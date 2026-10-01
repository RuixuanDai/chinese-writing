/**
 * hanzi-guide.js - 汉字笔顺动画与闯关跟写系统
 * 基于 HanziWriter 实现标准笔画拆解、动画演示、手写跟写检测、即时正误反馈
 */

class HanziGuide {
    constructor(targetElementId) {
        this.targetEl = document.getElementById(targetElementId);
        this.writer = null;
        this.currentChar = '一';
        this.speed = 1.0;
        this.isQuizMode = false;
        this.totalStrokes = 1;
        this.currentStrokeIndex = 0;
        this.onQuizCompleteCallback = null;
        this.onStrokeSuccessCallback = null;
        this.currentSize = 0;

        this.initResizeObserver();
    }

    initResizeObserver() {
        if (typeof ResizeObserver !== 'undefined' && this.targetEl) {
            const frame = this.targetEl.parentElement;
            if (frame) {
                this.resizeObserver = new ResizeObserver(() => {
                    this.resize();
                });
                this.resizeObserver.observe(frame);
            }
        }
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.resize(), 150);
        });
    }

    getFrameInnerSize() {
        if (!this.targetEl) return 240;
        const frame = this.targetEl.parentElement;
        if (!frame) return 240;
        const width = frame.clientWidth || (frame.getBoundingClientRect().width - 6);
        const height = frame.clientHeight || (frame.getBoundingClientRect().height - 6);
        const size = Math.floor(Math.min(width, height));
        return size > 40 ? size : 240;
    }

    resize() {
        if (!this.targetEl) return;
        const size = this.getFrameInnerSize();
        if (size <= 50 || size === this.currentSize) return;

        this.currentSize = size;
        if (this.writer && typeof this.writer.updateDimensions === 'function') {
            try {
                this.writer.updateDimensions({ width: size, height: size });
            } catch (e) {
                console.warn('Update HanziWriter dimensions error', e);
            }
        }
    }

    // 初始化或切换汉字
    load(char, onLoaded) {
        this.currentChar = char;
        if (!this.targetEl) return;

        // 清空容器
        this.targetEl.innerHTML = '';
        this.isQuizMode = false;

        const size = this.getFrameInnerSize();
        this.currentSize = size;

        try {
            if (typeof HanziWriter === 'undefined') {
                console.warn('HanziWriter 尚未加载');
                this.targetEl.innerHTML = `<div class="hw-fallback">${char}</div>`;
                return;
            }

            const charLoader = (charToLoad, onComplete, onError) => {
                if (window.STROKE_DATA_CACHE && window.STROKE_DATA_CACHE[charToLoad]) {
                    onComplete(window.STROKE_DATA_CACHE[charToLoad]);
                    return;
                }
                fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${encodeURIComponent(charToLoad)}.json`)
                    .then(res => {
                        if (!res.ok) throw new Error('Network response not ok');
                        return res.json();
                    })
                    .then(data => {
                        if (window.STROKE_DATA_CACHE) {
                            window.STROKE_DATA_CACHE[charToLoad] = data;
                        }
                        onComplete(data);
                    })
                    .catch(err => {
                        if (onError) onError(err);
                    });
            };

            this.writer = HanziWriter.create(this.targetEl, char, {
                width: size,
                height: size,
                padding: 18,
                strokeColor: '#2d3436',
                radicalColor: '#e17055', // 部首突出朱砂红
                outlineColor: '#dfe6e9',
                drawingColor: '#0984e3',
                drawingWidth: 16,
                showOutline: true,
                showCharacter: true,
                strokeAnimationSpeed: this.speed,
                delayBetweenStrokes: 220,
                showHintAfterMisses: 2,
                highlightOnComplete: true,
                charDataLoader: charLoader,
                onLoadCharDataSuccess: (data) => {
                    this.charData = data;
                    this.totalStrokes = data.strokes ? data.strokes.length : 1;
                    if (onLoaded) onLoaded(data);
                },
                onLoadCharDataError: (err) => {
                    this.charData = null;
                    console.log('加载笔顺数据失败/离线模式', err);
                    this.targetEl.innerHTML = `<div class="hw-fallback">${char}</div>`;
                }
            });
        } catch (e) {
            console.error('HanziWriter init error', e);
        }
    }

    getCharData() {
        return this.charData;
    }

    // 播放完整笔顺动画
    animate(onComplete) {
        if (!this.writer) return;
        this.isQuizMode = false;
        this.writer.showCharacter();
        this.writer.animateCharacter({
            onComplete: () => {
                if (window.soundManager) {
                    window.soundManager.playCorrect();
                }
                if (onComplete) onComplete();
            }
        });
    }

    // 循环单笔动画 (用于学习某特定笔画)
    animateSingleStroke(strokeNum) {
        if (!this.writer) return;
        this.writer.animateStroke(strokeNum);
    }

    // 调整动画播放速度
    setSpeed(speedVal) {
        this.speed = speedVal;
        if (this.writer) {
            this.writer.update({
                strokeAnimationSpeed: speedVal
            });
        }
    }

    // 开始互动跟写闯关模式 (Quiz Mode)
    startQuiz(options = {}) {
        if (!this.writer) return;
        this.isQuizMode = true;
        this.currentStrokeIndex = 0;
        this.onQuizCompleteCallback = options.onComplete;
        this.onStrokeSuccessCallback = options.onStrokeSuccess;

        this.writer.quiz({
            onCorrectStroke: (data) => {
                this.currentStrokeIndex = data.strokeNum + 1;
                if (window.soundManager) {
                    window.soundManager.playCorrect();
                }
                if (this.onStrokeSuccessCallback) {
                    this.onStrokeSuccessCallback({
                        strokeNum: data.strokeNum + 1,
                        totalStrokes: data.totalStrokes
                    });
                }
            },
            onMistake: (data) => {
                if (window.soundManager) {
                    window.soundManager.playMistake();
                }
                if (options.onMistake) {
                    options.onMistake(data);
                }
            },
            onComplete: (summary) => {
                this.isQuizMode = false;
                if (window.soundManager) {
                    window.soundManager.playVictory();
                }
                if (this.onQuizCompleteCallback) {
                    this.onQuizCompleteCallback(summary);
                }
            }
        });
    }

    // 重置或退出跟写模式
    reset() {
        if (!this.writer) return;
        this.isQuizMode = false;
        this.writer.showCharacter();
    }

    // 生成笔画分解图示条 (拆分汉字笔画顺序步骤展示)
    renderStrokeBreakdown(charData) {
        const container = document.getElementById('stroke-breakdown-list');
        if (!container || !charData || !charData.strokes) return;

        container.innerHTML = '';
        const strokes = charData.strokes;
        const total = strokes.length;

        // 生成前 12 步以内（避免字画过多过长）
        const maxDisplay = Math.min(total, 16);

        for (let i = 0; i < maxDisplay; i++) {
            const stepItem = document.createElement('div');
            stepItem.className = 'stroke-step-card';

            const stepTitle = document.createElement('span');
            stepTitle.className = 'stroke-step-num';
            stepTitle.textContent = `${i + 1}`;

            const miniBox = document.createElement('div');
            miniBox.className = 'stroke-mini-box';
            miniBox.id = `mini-stroke-${i}`;

            stepItem.appendChild(stepTitle);
            stepItem.appendChild(miniBox);
            container.appendChild(stepItem);

            // 渲染前 i+1 笔
            setTimeout(() => {
                try {
                    const miniWriter = HanziWriter.create(miniBox, this.currentChar, {
                        width: 52,
                        height: 52,
                        padding: 4,
                        strokeColor: '#2d3436',
                        radicalColor: '#2d3436',
                        outlineColor: '#f1f2f6',
                        showOutline: false,
                        showCharacter: false,
                        charDataLoader: () => charData
                    });
                    // 仅显示至当前笔画
                    for (let s = 0; s <= i; s++) {
                        miniWriter.showStroke(s);
                    }
                } catch (e) {}
            }, i * 35);
        }
    }
}

window.HanziGuide = HanziGuide;
