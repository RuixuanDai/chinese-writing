/**
 * evaluator.js - 汉字书写智能评分与归一化骨架文字识别引擎
 * 综合评估：
 *   1. 笔画数、笔顺、运笔方向与逐笔几何贴合度 (满分 40 分)
 *   2. 间架结构、重心对齐与宽高比例 (满分 30 分)
 *   3. 骨架覆盖率 (Recall) 与字迹精准度 (Precision) (满分 30 分)
 *   4. 自由默写归一化字符识别 (支持平移/缩放不变性与易混字判别)
 */

class ChineseWritingEvaluator {
    constructor() {
        if (typeof document !== 'undefined') {
            this.offscreenCanvas = document.createElement('canvas');
            this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        } else {
            this.offscreenCanvas = null;
            this.offscreenCtx = null;
        }
    }

    /**
     * 对用户的画板书写进行全方位智能评测（标准练字评分，校准后更严谨真实）
     */
    evaluate(drawCanvas, charInfo, strokeList, hanziData, canvasSize) {
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
        if (bounds.totalPixels < 90) {
            return {
                valid: false,
                message: '字迹太轻微或笔画过少，请多写几笔再评分哦！'
            };
        }

        let resolvedHanziData = hanziData;
        if (!resolvedHanziData && typeof window !== 'undefined' && window.STROKE_DATA_CACHE && charInfo && charInfo.char) {
            resolvedHanziData = window.STROKE_DATA_CACHE[charInfo.char] || null;
        }

        // 归一化骨架匹配分析（兼具平移缩放容差与真实字形鉴别力）
        const validStrokes = this.filterValidStrokes(strokeList);
        const canonicalMatch = this.computeCanonicalSimilarity(validStrokes, resolvedHanziData, cssSize);

        // 1. 维度一：笔画数、笔画顺序、运笔走向与逐笔位置精度评测 (满分 40 分)
        const strokeEval = this.evaluateStrokes(validStrokes, charInfo, resolvedHanziData, bounds, cssSize, canonicalMatch);

        // 2. 维度二：间架结构、重心对齐与宽高比例评测 (满分 30 分)
        const structureEval = this.evaluateStructure(bounds, width, height, resolvedHanziData, cssSize);

        // 3. 维度三：骨架覆盖率与字形贴合度评测 (满分 30 分)
        const shapeEval = this.evaluateShape(userPixels, charInfo.char, width, height, bounds, resolvedHanziData, cssSize, validStrokes, canonicalMatch);

        // 检测是否误写成了字库中的其它易混汉字
        let confusedChar = null;
        if (typeof window !== 'undefined' && window.STROKE_DATA_CACHE && charInfo && charInfo.char) {
            const cache = window.STROKE_DATA_CACHE;
            const userM = validStrokes.length;
            let bestOtherSim = 0;
            for (const cand of Object.keys(cache)) {
                if (cand === charInfo.char) continue;
                const cData = cache[cand];
                if (!cData || !cData.medians || Math.abs(cData.medians.length - userM) > 1) continue;
                const cMatch = this.computeCanonicalSimilarity(validStrokes, cData, cssSize);
                if (cMatch.similarity > bestOtherSim) {
                    bestOtherSim = cMatch.similarity;
                    if (cMatch.similarity >= 68 && cMatch.similarity > canonicalMatch.similarity + 3.5) {
                        confusedChar = cand;
                    }
                }
            }
        }

        // 4. 综合总分计算 (满分 100 分 = 40 + 30 + 30)
        let totalScore = strokeEval.score + structureEval.score + shapeEval.score;

        const hasOrderError = strokeEval.inversionsCount > 0;
        const hasReverseError = strokeEval.reverseCount > 0;

        // 严格封顶约束：杜绝乱画、错字或错笔顺拿到虚高分数
        if (confusedChar) {
            totalScore = Math.min(totalScore, 52);
        } else if (canonicalMatch && (canonicalMatch.skeletonF1 < 0.52 || canonicalMatch.matchedStrokeRatio < 0.45)) {
            totalScore = Math.min(totalScore, 52);
        } else if (canonicalMatch && (canonicalMatch.skeletonF1 < 0.68 || canonicalMatch.matchedStrokeRatio < 0.68)) {
            totalScore = Math.min(totalScore, 66);
        }

        if (strokeEval.diff >= 2) {
            totalScore = Math.min(totalScore, 62);
        } else if (strokeEval.diff === 1) {
            totalScore = Math.min(totalScore, 75);
        }

        if (strokeEval.inversionsCount >= 2 || (hasOrderError && hasReverseError)) {
            totalScore = Math.min(totalScore, 65);
        } else if (strokeEval.inversionsCount === 1) {
            totalScore = Math.min(totalScore, 75);
        } else if (hasReverseError) {
            totalScore = Math.min(totalScore, 77);
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
            if (canonicalMatch && canonicalMatch.skeletonF1 < 0.52) {
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

        const suggestions = this.synthesizeConciseSuggestions(totalScore, strokeEval, structureEval, shapeEval, confusedChar, charInfo ? charInfo.char : '');

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
     * 过滤极微小误触杂点（保留短点画，但滤除 < 5px 的手掌擦碰噪点）
     */
    filterValidStrokes(strokeList) {
        if (!strokeList || strokeList.length === 0) return [];
        const filtered = strokeList.filter(s => {
            const pts = s.points || [];
            if (pts.length <= 1) return false;
            let len = 0;
            for (let i = 1; i < pts.length; i++) {
                len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
            }
            return len >= 5;
        });
        return filtered.length > 0 ? filtered : strokeList;
    }

    /**
     * 自由默写识别与评测（专用于「📝 闯关测试 · 看图写汉字」无描红默写）
     * 特点：
     *   1. 对用户字迹与标准字模均做保长宽比的归一化对齐，不因默写偏左/偏右/偏小而误判；
     *   2. 结合骨架双向覆盖度、切向方向角余弦、笔画相对拓扑位置进行精准识别；
     *   3. 兼容儿童常见的折笔拆分（如“山/出/田/口/去”将折画分成两笔书写）；
     *   4. 全字库比对易混字（如把“上”写成“下/土”，把“禾”写成“木”），给出针对性纠错提示。
     */
    recognizeAndEvaluateFreehand(drawCanvas, targetChars, strokeList, canvasSize, candidatePoolChars = null) {
        const width = drawCanvas.width;
        const height = drawCanvas.height;
        const cssSize = canvasSize || drawCanvas.clientWidth || 260;

        const validStrokes = this.filterValidStrokes(strokeList);
        if (validStrokes.length === 0) {
            return {
                valid: false,
                message: '请先在米字格里写出汉字再提交批改哦！'
            };
        }

        const userImgData = drawCanvas.getContext('2d').getImageData(0, 0, width, height);
        const bounds = this.calculateBoundingBoxAndCentroid(userImgData.data, width, height);
        if (bounds.totalPixels < 65) {
            return {
                valid: false,
                message: '字迹太轻或笔画太少啦，请认真写出完整汉字哦！'
            };
        }

        const cache = (typeof window !== 'undefined' && window.STROKE_DATA_CACHE) ? window.STROKE_DATA_CACHE : {};
        const targets = Array.isArray(targetChars) ? targetChars : [targetChars];

        // 1. 评估目标字（支持一图多解，取最优匹配）
        let bestTargetChar = targets[0];
        let bestTargetMatch = null;
        let bestTargetEval = null;

        for (const tChar of targets) {
            const tData = cache[tChar] || null;
            const cMatch = this.computeCanonicalSimilarity(validStrokes, tData, cssSize);
            const charInfo = (typeof getCharInfo === 'function' && getCharInfo(tChar)) || {
                char: tChar,
                strokes: tData && tData.strokes ? tData.strokes.length : 1
            };
            const fullEval = this.evaluate(drawCanvas, charInfo, validStrokes, tData, cssSize);
            if (!bestTargetMatch || cMatch.similarity > bestTargetMatch.similarity) {
                bestTargetChar = tChar;
                bestTargetMatch = cMatch;
                bestTargetEval = fullEval;
            }
        }

        // 2. 在易混字/题库字池中检索是否有更匹配的其它汉字（识别用户是不是写成了别的字）
        const poolChars = candidatePoolChars || Object.keys(cache);
        let bestOtherChar = null;
        let bestOtherMatch = null;
        const userM = validStrokes.length;

        for (const candChar of poolChars) {
            if (targets.includes(candChar)) continue;
            const cData = cache[candChar];
            if (!cData || !cData.medians) continue;
            const stdN = cData.medians.length;
            // 仅在笔画数相近的候选字中比对
            if (Math.abs(userM - stdN) > 1) continue;

            const cMatch = this.computeCanonicalSimilarity(validStrokes, cData, cssSize);
            if (!bestOtherMatch || cMatch.similarity > bestOtherMatch.similarity) {
                bestOtherChar = candChar;
                bestOtherMatch = cMatch;
            }
        }

        // 3. 判定是否默写正确
        const stdData = cache[bestTargetChar];
        const expectedStrokes = (stdData && stdData.strokes) ? stdData.strokes.length : 1;
        const strokeDiff = userM - expectedStrokes;
        const strokeDiffAbs = Math.abs(strokeDiff);

        // 根据总笔画数动态设定折笔拆分容差：
        // 1~2画字不允许少写，最多允许折笔多1画；3画字允许 [3, 4]；4画及以上允许 [-1, +2]
        let strokeCountAcceptable = false;
        if (expectedStrokes === 1) {
            strokeCountAcceptable = (userM === 1);
        } else if (expectedStrokes === 2) {
            strokeCountAcceptable = (userM === 2 || (userM === 3 && bestTargetMatch.skeletonF1 >= 0.78));
        } else if (expectedStrokes === 3) {
            strokeCountAcceptable = (userM >= 3 && userM <= 4);
        } else {
            strokeCountAcceptable = (strokeDiff >= -1 && strokeDiff <= 2);
        }

        // 是否被易混字击败（例如题目是“上”，但用户写的是“下”或“土”；或题目是“禾”，写成了“木”）
        const confusedWithOther = !!(
            bestOtherMatch &&
            bestOtherMatch.similarity >= 64 &&
            bestOtherMatch.similarity > bestTargetMatch.similarity + 2.5
        );

        const isShapeMatched = (
            bestTargetMatch.skeletonRecall >= 0.58 &&
            bestTargetMatch.skeletonPrecision >= 0.58 &&
            bestTargetMatch.skeletonF1 >= 0.60 &&
            bestTargetMatch.matchedStrokeRatio >= 0.72 &&
            bestTargetMatch.similarity >= 64 &&
            bestTargetMatch.avgDirectionCos >= 0.50
        );

        const isPass = strokeCountAcceptable && isShapeMatched && !confusedWithOther;

        // 默写得分：理性校准得分曲线，普通默写 76~86 分，特别工整 88~94 分，不虚高
        let freehandScore = bestTargetEval ? bestTargetEval.totalScore : Math.round(bestTargetMatch.similarity * 0.85);
        if (isPass) {
            const structScore = bestTargetEval ? bestTargetEval.metrics.structureScore : 22;
            const calibrated = Math.round(
                bestTargetMatch.similarity * 0.62 +
                structScore * 0.88 +
                (bestTargetMatch.matchedStrokeRatio * 10)
            );
            freehandScore = Math.min(94, Math.max(72, calibrated));
            if (strokeDiffAbs >= 1) {
                freehandScore = Math.min(freehandScore, 79);
            }
            if (bestTargetEval && bestTargetEval.metrics.strokeScore < 26) {
                freehandScore = Math.min(freehandScore, 78);
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
            strokeDiff,
            strokeCountAcceptable,
            confusedWithChar: confusedWithOther ? bestOtherChar : null,
            confusedSimilarity: confusedWithOther ? Math.round(bestOtherMatch.similarity) : 0,
            targetSimilarity: Math.round(bestTargetMatch.similarity),
            skeletonRecall: bestTargetMatch.skeletonRecall,
            skeletonPrecision: bestTargetMatch.skeletonPrecision,
            skeletonF1: bestTargetMatch.skeletonF1,
            suggestions: bestTargetEval ? bestTargetEval.suggestions : []
        };
    }

    /**
     * 计算用户笔画与标准字模在归一化坐标系 [-0.5, 0.5] 下的骨架覆盖率、切向余弦与综合相似度
     */
    computeCanonicalSimilarity(validStrokes, hanziData, canvasSize = 360) {
        if (!hanziData || !hanziData.medians || hanziData.medians.length === 0 || !validStrokes || validStrokes.length === 0) {
            return {
                similarity: 50,
                skeletonRecall: 0.5,
                skeletonPrecision: 0.5,
                skeletonF1: 0.5,
                avgDirectionCos: 0.5,
                orderedStrokeScore: 0.5
            };
        }

        const stdTransformed = hanziData.medians.map(m => this.transformMedian(m, canvasSize));

        // 1. 提取用户笔画与标准笔画的稠密采样点及局部切向单位向量
        const userSampledStrokes = validStrokes.map(s => {
            const pts = (s.points && s.points.length > 0) ? s.points : [s.startPoint, s.endPoint];
            return this.resampleStrokeWithTangents(pts, 14);
        });
        const stdSampledStrokes = stdTransformed.map(pts => this.resampleStrokeWithTangents(pts, 14));

        // 2. 计算各自包围盒并归一化到 [-0.5, 0.5]（保持宽高比，设置最小跨度下限防止“一/丨”被拉伸变形）
        const minSpan = canvasSize * 0.25;
        const userNorm = this.normalizeStrokeSet(userSampledStrokes, minSpan);
        const stdNorm = this.normalizeStrokeSet(stdSampledStrokes, minSpan);

        // 3. 展平所有采样点，计算双向骨架覆盖度 (Tangential Chamfer Matching)
        const uAllPts = [];
        userNorm.strokes.forEach((s, sIdx) => {
            s.points.forEach(p => uAllPts.push({ ...p, strokeIdx: sIdx }));
        });
        const sAllPts = [];
        stdNorm.strokes.forEach((s, sIdx) => {
            s.points.forEach(p => sAllPts.push({ ...p, strokeIdx: sIdx }));
        });

        const distThreshold = 0.125; // 归一化空间距离容差（收紧以精准区分易混字）
        const cosThreshold = 0.65;   // 切向夹角容差 (约 49 度，严格区分横/竖/撇/捺)

        // Skeleton Recall: 标准骨架上各点被用户同方向笔画覆盖的连续得分
        let coveredStdScore = 0;
        for (const sp of sAllPts) {
            let bestDist = Infinity;
            let bestCos = 0;
            for (const up of uAllPts) {
                const d = Math.hypot(sp.nx - up.nx, sp.ny - up.ny);
                const dot = sp.tx * up.tx + sp.ty * up.ty;
                const absDot = Math.abs(dot);
                if (absDot >= cosThreshold && d < bestDist) {
                    bestDist = d;
                    bestCos = dot;
                }
            }
            if (bestDist <= distThreshold) {
                const distWeight = 1 - (bestDist / distThreshold) * 0.45;
                const dirWeight = bestCos >= 0 ? 1.0 : 0.55;
                coveredStdScore += distWeight * dirWeight;
            }
        }

        // Skeleton Precision: 用户写下的笔画中有多少比例精准贴合在标准骨架上
        let validUserScore = 0;
        for (const up of uAllPts) {
            let bestDist = Infinity;
            let bestCos = 0;
            for (const sp of sAllPts) {
                const d = Math.hypot(up.nx - sp.nx, up.ny - sp.ny);
                const dot = up.tx * sp.tx + up.ty * sp.ty;
                const absDot = Math.abs(dot);
                if (absDot >= cosThreshold && d < bestDist) {
                    bestDist = d;
                    bestCos = dot;
                }
            }
            if (bestDist <= distThreshold) {
                const distWeight = 1 - (bestDist / distThreshold) * 0.45;
                const dirWeight = bestCos >= 0 ? 1.0 : 0.55;
                validUserScore += distWeight * dirWeight;
            }
        }

        const skeletonRecall = sAllPts.length > 0 ? (coveredStdScore / sAllPts.length) : 0;
        const skeletonPrecision = uAllPts.length > 0 ? (validUserScore / uAllPts.length) : 0;
        const skeletonF1 = (skeletonRecall + skeletonPrecision) > 0
            ? (2 * skeletonRecall * skeletonPrecision) / (skeletonRecall + skeletonPrecision)
            : 0;

        // 4. 逐笔归一化向量与相对位置匹配（区分“上/下/土”、“人/入/大”、“木/禾”、“左/右”）
        const M = userNorm.strokes.length;
        const N = stdNorm.strokes.length;
        const strokePairs = [];
        for (let u = 0; u < M; u++) {
            for (let s = 0; s < N; s++) {
                const uStk = userNorm.strokes[u];
                const sStk = stdNorm.strokes[s];
                let ptDist = 0;
                let dirCosSum = 0;
                const K = uStk.points.length;
                for (let k = 0; k < K; k++) {
                    ptDist += Math.hypot(uStk.points[k].nx - sStk.points[k].nx, uStk.points[k].ny - sStk.points[k].ny);
                    dirCosSum += (uStk.points[k].tx * sStk.points[k].tx + uStk.points[k].ty * sStk.points[k].ty);
                }
                ptDist /= K;
                const avgCos = dirCosSum / K;
                const lenDiff = Math.abs(uStk.len - sStk.len);
                const cost = ptDist + (1 - Math.max(-0.5, avgCos)) * 0.25 + lenDiff * 0.35;
                strokePairs.push({ u, s, cost, ptDist, avgCos, lenDiff });
            }
        }
        strokePairs.sort((a, b) => a.cost - b.cost);

        const uUsed = Array(M).fill(false);
        const sUsed = Array(N).fill(false);
        let matchedCount = 0;
        let wellMatchedCount = 0;
        let sumPtDist = 0;
        let sumDirCos = 0;

        for (const p of strokePairs) {
            if (!uUsed[p.u] && !sUsed[p.s]) {
                uUsed[p.u] = true;
                sUsed[p.s] = true;
                matchedCount++;
                sumPtDist += p.ptDist + p.lenDiff * 0.25;
                sumDirCos += p.avgCos;
                if (p.ptDist <= 0.14 && p.avgCos >= 0.55 && p.lenDiff <= 0.28) {
                    wellMatchedCount++;
                }
            }
        }

        // 未匹配上的多写/漏写笔画计入重罚
        const unmatchedCount = Math.max(M, N) - matchedCount;
        const totalStrokeSlots = Math.max(M, N, 1);
        const avgMatchedDist = (sumPtDist + unmatchedCount * 0.32) / totalStrokeSlots;
        const avgDirectionCos = matchedCount > 0 ? (sumDirCos / matchedCount) : 0;
        // 如果骨架整体高度贴合 (skeletonF1 >= 0.78)，说明是折笔拆分（如“山/田/出”多1笔），给予折笔容差
        const effectiveWellMatched = (skeletonF1 >= 0.78 && M > N && M <= N + 2)
            ? Math.max(wellMatchedCount / totalStrokeSlots, skeletonF1)
            : (wellMatchedCount / totalStrokeSlots);

        const orderedStrokeScore = Math.max(0, Math.min(1,
            (1 - avgMatchedDist / 0.30) * 0.55 +
            Math.max(0, avgDirectionCos) * 0.20 +
            effectiveWellMatched * 0.25
        ));

        // 5. 宽高比一致性（例如“一”是扁宽，“日/月”偏竖长）
        const uAspect = (userNorm.boxWidth + canvasSize * 0.12) / (userNorm.boxHeight + canvasSize * 0.12);
        const sAspect = (stdNorm.boxWidth + canvasSize * 0.12) / (stdNorm.boxHeight + canvasSize * 0.12);
        const aspectRatioDiff = Math.abs(Math.log(uAspect / sAspect));
        const aspectScore = Math.max(0, 1 - aspectRatioDiff * 0.85);

        // 6. 笔画数匹配度
        const strokeDiffAbs = Math.abs(M - N);
        const strokeCountFactor = strokeDiffAbs === 0 ? 1.0 : (strokeDiffAbs === 1 ? 0.82 : (strokeDiffAbs === 2 ? 0.62 : 0.35));

        // 综合相似度 (0 ~ 100)
        const rawSim = (
            skeletonF1 * 0.44 +
            orderedStrokeScore * 0.38 +
            aspectScore * 0.08 +
            strokeCountFactor * 0.10
        ) * 100;

        return {
            similarity: Math.max(0, Math.min(100, rawSim)),
            skeletonRecall,
            skeletonPrecision,
            skeletonF1,
            matchedStrokeRatio: effectiveWellMatched,
            avgDirectionCos,
            orderedStrokeScore,
            aspectScore
        };
    }

    /**
     * 对单笔点集按弧长重采样并计算每个采样点的单位切向量 (tx, ty)
     */
    resampleStrokeWithTangents(points, numPoints = 14) {
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
                tx: mag > 1e-4 ? dx / mag : 1,
                ty: mag > 1e-4 ? dy / mag : 0
            };
        });
        return { points: withTangents, len: res.len };
    }

    /**
     * 将一组笔画归一化到以包围盒中心为原点、最大跨度为 1 的 [-0.5, 0.5] 空间
     */
    normalizeStrokeSet(sampledStrokes, minSpan = 80) {
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
        const span = Math.max(boxWidth, boxHeight, minSpan);

        const normStrokes = sampledStrokes.map(s => ({
            len: s.len / span,
            points: s.points.map(p => ({
                x: p.x,
                y: p.y,
                nx: (p.x - cx) / span,
                ny: (p.y - cy) / span,
                tx: p.tx,
                ty: p.ty
            }))
        }));

        return {
            strokes: normStrokes,
            boxWidth,
            boxHeight,
            cx,
            cy,
            span
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
        } else if (strokeEval.avgSpatialDist > 20) {
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

        // 1. 笔画数量检测（加大区分度）
        const diff = Math.abs(userStrokeCount - targetStrokeCount);
        if (diff === 0) {
            feedback.push(`✅ 笔画数量完全正确：标准 ${targetStrokeCount} 笔，你正好写了 ${userStrokeCount} 笔！`);
        } else if (diff === 1) {
            score -= 8;
            if (userStrokeCount < targetStrokeCount) {
                warnings.push(`⚠️ 笔画少写了 1 笔：标准应为 ${targetStrokeCount} 笔，你写了 ${userStrokeCount} 笔。`);
            } else {
                warnings.push(`⚠️ 笔画多写了 1 笔：标准应为 ${targetStrokeCount} 笔，你写了 ${userStrokeCount} 笔，注意折笔一气呵成。`);
            }
        } else if (diff === 2) {
            score -= 16;
            warnings.push(`💡 笔画数差异较大：标准为 ${targetStrokeCount} 笔，实际写了 ${userStrokeCount} 笔。`);
        } else {
            score -= 24;
            warnings.push(`💡 笔画数偏差明显：标准为 ${targetStrokeCount} 笔，请对照笔顺一步步书写。`);
        }

        let inversionsCount = 0;
        let reverseCount = 0;
        let avgSpatialDist = 0;

        // 2. 笔画空间关联、位置精度、顺序与走向评测
        if (hanziData && hanziData.medians && hanziData.medians.length > 0) {
            const stdMedians = hanziData.medians;
            const stdTransformed = stdMedians.map(m => this.transformMedian(m, canvasSize));
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

            // A. 逐笔几何精度扣分（位置偏移 + 角度偏差 + 长短偏差，最高扣 16 分）
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

            const spatialPenalty = Math.min(14, Math.max(0, (avgSpatialDist - 6) * 0.34));
            const anglePenalty = Math.min(7, Math.max(0, (avgAngleRad - 0.10) * 16));
            const lenPenalty = Math.min(6, Math.max(0, (avgLenRatio - 1.12) * 9));
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

            if (diff === 0 && inversions.length === 0 && reverseStrokes.length === 0 && avgSpatialDist <= 22) {
                feedback.push(`✨ 笔画顺序与运笔走向标准规范，落笔准确！`);
            }
        }

        const allFeedback = [...warnings, ...feedback];

        return {
            score: Math.max(4, Math.min(40, Math.round(score))),
            feedback: allFeedback,
            inversionsCount,
            reverseCount,
            diff,
            avgSpatialDist
        };
    }

    /**
     * 维度二：间架结构、重心对齐与宽高比例评测 (满分 30 分)
     * 改进：直接与当前汉字标准骨架的真实包围盒与重心比对（适配扁宽字“一/二/三”与竖长字“月/日/目”）
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

        // 1. 重心偏移评测 (最高扣 12 分)
        const offsetX = bounds.centroidX - targetCenterX;
        const offsetY = bounds.centroidY - targetCenterY;
        const distFromTargetCenter = Math.hypot(offsetX, offsetY);
        const centerRatio = distFromTargetCenter / (canvasWidth / 2);

        if (centerRatio <= 0.04) {
            feedback.push('✅ 间架结构居中：重心稳固，与标准字模中心对齐！');
        } else {
            const centerPenalty = Math.min(12, Math.max(1, Math.round((centerRatio - 0.03) * 48)));
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

        // 2. 大小占格比例评测 (与标准字跨度对比，最高扣 11 分)
        const userSpan = Math.max(bounds.boxWidth, bounds.boxHeight, canvasWidth * 0.12);
        const targetSpan = Math.max(targetWidth, targetHeight, canvasWidth * 0.25);
        const spanRatio = userSpan / targetSpan;

        if (spanRatio >= 0.90 && spanRatio <= 1.10) {
            feedback.push('✅ 比例饱满得体：字形大小适中，舒展大方！');
        } else if (spanRatio < 0.90) {
            const sizePenalty = Math.min(11, Math.max(1, Math.round((0.92 - spanRatio) * 32)));
            score -= sizePenalty;
            feedback.push('💡 占格提示：字写得偏小了，可以放开手脚把笔画写得更舒展！');
        } else {
            const sizePenalty = Math.min(10, Math.max(1, Math.round((spanRatio - 1.08) * 28)));
            score -= sizePenalty;
            feedback.push('💡 占格提示：字写得偏大了，注意外围留白，不要顶满边框。');
        }

        // 3. 宽高长短比例评测 (最高扣 8 分)
        const uAspect = (bounds.boxWidth + canvasWidth * 0.12) / (bounds.boxHeight + canvasHeight * 0.12);
        const tAspect = (targetWidth + canvasWidth * 0.12) / (targetHeight + canvasHeight * 0.12);
        const aspectDiff = Math.abs(Math.log(uAspect / tAspect));
        if (aspectDiff > 0.10) {
            const aspectPenalty = Math.min(8, Math.max(1, Math.round((aspectDiff - 0.08) * 22)));
            score -= aspectPenalty;
        }

        return {
            score: Math.max(5, Math.min(30, Math.round(score))),
            feedback
        };
    }

    /**
     * 维度三：字形饱满度与骨架贴合度 (满分 30 分)
     * 改进：综合像素精准度、标准骨架覆盖度与归一化骨架 F1，拉开高分与低分差距
     */
    evaluateShape(userPixels, char, width, height, bounds, hanziData, canvasSize = 360, validStrokes = [], canonicalMatch = null) {
        const feedback = [];

        if (!this.offscreenCanvas && typeof document !== 'undefined') {
            this.offscreenCanvas = document.createElement('canvas');
            this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        }
        if (!this.offscreenCanvas || !this.offscreenCtx) {
            return { score: 24, coverageRate: 0.75, validRate: 0.75, feedback: ['✅ 笔画饱满，字形完整'] };
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
        const toleranceRadius = Math.round(11 * dpr); // 收紧容差半径，提高评分严谨度

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
        const effectiveCoverage = pixelCoverage * 0.55 + skelRecall * 0.45;
        const effectiveValid = validRate * 0.60 + skelPrecision * 0.40;

        // 连续非线性映射计分 (满分 30 分 = 精准度 14 分 + 覆盖度 14 分 + 基础 2 分，高分需极高重合度)
        const precisionNorm = Math.pow(Math.max(0, Math.min(1, (effectiveValid - 0.30) / 0.66)), 1.25);
        const coverageNorm = Math.pow(Math.max(0, Math.min(1, (effectiveCoverage - 0.28) / 0.66)), 1.25);
        const rawScore = 2 + 14 * precisionNorm + 14 * coverageNorm;
        const score = Math.max(3, Math.min(30, Math.round(rawScore)));

        if (effectiveValid >= 0.82) {
            feedback.push('✅ 笔画轨迹工整，紧贴标准字模！');
        } else if (effectiveValid >= 0.64) {
            feedback.push('👌 笔画大体贴合字模，部分笔端略有偏移。');
        } else {
            feedback.push('💡 笔形控制提示：部分笔画偏离字模较远，注意起笔与收笔位置。');
        }

        if (effectiveCoverage >= 0.72) {
            feedback.push('✅ 汉字关键骨架完整饱满。');
        } else if (effectiveCoverage >= 0.52) {
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
