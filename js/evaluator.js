/**
 * evaluator.js - 汉字书写智能评分与笔画检测引擎
 * 综合评估：1. 笔画数与运笔方向  2. 间架结构与居中平衡  3. 笔画覆盖与字形工整度
 */

class ChineseWritingEvaluator {
    constructor() {
        // 创建离线评估 Canvas (支持浏览器环境与测试环境)
        if (typeof document !== 'undefined') {
            this.offscreenCanvas = document.createElement('canvas');
            this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        } else {
            this.offscreenCanvas = null;
            this.offscreenCtx = null;
        }
    }

    /**
     * 对用户的画板书写进行全方位智能评测
     * @param {HTMLCanvasElement} drawCanvas 用户的书写画布
     * @param {Object} charInfo 当前汉字元数据（拼音、笔画数、部首等）
     * @param {Array} strokeList 用户书写的笔画列表
     * @param {Object} hanziData HanziWriter 的笔画数据（含 strokes 矢量与 medians）
     * @param {number} [canvasSize] 画板 CSS 样式尺寸 (通常为 360)
     * @returns {Object} 评测结果详情
     */
    evaluate(drawCanvas, charInfo, strokeList, hanziData, canvasSize) {
        const width = drawCanvas.width;
        const height = drawCanvas.height;
        const cssSize = canvasSize || (drawCanvas.clientWidth > 0 ? drawCanvas.clientWidth : 0) || (drawCanvas.style.width ? parseFloat(drawCanvas.style.width) : 0) || (width / (window.devicePixelRatio || 1)) || 360;

        if (!strokeList || strokeList.length === 0) {
            return {
                valid: false,
                message: '请先在画板上认真写字后再提交评分哦！'
            };
        }

        // 1. 获取用户画面的 ImageData
        const userImgData = drawCanvas.getContext('2d').getImageData(0, 0, width, height);
        const userPixels = userImgData.data;

        // 计算用户笔画像素的包围盒与重心
        const bounds = this.calculateBoundingBoxAndCentroid(userPixels, width, height);
        if (bounds.totalPixels < 150) {
            return {
                valid: false,
                message: '字迹太轻微或笔画过少，请多写几笔再评分哦！'
            };
        }

        // 2. 维度一：笔画数、笔画顺序与运笔走向评测 (满分 40 分)
        const strokeEval = this.evaluateStrokes(strokeList, charInfo, hanziData, bounds, cssSize);

        // 3. 维度二：间架结构与居中布白评测 (满分 30 分)
        const structureEval = this.evaluateStructure(bounds, width, height);

        // 4. 维度三：字形饱满度与重合匹配度 (满分 30 分)
        const shapeEval = this.evaluateShape(userPixels, charInfo.char, width, height, bounds, hanziData, cssSize);

        // 5. 综合总分计算 (满分 100 分 = 40 + 30 + 30)
        let totalScore = strokeEval.score + structureEval.score + shapeEval.score;

        // 笔画顺序与方向对总分的严格封顶与约束
        const hasOrderError = strokeEval.inversionsCount > 0;
        const hasReverseError = strokeEval.reverseCount > 0;

        if (strokeEval.inversionsCount >= 2 || (hasOrderError && hasReverseError)) {
            // 严重笔顺错误或倒插笔：最高不超过 72 分 (仅及格/需加强，坚决不给虚假高分)
            totalScore = Math.min(totalScore, 72);
        } else if (strokeEval.inversionsCount === 1) {
            // 单处笔顺颠倒：最高不超过 82 分 (封顶良好，绝不可获得优等或甲上)
            totalScore = Math.min(totalScore, 82);
        } else if (hasReverseError) {
            // 运笔方向错误：最高不超过 84 分
            totalScore = Math.min(totalScore, 84);
        }

        // 最低底线控制在 30 分，最高 99 分
        totalScore = Math.max(30, Math.min(99, Math.round(totalScore)));

        // 6. 确定评级等级与印章评语
        let grade = '';
        let stars = 3;
        let sealText = '妙笔生花';
        let teacherComment = '';

        if (totalScore >= 93) {
            grade = '【甲上 · 妙笔生花】';
            stars = 3;
            sealText = '妙笔生花';
            teacherComment = '神采飞扬！间架稳固，笔顺如流，颇有小小书法家的风采！';
        } else if (totalScore >= 85) {
            grade = '【优等 · 书写新星】';
            stars = 3;
            sealText = '书写新星';
            teacherComment = '字形端正工整，笔顺规范，注意起笔与收笔细节会更完美！';
        } else if (totalScore >= 75) {
            grade = '【良好 · 工整大方】';
            stars = 2;
            if (hasOrderError) {
                sealText = '规范笔顺';
                teacherComment = '字形整体协调，但笔画顺序存在颠倒，请严格遵循汉字笔顺规范！';
            } else {
                sealText = '工整大方';
                teacherComment = '字形端正，结构稳健，注意细节运笔会更出色！';
            }
        } else {
            grade = '【需加强 · 循序渐进】';
            stars = 1;
            if (hasOrderError) {
                sealText = '规范笔顺';
                teacherComment = '笔顺是汉字书写的根本！正确的笔顺才能写好结构，快去左侧“笔顺跟写闯关”强化练习吧！';
            } else {
                sealText = '继续加油';
                teacherComment = '很有潜力的练习！跟着左边笔顺多临摹两遍，一定会越写越漂亮！';
            }
        }

        // 7. 汇总个性化诊断建议 (笔顺严重警告排在最前面)
        const suggestions = [];
        suggestions.push(...strokeEval.feedback);
        suggestions.push(...structureEval.feedback);
        suggestions.push(...shapeEval.feedback);

        return {
            valid: true,
            totalScore,
            grade,
            stars,
            sealText,
            teacherComment,
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
     * 计算像素的包围盒与重心
     */
    calculateBoundingBoxAndCentroid(pixels, width, height) {
        let minX = width, minY = height, maxX = 0, maxY = 0;
        let sumX = 0, sumY = 0, totalPixels = 0;

        for (let y = 0; y < height; y += 2) {
            for (let x = 0; x < width; x += 2) {
                const idx = (y * width + x) * 4;
                if (pixels[idx + 3] > 30) { // alpha > 30 视为有效笔触
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
     * 对任意笔画点集按弧长进行等距重采样，便于高精度几何与走向比对
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
     * 计算用户笔画与标准笔画骨架间的双向距离、夹角及走向匹配 (高精度检测倒插笔与笔画对应)
     */
    calcStrokeDistance(userStroke, stdStrokePoints) {
        const K = 12;
        const pts = userStroke.points && userStroke.points.length > 0 
            ? userStroke.points 
            : [userStroke.startPoint, userStroke.endPoint];
        const u = this.resampleStroke(pts, K);
        const s = this.resampleStroke(stdStrokePoints, K);

        let fwdDist = 0;
        let revDist = 0;
        for (let i = 0; i < K; i++) {
            fwdDist += Math.hypot(u.points[i].x - s.points[i].x, u.points[i].y - s.points[i].y);
            revDist += Math.hypot(u.points[i].x - s.points[K - 1 - i].x, u.points[i].y - s.points[K - 1 - i].y);
        }
        fwdDist /= K;
        revDist /= K;

        // 反向判定：反向距离明显小于正向距离 (差值>18px)，且笔画有足够长度 (避免微短点产生误判)
        const isReverse = (revDist < fwdDist - 18) && (u.len > 22 && s.len > 22);
        const spatialDist = Math.min(fwdDist, revDist);

        // 几何匹配代价优化：综合考虑走向夹角与长度比例，防止“点”错配给“横/竖”
        let anglePenalty = 0;
        let lenPenalty = 0;
        if (u.len > 20 && s.len > 20) {
            const uAngle = Math.atan2(u.points[K - 1].y - u.points[0].y, u.points[K - 1].x - u.points[0].x);
            const sAngle = Math.atan2(s.points[K - 1].y - s.points[0].y, s.points[K - 1].x - s.points[0].x);
            let diffAngle = Math.abs(uAngle - sAngle) % Math.PI;
            if (diffAngle > Math.PI / 2) diffAngle = Math.PI - diffAngle;
            // 夹角接近90度时增加代价
            anglePenalty = Math.sin(diffAngle) * 35;

            const lenRatio = Math.max(u.len / Math.max(s.len, 1), s.len / Math.max(u.len, 1));
            if (lenRatio > 2.0) {
                lenPenalty = Math.min(40, (lenRatio - 2.0) * 20);
            }
        }

        const matchCost = spatialDist + anglePenalty + lenPenalty;

        return { fwdDist, revDist, spatialDist, matchCost, isReverse, uLen: u.len, sLen: s.len };
    }

    /**
     * 维度一：笔画数、笔画顺序与运笔走向智能评测 (满分 40 分)
     */
    evaluateStrokes(strokeList, charInfo, hanziData, bounds, canvasSize = 360) {
        let score = 40; // 满分 40 分
        const feedback = [];
        const warnings = []; // 紧急严重警告优先置顶

        // 过滤由于手掌误触或极轻抖动产生的微小杂点 (总长度 < 6px)
        let validStrokes = strokeList.filter(s => {
            const pts = s.points || [];
            if (pts.length <= 1) return false;
            let len = 0;
            for (let i = 1; i < pts.length; i++) {
                len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
            }
            return len >= 6;
        });
        if (validStrokes.length === 0) validStrokes = strokeList;

        const userStrokeCount = validStrokes.length;

        // 获取标准笔画数
        let targetStrokeCount = 0;
        if (hanziData && hanziData.strokes) {
            targetStrokeCount = hanziData.strokes.length;
        } else if (typeof charInfo.strokes === 'number') {
            targetStrokeCount = charInfo.strokes;
        } else {
            targetStrokeCount = parseInt(charInfo.strokes, 10) || 1;
        }

        // 1. 笔画数量检测
        const diff = Math.abs(userStrokeCount - targetStrokeCount);
        if (diff === 0) {
            feedback.push(`✅ 笔画数量完全正确：标准 ${targetStrokeCount} 笔，你正好写了 ${userStrokeCount} 笔！`);
        } else if (diff === 1) {
            score -= 6;
            if (userStrokeCount < targetStrokeCount) {
                warnings.push(`⚠️ 笔画少写了 1 笔：标准应为 ${targetStrokeCount} 笔，你写了 ${userStrokeCount} 笔，可能漏写了点、提或短撇。`);
            } else {
                warnings.push(`⚠️ 笔画多写了 1 笔：标准应为 ${targetStrokeCount} 笔，你写了 ${userStrokeCount} 笔，注意转折处一气呵成，不要断开。`);
            }
        } else if (diff === 2) {
            score -= 12;
            warnings.push(`💡 笔画数差异较大：标准为 ${targetStrokeCount} 笔，实际书写 ${userStrokeCount} 笔，请对照左侧笔顺拆解补齐或合并。`);
        } else {
            score -= 18;
            warnings.push(`💡 笔画数偏差明显：标准为 ${targetStrokeCount} 笔，请点击左侧“播放笔顺”认真观看并一步步跟写。`);
        }

        let inversionsCount = 0;
        let reverseCount = 0;

        // 2. 笔画空间关联、顺序与走向综合评测
        if (hanziData && hanziData.medians && hanziData.medians.length > 0) {
            const stdMedians = hanziData.medians;
            const stdTransformed = stdMedians.map(m => this.transformMedian(m, canvasSize));
            const M = validStrokes.length;
            const N = stdTransformed.length;

            // 构建用户笔画与标准各笔画之间的空间代价矩阵
            const costMatrix = [];
            const detailsMatrix = [];
            for (let u = 0; u < M; u++) {
                costMatrix[u] = [];
                detailsMatrix[u] = [];
                for (let s = 0; s < N; s++) {
                    const res = this.calcStrokeDistance(validStrokes[u], stdTransformed[s]);
                    costMatrix[u][s] = res.matchCost;
                    detailsMatrix[u][s] = res;
                }
            }

            // 贪心最小空间距离关联 (Bipartite Matching)
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

            // 针对多写的额外笔画做就近归类
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

            // A. 运笔方向检测 (倒插笔检测)
            const reverseStrokes = [];
            for (let u = 0; u < M; u++) {
                const d = userStrokeDetails[u];
                if (d && d.isReverse) {
                    reverseStrokes.push(u + 1);
                }
            }
            reverseCount = reverseStrokes.length;

            if (reverseStrokes.length > 0) {
                const dirPenalty = Math.min(18, reverseStrokes.length * 8);
                score -= dirPenalty;
                warnings.push(`🚨 运笔方向错误（倒插笔重点扣分）：第 ${reverseStrokes.join('、')} 笔的方向反了！横应由左向右，竖应自上而下书写！`);
            }

            // B. 笔顺先后次序检测 (逆序对检测 - 核心加大扣分)
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
                    orderPenalty = 14; // 单处颠倒扣 14 分
                    const inv = inversions[0];
                    warnings.push(`🚨 笔画顺序错误（重点扣分）：第 ${inv.firstUser + 1} 笔与第 ${inv.secondUser + 1} 笔颠倒了！你先写了标准笔顺的【第 ${inv.firstStd + 1} 笔】，后写了【第 ${inv.secondStd + 1} 笔】！请牢记标准笔顺！`);
                } else if (inversions.length === 2) {
                    orderPenalty = 22; // 两处颠倒扣 22 分
                    warnings.push(`🚨 笔画顺序严重错误（重点扣分）：检测到 2 处笔顺颠倒！汉字必须遵循“从上到下、先横后竖、先撇后捺”，不可随意下笔！`);
                } else {
                    orderPenalty = 30; // 3处及以上扣 30 分
                    warnings.push(`🚨 笔顺严重错乱（重点扣分）：多处笔画书写顺序不符合规范！请点击左侧“播放笔顺”一步步仔细跟写！`);
                }
                score -= orderPenalty;
            }

            // C. 漏写具体笔画提醒 (当写得比标准少时)
            if (M < N) {
                const missingStd = [];
                for (let s = 0; s < N; s++) {
                    if (stdMatchedToUser[s] === -1) {
                        missingStd.push(s + 1);
                    }
                }
                if (missingStd.length > 0 && missingStd.length <= 3) {
                    warnings.push(`📌 漏笔提醒：似乎漏写了标准笔顺的第 ${missingStd.join('、')} 笔，请对照笔顺补齐。`);
                }
            }

            // 笔顺与方向皆规范时的鼓励
            if (diff === 0 && inversions.length === 0 && reverseStrokes.length === 0) {
                feedback.push(`✨ 笔画顺序与运笔走向非常标准规范，按部就班，工整严谨！`);
            }
        }

        const allFeedback = [...warnings, ...feedback];

        return {
            score: Math.max(6, score),
            feedback: allFeedback,
            inversionsCount,
            reverseCount,
            diff
        };
    }

    /**
     * 维度二：间架结构与居中布白评测 (满分 30 分)
     */
    evaluateStructure(bounds, canvasWidth, canvasHeight) {
        let score = 30; // 满分 30 分
        const feedback = [];

        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;

        // 1. 重心居中性评测 (距米字格中心距离)
        const offsetX = bounds.centroidX - centerX;
        const offsetY = bounds.centroidY - centerY;
        const distFromCenter = Math.hypot(offsetX, offsetY);
        const centerRatio = distFromCenter / (canvasWidth / 2);

        if (centerRatio < 0.08) {
            feedback.push('✅ 间架结构居中：重心非常稳固，正好处在米字格中央！');
        } else if (centerRatio < 0.16) {
            score -= 2;
            feedback.push('👌 居中度良好，稍微有些微偏，整体很平稳。');
        } else {
            score -= 5;
            let dirText = '';
            if (Math.abs(offsetX) > Math.abs(offsetY)) {
                dirText = offsetX > 0 ? '偏右' : '偏左';
            } else {
                dirText = offsetY > 0 ? '偏下' : '偏上';
            }
            feedback.push(`⚠️ 重心提示：整个字稍微${dirText}了一点，练习时注意把主笔写在米字格十字中线上。`);
        }

        // 2. 占格比例大小评测 (理想字形应占田字格约 55% ~ 85%)
        const fillRatioW = bounds.boxWidth / canvasWidth;
        const fillRatioH = bounds.boxHeight / canvasHeight;
        const avgFill = (fillRatioW + fillRatioH) / 2;

        if (avgFill >= 0.55 && avgFill <= 0.85) {
            feedback.push('✅ 比例饱满得体：大小刚刚好，不显拥挤也不显松散！');
        } else if (avgFill < 0.55) {
            score -= 4;
            feedback.push('💡 占格提示：字写得稍微偏小了，可以放开手脚，把笔画写得更舒展大气！');
        } else {
            score -= 4;
            feedback.push('💡 占格提示：字写得稍微偏大了，注意收拢外围笔锋，不要超出外框。');
        }

        return {
            score: Math.max(10, score),
            feedback
        };
    }

    /**
     * 维度三：字形饱满度与重合匹配度 (满分 30 分)
     */
    evaluateShape(userPixels, char, width, height, bounds, hanziData, canvasSize = 360) {
        let score = 30;
        const feedback = [];

        if (!this.offscreenCanvas && typeof document !== 'undefined') {
            this.offscreenCanvas = document.createElement('canvas');
            this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        }
        if (!this.offscreenCanvas || !this.offscreenCtx) {
            return { score: 28, feedback: ['✅ 笔画饱满，字形完整'] };
        }

        // 在离线 Canvas 绘制标准字样进行对比 (使用与 HanziWriter 100% 相同的矢量字模)
        this.offscreenCanvas.width = width;
        this.offscreenCanvas.height = height;
        const ctx = this.offscreenCtx;
        ctx.clearRect(0, 0, width, height);

        let strokeData = hanziData;
        if (!strokeData && window.STROKE_DATA_CACHE && window.STROKE_DATA_CACHE[char]) {
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

        // 计算覆盖与重合度 (抽样匹配)
        let targetCovered = 0;
        let totalTarget = 0;
        let validUserStrokes = 0;
        let totalUser = 0;
        const step = Math.max(2, Math.round(dpr * 2));
        const toleranceRadius = Math.round(16 * dpr);

        for (let y = 0; y < height; y += step) {
            for (let x = 0; x < width; x += step) {
                const idx = (y * width + x) * 4;
                const isTarget = targetPixels[idx + 3] > 40;
                const isUser = userPixels[idx + 3] > 40;

                if (isTarget) {
                    totalTarget++;
                    if (isUser) targetCovered++;
                }

                if (isUser) {
                    totalUser++;
                    // 膨胀容差：如果在目标像素或者其周围有目标，算作有效笔画
                    if (isTarget || this.hasNearbyTarget(targetPixels, x, y, width, height, toleranceRadius)) {
                        validUserStrokes++;
                    }
                }
            }
        }

        // 匹配率
        const coverageRate = totalTarget > 0 ? (targetCovered / totalTarget) : 0.8;
        const validRate = totalUser > 0 ? (validUserStrokes / totalUser) : 0.8;

        if (validRate > 0.82) {
            feedback.push('✅ 笔画轨迹工整，笔路紧凑，无多余涂抹！');
        } else if (validRate > 0.65) {
            score -= 3;
            feedback.push('👌 笔画大体贴合字模，部分笔端略有飞出。');
        } else {
            score -= 6;
            feedback.push('💡 笔形控制提示：注意收笔时控制手腕力道，尽量贴合标准字形。');
        }

        if (coverageRate > 0.6) {
            feedback.push('✅ 笔画完整，汉字关键骨架都写得很扎实。');
        } else if (coverageRate > 0.45) {
            score -= 3;
            feedback.push('💡 部分笔画偏细或偏短，可以多练几次加深印象。');
        } else {
            score -= 7;
            feedback.push('💡 字形覆盖率偏低，笔画不够饱满，请完整描绘汉字骨架。');
        }

        return {
            score: Math.max(8, score),
            feedback
        };
    }

    /**
     * 辅助函数：检测周边是否有标准字样像素（提供容差范围）
     */
    hasNearbyTarget(targetPixels, x, y, width, height, radius) {
        const minX = Math.max(0, x - radius);
        const maxX = Math.min(width - 1, x + radius);
        const minY = Math.max(0, y - radius);
        const maxY = Math.min(height - 1, y + radius);

        for (let cy = minY; cy <= maxY; cy += 4) {
            for (let cx = minX; cx <= maxX; cx += 4) {
                const idx = (cy * width + cx) * 4;
                if (targetPixels[idx + 3] > 40) return true;
            }
        }
        return false;
    }
}

window.ChineseWritingEvaluator = ChineseWritingEvaluator;
window.chineseWritingEvaluator = new ChineseWritingEvaluator();
