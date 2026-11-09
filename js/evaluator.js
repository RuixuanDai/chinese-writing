/**
 * evaluator.js - 汉字书写智能评分与多特征融合手写识别引擎
 *
 * 综合评估与识别架构：
 *   1. 智能笔触去噪与短点画保护（保留轻点“点”画，滤除边缘误触杂点）
 *   2. 标准字模去顿笔装饰简化 + WeakMap 预计算模板缓存（全库 117 字毫秒级检索）
 *   3. 双模态归一化（保长宽比 Isotropic + 半弹性框对齐 Semi-Elastic，兼容高矮胖瘦手写习惯）
 *   4. 折笔拆分自动缝合（如“口/日/田/山/出/几”将折画分两笔书写时首尾自动合并识别）
 *   5. 高斯切向骨架覆盖率 + 逐笔完整性校验（严防漏笔/多笔误判）+ 14×14 五通道方向模糊栅格余弦
 *   6. 易混字拓扑结构特征判别（精准区分 人/入/八、上/下/土、石/右/左、儿/几/九、木/禾/本 等）
 */

const KNOWN_VISUAL_CONFUSERS = {
    '一': '二三十', '二': '一三十土工', '三': '二王土丰', '十': '千土大一二', '千': '十禾干',
    '人': '入八大个', '入': '人八', '八': '人入六',
    '大': '太天人木犬', '太': '大天木犬', '天': '大太夫开',
    '上': '下土止正', '下': '上丁卜', '土': '上二工王士',
    '口': '日田目中四', '日': '目口白田电百', '目': '日口白自田耳', '田': '口日目由电四', '白': '日百目自', '百': '白日耳',
    '中': '口虫申', '虫': '中虽', '电': '田日由', '四': '田口西', '西': '四面',
    '木': '禾本米十林大', '禾': '木本米千', '本': '木禾体米', '米': '木禾来半', '来': '米木夹',
    '山': '出巾', '出': '山击',
    '石': '右左后百', '右': '石左古后', '左': '右石在工', '后': '石右',
    '儿': '几九八人', '几': '儿九凡风', '九': '几儿力丸', '七': '十匕儿',
    '小': '少水八', '少': '小水',
    '水': '永冰小求', '永': '水衣冰', '冰': '水永冲',
    '去': '云土丢会', '云': '去二会', '会': '云去合',
    '立': '六文辛', '六': '立八文大', '文': '六立大父',
    '牛': '午年手生', '年': '牛午生', '生': '牛年土王', '手': '毛牛丰千',
    '羊': '半米美干', '半': '羊平米',
    '马': '鸟乌与', '鸟': '马乌鸡鸣',
    '月': '日用目丹同', '门': '问们间口',
    '开': '天井并关', '关': '天开美羊',
    '东': '车乐练', '车': '东牛',
    '江': '红工河汪', '红': '江工丝',
    '子': '了字孑才', '习': '刁羽飞', '飞': '习气乙',
    '万': '方力乃', '早': '草十日旱', '正': '上止五王', '五': '正丑王',
    '王': '主玉工土三', '主': '王玉住', '玉': '王主宝', '工': '土王二干', '干': '千十土工',
    '午': '牛干千', '刀': '力几九万', '尺': '尸户', '贝': '见目日', '今': '令会人',
    '明': '朋日月', '你': '他作', '我': '找成', '衣': '农永', '方': '万刀'
};

class ChineseWritingEvaluator {
    constructor() {
        this._templateCache = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
        if (typeof document !== 'undefined') {
            this.offscreenCanvas = document.createElement('canvas');
            this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        } else {
            this.offscreenCanvas = null;
            this.offscreenCtx = null;
        }
    }

    /**
     * 对用户的画板书写进行全方位智能评测（标准练字评分：兼顾笔顺、结构与字形）
     */
    evaluate(drawCanvas, charInfo, strokeList, hanziData, canvasSize, difficulty = 'standard') {
        const width = drawCanvas.width;
        const height = drawCanvas.height;
        const cssSize = canvasSize
            || (drawCanvas.clientWidth > 0 ? drawCanvas.clientWidth : 0)
            || (drawCanvas.style.width ? parseFloat(drawCanvas.style.width) : 0)
            || (width / ((typeof window !== 'undefined' && window.devicePixelRatio) || 1))
            || 360;

        if (!strokeList || strokeList.length === 0) {
            return {
                valid: false,
                message: '请先在画板上认真写字后再提交评分哦！'
            };
        }

        const userImgData = drawCanvas.getContext('2d').getImageData(0, 0, width, height);
        const userPixels = userImgData.data;

        const bounds = this.calculateBoundingBoxAndCentroid(userPixels, width, height);
        if (bounds.totalPixels < 45 && strokeList.length === 0) {
            return {
                valid: false,
                message: '字迹太轻微或笔画过少，请多写几笔再评分哦！'
            };
        }

        let resolvedHanziData = hanziData;
        const targetChar = charInfo ? charInfo.char : '';
        if (!resolvedHanziData && typeof window !== 'undefined' && window.STROKE_DATA_CACHE && targetChar) {
            resolvedHanziData = window.STROKE_DATA_CACHE[targetChar] || null;
        }

        const validStrokes = this.filterValidStrokes(strokeList, cssSize);
        if (validStrokes.length === 0) {
            return {
                valid: false,
                message: '字迹太轻微或笔画过少，请多写几笔再评分哦！'
            };
        }

        const canonicalMatch = this.computeCanonicalSimilarity(validStrokes, resolvedHanziData, cssSize, targetChar);

        // 1. 维度一：笔画数、笔画顺序、运笔走向与逐笔位置精度评测 (满分 40 分)
        const strokeEval = this.evaluateStrokes(validStrokes, charInfo, resolvedHanziData, bounds, cssSize, canonicalMatch);

        // 2. 维度二：间架结构、重心对齐与宽高比例评测 (满分 30 分)
        const structureEval = this.evaluateStructure(bounds, width, height, resolvedHanziData, cssSize);

        // 3. 维度三：骨架覆盖率与字形贴合度评测 (满分 30 分)
        const shapeEval = this.evaluateShape(userPixels, targetChar, width, height, bounds, resolvedHanziData, cssSize, validStrokes, canonicalMatch);

        // 检测是否明显误写成了字库中的其它易混汉字（提高鉴别裕度，杜绝正常手写被误报为其它字）
        let confusedChar = null;
        if (typeof window !== 'undefined' && window.STROKE_DATA_CACHE && targetChar && canonicalMatch.similarity < 76) {
            const cache = window.STROKE_DATA_CACHE;
            const userCtx = this._prepareUserContext(validStrokes, cssSize);
            const knownSet = KNOWN_VISUAL_CONFUSERS[targetChar] || '';
            let bestOtherSim = 0;

            for (const cand of Object.keys(cache)) {
                if (cand === targetChar) continue;
                const cData = cache[cand];
                if (!cData || !cData.medians) continue;
                if (Math.abs(cData.medians.length - validStrokes.length) > 1) continue;

                const cMatch = this._matchPreparedUserToStd(userCtx, cData, cand);
                const isKnownConfuser = knownSet.includes(cand);
                const requiredMargin = isKnownConfuser ? 5.5 : 11.5;
                const minOtherSim = isKnownConfuser ? 68 : 76;

                if (cMatch.similarity >= minOtherSim &&
                    cMatch.similarity > canonicalMatch.similarity + requiredMargin &&
                    cMatch.similarity > bestOtherSim) {
                    bestOtherSim = cMatch.similarity;
                    confusedChar = cand;
                }
            }
        }

        // 4. 综合总分计算 (满分 100 分 = 40 + 30 + 30)
        let totalScore = strokeEval.score + structureEval.score + shapeEval.score;

        const hasOrderError = strokeEval.inversionsCount > 0;
        const hasReverseError = strokeEval.reverseCount > 0;

        // 封顶约束：乱画或错字限制低分，但正常书写（含折笔微调）给予合理分数
        if (confusedChar) {
            totalScore = Math.min(totalScore, 54);
        } else if (canonicalMatch && (canonicalMatch.skeletonF1 < 0.46 || canonicalMatch.rasterSim < 0.48)) {
            totalScore = Math.min(totalScore, 52);
        } else if (canonicalMatch && (canonicalMatch.skeletonF1 < 0.58 && canonicalMatch.rasterSim < 0.60)) {
            totalScore = Math.min(totalScore, 66);
        }

        if (strokeEval.effectiveDiff >= 2) {
            totalScore = Math.min(totalScore, 62);
        } else if (strokeEval.diff >= 1 && strokeEval.effectiveDiff >= 1) {
            totalScore = Math.min(totalScore, 76);
        } else if (strokeEval.diff >= 1 && strokeEval.effectiveDiff === 0) {
            // 折笔拆分但字形完整：轻度封顶提醒一笔写成
            totalScore = Math.min(totalScore, 83);
        }

        if (strokeEval.inversionsCount >= 2 || (hasOrderError && hasReverseError)) {
            totalScore = Math.min(totalScore, 66);
        } else if (strokeEval.inversionsCount === 1) {
            totalScore = Math.min(totalScore, 76);
        } else if (hasReverseError) {
            totalScore = Math.min(totalScore, 78);
        }

        if (difficulty === 'easy' && !confusedChar) {
            totalScore = Math.min(96, totalScore + 5);
        } else if (difficulty === 'hard' && (hasOrderError || strokeEval.diff !== 0)) {
            totalScore = Math.min(totalScore, 74);
        }

        totalScore = Math.max(25, Math.min(96, Math.round(totalScore)));

        // 5. 确定评级等级与印章评语
        let grade = '';
        let stars = 3;
        let sealText = '妙笔生花';
        let teacherComment = '';

        if (totalScore >= 90) {
            grade = '【甲上 · 妙笔生花】';
            stars = 3;
            sealText = '妙笔生花';
            teacherComment = '神采飞扬！间架稳固，笔顺如流，颇有小小书法家的风采！';
        } else if (totalScore >= 80) {
            grade = '【优等 · 书写新星】';
            stars = 3;
            sealText = '书写新星';
            teacherComment = '字形端正工整，笔顺规范，注意起笔与收笔细节会更完美！';
        } else if (totalScore >= 68) {
            grade = '【良好 · 工整大方】';
            stars = 2;
            if (hasOrderError) {
                sealText = '规范笔顺';
                teacherComment = '字形整体尚可，但笔画顺序存在颠倒，请遵循标准笔顺书写！';
            } else {
                sealText = '工整大方';
                teacherComment = '字形基本端正，注意笔画长短比例与米字格中心定位会更出色！';
            }
        } else {
            grade = '【需加强 · 循序渐进】';
            stars = 1;
            if (canonicalMatch && canonicalMatch.skeletonF1 < 0.48) {
                sealText = '认准字形';
                teacherComment = '所写字形与当前汉字偏差较大，请先观察左侧字模与笔顺演示再下笔哦！';
            } else if (hasOrderError) {
                sealText = '规范笔顺';
                teacherComment = '笔顺是汉字书写的根本！快去左侧“笔顺跟写闯关”强化练习吧！';
            } else {
                sealText = '继续加油';
                teacherComment = '跟着左边笔顺多临摹两遍，把每一笔写到位，一定会越写越漂亮！';
            }
        }

        const suggestions = this.synthesizeConciseSuggestions(totalScore, strokeEval, structureEval, shapeEval, confusedChar, targetChar);

        return {
            valid: true,
            totalScore,
            grade,
            stars,
            sealText,
            teacherComment,
            coverageRate: shapeEval.coverageRate,
            validRate: shapeEval.validRate,
            skeletonRecall: canonicalMatch ? canonicalMatch.skeletonRecall : shapeEval.coverageRate,
            skeletonPrecision: canonicalMatch ? canonicalMatch.skeletonPrecision : shapeEval.validRate,
            skeletonF1: canonicalMatch ? canonicalMatch.skeletonF1 : shapeEval.coverageRate,
            canonicalSimilarity: canonicalMatch ? canonicalMatch.similarity : totalScore,
            strokeDiff: strokeEval.diff,
            metrics: {
                strokeScore: strokeEval.score,
                strokeMax: 40,
                structureScore: structureEval.score,
                structureMax: 30,
                shapeScore: shapeEval.score,
                shapeMax: 30
            },
            suggestions
        };
    }

    /**
     * 智能过滤边缘误触杂点，同时完整保留真实的短“点”画（含轻触单点 isTapDot）
     */
    filterValidStrokes(strokeList, cssSize = 300) {
        if (!strokeList || strokeList.length === 0) return [];

        const minSubstantialLen = Math.max(5, cssSize * 0.022);
        const meta = strokeList.map(s => {
            const rawPts = (s && Array.isArray(s.points) && s.points.length > 0)
                ? s.points
                : (s && s.startPoint ? [s.startPoint, s.endPoint || s.startPoint] : []);
            let len = 0;
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for (let i = 0; i < rawPts.length; i++) {
                const p = rawPts[i];
                if (p.x < minX) minX = p.x;
                if (p.x > maxX) maxX = p.x;
                if (p.y < minY) minY = p.y;
                if (p.y > maxY) maxY = p.y;
                if (i > 0) {
                    len += Math.hypot(p.x - rawPts[i - 1].x, p.y - rawPts[i - 1].y);
                }
            }
            return {
                stroke: s,
                rawPts,
                len,
                cx: (minX + maxX) / 2,
                cy: (minY + maxY) / 2,
                minX, minY, maxX, maxY,
                startTime: (s && s.startPoint && s.startPoint.time) || (rawPts[0] && rawPts[0].time) || 0,
                endTime: (s && s.endPoint && s.endPoint.time) || (rawPts[rawPts.length - 1] && rawPts[rawPts.length - 1].time) || 0
            };
        }).filter(m => m.rawPts.length > 0);

        if (meta.length === 0) return [];

        // 计算主体笔画包围盒，用于识别落在字外远处的边缘手掌误触噪点
        const substantial = meta.filter(m => m.len >= minSubstantialLen);
        let coreMinX = Infinity, coreMinY = Infinity, coreMaxX = -Infinity, coreMaxY = -Infinity;
        for (const m of substantial) {
            if (m.minX < coreMinX) coreMinX = m.minX;
            if (m.maxX > coreMaxX) coreMaxX = m.maxX;
            if (m.minY < coreMinY) coreMinY = m.minY;
            if (m.maxY > coreMaxY) coreMaxY = m.maxY;
        }
        const hasCore = substantial.length > 0;
        const margin = Math.max(42, cssSize * 0.28);

        const kept = [];
        for (let i = 0; i < meta.length; i++) {
            const m = meta[i];
            if (m.len >= minSubstantialLen) {
                kept.push(m.stroke);
                continue;
            }

            // 过滤抬笔瞬间 (< 75ms) 在上一笔终点原地的极微小抖动重影
            if (kept.length > 0 && m.len < 3.8 && !m.stroke.isTapDot) {
                const prev = kept[kept.length - 1];
                const prevPts = prev.points || [];
                const prevEnd = prevPts[prevPts.length - 1] || prev.endPoint;
                const prevEndTime = (prev.endPoint && prev.endPoint.time) || (prevEnd && prevEnd.time) || 0;
                if (prevEnd && prevEndTime && m.startTime && (m.startTime - prevEndTime >= 0) && (m.startTime - prevEndTime < 75)) {
                    if (Math.hypot(m.cx - prevEnd.x, m.cy - prevEnd.y) < 6) {
                        continue;
                    }
                }
            }

            // 过滤远离主体字形区域的微小边缘擦碰噪点 (< 3.5px 且在主体包围盒大幅外围)
            if (hasCore && m.len < 3.5 && !m.stroke.isTapDot) {
                const outX = m.cx < coreMinX - margin || m.cx > coreMaxX + margin;
                const outY = m.cy < coreMinY - margin || m.cy > coreMaxY + margin;
                if (outX || outY) {
                    continue;
                }
            }

            // 保留真实短点画：若长度过短（如指尖轻点），合成为标准东南向短点矢量以便切向与栅格提取
            if (m.len < 4.2) {
                const p0 = m.rawPts[0];
                const dotHalf = Math.max(2.2, cssSize * 0.012);
                const pStart = { x: p0.x - dotHalf * 0.65, y: p0.y - dotHalf * 0.85 };
                const pEnd = { x: p0.x + dotHalf * 0.65, y: p0.y + dotHalf * 0.85 };
                kept.push({
                    ...m.stroke,
                    isTapDot: true,
                    points: [pStart, pEnd],
                    startPoint: pStart,
                    endPoint: pEnd
                });
            } else {
                kept.push(m.stroke);
            }
        }

        return kept.length > 0 ? kept : [meta[0].stroke];
    }

    /**
     * 自由默写识别与评测（专用于「🎮 闯关乐园 · 看图写字」无描红默写）
     * 特点：
     *   1. 融合双模态归一化骨架、逐笔完整性、折笔自动缝合与 14×14 五通道方向栅格余弦；
     *   2. 对默写位置偏移、大小缩放、高矮胖瘦比例差异、轻触点画、折笔拆分及偶发笔顺颠倒具备强鲁棒性；
     *   3. 精准拦截漏笔、多笔、乱画及真正的易混字（如把“上”写成“下/土”，把“禾”写成“木”）。
     */
    recognizeAndEvaluateFreehand(drawCanvas, targetChars, strokeList, canvasSize, candidatePoolChars = null, difficulty = 'standard') {
        const width = drawCanvas.width;
        const height = drawCanvas.height;
        const cssSize = canvasSize || drawCanvas.clientWidth || 260;

        const validStrokes = this.filterValidStrokes(strokeList, cssSize);
        if (validStrokes.length === 0) {
            return {
                valid: false,
                message: '请先在米字格里写出汉字再提交批改哦！'
            };
        }

        const userImgData = drawCanvas.getContext('2d').getImageData(0, 0, width, height);
        const bounds = this.calculateBoundingBoxAndCentroid(userImgData.data, width, height);
        if (bounds.totalPixels < 30 && validStrokes.length <= 1 && validStrokes[0].isTapDot) {
            return {
                valid: false,
                message: '字迹太轻或笔画太少啦，请认真写出完整汉字哦！'
            };
        }

        const cache = (typeof window !== 'undefined' && window.STROKE_DATA_CACHE) ? window.STROKE_DATA_CACHE : {};
        const targets = Array.isArray(targetChars) ? targetChars : [targetChars];
        const userCtx = this._prepareUserContext(validStrokes, cssSize);

        // 1. 评估目标字（支持同义备选字，取最优匹配）
        let bestTargetChar = targets[0];
        let bestTargetMatch = null;

        for (const tChar of targets) {
            const tData = cache[tChar] || null;
            const cMatch = this._matchPreparedUserToStd(userCtx, tData, tChar);
            if (!bestTargetMatch || cMatch.similarity > bestTargetMatch.similarity) {
                bestTargetChar = tChar;
                bestTargetMatch = cMatch;
            }
        }

        // 2. 检索题库/字库中是否有明显更匹配的其它汉字（识别是否写成了别的字）
        const poolChars = candidatePoolChars || Object.keys(cache);
        const knownSet = KNOWN_VISUAL_CONFUSERS[bestTargetChar] || '';
        const userM = validStrokes.length;

        let bestKnownConfuserChar = null;
        let bestKnownConfuserMatch = null;
        let bestGeneralOtherChar = null;
        let bestGeneralOtherMatch = null;

        for (const candChar of poolChars) {
            if (targets.includes(candChar)) continue;
            const cData = cache[candChar];
            if (!cData || !cData.medians) continue;
            const stdN = cData.medians.length;
            if (userM < stdN - 1 || userM > stdN + 2) continue;

            const cMatch = this._matchPreparedUserToStd(userCtx, cData, candChar);
            if (knownSet.includes(candChar)) {
                if (!bestKnownConfuserMatch || cMatch.similarity > bestKnownConfuserMatch.similarity) {
                    bestKnownConfuserChar = candChar;
                    bestKnownConfuserMatch = cMatch;
                }
            } else {
                if (!bestGeneralOtherMatch || cMatch.similarity > bestGeneralOtherMatch.similarity) {
                    bestGeneralOtherChar = candChar;
                    bestGeneralOtherMatch = cMatch;
                }
            }
        }

        // 3. 判定笔画数（折笔合并后有效笔画数 M_eff）与完整性是否达标
        const stdData = cache[bestTargetChar];
        const expectedStrokes = (stdData && stdData.strokes) ? stdData.strokes.length : 1;
        const effM = bestTargetMatch.effectiveStrokeCount;
        const strokeDiff = userM - expectedStrokes;
        const effDiff = effM - expectedStrokes;

        let strokeCountAcceptable = false;
        if (expectedStrokes === 1) {
            strokeCountAcceptable = (effM === 1 && userM <= 2);
        } else if (expectedStrokes === 2) {
            strokeCountAcceptable = (effM === 2 && userM >= 2 && userM <= 3);
        } else if (expectedStrokes === 3) {
            strokeCountAcceptable = (
                (effM === 3 && userM >= 3 && userM <= 5) ||
                (effM === 2 && userM === 2 && bestTargetMatch.uncoveredStdStrokes === 0 && bestTargetMatch.rasterSim >= 0.74) ||
                (effM === 4 && userM === 4 && bestTargetMatch.extraUserStrokes === 0 && bestTargetMatch.rasterSim >= 0.68)
            );
        } else {
            strokeCountAcceptable = (effDiff >= -1 && effDiff <= 1 && strokeDiff >= -1 && strokeDiff <= 3);
        }

        // 逐笔完整性校验：防止漏写关键笔画（如“太”漏点变“大”、“禾”漏撇变“木”）或多写无关笔画
        let completenessOk = false;
        if (expectedStrokes <= 3) {
            completenessOk = (bestTargetMatch.uncoveredStdStrokes === 0 && bestTargetMatch.extraUserStrokes === 0);
        } else if (expectedStrokes <= 5) {
            completenessOk = (
                (bestTargetMatch.uncoveredStdStrokes === 0 && bestTargetMatch.extraUserStrokes === 0) ||
                (bestTargetMatch.uncoveredStdStrokes + bestTargetMatch.extraUserStrokes <= 1 &&
                    effM === expectedStrokes &&
                    bestTargetMatch.skeletonF1 >= 0.70 &&
                    bestTargetMatch.rasterSim >= 0.72)
            );
        } else {
            completenessOk = (
                bestTargetMatch.uncoveredStdStrokes <= 1 &&
                bestTargetMatch.extraUserStrokes <= 1
            );
        }

        // 易混字双级判定：
        // (A) 针对已知形近易混字（如 上/下/土、木/禾/本、石/右、日/目/田），相差 > 4.5 分即精准纠错；
        // (B) 针对字库其余无关汉字，仅当目标匹配偏弱 (< 71) 且其它字大幅领先 (> +11 分) 时才判为错字，彻底消除误伤！
        let confusedWithChar = null;
        let confusedSimilarity = 0;

        if (bestKnownConfuserMatch &&
            bestKnownConfuserMatch.similarity >= 63 &&
            bestKnownConfuserMatch.uncoveredStdStrokes === 0 &&
            bestKnownConfuserMatch.similarity > bestTargetMatch.similarity + 4.5) {
            confusedWithChar = bestKnownConfuserChar;
            confusedSimilarity = Math.round(bestKnownConfuserMatch.similarity);
        } else if (bestGeneralOtherMatch &&
            bestTargetMatch.similarity < 71 &&
            bestGeneralOtherMatch.similarity >= 76 &&
            bestGeneralOtherMatch.uncoveredStdStrokes === 0 &&
            bestGeneralOtherMatch.similarity > bestTargetMatch.similarity + 11.0) {
            confusedWithChar = bestGeneralOtherChar;
            confusedSimilarity = Math.round(bestGeneralOtherMatch.similarity);
        }

        const minSkel = difficulty === 'easy' ? 0.45 : (difficulty === 'hard' ? 0.56 : 0.50);
        const minF1 = difficulty === 'easy' ? 0.47 : (difficulty === 'hard' ? 0.57 : 0.52);
        const minSim = difficulty === 'easy' ? 49 : (difficulty === 'hard' ? 60 : 54);
        const isShapeMatched = (
            completenessOk &&
            bestTargetMatch.skeletonRecall >= minSkel &&
            bestTargetMatch.skeletonPrecision >= minSkel &&
            bestTargetMatch.skeletonF1 >= minF1 &&
            bestTargetMatch.rasterSim >= minF1 &&
            bestTargetMatch.similarity >= minSim
        );

        const isPass = strokeCountAcceptable && isShapeMatched && !confusedWithChar;

        // 默写得分：理性校准得分曲线
        const charInfo = (typeof getCharInfo === 'function' && getCharInfo(bestTargetChar)) || {
            char: bestTargetChar,
            strokes: expectedStrokes
        };
        const fullEval = this.evaluate(drawCanvas, charInfo, validStrokes, stdData, cssSize);

        let freehandScore = fullEval ? fullEval.totalScore : Math.round(bestTargetMatch.similarity * 0.85);
        if (isPass) {
            const structScore = fullEval ? fullEval.metrics.structureScore : 22;
            const calibrated = Math.round(
                bestTargetMatch.similarity * 0.62 +
                structScore * 0.85 +
                (bestTargetMatch.matchedStrokeRatio * 10)
            );
            freehandScore = Math.min(95, Math.max(74, calibrated));
            if (Math.abs(strokeDiff) >= 1) {
                freehandScore = Math.min(freehandScore, 82);
            }
        } else {
            freehandScore = Math.min(freehandScore, 58);
        }

        return {
            valid: true,
            isPass,
            matchedChar: bestTargetChar,
            totalScore: Math.max(25, Math.min(98, Math.round(freehandScore))),
            expectedStrokes,
            userStrokes: userM,
            effectiveStrokes: effM,
            strokeDiff,
            strokeCountAcceptable,
            confusedWithChar,
            confusedSimilarity,
            targetSimilarity: Math.round(bestTargetMatch.similarity),
            skeletonRecall: bestTargetMatch.skeletonRecall,
            skeletonPrecision: bestTargetMatch.skeletonPrecision,
            skeletonF1: bestTargetMatch.skeletonF1,
            rasterSim: bestTargetMatch.rasterSim,
            suggestions: fullEval ? fullEval.suggestions : []
        };
    }

    /**
     * 计算用户笔画与标准字模在归一化坐标系下的综合相似度 (0 ~ 100)
     */
    computeCanonicalSimilarity(validStrokes, hanziData, canvasSize = 360, charKey = '') {
        if (!hanziData || !hanziData.medians || hanziData.medians.length === 0 || !validStrokes || validStrokes.length === 0) {
            return {
                similarity: 50,
                skeletonRecall: 0.5,
                skeletonPrecision: 0.5,
                skeletonF1: 0.5,
                rasterSim: 0.5,
                matchedStrokeRatio: 0.5,
                avgDirectionCos: 0.5,
                orderedStrokeScore: 0.5,
                aspectScore: 0.8,
                effectiveStrokeCount: validStrokes ? validStrokes.length : 0,
                uncoveredStdStrokes: 0,
                extraUserStrokes: 0
            };
        }

        const userCtx = this._prepareUserContext(validStrokes, canvasSize);
        return this._matchPreparedUserToStd(userCtx, hanziData, charKey);
    }

    /**
     * 预处理用户书写特征（单次提取，供全字库 117 字高速比对复用）
     */
    _prepareUserContext(validStrokes, canvasSize = 300) {
        const K = 12;
        const rawPolylines = validStrokes.map(s => {
            if (s.points && s.points.length >= 2) return s.points;
            if (s.points && s.points.length === 1) {
                const p = s.points[0];
                return [{ x: p.x - 1.5, y: p.y - 2.0 }, { x: p.x + 1.5, y: p.y + 2.0 }];
            }
            const a = s.startPoint || { x: 0, y: 0 };
            const b = s.endPoint || { x: a.x + 2, y: a.y + 2 };
            return [a, b];
        });

        const sampled = rawPolylines.map(pts => this.resampleStrokeWithTangents(pts, K));
        const minSpan = Math.max(36, canvasSize * 0.22);

        const isoNorm = this.normalizeStrokeSet(sampled, minSpan, false);
        const elasticNorm = this.normalizeStrokeSet(sampled, minSpan, true);
        const raster = this._rasterizeNormalizedStrokes(elasticNorm.strokes);
        const aspect = (isoNorm.boxWidth + canvasSize * 0.14) / (isoNorm.boxHeight + canvasSize * 0.14);

        return {
            rawPolylines,
            sampled,
            canvasSize,
            minSpan,
            isoNorm,
            elasticNorm,
            raster,
            aspect,
            rawCount: validStrokes.length
        };
    }

    /**
     * 获取或构建标准汉字特征模板（WeakMap 缓存，避免重复变换与栅格化）
     */
    _getStdTemplate(hanziData) {
        if (this._templateCache && this._templateCache.has(hanziData)) {
            return this._templateCache.get(hanziData);
        }

        const refSize = 300;
        const K = 12;
        const minSpan = refSize * 0.22;

        const transformed = hanziData.medians.map(m => {
            const pts = this.transformMedian(m, refSize);
            return this._cleanReferencePoints(pts);
        });

        const isCompoundStroke = transformed.map(pts => this._detectCompoundBend(pts));
        const sampled = transformed.map(pts => this.resampleStrokeWithTangents(pts, K));
        const isoNorm = this.normalizeStrokeSet(sampled, minSpan, false);
        const elasticNorm = this.normalizeStrokeSet(sampled, minSpan, true);
        const raster = this._rasterizeNormalizedStrokes(elasticNorm.strokes);
        const aspect = (isoNorm.boxWidth + refSize * 0.14) / (isoNorm.boxHeight + refSize * 0.14);

        const tpl = {
            N: sampled.length,
            isCompoundStroke,
            hasCompound: isCompoundStroke.some(Boolean),
            isoNorm,
            elasticNorm,
            raster,
            aspect
        };

        if (this._templateCache) {
            this._templateCache.set(hanziData, tpl);
        }
        return tpl;
    }

    /**
     * 去除楷体字模起笔处的微小“顿笔”斜钩伪影，使标准切向量与人类自然直笔一致
     */
    _cleanReferencePoints(pts) {
        if (!pts || pts.length < 3) return pts;
        let totalLen = 0;
        for (let i = 1; i < pts.length; i++) {
            totalLen += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
        }
        if (totalLen < 12) return pts;

        const out = pts.slice();
        const seg0 = Math.hypot(out[1].x - out[0].x, out[1].y - out[0].y);
        const seg1 = Math.hypot(out[2].x - out[1].x, out[2].y - out[1].y);
        if (seg0 > 0 && seg0 < totalLen * 0.15 && seg1 > seg0 * 1.4) {
            const v0x = (out[1].x - out[0].x) / seg0, v0y = (out[1].y - out[0].y) / seg0;
            const v1x = (out[2].x - out[1].x) / seg1, v1y = (out[2].y - out[1].y) / seg1;
            const cos = v0x * v1x + v0y * v1y;
            if (cos < 0.86) {
                // 将顿笔折角平滑回主干反方向延伸，保持笔画总跨度不变但消除 45° 伪切向
                out[0] = {
                    x: out[1].x - v1x * seg0 * 0.65,
                    y: out[1].y - v1y * seg0 * 0.65
                };
            }
        }
        return out;
    }

    /**
     * 检测标准笔画是否包含真实折角/弯钩（用于判定是否允许用户折笔拆分合并）
     */
    _detectCompoundBend(pts) {
        if (!pts || pts.length < 3) return false;
        let totalLen = 0;
        const cum = [0];
        for (let i = 1; i < pts.length; i++) {
            totalLen += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
            cum.push(totalLen);
        }
        if (totalLen < 22) return false;

        for (let i = 1; i < pts.length - 1; i++) {
            const leftLen = cum[i];
            const rightLen = totalLen - cum[i];
            if (leftLen < totalLen * 0.14 || rightLen < totalLen * 0.14) continue;
            const ax = pts[i].x - pts[0].x, ay = pts[i].y - pts[0].y;
            const bx = pts[pts.length - 1].x - pts[i].x, by = pts[pts.length - 1].y - pts[i].y;
            const la = Math.hypot(ax, ay), lb = Math.hypot(bx, by);
            if (la > 8 && lb > 8) {
                const cos = (ax * bx + ay * by) / (la * lb);
                if (cos < 0.68) return true; // 折角 > ~47°（涵盖横折、竖折、撇折、横撇、竖弯钩、横折钩、竖钩）
            }
        }
        return false;
    }

    /**
     * 将已预处理的用户书写与目标标准汉字进行深度几何、栅格与拓扑匹配
     */
    _matchPreparedUserToStd(userCtx, hanziData, charKey = '') {
        const tpl = this._getStdTemplate(hanziData);

        // 1. 尝试对用户的折笔拆分或中途断笔进行首尾虚合并（仅在几何连续且显著降低匹配代价时生效）
        const mergedElasticStrokes = this._mergeSplitUserStrokes(userCtx.elasticNorm.strokes, tpl.elasticNorm.strokes, tpl.isCompoundStroke);
        const mergeCount = userCtx.elasticNorm.strokes.length - mergedElasticStrokes.length;
        const effectiveStrokeCount = mergedElasticStrokes.length;

        // 同步合并保长宽比空间中的对应笔画
        const mergedIsoStrokes = mergeCount > 0
            ? this._mergeSplitUserStrokes(userCtx.isoNorm.strokes, tpl.isoNorm.strokes, tpl.isCompoundStroke)
            : userCtx.isoNorm.strokes;

        // 2. 计算双模态高斯切向骨架覆盖度与逐笔完整性
        const elasticSkel = this._computeGaussianSkeletonMetrics(mergedElasticStrokes, tpl.elasticNorm.strokes);
        const isoSkel = this._computeGaussianSkeletonMetrics(mergedIsoStrokes, tpl.isoNorm.strokes);

        const skeletonRecall = elasticSkel.recall * 0.65 + isoSkel.recall * 0.35;
        const skeletonPrecision = elasticSkel.precision * 0.65 + isoSkel.precision * 0.35;
        const skeletonF1 = (skeletonRecall + skeletonPrecision) > 0
            ? (2 * skeletonRecall * skeletonPrecision) / (skeletonRecall + skeletonPrecision)
            : 0;

        const uncoveredStdStrokes = Math.min(elasticSkel.uncoveredStd, isoSkel.uncoveredStd);
        const extraUserStrokes = Math.min(elasticSkel.extraUser, isoSkel.extraUser);

        // 3. 24×24 五通道方向模糊栅格余弦相似度（天然对折笔、连笔、笔顺颠倒完全鲁棒）
        const rasterSim = this._computeRasterCosine(userCtx.raster, tpl.raster);

        // 4. 逐笔最优配对得分（允许单笔轻微倒插或笔顺调整以支持自由默写识别，练字评分由 evaluateStrokes 单独严查）
        const strokeAlign = this._computeStrokeAlignment(mergedElasticStrokes, tpl.elasticNorm.strokes, skeletonF1, rasterSim);

        // 5. 宽高比兼容性（温和惩罚极端比例失调，如把“日”写成扁线或把“一”写成竖杆，但不苛责常规胖瘦差异）
        const aspectLogDiff = Math.abs(Math.log(userCtx.aspect / tpl.aspect));
        const aspectScore = Math.max(0, Math.min(1, 1 - Math.max(0, aspectLogDiff - 0.16) * 0.90));

        // 6. 有效笔画数一致性因子
        const effDiff = Math.abs(effectiveStrokeCount - tpl.N);
        const strokeCountFactor = effDiff === 0 ? 1.0 : (effDiff === 1 ? 0.84 : (effDiff === 2 ? 0.60 : 0.32));

        // 7. 基础融合分 (0 ~ 100)
        let sim = (
            skeletonF1 * 0.34 +
            rasterSim * 0.30 +
            strokeAlign.orderedStrokeScore * 0.22 +
            aspectScore * 0.06 +
            strokeCountFactor * 0.08
        ) * 100;

        // 8. 漏笔与多笔完整性硬惩罚（精准区分 大/太/天、木/禾/本、口/日/目、二/三）
        if (uncoveredStdStrokes > 0) {
            const perMissingPenalty = tpl.N <= 4 ? 13.5 : (tpl.N <= 6 ? 10.5 : 8.0);
            sim -= uncoveredStdStrokes * perMissingPenalty;
        }
        if (extraUserStrokes > 0) {
            const perExtraPenalty = tpl.N <= 4 ? 13.5 : (tpl.N <= 6 ? 10.5 : 8.0);
            sim -= extraUserStrokes * perExtraPenalty;
        }

        // 9. 针对高频易混字对的拓扑结构微调判别（人/入/八、上/下/土、石/右/左、儿/几/九）
        if (charKey) {
            sim += this._computeTopologicalAdjustment(charKey, mergedIsoStrokes, mergedElasticStrokes);
        }

        return {
            similarity: Math.max(0, Math.min(100, sim)),
            skeletonRecall,
            skeletonPrecision,
            skeletonF1,
            rasterSim,
            matchedStrokeRatio: strokeAlign.matchedStrokeRatio,
            avgDirectionCos: strokeAlign.avgDirectionCos,
            orderedStrokeScore: strokeAlign.orderedStrokeScore,
            aspectScore,
            effectiveStrokeCount,
            mergeCount,
            uncoveredStdStrokes,
            extraUserStrokes
        };
    }

    /**
     * 首尾相连折笔拆分/中途断笔自动缝合
     * 仅当相邻两笔终点与起点紧邻 (gap <= 0.27)，且合并后与某一标准折笔（或同向直笔）高度吻合时才合并
     */
    _mergeSplitUserStrokes(userStrokes, stdStrokes, isCompoundStroke) {
        const M = userStrokes.length;
        const N = stdStrokes.length;
        if (M <= 1 || M <= N) return userStrokes;

        let curr = userStrokes.slice();
        const maxMerges = Math.min(3, M - N);

        for (let step = 0; step < maxMerges && curr.length > N; step++) {
            let bestIdx = -1;
            let bestGain = 0;
            let bestMerged = null;

            for (let i = 0; i < curr.length - 1; i++) {
                const sA = curr[i];
                const sB = curr[i + 1];
                const endA = sA.points[sA.points.length - 1];
                const startB = sB.points[0];
                const gap = Math.hypot(endA.nx - startB.nx, endA.ny - startB.ny);
                if (gap > 0.27) continue;

                const dirAx = endA.nx - sA.points[0].nx, dirAy = endA.ny - sA.points[0].ny;
                const dirBx = sB.points[sB.points.length - 1].nx - startB.nx, dirBy = sB.points[sB.points.length - 1].ny - startB.ny;
                const lenA = Math.hypot(dirAx, dirAy), lenB = Math.hypot(dirBx, dirBy);
                const collinear = (lenA > 0.04 && lenB > 0.04)
                    ? ((dirAx * dirBx + dirAy * dirBy) / (lenA * lenB) >= 0.65 && gap <= 0.16)
                    : (gap <= 0.12);

                const merged = this._concatNormalizedStrokes(sA, sB);

                for (let s = 0; s < N; s++) {
                    if (!isCompoundStroke[s] && !collinear) continue;
                    const costMerged = this._normStrokePairCost(merged, stdStrokes[s]);
                    const costSeparate = Math.min(
                        this._normStrokePairCost(sA, stdStrokes[s]),
                        this._normStrokePairCost(sB, stdStrokes[s])
                    );
                    const gain = costSeparate - costMerged;
                    if (costMerged < 0.38 && gain > 0.04 && gain > bestGain) {
                        bestGain = gain;
                        bestIdx = i;
                        bestMerged = merged;
                    }
                }
            }

            if (bestIdx >= 0 && bestMerged) {
                curr.splice(bestIdx, 2, bestMerged);
            } else {
                break;
            }
        }

        return curr;
    }

    /**
     * 连接两条归一化笔画并等距重采样为 K 点
     */
    _concatNormalizedStrokes(sA, sB) {
        const K = sA.points.length;
        const raw = [
            ...sA.points.map(p => ({ x: p.nx, y: p.ny })),
            ...sB.points.map(p => ({ x: p.nx, y: p.ny }))
        ];
        const res = this.resampleStrokeWithTangents(raw, K);
        return {
            len: res.len,
            points: res.points.map(p => ({
                x: p.x,
                y: p.y,
                nx: p.x,
                ny: p.y,
                tx: p.tx,
                ty: p.ty
            }))
        };
    }

    _normStrokePairCost(uStk, sStk) {
        const K = uStk.points.length;
        let fwdDist = 0, dirCos = 0;
        for (let k = 0; k < K; k++) {
            fwdDist += Math.hypot(uStk.points[k].nx - sStk.points[k].nx, uStk.points[k].ny - sStk.points[k].ny);
            dirCos += (uStk.points[k].tx * sStk.points[k].tx + uStk.points[k].ty * sStk.points[k].ty);
        }
        fwdDist /= K;
        dirCos /= K;
        const lenDiff = Math.abs(uStk.len - sStk.len);
        return fwdDist + (1 - Math.max(-0.4, dirCos)) * 0.20 + lenDiff * 0.25;
    }

    /**
     * 平滑高斯核切向骨架覆盖率 + 逐笔漏写/多写完整性统计（短点画支持全向点击容差）
     */
    _computeGaussianSkeletonMetrics(uStrokes, sStrokes) {
        const uAll = [];
        for (let ui = 0; ui < uStrokes.length; ui++) {
            const pts = uStrokes[ui].points;
            const isDot = uStrokes[ui].len < 0.18;
            for (let k = 0; k < pts.length; k++) {
                uAll.push({ nx: pts[k].nx, ny: pts[k].ny, tx: pts[k].tx, ty: pts[k].ty, si: ui, isDot });
            }
        }
        const sAll = [];
        for (let si = 0; si < sStrokes.length; si++) {
            const pts = sStrokes[si].points;
            const isDot = sStrokes[si].len < 0.18;
            for (let k = 0; k < pts.length; k++) {
                sAll.push({ nx: pts[k].nx, ny: pts[k].ny, tx: pts[k].tx, ty: pts[k].ty, si, isDot });
            }
        }

        const invTwoSigmaSq = 1 / (2 * 0.162 * 0.162);
        const stdStrokeSums = new Float32Array(sStrokes.length);
        const userStrokeSums = new Float32Array(uStrokes.length);

        let recallSum = 0;
        for (let i = 0; i < sAll.length; i++) {
            const sp = sAll[i];
            let bestVal = 0;
            for (let j = 0; j < uAll.length; j++) {
                const up = uAll[j];
                const dx = sp.nx - up.nx;
                const dy = sp.ny - up.ny;
                const d2 = dx * dx + dy * dy;
                if (d2 > 0.19) continue;

                let dirW;
                if (sp.isDot || up.isDot) {
                    dirW = 0.88;
                } else {
                    const dot = sp.tx * up.tx + sp.ty * up.ty;
                    const absDot = Math.abs(dot);
                    if (absDot < 0.35) continue;
                    dirW = (0.34 + 0.66 * ((absDot - 0.35) / 0.65)) * (dot >= -0.15 ? 1.0 : 0.78);
                }

                const val = Math.exp(-d2 * invTwoSigmaSq) * dirW;
                if (val > bestVal) bestVal = val;
            }
            recallSum += bestVal;
            stdStrokeSums[sp.si] += bestVal;
        }

        let precisionSum = 0;
        for (let j = 0; j < uAll.length; j++) {
            const up = uAll[j];
            let bestVal = 0;
            for (let i = 0; i < sAll.length; i++) {
                const sp = sAll[i];
                const dx = up.nx - sp.nx;
                const dy = up.ny - sp.ny;
                const d2 = dx * dx + dy * dy;
                if (d2 > 0.19) continue;

                let dirW;
                if (sp.isDot || up.isDot) {
                    dirW = 0.88;
                } else {
                    const dot = up.tx * sp.tx + up.ty * sp.ty;
                    const absDot = Math.abs(dot);
                    if (absDot < 0.35) continue;
                    dirW = (0.34 + 0.66 * ((absDot - 0.35) / 0.65)) * (dot >= -0.15 ? 1.0 : 0.78);
                }

                const val = Math.exp(-d2 * invTwoSigmaSq) * dirW;
                if (val > bestVal) bestVal = val;
            }
            precisionSum += bestVal;
            userStrokeSums[up.si] += bestVal;
        }

        let uncoveredStd = 0;
        for (let s = 0; s < sStrokes.length; s++) {
            const K = sStrokes[s].points.length || 1;
            const avg = stdStrokeSums[s] / K;
            const minReq = sStrokes[s].len < 0.18 ? 0.24 : 0.31;
            if (avg < minReq) uncoveredStd++;
        }

        let extraUser = 0;
        for (let u = 0; u < uStrokes.length; u++) {
            const K = uStrokes[u].points.length || 1;
            const avg = userStrokeSums[u] / K;
            const minReq = uStrokes[u].len < 0.18 ? 0.24 : 0.29;
            if (avg < minReq) extraUser++;
        }

        return {
            recall: sAll.length > 0 ? (recallSum / sAll.length) : 0,
            precision: uAll.length > 0 ? (precisionSum / uAll.length) : 0,
            uncoveredStd,
            extraUser
        };
    }

    /**
     * 逐笔二分贪心对齐得分（兼容自由默写中的连笔与局部逆笔）
     */
    _computeStrokeAlignment(uStrokes, sStrokes, skeletonF1, rasterSim) {
        const M = uStrokes.length;
        const N = sStrokes.length;
        const pairs = [];

        for (let u = 0; u < M; u++) {
            const uStk = uStrokes[u];
            const K = uStk.points.length;
            for (let s = 0; s < N; s++) {
                const sStk = sStrokes[s];
                let fwdDist = 0, revDist = 0, fwdCos = 0, revCos = 0;
                for (let k = 0; k < K; k++) {
                    const up = uStk.points[k];
                    const spFwd = sStk.points[k];
                    const spRev = sStk.points[K - 1 - k];
                    fwdDist += Math.hypot(up.nx - spFwd.nx, up.ny - spFwd.ny);
                    revDist += Math.hypot(up.nx - spRev.nx, up.ny - spRev.ny);
                    fwdCos += (up.tx * spFwd.tx + up.ty * spFwd.ty);
                    revCos += (-up.tx * spRev.tx - up.ty * spRev.ty);
                }
                fwdDist /= K; revDist /= K;
                fwdCos /= K; revCos /= K;

                const useRev = revDist + 0.05 < fwdDist;
                const ptDist = useRev ? revDist + 0.03 : fwdDist;
                const avgCos = useRev ? revCos * 0.88 : fwdCos;
                const lenDiff = Math.abs(uStk.len - sStk.len);
                const cost = ptDist + (1 - Math.max(-0.4, avgCos)) * 0.22 + lenDiff * 0.28;
                pairs.push({ u, s, cost, ptDist, avgCos, lenDiff });
            }
        }
        pairs.sort((a, b) => a.cost - b.cost);

        const uUsed = new Uint8Array(M);
        const sUsed = new Uint8Array(N);
        let matchedCount = 0;
        let wellMatchedCount = 0;
        let sumPtDist = 0;
        let sumDirCos = 0;

        for (let i = 0; i < pairs.length; i++) {
            const p = pairs[i];
            if (!uUsed[p.u] && !sUsed[p.s]) {
                uUsed[p.u] = 1;
                sUsed[p.s] = 1;
                matchedCount++;
                sumPtDist += p.ptDist + p.lenDiff * 0.20;
                sumDirCos += p.avgCos;
                if (p.ptDist <= 0.19 && p.avgCos >= 0.42 && p.lenDiff <= 0.36) {
                    wellMatchedCount++;
                }
            }
        }

        const totalSlots = Math.max(M, N, 1);
        const unmatched = totalSlots - matchedCount;
        const avgMatchedDist = (sumPtDist + unmatched * 0.30) / totalSlots;
        const avgDirectionCos = matchedCount > 0 ? (sumDirCos / matchedCount) : 0;

        let matchedStrokeRatio = wellMatchedCount / totalSlots;
        // 连笔容差：4 画以上汉字若快写连了 1 笔但骨架与方向栅格均高度吻合，平滑补偿配对率
        if (N >= 4 && M === N - 1 && skeletonF1 >= 0.68 && rasterSim >= 0.70) {
            matchedStrokeRatio = Math.max(matchedStrokeRatio, (skeletonF1 + rasterSim) * 0.46);
        }

        const orderedStrokeScore = Math.max(0, Math.min(1,
            (1 - avgMatchedDist / 0.34) * 0.52 +
            Math.max(0, avgDirectionCos) * 0.20 +
            matchedStrokeRatio * 0.28
        ));

        return {
            matchedStrokeRatio,
            avgDirectionCos,
            orderedStrokeScore
        };
    }

    /**
     * 14×14 五通道方向模糊栅格化（纯浮点计算，零 DOM 开销，单字 < 0.02ms，天然吸收曲直与框形差异）
     */
    _rasterizeNormalizedStrokes(normStrokes) {
        const G = 14;
        const planeSize = G * G;
        const raw = new Float32Array(planeSize * 5);

        const splat = (gx, gy, w, c1, c2, c3, c4) => {
            const x0 = Math.floor(gx), y0 = Math.floor(gy);
            const fx = gx - x0, fy = gy - y0;
            for (let dy = 0; dy <= 1; dy++) {
                const y = y0 + dy;
                if (y < 0 || y >= G) continue;
                const wy = dy === 0 ? (1 - fy) : fy;
                for (let dx = 0; dx <= 1; dx++) {
                    const x = x0 + dx;
                    if (x < 0 || x >= G) continue;
                    const wt = w * wy * (dx === 0 ? (1 - fx) : fx);
                    const idx = y * G + x;
                    raw[idx] += wt;
                    raw[planeSize + idx] += wt * c1;
                    raw[planeSize * 2 + idx] += wt * c2;
                    raw[planeSize * 3 + idx] += wt * c3;
                    raw[planeSize * 4 + idx] += wt * c4;
                }
            }
        };

        for (let s = 0; s < normStrokes.length; s++) {
            const pts = normStrokes[s].points;
            const isDot = normStrokes[s].len < 0.18;
            if (!pts || pts.length === 0) continue;
            for (let i = 0; i < pts.length - 1; i++) {
                const a = pts[i], b = pts[i + 1];
                const segLen = Math.hypot(b.nx - a.nx, b.ny - a.ny);
                const steps = Math.max(1, Math.ceil(segLen * G * 1.5));
                let c1, c2, c3, c4;
                if (isDot) {
                    c1 = 0.25; c2 = 0.25; c3 = 0.50; c4 = 0.50;
                } else {
                    const tx = a.tx, ty = a.ty;
                    c1 = tx * tx;
                    c2 = ty * ty;
                    const d1 = (tx - ty) * 0.70710678;
                    const d2 = (tx + ty) * 0.70710678;
                    c3 = d1 * d1;
                    c4 = d2 * d2;
                }
                const stepW = Math.max(0.45, segLen * G) / (steps + 1);

                for (let k = 0; k <= steps; k++) {
                    const t = k / steps;
                    const nx = a.nx + (b.nx - a.nx) * t;
                    const ny = a.ny + (b.ny - a.ny) * t;
                    const gx = ((nx + 0.56) / 1.12) * (G - 1);
                    const gy = ((ny + 0.56) / 1.12) * (G - 1);
                    splat(gx, gy, stepW, c1, c2, c3, c4);
                }
            }
        }

        // 两轮可分离 [0.25, 0.5, 0.25] 高斯平滑，提供自然局部位置容差
        const tmp = new Float32Array(planeSize);
        const blurred = new Float32Array(planeSize * 5);
        for (let ch = 0; ch < 5; ch++) {
            const offset = ch * planeSize;
            let src = raw.subarray(offset, offset + planeSize);
            let dst = blurred.subarray(offset, offset + planeSize);
            for (let pass = 0; pass < 2; pass++) {
                const input = pass === 0 ? src : dst;
                for (let y = 0; y < G; y++) {
                    const row = y * G;
                    for (let x = 0; x < G; x++) {
                        const l = input[row + Math.max(0, x - 1)];
                        const c = input[row + x];
                        const r = input[row + Math.min(G - 1, x + 1)];
                        tmp[row + x] = 0.25 * l + 0.5 * c + 0.25 * r;
                    }
                }
                for (let y = 0; y < G; y++) {
                    const ym = Math.max(0, y - 1) * G;
                    const yc = y * G;
                    const yp = Math.min(G - 1, y + 1) * G;
                    for (let x = 0; x < G; x++) {
                        dst[yc + x] = 0.25 * tmp[ym + x] + 0.5 * tmp[yc + x] + 0.25 * tmp[yp + x];
                    }
                }
            }
        }

        let totalNormSq = 0;
        for (let i = 0; i < planeSize; i++) totalNormSq += blurred[i] * blurred[i];
        let dirNormSq = 0;
        for (let i = planeSize; i < planeSize * 5; i++) dirNormSq += blurred[i] * blurred[i];

        return {
            data: blurred,
            planeSize,
            totalNorm: Math.sqrt(totalNormSq) || 1e-6,
            dirNorm: Math.sqrt(dirNormSq) || 1e-6
        };
    }

    _computeRasterCosine(rA, rB) {
        const P = rA.planeSize;
        const a = rA.data, b = rB.data;
        let dotTotal = 0;
        for (let i = 0; i < P; i++) dotTotal += a[i] * b[i];
        let dotDir = 0;
        for (let i = P; i < P * 5; i++) dotDir += a[i] * b[i];

        const totalCos = dotTotal / (rA.totalNorm * rB.totalNorm);
        const dirCos = dotDir / (rA.dirNorm * rB.dirNorm);
        return Math.max(0, Math.min(1, totalCos * 0.32 + dirCos * 0.68));
    }

    /**
     * 高频易混字拓扑结构特征判别（解决纯距离匹配在 人/入/八、上/下/土、石/右/左 等上的盲区）
     */
    _computeTopologicalAdjustment(charKey, isoStrokes, elasticStrokes) {
        const M = isoStrokes.length;

        // 1. 「人 / 入 / 八」二画撇捺顶点关系判别
        if ((charKey === '人' || charKey === '入' || charKey === '八') && M === 2) {
            let sPie = null, sNa = null;
            for (const s of isoStrokes) {
                const p0 = s.points[0], p1 = s.points[s.points.length - 1];
                const dx = p1.nx - p0.nx, dy = p1.ny - p0.ny;
                if (dy > 0.12 && dx < -0.06 && !sPie) sPie = s;
                else if (dy > 0.12 && dx > 0.06 && !sNa) sNa = s;
            }
            if (!sPie || !sNa) return -8;

            const pieTop = sPie.points[0];
            const naTop = sNa.points[0];
            let minGap = Infinity;
            for (const pa of sPie.points) {
                for (const pb of sNa.points) {
                    const d = Math.hypot(pa.nx - pb.nx, pa.ny - pb.ny);
                    if (d < minGap) minGap = d;
                }
            }

            const isSeparated = (minGap > 0.115 && pieTop.nx < naTop.nx - 0.06);
            const naClearlyHigher = (!isSeparated && naTop.ny < pieTop.ny - 0.075);

            if (charKey === '八') {
                return isSeparated ? 7.5 : -9.0;
            }
            if (charKey === '入') {
                if (isSeparated) return -9.0;
                return naClearlyHigher ? 7.5 : -6.5;
            }
            if (charKey === '人') {
                if (isSeparated) return -8.5;
                if (naClearlyHigher) return -6.5;
                // 人类手写“人”常见两笔在顶端相接 (naTop.ny ≈ pieTop.ny) 或捺起于撇中上部，均给予正向加分！
                return 7.0;
            }
        }

        // 2. 「上 / 下 / 土」横竖相对位置与穿插判别
        if ((charKey === '上' || charKey === '下' || charKey === '土') && M === 3) {
            let vert = null;
            const others = [];
            for (const s of elasticStrokes) {
                const p0 = s.points[0], p1 = s.points[s.points.length - 1];
                if (Math.abs(p1.ny - p0.ny) > Math.abs(p1.nx - p0.nx) * 1.4 && s.len > 0.35 && !vert) {
                    vert = s;
                } else {
                    others.push(s);
                }
            }
            if (!vert || others.length !== 2) return 0;

            const stemX = (vert.points[0].nx + vert.points[vert.points.length - 1].nx) / 2;
            others.sort((a, b) => a.points[0].ny - b.points[0].ny);
            const upper = others[0], lower = others[1];
            const upperMeanY = (upper.points[0].ny + upper.points[upper.points.length - 1].ny) / 2;
            const lowerMeanY = (lower.points[0].ny + lower.points[lower.points.length - 1].ny) / 2;
            const upperMinX = Math.min(upper.points[0].nx, upper.points[upper.points.length - 1].nx);
            const upperMaxX = Math.max(upper.points[0].nx, upper.points[upper.points.length - 1].nx);

            if (charKey === '下') {
                return (upper.len > lower.len * 1.35 && upperMeanY < -0.15) ? 7.0 : -10.0;
            }
            if (charKey === '上') {
                if (lowerMeanY < 0.15 || upper.len > lower.len * 0.92) return -9.0;
                const staysRightOfStem = upperMinX >= stemX - 0.10 && upperMaxX > stemX + 0.06;
                return staysRightOfStem ? 7.5 : -7.5;
            }
            if (charKey === '土') {
                if (lowerMeanY < 0.15) return -9.0;
                const crossesStem = upperMinX < stemX - 0.11 && upperMaxX > stemX + 0.11;
                return crossesStem ? 7.5 : -7.5;
            }
        }

        // 3. 「石 / 右」首横与首撇出头关系判别
        if ((charKey === '石' || charKey === '右') && M >= 5) {
            let topHeng = null, topPie = null;
            for (let i = 0; i < Math.min(3, M); i++) {
                const s = elasticStrokes[i];
                const p0 = s.points[0], p1 = s.points[s.points.length - 1];
                const dx = p1.nx - p0.nx, dy = p1.ny - p0.ny;
                if (!topHeng && dx > 0.25 && Math.abs(dy) < dx * 0.45) topHeng = s;
                if (!topPie && dx < -0.18 && dy > 0.22) topPie = s;
            }
            if (topHeng && topPie) {
                const hengY = (topHeng.points[0].ny + topHeng.points[topHeng.points.length - 1].ny) / 2;
                const pieStartY = topPie.points[0].ny;
                const pieSticksAbove = pieStartY < hengY - 0.085;
                if (charKey === '右') return pieSticksAbove ? 6.5 : -7.5;
                if (charKey === '石') return !pieSticksAbove ? 6.5 : -7.5;
            }
        }

        return 0;
    }

    /**
     * 对单笔点集按弧长重采样并计算每个采样点的单位切向量 (tx, ty)
     */
    resampleStrokeWithTangents(points, numPoints = 12) {
        const res = this.resampleStroke(points, numPoints);
        const pts = res.points;
        const K = pts.length;
        const withTangents = pts.map((p, i) => {
            const prev = pts[Math.max(0, i - 1)];
            const next = pts[Math.min(K - 1, i + 1)];
            const dx = next.x - prev.x;
            const dy = next.y - prev.y;
            const mag = Math.hypot(dx, dy);
            return {
                x: p.x,
                y: p.y,
                tx: mag > 1e-4 ? dx / mag : 0.6,
                ty: mag > 1e-4 ? dy / mag : 0.8
            };
        });
        return { points: withTangents, len: res.len };
    }

    /**
     * 将一组笔画归一化到 [-0.5, 0.5] 空间
     * @param {boolean} elastic - true 时启用半弹性长宽对齐（吸收手写胖瘦差异，同时保留 0.36*iso 下限保护“一/丨”）
     */
    normalizeStrokeSet(sampledStrokes, minSpan = 70, elastic = false) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const s of sampledStrokes) {
            for (const p of s.points) {
                if (p.x < minX) minX = p.x;
                if (p.x > maxX) maxX = p.x;
                if (p.y < minY) minY = p.y;
                if (p.y > maxY) maxY = p.y;
            }
        }
        const boxWidth = Math.max(1, maxX - minX);
        const boxHeight = Math.max(1, maxY - minY);
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        const isoSpan = Math.max(boxWidth, boxHeight, minSpan);

        const scaleX = elastic ? Math.max(boxWidth * 0.65 + isoSpan * 0.35, isoSpan * 0.36) : isoSpan;
        const scaleY = elastic ? Math.max(boxHeight * 0.65 + isoSpan * 0.35, isoSpan * 0.36) : isoSpan;

        const normStrokes = sampledStrokes.map(s => {
            const mapped = s.points.map(p => {
                const stx = p.tx / scaleX;
                const sty = p.ty / scaleY;
                const tMag = Math.hypot(stx, sty) || 1;
                return {
                    x: p.x,
                    y: p.y,
                    nx: (p.x - cx) / scaleX,
                    ny: (p.y - cy) / scaleY,
                    tx: stx / tMag,
                    ty: sty / tMag
                };
            });
            let normLen = 0;
            for (let i = 1; i < mapped.length; i++) {
                normLen += Math.hypot(mapped[i].nx - mapped[i - 1].nx, mapped[i].ny - mapped[i - 1].ny);
            }
            return {
                len: normLen,
                points: mapped
            };
        });

        return {
            strokes: normStrokes,
            boxWidth,
            boxHeight,
            cx,
            cy,
            span: isoSpan
        };
    }

    /**
     * 智能精简提炼名师点拨 (控制在 1 ~ 2 条精炼短句)
     */
    synthesizeConciseSuggestions(totalScore, strokeEval, structureEval, shapeEval, confusedChar = null, targetChar = '') {
        const conciseList = [];

        if (confusedChar) {
            conciseList.push(`🚨 字形提醒：系统识别你写得更像“${confusedChar}”字，当前练习的是“${targetChar}”哦！`);
        }

        let strokeIssue = null;
        if (strokeEval.inversionsCount > 0) {
            strokeIssue = '🚨 笔顺提醒：按从上到下、先横后竖书写哦！';
        } else if (strokeEval.reverseCount > 0) {
            strokeIssue = '🚨 运笔方向：横画从左向右、竖画从上往下写，不要倒插笔！';
        } else if (strokeEval.diff < 0) {
            strokeIssue = '📌 笔画提醒：漏写了笔画，请对照左侧标准笔顺补齐。';
        } else if (strokeEval.diff > 0) {
            strokeIssue = '📌 笔画提醒：笔画稍有多余，转折处一笔写成不要断开。';
        } else if (strokeEval.avgSpatialDist > 22) {
            strokeIssue = '💡 落笔位置：部分笔画位置偏离标准字模，多观察每一笔的起止点！';
        }

        let structureIssue = null;
        if (shapeEval.score < 18) {
            structureIssue = '💡 字形建议：笔画与标准字模贴合度较低，请先跟着红色描红多练两遍！';
        } else if (structureEval.score < 22) {
            const hasCenterWarning = structureEval.feedback.some(f => f.includes('重心') || f.includes('偏'));
            if (hasCenterWarning) {
                structureIssue = '💡 结构建议：下笔尽量对齐米字格正中央，重心会更端正！';
            } else {
                structureIssue = '💡 占格建议：注意字形宽窄与大小比例，让间架更匀称！';
            }
        } else if (shapeEval.score < 23) {
            structureIssue = '💡 细节建议：注意起笔与收笔的到位，让笔画更饱满工整！';
        }

        if (strokeIssue) {
            conciseList.push(strokeIssue);
            if (structureIssue) {
                conciseList.push(structureIssue);
            } else if (structureEval.score >= 25) {
                conciseList.push('✅ 间架结构居中稳固，重心掌握得很好！');
            }
        } else if (structureIssue) {
            conciseList.push('✨ 笔顺规范，按部就班非常棒！');
            conciseList.push(structureIssue);
        } else {
            if (totalScore >= 90) {
                conciseList.push('✨ 笔顺标准规范，间架开阔，颇有小书法家风范！');
            } else {
                conciseList.push('✨ 笔画顺序规范，重心平稳，字迹工整端正！');
            }
        }

        return conciseList.slice(0, 2);
    }

    /**
     * 计算像素的包围盒与重心
     */
    calculateBoundingBoxAndCentroid(pixels, width, height) {
        let minX = width, minY = height, maxX = 0, maxY = 0;
        let sumX = 0, sumY = 0, totalPixels = 0;

        for (let y = 0; y < height; y += 2) {
            for (let x = 0; x < width; x += 2) {
                const idx = (y * width + x) * 4;
                if (pixels[idx + 3] > 30) {
                    totalPixels++;
                    sumX += x;
                    sumY += y;
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        return {
            minX, minY, maxX, maxY,
            boxWidth: Math.max(0, maxX - minX),
            boxHeight: Math.max(0, maxY - minY),
            centroidX: totalPixels ? sumX / totalPixels : width / 2,
            centroidY: totalPixels ? sumY / totalPixels : height / 2,
            totalPixels
        };
    }

    /**
     * 将 HanziWriter 字模字形骨架坐标 (1024x1024, Y轴向上) 映射转换为画板 CSS 屏幕坐标系 (Y轴向下)
     */
    transformMedian(median, size) {
        const padding = 20;
        const b = 1024, $ = 1024;
        const s = size - 2 * padding;
        const o = size - 2 * padding;
        const scale = Math.min(s / b, o / $);
        const h = padding + (s - scale * b) / 2;
        const l = padding + (o - scale * $) / 2;
        const xOffset = h;
        const yOffset = 124 * scale + l;

        return median.map(p => ({
            x: xOffset + scale * p[0],
            y: (size - yOffset) - scale * p[1]
        }));
    }

    /**
     * 对任意笔画点集按弧长进行等距重采样
     */
    resampleStroke(points, numPoints = 12) {
        if (!points || points.length === 0) return { points: [], len: 0 };
        if (points.length === 1) {
            return { points: Array(numPoints).fill({ x: points[0].x, y: points[0].y }), len: 0 };
        }
        let totalLen = 0;
        const dists = [0];
        for (let i = 1; i < points.length; i++) {
            const d = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
            totalLen += d;
            dists.push(totalLen);
        }
        if (totalLen < 1) {
            return { points: Array(numPoints).fill({ x: points[0].x, y: points[0].y }), len: 0 };
        }

        const resampled = [];
        const step = totalLen / (numPoints - 1);
        let currIdx = 0;

        for (let i = 0; i < numPoints; i++) {
            const targetDist = i * step;
            while (currIdx < dists.length - 1 && dists[currIdx + 1] < targetDist) {
                currIdx++;
            }
            if (currIdx >= dists.length - 1) {
                resampled.push({ x: points[points.length - 1].x, y: points[points.length - 1].y });
            } else {
                const segLen = dists[currIdx + 1] - dists[currIdx];
                const t = segLen > 0 ? (targetDist - dists[currIdx]) / segLen : 0;
                resampled.push({
                    x: points[currIdx].x + t * (points[currIdx + 1].x - points[currIdx].x),
                    y: points[currIdx].y + t * (points[currIdx + 1].y - points[currIdx].y)
                });
            }
        }
        return { points: resampled, len: totalLen };
    }

    /**
     * 计算用户笔画与标准笔画骨架间的双向距离、夹角及长度比
     */
    calcStrokeDistance(userStroke, stdStrokePoints, canvasSize = 360) {
        const K = 12;
        const pts = userStroke.points && userStroke.points.length > 0
            ? userStroke.points
            : [userStroke.startPoint, userStroke.endPoint];
        const u = this.resampleStroke(pts, K);
        const s = this.resampleStroke(stdStrokePoints, K);
        const scale360 = 360 / Math.max(120, canvasSize);

        let fwdDist = 0;
        let revDist = 0;
        for (let i = 0; i < K; i++) {
            fwdDist += Math.hypot(u.points[i].x - s.points[i].x, u.points[i].y - s.points[i].y);
            revDist += Math.hypot(u.points[i].x - s.points[K - 1 - i].x, u.points[i].y - s.points[K - 1 - i].y);
        }
        fwdDist = (fwdDist / K) * scale360;
        revDist = (revDist / K) * scale360;

        const uLen360 = u.len * scale360;
        const sLen360 = s.len * scale360;

        const isReverse = (revDist < fwdDist - 16) && (uLen360 > 20 && sLen360 > 20);
        const spatialDist = Math.min(fwdDist, revDist);

        let diffAngle = 0;
        let anglePenalty = 0;
        let lenRatio = 1.0;
        let lenPenalty = 0;

        if (uLen360 > 16 && sLen360 > 16) {
            const uAngle = Math.atan2(u.points[K - 1].y - u.points[0].y, u.points[K - 1].x - u.points[0].x);
            const sAngle = Math.atan2(s.points[K - 1].y - s.points[0].y, s.points[K - 1].x - s.points[0].x);
            diffAngle = Math.abs(uAngle - sAngle) % Math.PI;
            if (diffAngle > Math.PI / 2) diffAngle = Math.PI - diffAngle;
            anglePenalty = Math.sin(diffAngle) * 40;

            lenRatio = Math.max(uLen360 / Math.max(sLen360, 1), sLen360 / Math.max(uLen360, 1));
            if (lenRatio > 1.6) {
                lenPenalty = Math.min(45, (lenRatio - 1.6) * 24);
            }
        }

        const matchCost = spatialDist + anglePenalty + lenPenalty;

        return {
            fwdDist,
            revDist,
            spatialDist,
            diffAngle,
            lenRatio,
            matchCost,
            isReverse,
            uLen: uLen360,
            sLen: sLen360
        };
    }

    /**
     * 维度一：笔画数、笔画顺序、运笔走向与逐笔几何精度评测 (满分 40 分)
     */
    evaluateStrokes(validStrokes, charInfo, hanziData, bounds, canvasSize = 360, canonicalMatch = null) {
        let score = 40;
        const feedback = [];
        const warnings = [];

        const userStrokeCount = validStrokes.length;

        let targetStrokeCount = 0;
        if (hanziData && hanziData.strokes) {
            targetStrokeCount = hanziData.strokes.length;
        } else if (charInfo && typeof charInfo.strokes === 'number') {
            targetStrokeCount = charInfo.strokes;
        } else {
            targetStrokeCount = (charInfo && parseInt(charInfo.strokes, 10)) || 1;
        }

        const diff = userStrokeCount - targetStrokeCount;
        const absDiff = Math.abs(diff);
        const effCount = canonicalMatch ? canonicalMatch.effectiveStrokeCount : userStrokeCount;
        const effectiveDiff = Math.abs(effCount - targetStrokeCount);

        if (absDiff === 0) {
            feedback.push(`✅ 笔画数量完全正确：标准 ${targetStrokeCount} 笔，你正好写了 ${userStrokeCount} 笔！`);
        } else if (absDiff === 1 && effectiveDiff === 0) {
            score -= 5;
            warnings.push(`💡 转折提示：标准为 ${targetStrokeCount} 笔，你把转折分成了 ${userStrokeCount} 笔，折画一笔写成会更规范哦！`);
        } else if (absDiff === 1) {
            score -= 8;
            if (userStrokeCount < targetStrokeCount) {
                warnings.push(`⚠️ 笔画少写了 1 笔：标准应为 ${targetStrokeCount} 笔，你写了 ${userStrokeCount} 笔。`);
            } else {
                warnings.push(`⚠️ 笔画多写了 1 笔：标准应为 ${targetStrokeCount} 笔，你写了 ${userStrokeCount} 笔，注意折笔一气呵成。`);
            }
        } else if (absDiff === 2) {
            score -= 16;
            warnings.push(`💡 笔画数差异较大：标准为 ${targetStrokeCount} 笔，实际写了 ${userStrokeCount} 笔。`);
        } else {
            score -= 24;
            warnings.push(`💡 笔画数偏差明显：标准为 ${targetStrokeCount} 笔，请对照笔顺一步步书写。`);
        }

        let inversionsCount = 0;
        let reverseCount = 0;
        let avgSpatialDist = 0;

        if (hanziData && hanziData.medians && hanziData.medians.length > 0) {
            const stdMedians = hanziData.medians;
            const stdTransformed = stdMedians.map(m => this._cleanReferencePoints(this.transformMedian(m, canvasSize)));
            const M = validStrokes.length;
            const N = stdTransformed.length;

            const costMatrix = [];
            const detailsMatrix = [];
            for (let u = 0; u < M; u++) {
                costMatrix[u] = [];
                detailsMatrix[u] = [];
                for (let s = 0; s < N; s++) {
                    const res = this.calcStrokeDistance(validStrokes[u], stdTransformed[s], canvasSize);
                    costMatrix[u][s] = res.matchCost;
                    detailsMatrix[u][s] = res;
                }
            }

            const pairs = [];
            for (let u = 0; u < M; u++) {
                for (let s = 0; s < N; s++) {
                    pairs.push({ u, s, cost: costMatrix[u][s], detail: detailsMatrix[u][s] });
                }
            }
            pairs.sort((a, b) => a.cost - b.cost);

            const userMatchedToStd = Array(M).fill(-1);
            const stdMatchedToUser = Array(N).fill(-1);
            const userStrokeDetails = Array(M).fill(null);

            for (const p of pairs) {
                if (userMatchedToStd[p.u] === -1 && stdMatchedToUser[p.s] === -1) {
                    userMatchedToStd[p.u] = p.s;
                    stdMatchedToUser[p.s] = p.u;
                    userStrokeDetails[p.u] = p.detail;
                }
            }

            for (let u = 0; u < M; u++) {
                if (userMatchedToStd[u] === -1) {
                    let bestS = 0;
                    let bestCost = Infinity;
                    for (let s = 0; s < N; s++) {
                        if (costMatrix[u][s] < bestCost) {
                            bestCost = costMatrix[u][s];
                            bestS = s;
                        }
                    }
                    userMatchedToStd[u] = bestS;
                    userStrokeDetails[u] = detailsMatrix[u][bestS];
                }
            }

            // A. 逐笔几何精度扣分
            let sumSpatial = 0;
            let sumAngle = 0;
            let sumLenRatio = 0;
            for (let u = 0; u < M; u++) {
                const d = userStrokeDetails[u];
                if (d) {
                    sumSpatial += d.spatialDist;
                    sumAngle += d.diffAngle;
                    sumLenRatio += d.lenRatio;
                }
            }
            avgSpatialDist = M > 0 ? (sumSpatial / M) : 0;
            const avgAngleRad = M > 0 ? (sumAngle / M) : 0;
            const avgLenRatio = M > 0 ? (sumLenRatio / M) : 1;

            const spatialPenalty = Math.min(13, Math.max(0, (avgSpatialDist - 7) * 0.32));
            const anglePenalty = Math.min(6, Math.max(0, (avgAngleRad - 0.12) * 14));
            const lenPenalty = Math.min(6, Math.max(0, (avgLenRatio - 1.15) * 8));
            score -= Math.round(spatialPenalty + anglePenalty + lenPenalty);

            // B. 运笔方向检测 (倒插笔检测)
            const reverseStrokes = [];
            for (let u = 0; u < M; u++) {
                const d = userStrokeDetails[u];
                if (d && d.isReverse) {
                    reverseStrokes.push(u + 1);
                }
            }
            reverseCount = reverseStrokes.length;

            if (reverseStrokes.length > 0) {
                const dirPenalty = Math.min(18, reverseStrokes.length * 9);
                score -= dirPenalty;
                warnings.push(`🚨 运笔方向错误：第 ${reverseStrokes.join('、')} 笔方向反了！横应从左向右，竖应从上往下！`);
            }

            // C. 笔顺先后次序检测 (逆序对检测)
            const inversions = [];
            for (let i = 0; i < M - 1; i++) {
                for (let j = i + 1; j < M; j++) {
                    if (userMatchedToStd[i] > userMatchedToStd[j]) {
                        inversions.push({
                            firstUser: i,
                            secondUser: j,
                            firstStd: userMatchedToStd[i],
                            secondStd: userMatchedToStd[j]
                        });
                    }
                }
            }
            inversionsCount = inversions.length;

            if (inversions.length > 0) {
                let orderPenalty = 0;
                if (inversions.length === 1) {
                    orderPenalty = 14;
                    const inv = inversions[0];
                    warnings.push(`🚨 笔顺错误：第 ${inv.firstUser + 1} 笔与第 ${inv.secondUser + 1} 笔颠倒了！`);
                } else if (inversions.length === 2) {
                    orderPenalty = 22;
                    warnings.push(`🚨 笔顺错误：检测到 2 处笔顺颠倒，请遵循“从上到下、先横后竖”！`);
                } else {
                    orderPenalty = 28;
                    warnings.push(`🚨 笔顺错乱：多处笔画顺序不合规范，请先观看左侧笔顺演示！`);
                }
                score -= orderPenalty;
            }

            if (absDiff === 0 && inversions.length === 0 && reverseStrokes.length === 0 && avgSpatialDist <= 22) {
                feedback.push('✨ 笔画顺序与运笔走向标准规范，落笔准确！');
            }
        }

        const allFeedback = [...warnings, ...feedback];

        return {
            score: Math.max(4, Math.min(40, Math.round(score))),
            feedback: allFeedback,
            inversionsCount,
            reverseCount,
            diff,
            absDiff,
            effectiveDiff,
            avgSpatialDist
        };
    }

    /**
     * 维度二：间架结构、重心对齐与宽高比例评测 (满分 30 分)
     */
    evaluateStructure(bounds, canvasWidth, canvasHeight, hanziData = null, cssSize = 360) {
        let score = 30;
        const feedback = [];

        const dpr = canvasWidth / Math.max(120, cssSize);
        let targetCenterX = canvasWidth / 2;
        let targetCenterY = canvasHeight / 2;
        let targetWidth = canvasWidth * 0.68;
        let targetHeight = canvasHeight * 0.68;

        if (hanziData && hanziData.medians && hanziData.medians.length > 0) {
            const stdTransformed = hanziData.medians.map(m => this.transformMedian(m, cssSize));
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            let sumX = 0, sumY = 0, cnt = 0;
            for (const stk of stdTransformed) {
                for (const p of stk) {
                    const px = p.x * dpr;
                    const py = p.y * dpr;
                    if (px < minX) minX = px;
                    if (px > maxX) maxX = px;
                    if (py < minY) minY = py;
                    if (py > maxY) maxY = py;
                    sumX += px;
                    sumY += py;
                    cnt++;
                }
            }
            if (cnt > 0) {
                targetCenterX = sumX / cnt;
                targetCenterY = sumY / cnt;
                targetWidth = Math.max(canvasWidth * 0.14, maxX - minX);
                targetHeight = Math.max(canvasHeight * 0.14, maxY - minY);
            }
        }

        // 1. 重心偏移评测
        const offsetX = bounds.centroidX - targetCenterX;
        const offsetY = bounds.centroidY - targetCenterY;
        const distFromTargetCenter = Math.hypot(offsetX, offsetY);
        const centerRatio = distFromTargetCenter / (canvasWidth / 2);

        if (centerRatio <= 0.04) {
            feedback.push('✅ 间架结构居中：重心稳固，与标准字模中心对齐！');
        } else {
            const centerPenalty = Math.min(12, Math.max(1, Math.round((centerRatio - 0.03) * 46)));
            score -= centerPenalty;
            if (centerRatio >= 0.13) {
                let dirText = '';
                if (Math.abs(offsetX) > Math.abs(offsetY)) {
                    dirText = offsetX > 0 ? '偏右' : '偏左';
                } else {
                    dirText = offsetY > 0 ? '偏下' : '偏上';
                }
                feedback.push(`⚠️ 重心提示：整个字稍微${dirText}了，注意把主笔落在米字格中心线上。`);
            } else {
                feedback.push('👌 居中度良好，整体重心比较平稳。');
            }
        }

        // 2. 大小占格比例评测
        const userSpan = Math.max(bounds.boxWidth, bounds.boxHeight, canvasWidth * 0.12);
        const targetSpan = Math.max(targetWidth, targetHeight, canvasWidth * 0.25);
        const spanRatio = userSpan / targetSpan;

        if (spanRatio >= 0.90 && spanRatio <= 1.10) {
            feedback.push('✅ 比例饱满得体：字形大小适中，舒展大方！');
        } else if (spanRatio < 0.90) {
            const sizePenalty = Math.min(11, Math.max(1, Math.round((0.92 - spanRatio) * 30)));
            score -= sizePenalty;
            feedback.push('💡 占格提示：字写得偏小了，可以放开手脚把笔画写得更舒展！');
        } else {
            const sizePenalty = Math.min(10, Math.max(1, Math.round((spanRatio - 1.08) * 26)));
            score -= sizePenalty;
            feedback.push('💡 占格提示：字写得偏大了，注意外围留白，不要顶满边框。');
        }

        // 3. 宽高长短比例评测
        const uAspect = (bounds.boxWidth + canvasWidth * 0.12) / (bounds.boxHeight + canvasHeight * 0.12);
        const tAspect = (targetWidth + canvasWidth * 0.12) / (targetHeight + canvasHeight * 0.12);
        const aspectDiff = Math.abs(Math.log(uAspect / tAspect));
        if (aspectDiff > 0.12) {
            const aspectPenalty = Math.min(8, Math.max(1, Math.round((aspectDiff - 0.10) * 20)));
            score -= aspectPenalty;
        }

        return {
            score: Math.max(5, Math.min(30, Math.round(score))),
            feedback
        };
    }

    /**
     * 维度三：字形饱满度与骨架贴合度 (满分 30 分)
     */
    evaluateShape(userPixels, char, width, height, bounds, hanziData, canvasSize = 360, validStrokes = [], canonicalMatch = null) {
        const feedback = [];

        if (!this.offscreenCanvas && typeof document !== 'undefined') {
            this.offscreenCanvas = document.createElement('canvas');
            this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        }
        if (!this.offscreenCanvas || !this.offscreenCtx) {
            const skelF1 = canonicalMatch ? canonicalMatch.skeletonF1 : 0.75;
            const simScore = Math.max(6, Math.min(30, Math.round(4 + 26 * Math.pow(skelF1, 1.15))));
            return {
                score: simScore,
                coverageRate: canonicalMatch ? canonicalMatch.skeletonRecall : 0.75,
                validRate: canonicalMatch ? canonicalMatch.skeletonPrecision : 0.75,
                feedback: ['✅ 笔画饱满，字形完整']
            };
        }

        this.offscreenCanvas.width = width;
        this.offscreenCanvas.height = height;
        const ctx = this.offscreenCtx;
        ctx.clearRect(0, 0, width, height);

        let strokeData = hanziData;
        if (!strokeData && typeof window !== 'undefined' && window.STROKE_DATA_CACHE && window.STROKE_DATA_CACHE[char]) {
            strokeData = window.STROKE_DATA_CACHE[char];
        }

        const dpr = width / canvasSize;

        if (strokeData && strokeData.strokes && typeof Path2D !== 'undefined') {
            const padding = 20;
            const b = 1024, $ = 1024;
            const s = canvasSize - 2 * padding;
            const o = canvasSize - 2 * padding;
            const scale = Math.min(s / b, o / $);
            const h = padding + (s - scale * b) / 2;
            const l = padding + (o - scale * $) / 2;
            const xOffset = h;
            const yOffset = 124 * scale + l;

            ctx.save();
            ctx.scale(dpr, dpr);
            ctx.translate(xOffset, canvasSize - yOffset);
            ctx.scale(scale, -scale);
            ctx.fillStyle = '#000000';

            for (const strokePath of strokeData.strokes) {
                const path2d = new Path2D(strokePath);
                ctx.fill(path2d);
            }
            ctx.restore();
        } else {
            const fontSize = Math.floor(width * 0.72);
            ctx.font = `normal ${fontSize}px "KaiTi", "STKaiti", "BiaoKai", "SimSun", serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#000000';
            ctx.fillText(char, width / 2, height / 2 + height * 0.03);
        }

        const targetPixels = ctx.getImageData(0, 0, width, height).data;

        let targetCovered = 0;
        let totalTarget = 0;
        let validUserStrokes = 0;
        let totalUser = 0;
        const step = Math.max(2, Math.round(dpr * 2));
        const toleranceRadius = Math.round(11 * dpr);

        for (let y = 0; y < height; y += step) {
            for (let x = 0; x < width; x += step) {
                const idx = (y * width + x) * 4;
                const isTarget = targetPixels[idx + 3] > 40;
                const isUser = userPixels[idx + 3] > 40;

                if (isTarget) {
                    totalTarget++;
                    if (isUser || this.hasNearbyTarget(userPixels, x, y, width, height, Math.round(7 * dpr))) {
                        targetCovered++;
                    }
                }

                if (isUser) {
                    totalUser++;
                    if (isTarget || this.hasNearbyTarget(targetPixels, x, y, width, height, toleranceRadius)) {
                        validUserStrokes++;
                    }
                }
            }
        }

        const pixelCoverage = totalTarget > 0 ? (targetCovered / totalTarget) : 0.6;
        const validRate = totalUser > 0 ? (validUserStrokes / totalUser) : 0.6;

        const skelRecall = canonicalMatch ? canonicalMatch.skeletonRecall : pixelCoverage;
        const skelPrecision = canonicalMatch ? canonicalMatch.skeletonPrecision : validRate;
        const effectiveCoverage = pixelCoverage * 0.50 + skelRecall * 0.50;
        const effectiveValid = validRate * 0.55 + skelPrecision * 0.45;

        const precisionNorm = Math.pow(Math.max(0, Math.min(1, (effectiveValid - 0.28) / 0.66)), 1.22);
        const coverageNorm = Math.pow(Math.max(0, Math.min(1, (effectiveCoverage - 0.26) / 0.66)), 1.22);
        const rawScore = 2 + 14 * precisionNorm + 14 * coverageNorm;
        const score = Math.max(3, Math.min(30, Math.round(rawScore)));

        if (effectiveValid >= 0.80) {
            feedback.push('✅ 笔画轨迹工整，紧贴标准字模！');
        } else if (effectiveValid >= 0.62) {
            feedback.push('👌 笔画大体贴合字模，部分笔端略有偏移。');
        } else {
            feedback.push('💡 笔形控制提示：部分笔画偏离字模较远，注意起笔与收笔位置。');
        }

        if (effectiveCoverage >= 0.70) {
            feedback.push('✅ 汉字关键骨架完整饱满。');
        } else if (effectiveCoverage >= 0.50) {
            feedback.push('💡 部分笔画偏短或未写到位，可多加练习。');
        } else {
            feedback.push('💡 字形骨架覆盖率偏低，请完整书写每一笔。');
        }

        return {
            score,
            coverageRate: effectiveCoverage,
            validRate: effectiveValid,
            feedback
        };
    }

    /**
     * 辅助函数：检测周边是否有有效像素
     */
    hasNearbyTarget(pixels, x, y, width, height, radius) {
        const minX = Math.max(0, x - radius);
        const maxX = Math.min(width - 1, x + radius);
        const minY = Math.max(0, y - radius);
        const maxY = Math.min(height - 1, y + radius);

        for (let cy = minY; cy <= maxY; cy += 4) {
            for (let cx = minX; cx <= maxX; cx += 4) {
                const idx = (cy * width + cx) * 4;
                if (pixels[idx + 3] > 40) return true;
            }
        }
        return false;
    }
}

window.ChineseWritingEvaluator = ChineseWritingEvaluator;
window.chineseWritingEvaluator = new ChineseWritingEvaluator();
