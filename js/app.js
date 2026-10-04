/**
 * app.js - 儿童练字App 主控制器
 * 联动汉字题库、手写画板、笔顺动画、语音朗读、积分成就、打印字帖
 */

class KidWritingApp {
    constructor() {
        this.currentChar = '一';
        this.charInfo = null;
        this.currentCategory = 'starter';
        this.activeMode = 'free'; // 'free' (自由书写/描红), 'quiz' (笔顺跟写)

        // 积分与激励
        this.stars = parseInt(localStorage.getItem('kid_app_stars') || '0', 10);
        this.completedChars = JSON.parse(localStorage.getItem('kid_app_completed') || '[]');

        this.canvasEngine = null;
        this.hanziGuide = null;
    }

    init() {
        // 1. 初始化手写画板
        this.canvasEngine = new HandwritingCanvas('gridCanvas', 'drawCanvas', 'canvas-box');

        // 2. 初始化笔顺引擎
        this.hanziGuide = new HanziGuide('hanzi-writer-box');

        // 3. 页面记忆功能：获取上次完成的汉字或上次练习的汉字
        let targetChar = localStorage.getItem('kid_app_last_completed') || localStorage.getItem('kid_app_last_char');
        let targetCat = localStorage.getItem('kid_app_last_category') || 'starter';

        // 如果有上次记住的汉字，自动查找匹配其分类
        if (targetChar) {
            const foundCat = CHARACTER_CATEGORIES.find(c => c.chars.some(item => item.char === targetChar));
            if (foundCat) {
                targetCat = foundCat.id;
            }
        } else if (this.completedChars && this.completedChars.length > 0) {
            targetChar = this.completedChars[this.completedChars.length - 1];
            const foundCat = CHARACTER_CATEGORIES.find(c => c.chars.some(item => item.char === targetChar));
            if (foundCat) {
                targetCat = foundCat.id;
            }
        } else {
            targetChar = '一';
            targetCat = 'starter';
        }

        this.currentCategory = targetCat;

        // 4. 渲染分类标签与汉字列表
        this.renderCategories();
        this.renderCharList(targetCat);

        // 5. 绑定界面事件
        this.bindEvents();

        // 6. 恢复并自动选中上次完成/练习的汉字
        this.selectChar(targetChar);

        // 7. 更新星数显示
        this.updateStarUI();

        // 8. 设备检测与针对性弹窗提示
        const isMobile = this.isMobilePhone();
        if (isMobile) {
            // 在手机端显示顶部温馨提醒条
            const hintBanner = document.getElementById('mobile-hint-banner');
            if (hintBanner) hintBanner.style.display = 'flex';

            // 手机打开时，提示使用 iPad 或大屏幕设备
            try {
                const mobilePromptSeen = sessionStorage.getItem('kid_app_mobile_prompt_seen');
                if (!mobilePromptSeen) {
                    setTimeout(() => {
                        this.openMobileDeviceModal();
                    }, 350);
                }
            } catch (e) {}
        } else {
            // 平板/电脑端：首次打开 App 时，自动弹出简介与隐私免责声明弹窗
            try {
                const hasSeenIntro = localStorage.getItem('kid_app_intro_seen');
                if (!hasSeenIntro) {
                    setTimeout(() => {
                        this.openIpadGuideModal();
                    }, 350);
                }
            } catch (e) {}
        }
    }

    // 渲染分类标签栏
    renderCategories() {
        const catBar = document.getElementById('category-bar');
        if (!catBar) return;
        catBar.innerHTML = '';

        CHARACTER_CATEGORIES.forEach((cat) => {
            const btn = document.createElement('button');
            const isActive = (cat.id === this.currentCategory);
            btn.className = `cat-tab-btn ${isActive ? 'active' : ''}`;
            btn.textContent = cat.name;
            btn.dataset.id = cat.id;
            btn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                document.querySelectorAll('.cat-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCategory = cat.id;
                try {
                    localStorage.setItem('kid_app_last_category', cat.id);
                } catch (e) {}
                this.renderCharList(cat.id);
                // 切换分类时，若当前汉字不在新分类中，自动选中该分类的第一个汉字，即刻呈现生动插画
                if (cat.chars && cat.chars.length > 0) {
                    const alreadyInCat = cat.chars.some(c => c.char === this.currentChar);
                    if (!alreadyInCat) {
                        this.selectChar(cat.chars[0].char);
                    }
                }
            });
            catBar.appendChild(btn);

            if (isActive) {
                setTimeout(() => {
                    try {
                        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    } catch (e) {}
                }, 50);
            }
        });
    }

    // 渲染当前分类下的汉字卡片
    renderCharList(categoryId) {
        const listContainer = document.getElementById('char-list-grid');
        if (!listContainer) return;
        listContainer.innerHTML = '';

        const cat = CHARACTER_CATEGORIES.find(c => c.id === categoryId) || CHARACTER_CATEGORIES[0];
        
        cat.chars.forEach(item => {
            const card = document.createElement('button');
            const isCompleted = this.completedChars.includes(item.char);
            const hasIll = !!(item.image || (window.CHARACTER_ILLUSTRATION_MAP && window.CHARACTER_ILLUSTRATION_MAP[item.char]));
            card.className = `char-card-btn ${item.char === this.currentChar ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${hasIll ? 'has-ill' : ''}`;
            card.dataset.char = item.char;
            card.title = `${item.char} (${item.pinyin}) ${item.en ? '· ' + item.en : ''}`;

            card.innerHTML = `
                <span class="char-py">${item.pinyin}</span>
                <span class="char-hz">${item.char}</span>
                ${isCompleted ? '<span class="char-badge">⭐</span>' : ''}
            `;

            card.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this.selectChar(item.char);
            });

            listContainer.appendChild(card);
        });
    }

    // 选择指定汉字
    selectChar(char) {
        this.currentChar = char;
        this.charInfo = getCharInfo(char);

        // 持久化存储记忆：记住当前选中的字与分类
        try {
            localStorage.setItem('kid_app_last_char', char);
            if (this.currentCategory) {
                localStorage.setItem('kid_app_last_category', this.currentCategory);
            }
        } catch (e) {}

        // 更新汉字选中高亮并横向平滑滚动到可见区域
        document.querySelectorAll('.char-card-btn').forEach(btn => {
            if (btn.dataset.char === char) {
                btn.classList.add('active');
                try {
                    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                } catch (e) {}
            } else {
                btn.classList.remove('active');
            }
        });

        // 1. 更新顶部拼音与汉字详情信息
        this.updateCharDetails();

        // 2. 更新手写画板底字与字模
        if (this.canvasEngine) {
            const cachedData = window.STROKE_DATA_CACHE ? window.STROKE_DATA_CACHE[char] : null;
            this.canvasEngine.setCharacter(char, cachedData);
            this.canvasEngine.clear();
        }

        // 3. 加载笔顺数据并同步字模
        if (this.hanziGuide) {
            this.hanziGuide.load(char, (data) => {
                const strokeCountEl = document.getElementById('info-stroke-count');
                if (strokeCountEl && data && data.strokes) {
                    strokeCountEl.textContent = `${data.strokes.length} 画`;
                }
                // 将 HanziWriter 的同源矢量字模同步至画板底模，确保左右两侧字体 100% 一致！
                if (this.canvasEngine) {
                    this.canvasEngine.setCharData(data);
                }
            });
        }

        // 4. 重置状态提示
        this.setQuizStatus('点击下方“播放笔顺”或“笔顺跟写闯关”开始练习！');
    }

    // 更新汉字词义、例句与读音面板
    updateCharDetails() {
        const info = this.charInfo;
        if (!info) return;

        const pyEl = document.getElementById('current-pinyin');
        const hzEl = document.getElementById('current-char-display');
        const radEl = document.getElementById('info-radical');
        const stkEl = document.getElementById('info-stroke-count');
        const wordsEl = document.getElementById('info-words-list');
        const sentenceEl = document.getElementById('info-sentence');
        const enEl = document.getElementById('current-char-en');
        const illEnEl = document.getElementById('large-illustration-en');
        // 更新大幅看图识字插画卡
        const illCardEl = document.getElementById('char-illustration-large') || document.getElementById('char-illustration-box');
        const illArtEl = document.getElementById('large-illustration-art') || document.getElementById('char-illustration-icon');
        const illLabelEl = document.getElementById('large-illustration-label') || document.getElementById('char-illustration-label');

        const enText = info.en || (window.CHARACTER_EN_MAP && window.CHARACTER_EN_MAP[info.char]) || '';

        const catTagEl = document.getElementById('cognition-cat-tag');
        if (catTagEl) {
            catTagEl.textContent = info.category ? info.category.replace(/^[^\u4e00-\u9fa5\w]+/, '') : '常用字';
        }

        if (pyEl) pyEl.textContent = info.pinyin;
        if (hzEl) hzEl.textContent = info.char;
        if (radEl) radEl.textContent = info.radical || '-';
        if (stkEl) stkEl.textContent = typeof info.strokes === 'number' ? `${info.strokes} 画` : info.strokes;

        // 汉字旁边英文释义更新与交互
        if (enEl) {
            enEl.textContent = enText;
            enEl.style.display = enText ? 'inline-flex' : 'none';
            enEl.title = `英文释义：${enText}（点击听纯正英文发音 🇬🇧/🇺🇸）`;
            enEl.onclick = (e) => {
                e.stopPropagation();
                enEl.classList.add('pop-anim');
                setTimeout(() => enEl.classList.remove('pop-anim'), 300);
                if (window.soundManager) {
                    window.soundManager.playPop();
                    window.soundManager.speakEn(enText);
                }
            };
        }

        // 大幅看图识字卡片更新 (支持真实生动绘本插画，替代有误/粗糙的 emoji)
        const illArtWrap = document.querySelector('.ill-art-wrap');
        const imgUrl = info.image || (window.CHARACTER_ILLUSTRATION_MAP && window.CHARACTER_ILLUSTRATION_MAP[info.char]);

        if (illArtWrap) {
            if (imgUrl) {
                illArtWrap.innerHTML = `<img src="${imgUrl}" class="ill-large-img" alt="${info.label || info.char}">`;
            } else {
                // 不使用不准确或误导性的 emoji，展示典雅国风楷书启蒙识字卡
                illArtWrap.innerHTML = `
                    <div class="ill-fallback-card">
                        <div class="fallback-char">${info.char}</div>
                        <div class="fallback-pinyin">${info.pinyin}</div>
                    </div>
                `;
            }
        }
        if (illLabelEl) illLabelEl.textContent = info.label || info.char;
        if (illEnEl) {
            illEnEl.textContent = enText;
            illEnEl.style.display = enText ? 'inline-block' : 'none';
            illEnEl.title = `英文：${enText}（点击朗读英文）`;
            illEnEl.onclick = (e) => {
                e.stopPropagation();
                if (window.soundManager) {
                    window.soundManager.playPop();
                    window.soundManager.speakEn(enText);
                }
            };
        }

        if (illCardEl) {
            illCardEl.title = `看图识字：${info.label || info.char} ${enText ? '(' + enText + ')' : ''}（点击朗读）`;
            illCardEl.onclick = () => {
                illCardEl.classList.add('pop-anim');
                setTimeout(() => illCardEl.classList.remove('pop-anim'), 300);
                if (window.soundManager) {
                    window.soundManager.playPop();
                    window.soundManager.speak(info.label || info.char);
                }
            };
        }

        if (wordsEl) {
            wordsEl.innerHTML = '';
            if (info.words && info.words.length) {
                info.words.forEach(w => {
                    const tag = document.createElement('span');
                    tag.className = 'word-tag';
                    tag.textContent = w;
                    tag.title = '点击朗读词语';
                    tag.addEventListener('click', () => {
                        if (window.soundManager) window.soundManager.speak(w);
                    });
                    wordsEl.appendChild(tag);
                });
            }
        }

        if (sentenceEl) {
            sentenceEl.textContent = info.sentence || `认真写好“${info.char}”字！`;
            sentenceEl.style.cursor = 'pointer';
            sentenceEl.title = '点击朗读例句 🔊';
            sentenceEl.onclick = () => {
                if (window.soundManager) {
                    window.soundManager.speak(info.sentence || sentenceEl.textContent);
                }
            };
        }
    }

    // 绑定各类按钮和交互控制
    bindEvents() {
        // 1. 声音朗读按钮 (标准母语真人高保真发音，单字清晰，字词连贯)
        const speakBtn = document.getElementById('btn-speak-char');
        const triggerCharSpeech = () => {
            if (window.soundManager) {
                const sampleWord = (this.charInfo && this.charInfo.words && this.charInfo.words[0]) ? this.charInfo.words[0] : '';
                window.soundManager.speakChar(this.currentChar, sampleWord);
            }
        };

        if (speakBtn) {
            speakBtn.addEventListener('click', triggerCharSpeech);
        }

        // 点击汉字信息block也能直接触发朗读 (响应用户需求：点击block就发音)
        const charHeaderBlock = document.getElementById('cognition-char-header-block') || document.querySelector('.cognition-char-header') || document.querySelector('.hero-character-box');
        if (charHeaderBlock) {
            charHeaderBlock.style.cursor = 'pointer';
            charHeaderBlock.title = '点击听汉字标准发音 🔊';
            charHeaderBlock.addEventListener('click', (e) => {
                // 如果点击的是英文释义标签，让它自己播放纯正英文，不触发汉语发音
                if (e.target.closest('#current-char-en')) return;
                charHeaderBlock.classList.add('pop-anim');
                setTimeout(() => charHeaderBlock.classList.remove('pop-anim'), 300);
                triggerCharSpeech();
            });
        }

        // 2. 音效总开关 (初始化状态显示)
        const soundToggle = document.getElementById('btn-sound-toggle');
        if (soundToggle && window.soundManager) {
            const isEnabled = window.soundManager.enabled;
            soundToggle.textContent = isEnabled ? '🔊 声音开' : '🔇 静音中';
            soundToggle.classList.toggle('muted', !isEnabled);

            soundToggle.addEventListener('click', () => {
                const enabled = window.soundManager.toggle();
                soundToggle.textContent = enabled ? '🔊 声音开' : '🔇 静音中';
                soundToggle.classList.toggle('muted', !enabled);
            });
        }

        // 2.1 iPad 连线与简介说明弹窗控制
        const ipadBtn = document.getElementById('btn-ipad-modal');
        const ipadModal = document.getElementById('ipad-guide-modal');
        const ipadCloseBtn = document.getElementById('ipad-guide-close-btn');

        if (ipadBtn) {
            ipadBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this.openIpadGuideModal();
            });
        }
        if (ipadCloseBtn && ipadModal) {
            const handleCloseIntro = () => {
                if (window.soundManager) window.soundManager.playPop();
                ipadModal.classList.remove('visible');
                try {
                    localStorage.setItem('kid_app_intro_seen', 'true');
                } catch (e) {}
            };
            ipadCloseBtn.addEventListener('click', handleCloseIntro);
            ipadModal.addEventListener('click', (e) => {
                if (e.target === ipadModal) handleCloseIntro();
            });
        }

        // 2.2 全屏切换控制
        const fsBtn = document.getElementById('btn-toggle-fullscreen');
        if (fsBtn) {
            fsBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this.toggleFullscreen();
            });
        }
        document.addEventListener('fullscreenchange', () => this.updateFullscreenButton());
        document.addEventListener('webkitfullscreenchange', () => this.updateFullscreenButton());

        // 2.3 清除本地数据控制 (带确认弹窗)
        const clearDataBtn = document.getElementById('btn-clear-data');
        const clearModal = document.getElementById('clear-data-modal');
        const cancelClearBtn = document.getElementById('btn-cancel-clear-data');
        const confirmClearBtn = document.getElementById('btn-confirm-clear-data');
        const clearStarsEl = document.getElementById('clear-modal-stars');
        const clearCharsEl = document.getElementById('clear-modal-chars');

        if (clearDataBtn && clearModal) {
            clearDataBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                if (clearStarsEl) clearStarsEl.textContent = this.stars || 0;
                if (clearCharsEl) clearCharsEl.textContent = (this.completedChars && this.completedChars.length) || 0;
                clearModal.classList.add('visible');
            });
        }
        if (cancelClearBtn && clearModal) {
            cancelClearBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                clearModal.classList.remove('visible');
            });
        }
        if (clearModal) {
            clearModal.addEventListener('click', (e) => {
                if (e.target === clearModal) clearModal.classList.remove('visible');
            });
        }
        if (confirmClearBtn && clearModal) {
            confirmClearBtn.addEventListener('click', () => {
                clearModal.classList.remove('visible');
                this.clearAllLocalData();
            });
        }

        // 2.4 手机访问提示弹窗事件绑定
        const mobileModal = document.getElementById('mobile-device-modal');
        const copyForIpadBtn = document.getElementById('btn-copy-link-for-ipad');
        const continueMobileBtn = document.getElementById('btn-continue-on-mobile');
        const bannerGuideBtn = document.getElementById('btn-banner-guide');

        if (copyForIpadBtn) {
            copyForIpadBtn.addEventListener('click', () => {
                const currentUrl = window.location.href;
                navigator.clipboard.writeText(currentUrl).then(() => {
                    const originalText = copyForIpadBtn.textContent;
                    copyForIpadBtn.textContent = '✅ 已复制网址！可在 iPad/电脑打开';
                    copyForIpadBtn.style.background = '#2ed573';
                    setTimeout(() => {
                        copyForIpadBtn.textContent = originalText;
                        copyForIpadBtn.style.background = 'linear-gradient(135deg, #0984e3, #74b9ff)';
                    }, 2500);
                }).catch(() => {
                    alert('网址为：' + currentUrl);
                });
            });
        }

        if (continueMobileBtn && mobileModal) {
            continueMobileBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                mobileModal.classList.remove('visible');
                try {
                    sessionStorage.setItem('kid_app_mobile_prompt_seen', 'true');
                    localStorage.setItem('kid_app_intro_seen', 'true');
                } catch (e) {}
            });
        }

        if (mobileModal) {
            mobileModal.addEventListener('click', (e) => {
                if (e.target === mobileModal) {
                    mobileModal.classList.remove('visible');
                    try {
                        sessionStorage.setItem('kid_app_mobile_prompt_seen', 'true');
                        localStorage.setItem('kid_app_intro_seen', 'true');
                    } catch (e) {}
                }
            });
        }

        if (bannerGuideBtn) {
            bannerGuideBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this.openMobileDeviceModal();
            });
        }

        // 3. 自定义输入汉字搜索
        const customInput = document.getElementById('custom-char-input');
        const customBtn = document.getElementById('btn-custom-char');
        const handleCustomSearch = () => {
            const val = (customInput.value || '').trim();
            if (val) {
                const firstChar = val.charAt(0);
                this.selectChar(firstChar);
                customInput.value = '';
                if (window.soundManager) window.soundManager.playPop();
            }
        };

        if (customBtn) customBtn.addEventListener('click', handleCustomSearch);
        if (customInput) {
            customInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') handleCustomSearch();
            });
        }

        // 4. 笔顺动画控制
        const playAnimBtn = document.getElementById('btn-play-anim');
        if (playAnimBtn) {
            playAnimBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this.setQuizStatus('正在演示标准笔顺，请仔细观察起笔和笔画方向...');
                playAnimBtn.disabled = true;
                this.hanziGuide.animate(() => {
                    playAnimBtn.disabled = false;
                    this.setQuizStatus('笔顺演示完成！现在轮到你在右边画板练字啦！');
                });
            });
        }

        // 5. 跟写闯关模式 (Quiz Mode)
        const startQuizBtn = document.getElementById('btn-start-quiz');
        if (startQuizBtn) {
            startQuizBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this.setQuizStatus('🌟 笔顺闯关开始：请在左侧方框内跟着虚线写！');
                startQuizBtn.classList.add('pulse');

                this.hanziGuide.startQuiz({
                    onStrokeSuccess: (data) => {
                        this.setQuizStatus(`👏 太棒了！第 ${data.strokeNum} 笔书写正确！继续加油！`);
                    },
                    onMistake: (data) => {
                        this.setQuizStatus('💡 笔顺或方向不太对哦，别灰心，再试一次！');
                    },
                    onComplete: (summary) => {
                        startQuizBtn.classList.remove('pulse');
                        this.handleQuizPassed(summary);
                    }
                });
            });
        }

        // 速度调节
        const speedSelect = document.getElementById('select-anim-speed');
        if (speedSelect) {
            speedSelect.addEventListener('change', (e) => {
                const spd = parseFloat(e.target.value);
                this.hanziGuide.setSpeed(spd);
            });
        }

        // 6. 画板格线切换
        const gridBtns = document.querySelectorAll('.grid-type-btn');
        gridBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                gridBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const type = btn.dataset.grid;
                this.canvasEngine.setGridType(type);
            });
        });

        // 7. 画笔类型切换
        const brushBtns = document.querySelectorAll('.brush-btn');
        brushBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                brushBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const bType = btn.dataset.brush;
                this.canvasEngine.setBrushType(bType);
            });
        });

        // 8. 颜色选择器
        const colorPills = document.querySelectorAll('.color-pill');
        colorPills.forEach(pill => {
            pill.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                colorPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                const col = pill.dataset.color;
                this.canvasEngine.setBrushColor(col);
            });
        });

        // 9. 画笔粗细滑动条
        const sizeSlider = document.getElementById('brush-size-slider');
        if (sizeSlider) {
            sizeSlider.addEventListener('input', (e) => {
                this.canvasEngine.setBrushSize(parseInt(e.target.value, 10));
            });
        }

        // 10. 描红开关与透明度
        const traceToggle = document.getElementById('toggle-trace-switch');
        const traceSlider = document.getElementById('trace-opacity-slider');
        const updateTrace = () => {
            const show = traceToggle ? traceToggle.checked : true;
            const opacity = traceSlider ? parseFloat(traceSlider.value) : 0.35;
            this.canvasEngine.setTraceSettings(show, opacity);
        };

        if (traceToggle) traceToggle.addEventListener('change', updateTrace);
        if (traceSlider) traceSlider.addEventListener('input', updateTrace);

        // 11. 撤销按钮
        const undoBtn = document.getElementById('btn-undo');
        if (undoBtn) {
            undoBtn.addEventListener('click', () => {
                this.canvasEngine.undo();
            });
        }

        // 12. 清空画板按钮
        const clearBtn = document.getElementById('btn-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.canvasEngine.clear();
            });
        }

        // 13. 打印字帖
        const printBtn = document.getElementById('btn-print-sheet');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this.printWorksheet();
            });
        }

        // 14. 智能书写评分与笔画检测
        const finishBtn = document.getElementById('btn-finish-drawing');
        if (finishBtn) {
            finishBtn.addEventListener('click', () => {
                this.handleWritingEvaluation();
            });
        }

        // 15. 智能评分报告弹窗操作
        const evalModal = document.getElementById('eval-modal');
        const evalRetryBtn = document.getElementById('btn-eval-retry');
        const evalNextBtn = document.getElementById('btn-eval-next');

        if (evalRetryBtn && evalModal) {
            evalRetryBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                evalModal.classList.remove('visible');
                this.canvasEngine.clear();
            });
        }

        if (evalNextBtn && evalModal) {
            evalNextBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                evalModal.classList.remove('visible');
                this.selectNextChar();
            });
        }
    }

    // 设置状态提示文本
    setQuizStatus(text) {
        const el = document.getElementById('quiz-status-msg');
        if (el) el.textContent = text;
    }

    // 【第 1 步】：跟写闯关通过逻辑 (完成笔顺后，引导必须前往右侧画板亲手独立书写)
    handleQuizPassed(summary) {
        const mistakes = summary ? (summary.totalMistakes || 0) : 0;
        const quizScore = Math.max(72, 100 - mistakes * 7);

        this.addStars(5, '完成第1步笔顺跟写');
        this.fireConfetti();

        let gradeBadge = '【优等 · 笔顺小达人】';
        if (mistakes === 0) gradeBadge = '【特优 · 一笔不错】';
        else if (mistakes <= 2) gradeBadge = '【良好 · 笔顺清晰】';

        // 阶段性成功弹窗：引导必须在右侧画板完成亲手书写！
        this.showQuizSuccessModal({
            title: '🎉 笔顺闯关成功！',
            subtitle: `笔顺得分：${quizScore} 分（失误：${mistakes} 次）！\n你已完全掌握“${this.currentChar}”字的正确笔顺！请前往右侧【小小书法家画板】亲手写一遍吧！`,
            starsEarned: 5,
            badge: gradeBadge,
            onContinue: () => {
                this.highlightCanvasForPractice();
            }
        });
    }

    // 笔顺过关引导弹窗
    showQuizSuccessModal({ title, subtitle, starsEarned, badge, onContinue }) {
        const modal = document.getElementById('reward-modal');
        if (!modal) return;

        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-subtitle').textContent = subtitle;
        document.getElementById('modal-stars-num').textContent = `+${starsEarned} ⭐`;
        document.getElementById('modal-badge-name').textContent = badge;

        const closeBtn = document.getElementById('modal-close-btn');
        const nextBtn = document.getElementById('modal-next-btn');

        closeBtn.textContent = '再练一遍笔顺';
        nextBtn.textContent = '👉 前往画板书写 ➔';

        modal.classList.add('visible');

        const closeModal = () => {
            modal.classList.remove('visible');
            if (window.soundManager) window.soundManager.playPop();
        };

        closeBtn.onclick = () => {
            closeModal();
            const startQuizBtn = document.getElementById('btn-start-quiz');
            if (startQuizBtn) startQuizBtn.click();
        };

        nextBtn.onclick = () => {
            closeModal();
            if (onContinue) onContinue();
        };
    }

    // 视觉引导：高亮并聚焦右侧书写画板
    highlightCanvasForPractice() {
        this.setQuizStatus(`🎯 请在右侧画板亲手写出“${this.currentChar}”字，写完点击【🏆 智能评分 & 盖章】！`);
        const rightPanel = document.querySelector('.panel-right');
        if (rightPanel) {
            rightPanel.classList.add('pulse-target');
            setTimeout(() => {
                rightPanel.classList.remove('pulse-target');
            }, 3500);
            rightPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // 智能手写评测与笔画诊断
    handleWritingEvaluation() {
        if (!this.canvasEngine.hasDrawing()) {
            alert('请先在画板上写字再进行智能评分哦！✍️');
            return;
        }

        const drawCanvas = this.canvasEngine.drawCanvas;
        const charInfo = this.charInfo;
        const strokeList = this.canvasEngine.getStrokeList();
        const hanziData = this.hanziGuide.getCharData();

        const canvasSize = (this.canvasEngine && this.canvasEngine.cssSize) ? this.canvasEngine.cssSize : (drawCanvas.clientWidth || 360);
        const result = window.chineseWritingEvaluator.evaluate(drawCanvas, charInfo, strokeList, hanziData, canvasSize);
        if (!result.valid) {
            alert(result.message);
            return;
        }

        this.lastEvaluationResult = result;

        // 更新评分弹窗各维度数据
        const charBadge = document.getElementById('eval-char-badge');
        const scoreNum = document.getElementById('eval-score-num');
        const gradeText = document.getElementById('eval-grade-text');
        const starsDisplay = document.getElementById('eval-stars-display');
        const commentEl = document.getElementById('eval-teacher-comment');

        if (charBadge) charBadge.textContent = `“${this.currentChar}” 字`;
        if (scoreNum) scoreNum.textContent = result.totalScore;
        if (gradeText) gradeText.textContent = result.grade;
        if (starsDisplay) starsDisplay.textContent = '⭐'.repeat(result.stars);
        if (commentEl) commentEl.textContent = result.teacherComment;

        // 维度进度条
        const mStroke = document.getElementById('eval-metric-stroke');
        const bStroke = document.getElementById('eval-bar-stroke');
        if (mStroke) mStroke.textContent = `${result.metrics.strokeScore} / ${result.metrics.strokeMax}`;
        if (bStroke) bStroke.style.width = `${Math.round((result.metrics.strokeScore / result.metrics.strokeMax) * 100)}%`;

        const mStruct = document.getElementById('eval-metric-structure');
        const bStruct = document.getElementById('eval-bar-structure');
        if (mStruct) mStruct.textContent = `${result.metrics.structureScore} / ${result.metrics.structureMax}`;
        if (bStruct) bStruct.style.width = `${Math.round((result.metrics.structureScore / result.metrics.structureMax) * 100)}%`;

        const mShape = document.getElementById('eval-metric-shape');
        const bShape = document.getElementById('eval-bar-shape');
        if (mShape) mShape.textContent = `${result.metrics.shapeScore} / ${result.metrics.shapeMax}`;
        if (bShape) bShape.style.width = `${Math.round((result.metrics.shapeScore / result.metrics.shapeMax) * 100)}%`;

        // 诊断建议列表 (严重笔顺错误突出红框高亮显示)
        const sugList = document.getElementById('eval-suggestions-list');
        if (sugList) {
            sugList.innerHTML = '';
            result.suggestions.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                if (item.startsWith('🚨')) {
                    li.classList.add('eval-warning-item', 'eval-severe-item');
                } else if (item.startsWith('⚠️')) {
                    li.classList.add('eval-warning-item');
                }
                sugList.appendChild(li);
            });
        }

        // 播放对应音效并燃放礼花
        if (result.totalScore >= 80) {
            if (window.soundManager) window.soundManager.playVictory();
            this.fireConfetti();
        } else {
            if (window.soundManager) window.soundManager.playCorrect();
        }

        // 奖励金星并更新已练记录
        const starsAwarded = result.stars * 5;
        this.addStars(starsAwarded, '智能书写评测');
        this.markCharCompleted(this.currentChar);

        // 弹出报告弹窗
        const modal = document.getElementById('eval-modal');
        if (modal) modal.classList.add('visible');
    }

    // 标记汉字已练过
    markCharCompleted(char) {
        if (!this.completedChars.includes(char)) {
            this.completedChars.push(char);
            localStorage.setItem('kid_app_completed', JSON.stringify(this.completedChars));
            this.renderCharList(this.currentCategory);
        }
        // 关键记忆：记录最后完成的字，以便下次直接跳到该汉字
        try {
            localStorage.setItem('kid_app_last_completed', char);
            localStorage.setItem('kid_app_last_char', char);
        } catch (e) {}
    }

    // 增加星星
    addStars(count, reason) {
        this.stars += count;
        localStorage.setItem('kid_app_stars', this.stars.toString());
        this.updateStarUI();
    }

    // 更新界面星星
    updateStarUI() {
        const starEl = document.getElementById('total-star-count');
        if (starEl) {
            starEl.textContent = this.stars;
        }
        const completedEl = document.getElementById('completed-char-count');
        if (completedEl) {
            completedEl.textContent = this.completedChars.length;
        }
    }

    // 炫酷五彩纸屑庆祝
    fireConfetti() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }

    // 展示奖励成就弹窗
    showVictoryModal({ title, subtitle, starsEarned, badge }) {
        const modal = document.getElementById('reward-modal');
        if (!modal) return;

        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-subtitle').textContent = subtitle;
        document.getElementById('modal-stars-num').textContent = `+${starsEarned} ⭐`;
        document.getElementById('modal-badge-name').textContent = badge;

        modal.classList.add('visible');

        const closeBtn = document.getElementById('modal-close-btn');
        const nextBtn = document.getElementById('modal-next-btn');

        closeBtn.textContent = '再练一次';
        nextBtn.textContent = '练下一个字 ➔';

        const closeModal = () => {
            modal.classList.remove('visible');
            if (window.soundManager) window.soundManager.playPop();
        };

        closeBtn.onclick = closeModal;
        nextBtn.onclick = () => {
            closeModal();
            this.selectNextChar();
        };
    }

    // 自动切换到下一个字
    selectNextChar() {
        const cat = CHARACTER_CATEGORIES.find(c => c.id === this.currentCategory);
        if (!cat) return;
        const idx = cat.chars.findIndex(c => c.char === this.currentChar);
        if (idx >= 0 && idx < cat.chars.length - 1) {
            this.selectChar(cat.chars[idx + 1].char);
        } else if (cat.chars.length > 0) {
            this.selectChar(cat.chars[0].char);
        }
    }

    // 生成并打印标准田字格纸质练字帖
    printWorksheet() {
        const char = this.currentChar;
        const info = this.charInfo;

        // 动态构建打印区域
        let printArea = document.getElementById('printable-area');
        if (!printArea) {
            printArea = document.createElement('div');
            printArea.id = 'printable-area';
            document.body.appendChild(printArea);
        }

        printArea.innerHTML = `
            <div class="print-sheet">
                <div class="print-header">
                    <h2>小学语文描红练字帖 · “${char}”字练习</h2>
                    <div class="print-meta">
                        <span>姓名：______________</span>
                        <span>日期：____年__月__日</span>
                        <span>成绩评定：【 ⭐️ ⭐️ ⭐️ 】</span>
                    </div>
                </div>

                <div class="print-char-intro">
                    <div class="print-big-box">
                        <span class="py">${info.pinyin}</span>
                        <div class="tianzi">${char}</div>
                    </div>
                    <div class="print-ill-box" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:58px; height:58px; border:1.5px dashed #f59e0b; border-radius:10px; margin:0 10px; background:#fffbeb;">
                        <span style="font-size:28px; line-height:1;">${info.icon || '✏️'}</span>
                        <span style="font-size:10px; font-weight:bold; color:#b45309; margin-top:2px;">${info.label || ''}</span>
                    </div>
                    <div class="print-info-text">
                        <p><strong>拼音：</strong>${info.pinyin} &nbsp;&nbsp; <strong>英文：</strong>${info.en || '-'} &nbsp;&nbsp; <strong>部首：</strong>${info.radical || '-'} &nbsp;&nbsp; <strong>笔画：</strong>${info.strokes || '-'} 画</p>
                        <p><strong>常用词语：</strong>${(info.words || []).join('、')}</p>
                        <p><strong>经典例句：</strong>${info.sentence || ''}</p>
                    </div>
                </div>

                <div class="print-grid-section">
                    <h3>一、描红练习（请按正确笔顺描红）</h3>
                    <div class="print-row">
                        ${this.generatePrintBoxes(char, 10, true)}
                    </div>
                    <div class="print-row">
                        ${this.generatePrintBoxes(char, 10, true)}
                    </div>

                    <h3>二、临摹练习（仔细观察间架结构，端正书写）</h3>
                    <div class="print-row">
                        ${this.generatePrintBoxes(char, 10, false)}
                    </div>
                    <div class="print-row">
                        ${this.generatePrintBoxes(char, 10, false)}
                    </div>
                    <div class="print-row">
                        ${this.generatePrintBoxes(char, 10, false)}
                    </div>
                </div>

                <div class="print-footer">
                    <span>坐姿规范：头正、身直、臂开、足安。一拳、一尺、一寸。</span>
                </div>
            </div>
        `;

        window.print();
    }

    generatePrintBoxes(char, count, isTrace) {
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `
                <div class="print-cell ${isTrace ? 'trace' : 'blank'}">
                    <span class="grid-cross-h"></span>
                    <span class="grid-cross-v"></span>
                    ${isTrace ? `<span class="trace-char">${char}</span>` : ''}
                </div>
            `;
        }
        return html;
    }

    // 设备类型检测：是否为小屏手机（精确识别手机，排除 iPad、平板及电脑设备）
    isMobilePhone() {
        const ua = navigator.userAgent;
        // 明确排除 iPad (包含现代 iPadOS 桌面 UA: MacIntel + touchPoints) 与各类平板
        const isIPad = /iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        const isTablet = /Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua));
        if (isIPad || isTablet) {
            return false;
        }

        // 明确识别手机 UA：iPhone, iPod, Android Mobile 等
        const isPhoneUA = /iPhone|iPod/i.test(ua) || (/Android/i.test(ua) && /Mobile/i.test(ua)) || /Windows Phone/i.test(ua);
        if (isPhoneUA) {
            return true;
        }

        // 触屏移动设备且视口极窄（适配部分自定义内核移动浏览器）
        const hasTouch = (navigator.maxTouchPoints > 0) || ('ontouchstart' in window);
        const isSmallViewport = window.innerWidth <= 640;
        if (hasTouch && isSmallViewport) {
            return true;
        }

        return false;
    }

    // 打开手机设备提示弹窗
    openMobileDeviceModal() {
        const modal = document.getElementById('mobile-device-modal');
        if (modal) {
            modal.classList.add('visible');
        }
    }

    // 打开 iPad 连接指南与简介说明弹窗
    openIpadGuideModal() {
        const ipadModal = document.getElementById('ipad-guide-modal');
        if (!ipadModal) return;
        ipadModal.classList.add('visible');
    }

    // 全屏切换控制
    toggleFullscreen() {
        const doc = document;
        const docEl = document.documentElement;

        const isFullscreen = !!(doc.fullscreenElement || 
                               doc.webkitFullscreenElement || 
                               doc.mozFullScreenElement || 
                               doc.msFullscreenElement);

        if (!isFullscreen) {
            const req = docEl.requestFullscreen || 
                        docEl.webkitRequestFullscreen || 
                        docEl.mozRequestFullScreen || 
                        docEl.msRequestFullscreen;
            if (req) {
                req.call(docEl).catch(err => {
                    console.warn('全屏请求未成功:', err);
                    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
                        this.openIpadGuideModal();
                    }
                });
            } else {
                if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
                    this.openIpadGuideModal();
                } else {
                    alert('提示：当前浏览器暂不支持全屏 API，建议使用 Chrome/Safari 快捷键 F11 或全屏模式。');
                }
            }
        } else {
            const exit = doc.exitFullscreen || 
                         doc.webkitExitFullscreen || 
                         doc.mozCancelFullScreen || 
                         doc.msExitFullscreen;
            if (exit) {
                exit.call(doc).catch(err => console.warn('退出全屏失败:', err));
            }
        }
    }

    // 更新全屏按钮显示状态
    updateFullscreenButton() {
        const btn = document.getElementById('btn-toggle-fullscreen');
        if (!btn) return;
        const isFullscreen = !!(document.fullscreenElement || 
                               document.webkitFullscreenElement || 
                               document.mozFullScreenElement || 
                               document.msFullscreenElement);
        if (isFullscreen) {
            btn.innerHTML = '🗗 退出全屏';
            btn.classList.add('active');
            btn.title = '退出浏览器全屏显示';
        } else {
            btn.innerHTML = '⛶ 全屏';
            btn.classList.remove('active');
            btn.title = '切换浏览器全屏显示，沉浸式练字';
        }
    }

    // 清空本地数据
    clearAllLocalData() {
        try {
            // 清理本地练习与成就数据
            localStorage.removeItem('kid_app_stars');
            localStorage.removeItem('kid_app_completed');
            localStorage.removeItem('kid_app_last_completed');
            localStorage.removeItem('kid_app_last_char');
            localStorage.removeItem('kid_app_last_category');

            // 保持已阅读简介状态，避免清除数据后立刻弹窗打扰
            const keepIntro = localStorage.getItem('kid_app_intro_seen');
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key && key.startsWith('kid_app_')) {
                    localStorage.removeItem(key);
                }
            }
            if (keepIntro) {
                localStorage.setItem('kid_app_intro_seen', keepIntro);
            }
        } catch (e) {
            console.error('清除本地数据失败:', e);
        }

        // 重置内部状态并刷新 UI
        this.stars = 0;
        this.completedChars = [];
        this.updateStarUI();
        this.renderCharList(this.currentCategory);
        if (this.canvasEngine) {
            this.canvasEngine.clear();
        }
        if (window.soundManager) {
            window.soundManager.playPop();
        }
        alert('✅ 本地所有练字记录、金星星及画板数据已成功清空重置！');
    }
}

// 页面加载完成后启动
window.addEventListener('DOMContentLoaded', () => {
    window.kidApp = new KidWritingApp();
    window.kidApp.init();
});
