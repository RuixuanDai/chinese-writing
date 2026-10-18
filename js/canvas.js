/**
 * canvas.js - 核心手写画板引擎
 * 支持高分屏自适应、双层画布架构(底格+书写层)、毛笔书法笔触、描红透明度、撤销重做、橡皮擦与奖状导出
 */

class HandwritingCanvas {
    constructor(gridCanvasId, drawCanvasId, containerId) {
        this.gridCanvas = document.getElementById(gridCanvasId);
        this.drawCanvas = document.getElementById(drawCanvasId);
        this.container = document.getElementById(containerId);

        this.gridCtx = this.gridCanvas.getContext('2d');
        this.drawCtx = this.drawCanvas.getContext('2d');

        // 配置属性
        this.gridType = 'mizi'; // 'mizi', 'tianzi', 'huigong', 'jiugong', 'blank'
        this.brushType = 'brush'; // 'brush' (毛笔), 'pen' (硬笔), 'marker' (马克笔), 'eraser' (橡皮)
        this.brushColor = '#2d3436'; // 墨黑
        this.brushSize = 14; // 基准画笔粗细
        this.traceOpacity = 0.35; // 描红字样透明度
        this.currentChar = '一'; // 当前练习的字
        this.showTrace = true; // 是否显示描红

        // 智能手掌防误触与指针控制 (解决孩子使用 Apple Pencil / 触控笔时手腕误触问题)
        this.palmRejection = 'auto'; // 'auto' (检测到手写笔后自动屏蔽手掌触控), 'pen_only' (强制仅笔触), 'off' (手笔通用)
        this.isStylusDetected = false; // 是否已检测到手写笔介入
        this.activePointerId = null; // 当前正在书写的活跃指针 ID (单点锁定防串笔)
        this.lastClearedBackup = null; // 清空画板时的即时备份 (支持一键撤销找回，防止误触清空)
        this.onPalmRejectionChange = null; // 状态改变回调函数

        // 书写状态
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.lastTime = 0;
        this.lastWidth = this.brushSize;
        // 笔画历史堆栈 (用于撤销与保存)
        this.history = []; // 存储每一次绘制后的 ImageData
        this.maxHistory = 20;

        // 真实笔画轨迹序列 (用于智能笔画与笔顺评测)
        this.strokeList = [];
        this.currentStroke = null;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => {
            this.resize();
        });
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.resize(), 150);
        });

        const wrapper = this.container ? this.container.parentElement : null;
        if (typeof ResizeObserver !== 'undefined' && wrapper) {
            this.resizeObserver = new ResizeObserver(() => {
                this.resize();
            });
            this.resizeObserver.observe(wrapper);
        } else if (typeof ResizeObserver !== 'undefined' && this.container) {
            this.resizeObserver = new ResizeObserver(() => {
                this.resize();
            });
            this.resizeObserver.observe(this.container);
        }

        this.bindEvents();
        this.renderBackground();
    }

    // 处理高分屏 (Retina / 移动端高清屏)，根据视口自适应尺寸并防模糊
    resize() {
        if (!this.container) return;
        const wrapper = this.container.parentElement || this.container;
        const rect = wrapper.getBoundingClientRect();
        const padding = 2;
        const availW = Math.max(0, rect.width - padding * 2);
        const availH = Math.max(0, rect.height - padding * 2);
        const size = Math.floor(Math.min(availW, availH));
        if (size <= 0) return;
        if (this.cssSize === size) return; // 尺寸未变无需重复重绘

        const dpr = window.devicePixelRatio || 1;

        // 设置外层正方形容器与画布精确尺寸，消灭任何多余留白
        this.container.style.width = `${size}px`;
        this.container.style.height = `${size}px`;
        this.gridCanvas.style.width = `${size}px`;
        this.gridCanvas.style.height = `${size}px`;
        this.drawCanvas.style.width = `${size}px`;
        this.drawCanvas.style.height = `${size}px`;

        // 避免 resize 丢失孩子的书写内容：暂存到离线 canvas
        let tempCanvas = null;
        if (this.drawCanvas.width > 0 && this.drawCanvas.height > 0 && this.hasDrawing()) {
            try {
                tempCanvas = document.createElement('canvas');
                tempCanvas.width = this.drawCanvas.width;
                tempCanvas.height = this.drawCanvas.height;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx.drawImage(this.drawCanvas, 0, 0);
            } catch (e) {}
        }

        // 设置内部像素尺寸
        this.gridCanvas.width = size * dpr;
        this.gridCanvas.height = size * dpr;
        this.drawCanvas.width = size * dpr;
        this.drawCanvas.height = size * dpr;

        // 统一缩放上下文
        this.gridCtx.scale(dpr, dpr);
        this.drawCtx.scale(dpr, dpr);

        this.cssSize = size;
        this.dpr = dpr;

        this.renderBackground();

        // 恢复书写内容，平滑等比缩放
        if (tempCanvas) {
            try {
                this.drawCtx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, size, size);
            } catch (e) {}
        }
        this.saveHistory();
    }

    // 绑定指针事件 (支持触屏触控笔、手指、鼠标，内置硬件级手掌防误触与指针单点锁定)
    bindEvents() {
        const canvas = this.drawCanvas;

        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            // 支持 Apple Pencil / 触控笔压感检测 (0 ~ 1)
            const pressure = (e.pressure !== undefined && e.pressure > 0) ? e.pressure : 0.5;
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                pressure: pressure,
                pointerType: e.pointerType || 'touch',
                time: Date.now()
            };
        };

        const startDrawing = (e) => {
            // 1. 若当前已有活跃指针正在书写，忽略其他触控 (单点锁定，防止手掌下压产生第二触点)
            if (this.isDrawing && this.activePointerId !== null && this.activePointerId !== e.pointerId) {
                e.preventDefault();
                return;
            }

            // 2. 检测指针类型：如果是手写笔 (Apple Pencil 等)，更新标记并开启硬件级防误触
            const isPen = e.pointerType === 'pen';
            if (isPen && !this.isStylusDetected) {
                this.isStylusDetected = true;
                if (typeof this.onPalmRejectionChange === 'function') {
                    this.onPalmRejectionChange(this.palmRejection, true);
                }
            }

            // 3. 防误触过滤：在'pen_only'模式或'auto'(且已检测到笔)模式下，直接忽略任何手指/手掌 touch 触控
            const isTouch = e.pointerType === 'touch';
            const isPenOnlyActive = this.palmRejection === 'pen_only' || (this.palmRejection === 'auto' && this.isStylusDetected);
            if (isTouch && isPenOnlyActive) {
                e.preventDefault();
                return;
            }

            // 4. 触控面积过滤：手掌或小鱼际触屏通常接触面积较大 (width 或 height > 26px)，自动丢弃
            if (isTouch && ((e.width && e.width > 26) || (e.height && e.height > 26))) {
                e.preventDefault();
                return;
            }

            e.preventDefault();
            this.isDrawing = true;
            this.activePointerId = e.pointerId;

            // 运笔期间给 body 添加 writing-active 状态，临时阻断外部按钮误触 (运笔中不可点清空/撤销等)
            document.body.classList.add('writing-active');

            const pos = getPos(e);
            this.lastX = pos.x;
            this.lastY = pos.y;
            this.lastTime = pos.time;
            this.lastWidth = this.brushSize;
            this.points = [pos];

            // 尝试捕获指针，避免贴近边缘书写或轻微划出画布时笔画突发中断
            try {
                if (canvas.setPointerCapture && e.pointerId) {
                    canvas.setPointerCapture(e.pointerId);
                }
            } catch (err) {}

            // 记录笔画元数据
            this.currentStroke = {
                points: [pos],
                startPoint: { x: pos.x, y: pos.y, time: pos.time },
                endPoint: { x: pos.x, y: pos.y, time: pos.time },
                brushType: this.brushType,
                brushColor: this.brushColor
            };

            if (window.soundManager) {
                window.soundManager.playBrush();
            }

            // 画一个起始圆点，确保轻点也能留下笔触
            this.drawDot(pos.x, pos.y);
        };

        const drawMove = (e) => {
            if (!this.isDrawing) return;
            // 仅响应当前活跃书写指针，手掌侧滑或第二个手指移动直接丢弃
            if (this.activePointerId !== null && e.pointerId !== this.activePointerId) return;

            e.preventDefault();
            const pos = getPos(e);
            this.points.push(pos);

            if (this.currentStroke) {
                this.currentStroke.points.push(pos);
                this.currentStroke.endPoint = { x: pos.x, y: pos.y, time: pos.time };
            }

            if (this.points.length >= 3) {
                const len = this.points.length;
                const p0 = this.points[len - 3];
                const p1 = this.points[len - 2];
                const p2 = this.points[len - 1];
                this.drawSegment(p0, p1, p2);
            }
        };

        const stopDrawing = (e) => {
            if (!this.isDrawing) return;
            // 如果抬起的不是活跃书写指针 (比如抬起的是搭在屏幕上的手掌)，绝不能中断画笔的书写！
            if (this.activePointerId !== null && e.pointerId !== this.activePointerId) return;

            this.isDrawing = false;
            this.activePointerId = null;
            this.points = [];

            try {
                if (canvas.releasePointerCapture && e.pointerId) {
                    canvas.releasePointerCapture(e.pointerId);
                }
            } catch (err) {}

            // 延时清除 writing-active，给手掌抬起留出防误触安全缓冲
            setTimeout(() => {
                if (!this.isDrawing) {
                    document.body.classList.remove('writing-active');
                }
            }, 180);

            if (this.currentStroke && this.brushType !== 'eraser') {
                this.strokeList.push(this.currentStroke);
            }
            this.currentStroke = null;

            this.saveHistory();
        };

        // Pointer 事件兼容现代所有设备
        canvas.addEventListener('pointerdown', startDrawing);
        canvas.addEventListener('pointermove', drawMove);
        canvas.addEventListener('pointerup', stopDrawing);
        canvas.addEventListener('pointercancel', stopDrawing);
    }

    // 绘制起始圆点
    drawDot(x, y) {
        const ctx = this.drawCtx;
        ctx.save();
        if (this.brushType === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, this.brushSize * 1.5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = this.brushColor;
            ctx.beginPath();
            ctx.arc(x, y, this.brushSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    // 绘制平滑笔触线段
    drawSegment(p0, p1, p2) {
        const ctx = this.drawCtx;
        ctx.save();

        // 橡皮擦模式
        if (this.brushType === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
            ctx.lineWidth = this.brushSize * 2.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
            return;
        }

        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = this.brushColor;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // 贝塞尔中点平滑
        const midPointX = (p1.x + p2.x) / 2;
        const midPointY = (p1.y + p2.y) / 2;

        if (this.brushType === 'brush') {
            // 毛笔笔触：根据书写速度动态调整粗细
            const distance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
            const timeDiff = Math.max(p2.time - p1.time, 1);
            const speed = distance / timeDiff;

            // 速度快时笔画变细，速度慢时笔画饱满
            let targetWidth = Math.max(
                this.brushSize * 0.45,
                Math.min(this.brushSize * 1.6, this.brushSize * (1.1 - speed * 0.18))
            );

            // 如果使用手写笔 (如 iPad Apple Pencil)，融合真实压感系数，呈现极致书法锋芒
            if (p2.pointerType === 'pen' && p2.pressure !== undefined && p2.pressure > 0) {
                const pressureFactor = 0.5 + p2.pressure * 0.9;
                targetWidth = Math.max(this.brushSize * 0.35, Math.min(this.brushSize * 2.0, targetWidth * pressureFactor));
            }

            // 线性缓动平滑笔画粗细变化，避免突变
            const currentWidth = this.lastWidth * 0.65 + targetWidth * 0.35;
            this.lastWidth = currentWidth;

            ctx.lineWidth = currentWidth;
            ctx.beginPath();
            ctx.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
            ctx.quadraticCurveTo(p1.x, p1.y, midPointX, midPointY);
            ctx.stroke();

        } else if (this.brushType === 'marker') {
            // 马克笔 / 蜡笔：半透明、粗边
            ctx.globalAlpha = 0.75;
            ctx.lineWidth = this.brushSize * 1.4;
            ctx.beginPath();
            ctx.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
            ctx.quadraticCurveTo(p1.x, p1.y, midPointX, midPointY);
            ctx.stroke();

        } else {
            // 硬笔 / 钢笔：均匀清晰线条
            ctx.lineWidth = this.brushSize;
            ctx.beginPath();
            ctx.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
            ctx.quadraticCurveTo(p1.x, p1.y, midPointX, midPointY);
            ctx.stroke();
        }

        ctx.restore();
    }

    // 渲染底层画布 (格线 + 描红字)
    renderBackground() {
        const ctx = this.gridCtx;
        const size = this.cssSize;
        if (!size) return;

        ctx.clearRect(0, 0, size, size);

        // 1. 绘制格线背景
        this.drawGrid(ctx, size);

        // 2. 绘制描红字样 (如果开启)
        if (this.showTrace && this.currentChar && this.traceOpacity > 0) {
            this.drawTraceCharacter(ctx, size);
        }
    }

    // 绘制各种练习格线 (最大化可用书写空间，四周仅留6px呼吸边距)
    drawGrid(ctx, size) {
        ctx.save();
        const left = 0;
        const top = 0;
        const right = size;
        const bottom = size;
        const centerX = size / 2;
        const centerY = size / 2;

        const gridColor = '#e17055'; // 经典朱砂红 (与左侧笔顺框统一)

        if (this.gridType === 'blank') {
            ctx.restore();
            return;
        }

        ctx.lineWidth = 1;
        ctx.setLineDash([6, 5]); // 虚线

        if (this.gridType === 'mizi' || this.gridType === 'tianzi') {
            // 十字十字中线
            ctx.beginPath();
            ctx.moveTo(centerX, top);
            ctx.lineTo(centerX, bottom);
            ctx.moveTo(left, centerY);
            ctx.lineTo(right, centerY);
            ctx.stroke();

            // 米字格对角虚线
            if (this.gridType === 'mizi') {
                ctx.beginPath();
                ctx.moveTo(left, top);
                ctx.lineTo(right, bottom);
                ctx.moveTo(right, top);
                ctx.lineTo(left, bottom);
                ctx.stroke();
            }
        } else if (this.gridType === 'jiugong') {
            // 九宫格
            const oneThird = boxSize / 3;
            ctx.beginPath();
            ctx.moveTo(left + oneThird, top);
            ctx.lineTo(left + oneThird, bottom);
            ctx.moveTo(left + oneThird * 2, top);
            ctx.lineTo(left + oneThird * 2, bottom);
            ctx.moveTo(left, top + oneThird);
            ctx.lineTo(right, top + oneThird);
            ctx.moveTo(left, top + oneThird * 2);
            ctx.lineTo(right, top + oneThird * 2);
            ctx.stroke();
        } else if (this.gridType === 'huigong') {
            // 回宫格 (内方格外框)
            const innerSize = boxSize * 0.55;
            const innerOffset = (boxSize - innerSize) / 2;
            ctx.strokeRect(left + innerOffset, top + innerOffset, innerSize, innerSize);

            // 轻微的中心十字参考线
            ctx.beginPath();
            ctx.moveTo(centerX, top);
            ctx.lineTo(centerX, bottom);
            ctx.moveTo(left, centerY);
            ctx.lineTo(right, centerY);
            ctx.stroke();
        }

        ctx.restore();
    }

    // 绘制半透明描红汉字 (100% 同步笔顺小课堂的矢量字形骨架，字体完全一致)
    drawTraceCharacter(ctx, size) {
        ctx.save();
        ctx.fillStyle = `rgba(214, 48, 49, ${this.traceOpacity})`; // 浅朱红色，易于描画

        // 优先使用 HanziWriter 相同字模矢量数据 (从本地缓存或加载的数据中提取)
        let strokeData = this.hanziData;
        if (!strokeData && window.STROKE_DATA_CACHE && window.STROKE_DATA_CACHE[this.currentChar]) {
            strokeData = window.STROKE_DATA_CACHE[this.currentChar];
        }

        if (strokeData && strokeData.strokes && typeof Path2D !== 'undefined') {
            // 与 HanziWriter 保持完全相同的坐标映射体系与尺寸
            const padding = 20;
            const b = 1024, $ = 1024;
            const s = size - 2 * padding;
            const o = size - 2 * padding;
            const scale = Math.min(s / b, o / $);
            const h = padding + (s - scale * b) / 2;
            const l = padding + (o - scale * $) / 2;
            const xOffset = h;
            const yOffset = 124 * scale + l;

            ctx.translate(xOffset, size - yOffset);
            ctx.scale(scale, -scale);

            for (const strokePath of strokeData.strokes) {
                const path2d = new Path2D(strokePath);
                ctx.fill(path2d);
            }
        } else {
            // 兜底方案：使用系统字体
            const fontSize = Math.floor(size * 0.72);
            ctx.font = `normal ${fontSize}px "KaiTi", "STKaiti", "BiaoKai", "SimSun", "Noto Serif SC", serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.currentChar, size / 2, size / 2 + size * 0.03);
        }

        ctx.restore();
    }

    // 记录历史步骤 (用于撤销)
    saveHistory() {
        if (!this.drawCanvas.width) return;
        const imgData = this.drawCtx.getImageData(0, 0, this.drawCanvas.width, this.drawCanvas.height);
        this.history.push(imgData);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }

    // 撤销上一步 (支持误触清空后的一键恢复)
    undo() {
        // 如果刚刚被清空过且存在备份，一键完整恢复！
        if (this.lastClearedBackup && (!this.hasDrawing() || this.history.length <= 1)) {
            if (this.lastClearedBackup.imgData) {
                this.drawCtx.putImageData(this.lastClearedBackup.imgData, 0, 0);
            }
            this.history = [...this.lastClearedBackup.history];
            this.strokeList = [...this.lastClearedBackup.strokeList];
            this.lastClearedBackup = null;

            if (window.soundManager) {
                window.soundManager.playPop();
            }
            return true;
        }

        if (this.history.length > 1) {
            this.history.pop(); // 弹出当前状态
            const previous = this.history[this.history.length - 1];
            this.drawCtx.putImageData(previous, 0, 0);

            if (this.strokeList.length > 0) {
                this.strokeList.pop();
            }

            if (window.soundManager) {
                window.soundManager.playPop();
            }
            return true;
        } else if (this.history.length === 1) {
            this.clear(false);
            return true;
        }
        return false;
    }

    // 清空书写画布 (自动保留恢复备份，防止手腕误触清空)
    clear(saveBackup = true) {
        if (saveBackup && this.hasDrawing()) {
            try {
                this.lastClearedBackup = {
                    imgData: this.drawCtx.getImageData(0, 0, this.drawCanvas.width, this.drawCanvas.height),
                    history: [...this.history],
                    strokeList: [...this.strokeList]
                };
            } catch (e) {}
        }

        this.drawCtx.save();
        this.drawCtx.setTransform(1, 0, 0, 1, 0, 0);
        this.drawCtx.clearRect(0, 0, this.drawCanvas.width, this.drawCanvas.height);
        this.drawCtx.restore();

        this.history = [];
        this.strokeList = [];
        this.currentStroke = null;
        this.saveHistory();
        if (window.soundManager) {
            window.soundManager.playEraser();
        }
    }

    // 设置防误触模式 ('auto', 'pen_only', 'off')
    setPalmRejection(mode) {
        this.palmRejection = mode;
        if (typeof this.onPalmRejectionChange === 'function') {
            this.onPalmRejectionChange(this.palmRejection, this.isStylusDetected);
        }
    }

    // 获取当前防误触状态信息
    getPalmRejectionInfo() {
        const isPenOnly = this.palmRejection === 'pen_only' || (this.palmRejection === 'auto' && this.isStylusDetected);
        return {
            mode: this.palmRejection,
            isStylusDetected: this.isStylusDetected,
            isPenOnlyActive: isPenOnly
        };
    }

    // 获取当前笔画列表数据
    getStrokeList() {
        return this.strokeList;
    }

    // 切换格线类型
    setGridType(type) {
        this.gridType = type;
        this.renderBackground();
    }

    // 切换当前练习字
    setCharacter(char, charData = null) {
        this.currentChar = char;
        this.hanziData = charData || (window.STROKE_DATA_CACHE ? window.STROKE_DATA_CACHE[char] : null);
        this.renderBackground();
    }

    // 设置并同步 HanziWriter 的矢量字模数据
    setCharData(charData) {
        this.hanziData = charData;
        this.renderBackground();
    }

    // 切换描红显示与透明度
    setTraceSettings(show, opacity) {
        this.showTrace = show;
        if (opacity !== undefined) this.traceOpacity = opacity;
        this.renderBackground();
    }

    // 设置画笔类型
    setBrushType(type) {
        this.brushType = type;
    }

    // 设置画笔颜色
    setBrushColor(color) {
        this.brushColor = color;
    }

    // 设置画笔尺寸
    setBrushSize(size) {
        this.brushSize = size;
    }

    // 检查画板是否有书写内容
    hasDrawing() {
        const w = this.drawCanvas.width;
        const h = this.drawCanvas.height;
        if (w === 0 || h === 0) return false;
        const imgData = this.drawCtx.getImageData(0, 0, w, h).data;
        for (let i = 3; i < imgData.length; i += 40) { // 抽样检测 alpha 通道
            if (imgData[i] > 10) return true;
        }
        return false;
    }

    // 导出小书法家明信片奖状卡片
    exportArtwork(charInfo, kidName = '小小书法家', evalResult = null) {
        const outCanvas = document.createElement('canvas');
        const cardW = 900;
        const cardH = 1200;
        outCanvas.width = cardW;
        outCanvas.height = cardH;
        const outCtx = outCanvas.getContext('2d');

        // 1. 底色：温润复古宣纸质感渐变
        const bgGrad = outCtx.createLinearGradient(0, 0, 0, cardH);
        bgGrad.addColorStop(0, '#fffbf0');
        bgGrad.addColorStop(1, '#f9f1e1');
        outCtx.fillStyle = bgGrad;
        outCtx.fillRect(0, 0, cardW, cardH);

        // 2. 装饰花边框
        outCtx.strokeStyle = '#d63031';
        outCtx.lineWidth = 6;
        outCtx.strokeRect(36, 36, cardW - 72, cardH - 72);

        outCtx.strokeStyle = '#e17055';
        outCtx.lineWidth = 1.5;
        outCtx.strokeRect(46, 46, cardW - 92, cardH - 92);

        // 3. 顶部标题与国风元素
        outCtx.fillStyle = '#d63031';
        outCtx.font = 'bold 44px "KaiTi", "STKaiti", serif';
        outCtx.textAlign = 'center';
        outCtx.fillText('★ 小小书法家练习成果卡 ★', cardW / 2, 105);

        outCtx.fillStyle = '#636e72';
        outCtx.font = '22px sans-serif';
        outCtx.fillText(`书写者: ${kidName}   ·   日期: ${new Date().toLocaleDateString('zh-CN')}`, cardW / 2, 150);

        // 评分与评级显示 (如果有评分结果)
        if (evalResult && evalResult.totalScore) {
            outCtx.fillStyle = '#d63031';
            outCtx.font = 'bold 24px "Segoe UI", sans-serif';
            outCtx.fillText(`★ 智能评分: ${evalResult.totalScore} 分   |   等级: ${evalResult.grade} ★`, cardW / 2, 190);
        }

        // 4. 汉字拼音与部首信息
        if (charInfo) {
            outCtx.fillStyle = '#e17055';
            outCtx.font = 'bold 36px "Segoe UI", sans-serif';
            outCtx.fillText(charInfo.pinyin || '', cardW / 2, 240);

            outCtx.fillStyle = '#2d3436';
            outCtx.font = '22px sans-serif';
            const infoText = `部首: ${charInfo.radical || '-'}   |   笔画数: ${charInfo.strokes || '-'} 画   |   ${charInfo.words ? charInfo.words.join(' · ') : ''}`;
            outCtx.fillText(infoText, cardW / 2, 280);
        }

        // 5. 居中绘制书写田字格与字迹
        const canvasTargetSize = 540;
        const canvasX = (cardW - canvasTargetSize) / 2;
        const canvasY = 320;

        // 绘制白色宣纸方底
        outCtx.fillStyle = '#ffffff';
        outCtx.shadowColor = 'rgba(0,0,0,0.08)';
        outCtx.shadowBlur = 15;
        outCtx.shadowOffsetY = 6;
        outCtx.fillRect(canvasX, canvasY, canvasTargetSize, canvasTargetSize);
        outCtx.shadowColor = 'transparent';

        // 绘制格线背景
        outCtx.drawImage(this.gridCanvas, canvasX, canvasY, canvasTargetSize, canvasTargetSize);

        // 绘制小朋友的亲手笔迹
        outCtx.drawImage(this.drawCanvas, canvasX, canvasY, canvasTargetSize, canvasTargetSize);

        // 6. 鼓励评语与例句
        outCtx.fillStyle = '#2d3436';
        outCtx.font = 'italic 26px "KaiTi", "STKaiti", serif';
        const commentLine = (evalResult && evalResult.teacherComment) 
            ? `“${evalResult.teacherComment}”` 
            : (charInfo && charInfo.sentence ? `“${charInfo.sentence}”` : '“端端正正写中国字，堂堂正正做中国人。”');
        outCtx.fillText(commentLine, cardW / 2, 930);

        // 7. 右下角专属朱砂红印章 (篆刻印章感)
        const sealX = cardW - 220;
        const sealY = 990;
        const sealSize = 110;

        outCtx.strokeStyle = '#d63031';
        outCtx.lineWidth = 4;
        outCtx.strokeRect(sealX, sealY, sealSize, sealSize);

        outCtx.fillStyle = 'rgba(214, 48, 49, 0.08)';
        outCtx.fillRect(sealX, sealY, sealSize, sealSize);

        outCtx.fillStyle = '#d63031';
        outCtx.font = 'bold 30px "KaiTi", "STKaiti", serif';
        outCtx.textAlign = 'center';

        const sealStr = (evalResult && evalResult.sealText) ? evalResult.sealText : '写得真棒';
        const sealTop = sealStr.slice(0, 2);
        const sealBottom = sealStr.slice(2, 4) || '真棒';
        outCtx.fillText(sealTop, sealX + sealSize / 2, sealY + 44);
        outCtx.fillText(sealBottom, sealX + sealSize / 2, sealY + 84);

        // 导出并自动下载
        const dataUrl = outCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `小小书法家_${charInfo ? charInfo.char : '练字'}_${evalResult ? evalResult.totalScore + '分_' : ''}${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    }
}

window.HandwritingCanvas = HandwritingCanvas;
