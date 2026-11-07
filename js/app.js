/**
 * app.js - 儿童练字App 主控制器
 * 联动汉字题库、手写画板、笔顺动画、语音朗读、积分成就、打印字帖、幸运扭蛋机与贴纸乐园
 */

// 16款超萌书法与国风萌宠贴纸图鉴库
const CALLIGRAPHY_STICKERS = [
    { id: 'maliang', name: '神笔马良', emoji: '🖌️', title: '妙笔生花', soundText: '我有一支神奇画笔，落笔生花，画什么变什么！' },
    { id: 'lion', name: '小狮子波波', emoji: '🦁', title: '威武墨客', soundText: '吼~ 我的毛笔字写得有力拔山兮的大气魄！' },
    { id: 'panda', name: '胖达熊猫', emoji: '🐼', title: '竹林隐士', soundText: '呼噜噜，吃完脆嫩的竹子，写一幅漂亮对联！' },
    { id: 'wukong', name: '齐天大圣', emoji: '🐵', title: '字里乾坤', soundText: '俺老孙来也！一个筋斗十万八千里，落笔惊风雨！' },
    { id: 'dragon', name: '祥瑞金龙', emoji: '🐉', title: '笔走龙蛇', soundText: '飞龙在天，你的汉字笔画宛如蛟龙出海般苍劲！' },
    { id: 'zhuangyuan', name: '状元郎豆豆', emoji: '👑', title: '金榜题名', soundText: '十年磨一剑，字写得端端正正，高中状元！' },
    { id: 'scholar_cat', name: '状元喵乐乐', emoji: '🐱', title: '书香门第', soundText: '喵呜~ 蘸一蘸墨水，我的猫爪字写得最工整！' },
    { id: 'phoenix', name: '七彩彩凤', emoji: '🦚', title: '凤舞九天', soundText: '笔若游龙，墨如彩凤，飞舞在万里晴空！' },
    { id: 'inkstone', name: '神奇砚台宝', emoji: '🪨', title: '文房四宝', soundText: '磨呀磨，磨出最香最浓郁的陈年古墨！' },
    { id: 'owl', name: '博学猫头鹰', emoji: '🦉', title: '学富五车', soundText: '咕咕咕，多读书多练字，胸藏万卷书！' },
    { id: 'rocket', name: '星空火箭', emoji: '🚀', title: '小小探险家', soundText: '3、2、1，带着漂亮的中国汉字飞向浩瀚太空！' },
    { id: 'rainbow', name: '彩虹仙子', emoji: '🌈', title: '七彩翰墨', soundText: '挥一挥画笔，让古老汉字变成绚烂彩虹！' },
    { id: 'tiger', name: '小萌虎泰戈', emoji: '🐯', title: '虎步生风', soundText: '生龙活虎，下笔有神，今天又练好了三个字！' },
    { id: 'koi', name: '锦鲤福宝', emoji: '🐟', title: '好运连连', soundText: '咕噜咕噜，认真写好每一个字，每天都有好运气！' },
    { id: 'scroll', name: '千年圣旨卷', emoji: '📜', title: '御赐金卷', soundText: '奉天承运，小书法家今日字写得极其端庄！' },
    { id: 'trophy', name: '黄金翰墨鼎', emoji: '🏆', title: '书法大宗师', soundText: '恭喜你！持之以恒天天练字，终成小小书法大师！' }
];

class KidWritingApp {
    constructor() {
        this.currentChar = '一';
        this.charInfo = null;
        this.currentCategory = 'starter';
        this.activeMode = 'free'; // 'free' (自由书写/描红), 'quiz' (笔顺跟写)

        // 积分与激励 (安全解析本地存储，防范 JSON 损坏导致白屏崩溃)
        const parsedStars = parseInt(this.safeGetStorage('kid_app_stars', '0'), 10);
        this.stars = (Number.isFinite(parsedStars) && parsedStars >= 0) ? parsedStars : 0;
        this.completedChars = this.safeParseJSONArray('kid_app_completed', []);
        this.unlockedStickers = this.safeParseJSONArray('kid_app_stickers', ['maliang', 'zhuangyuan', 'panda']);
        this.eggCost = 3; // 每 3 颗星扭蛋一次
        this.canvasSizeMode = 'large';
        this._evalSpeechTimer = null;
        this.autoEvalSpeech = this.safeGetStorage('kid_app_auto_eval_speech', 'true') !== 'false'; // 评分后自动朗读点评 (家长可在设置页关闭)
        this.deferredInstallPrompt = null;
        this._mobileBannerDismissed = false;
        this._modalOpenedFromSettings = false;

        this.canvasEngine = null;
        this.hanziGuide = null;
    }

    // 安全读取 localStorage 字符串
    safeGetStorage(key, fallback = '') {
        try {
            const val = localStorage.getItem(key);
            return val !== null ? val : fallback;
        } catch (e) {
            return fallback;
        }
    }

    // 安全解析 localStorage 数组数据
    safeParseJSONArray(key, fallback = []) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return Array.isArray(fallback) ? [...fallback] : [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : (Array.isArray(fallback) ? [...fallback] : []);
        } catch (e) {
            return Array.isArray(fallback) ? [...fallback] : [];
        }
    }

    // HTML 实体转义（防止自定义字符或异常存储引发 DOM XSS）
    escapeHtml(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    init() {
        // 1. 初始化手写画板
        this.canvasEngine = new HandwritingCanvas('gridCanvas', 'drawCanvas', 'canvas-box');
        let lastBlockedToast = 0;
        this.canvasEngine.onPalmRejectionChange = (mode, isStylusDetected) => {
            this.updateStylusModeUI(mode, isStylusDetected);
        };
        this.canvasEngine.onBlockedTouch = () => {
            const now = Date.now();
            if (now - lastBlockedToast > 2800) {
                lastBlockedToast = now;
                this.showToast('💡 当前为【仅手写笔模式】：若使用手指或普通电容笔，请点击上方防误触切换为【智能识别】或【手笔通用】');
            }
        };

        // 恢复家长在设置页选择的手写防误触模式 (智能 / 仅笔 / 通用)
        const savedPalmMode = this.safeGetStorage('kid_app_palm_mode', 'auto');
        if (savedPalmMode === 'pen_only' || savedPalmMode === 'off') {
            this.canvasEngine.setPalmRejection(savedPalmMode);
        }

        // 2. 初始化笔顺引擎并恢复写字框与写字画板大小记忆
        this.hanziGuide = new HanziGuide('hanzi-writer-box');
        this.hanziGuide.onModeChange = () => this.scheduleNavSync();
        const savedFrameSize = this.safeGetStorage('kid_app_guide_frame_size', 'medium');
        this.setGuideFrameSize(['small', 'medium', 'large'].includes(savedFrameSize) ? savedFrameSize : 'medium');

        const savedCanvasSize = this.safeGetStorage('kid_app_canvas_size', 'large');
        this.setCanvasSizeMode(['small', 'medium', 'large', 'xlarge'].includes(savedCanvasSize) ? savedCanvasSize : 'large');

        // 3. 页面记忆功能：获取上次完成的汉字或上次练习的汉字
        let targetChar = this.safeGetStorage('kid_app_last_completed', '') || this.safeGetStorage('kid_app_last_char', '');
        if (targetChar && !/^[\u4e00-\u9fa5]$/.test(targetChar)) {
            targetChar = '';
        }
        let targetCat = this.safeGetStorage('kid_app_last_category', 'starter');

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

        // 9. 初始化手机端标签页切换与便捷跳转
        this.initMobileTabs();

        // 10. 初始化奖励系统与扭蛋徽章
        this.updateGashaponBadge();
        this.bindRewardEvents();

        // 11. 初始化 🎮 汉字闯关乐园，并设为默认首页
        if (typeof ExamCenter === 'function') {
            this.examCenter = new ExamCenter(this);
            this.examCenter.initIfNeeded();
            window.examCenter = this.examCenter;
            this.examCenter.switchAppTab('exam');
        }

        // 11.5 初始化移动端 / Android 系统后退导航栈（返回上层页面而非直接退出应用）
        this.initBackNavigation();

        // 12. 初始化 PWA 离线缓存与桌面安装支持
        this.initPWA();
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
        const startQuizBtn = document.getElementById('btn-start-quiz');
        if (startQuizBtn) startQuizBtn.classList.remove('pulse');
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
        const illCardEl = document.getElementById('char-illustration-large');

        const enText = info.en || (window.CHARACTER_EN_MAP && window.CHARACTER_EN_MAP[info.char]) || '';

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
                illArtWrap.innerHTML = `<img src="${this.escapeHtml(imgUrl)}" class="ill-large-img" alt="${this.escapeHtml(info.label || info.char)}">`;
            } else {
                // 不使用不准确或误导性的 emoji，展示典雅国风楷书启蒙识字卡
                illArtWrap.innerHTML = `
                    <div class="ill-fallback-card">
                        <div class="fallback-char">${this.escapeHtml(info.char)}</div>
                        <div class="fallback-pinyin">${this.escapeHtml(info.pinyin)}</div>
                    </div>
                `;
            }
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
                    tag.title = `点击朗读词语：“${w}” 🔊`;
                    tag.addEventListener('click', () => {
                        tag.classList.add('pop-anim');
                        setTimeout(() => tag.classList.remove('pop-anim'), 300);
                        if (window.soundManager) {
                            window.soundManager.playPop();
                            window.soundManager.speak(w);
                        }
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
                sentenceEl.classList.add('pop-anim');
                setTimeout(() => sentenceEl.classList.remove('pop-anim'), 300);
                if (window.soundManager) {
                    window.soundManager.playPop();
                    window.soundManager.speak(info.sentence || sentenceEl.textContent);
                }
            };
        }

        // 手机端顶部练字参考条同步更新
        const mobRefChar = document.getElementById('mobile-ref-char');
        const mobRefPy = document.getElementById('mobile-ref-py');
        const mobRefRad = document.getElementById('mobile-ref-radical');
        if (mobRefChar) mobRefChar.textContent = info.char;
        if (mobRefPy) mobRefPy.textContent = info.pinyin;
        if (mobRefRad) mobRefRad.textContent = info.radical ? `部首:${info.radical}` : '';
    }

    // 初始化移动端手机模式标签切换 (认字与笔顺 vs 书法画板)
    initMobileTabs() {
        const tabStudio = document.getElementById('tab-btn-studio');
        const tabCanvas = document.getElementById('tab-btn-canvas');
        const mainContainer = document.getElementById('main-container') || document.querySelector('.main-container');
        const btnGotoCanvas = document.getElementById('btn-mobile-goto-canvas');
        const btnGotoStudio = document.getElementById('btn-mobile-goto-studio');
        const btnSpeakRef = document.getElementById('btn-mobile-speak-ref');
        const refInfoBox = document.getElementById('mobile-ref-info-box');

        const switchTab = (target) => {
            if (!mainContainer) return;
            if (target === 'studio') {
                mainContainer.classList.remove('mobile-tab-canvas');
                mainContainer.classList.add('mobile-tab-studio');
                if (tabStudio) tabStudio.classList.add('active');
                if (tabCanvas) tabCanvas.classList.remove('active');
                setTimeout(() => {
                    if (this.hanziGuide) {
                        this.hanziGuide.resize();
                    }
                }, 60);
            } else if (target === 'canvas') {
                mainContainer.classList.remove('mobile-tab-studio');
                mainContainer.classList.add('mobile-tab-canvas');
                if (tabCanvas) tabCanvas.classList.add('active');
                if (tabStudio) tabStudio.classList.remove('active');
                // 切换到画板时，同步+下一帧触发画布重测绘，确保在移动端首帧即精准撑开
                if (this.canvasEngine) {
                    this.canvasEngine.resize();
                }
                requestAnimationFrame(() => {
                    if (this.canvasEngine) {
                        this.canvasEngine.resize();
                    }
                });
                setTimeout(() => {
                    if (this.canvasEngine) {
                        this.canvasEngine.resize();
                    }
                }, 60);
            }
            if (window.soundManager) window.soundManager.playPop();
            this.scheduleNavSync();
        };

        this.switchMobileTab = switchTab;

        if (tabStudio) {
            tabStudio.addEventListener('click', () => switchTab('studio'));
        }
        if (tabCanvas) {
            tabCanvas.addEventListener('click', () => switchTab('canvas'));
        }
        if (btnGotoCanvas) {
            btnGotoCanvas.addEventListener('click', () => switchTab('canvas'));
        }
        if (btnGotoStudio) {
            btnGotoStudio.addEventListener('click', () => switchTab('studio'));
        }

        // 手机端画板顶部汉字卡片点击发音
        const triggerRefSpeech = () => {
            if (window.soundManager) {
                const sampleWord = (this.charInfo && this.charInfo.words && this.charInfo.words[0]) ? this.charInfo.words[0] : '';
                window.soundManager.speakChar(this.currentChar, sampleWord);
            }
        };

        if (btnSpeakRef) {
            btnSpeakRef.addEventListener('click', (e) => {
                e.stopPropagation();
                triggerRefSpeech();
            });
        }
        if (refInfoBox) {
            refInfoBox.addEventListener('click', triggerRefSpeech);
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

        // 2. 音效总开关 (顶栏按钮与设置页开关双向同步)
        const soundToggle = document.getElementById('btn-sound-toggle');
        if (soundToggle && window.soundManager) {
            soundToggle.addEventListener('click', () => {
                const enabled = window.soundManager.toggle();
                this.updateSoundUI(enabled);
            });
        }
        const settingsSoundSwitch = document.getElementById('setting-sound-switch');
        if (settingsSoundSwitch && window.soundManager) {
            settingsSoundSwitch.addEventListener('change', () => {
                if (settingsSoundSwitch.checked !== window.soundManager.enabled) {
                    const enabled = window.soundManager.toggle();
                    this.updateSoundUI(enabled);
                }
            });
        }
        this.updateSoundUI(window.soundManager ? window.soundManager.enabled : true);

        // 2.0 设置页：评分后自动朗读点评开关
        const autoSpeechSwitch = document.getElementById('setting-auto-eval-speech-switch');
        if (autoSpeechSwitch) {
            autoSpeechSwitch.checked = !!this.autoEvalSpeech;
            autoSpeechSwitch.addEventListener('change', () => {
                this.autoEvalSpeech = autoSpeechSwitch.checked;
                try {
                    localStorage.setItem('kid_app_auto_eval_speech', this.autoEvalSpeech ? 'true' : 'false');
                } catch (e) {}
                if (window.soundManager) window.soundManager.playPop();
                this.showToast(this.autoEvalSpeech
                    ? '🗣️ 已开启：智能评分后自动朗读点评'
                    : '🔕 已关闭自动朗读，可在评分报告中点击「听点评」');
            });
        }

        // 2.0.1 设置页：手写防误触模式分段选择 (与画板工具栏按钮双向同步并记忆)
        document.querySelectorAll('#setting-palm-seg .settings-seg-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.palmMode;
                if (!this.canvasEngine || !['auto', 'pen_only', 'off'].includes(mode)) return;
                if (window.soundManager) window.soundManager.playPop();
                this.canvasEngine.setPalmRejection(mode);
                this.updateStylusModeUI(mode, this.canvasEngine.isStylusDetected, true);
                try {
                    localStorage.setItem('kid_app_palm_mode', mode);
                } catch (e) {}
            });
        });

        // 2.1 家长区与系统设置弹窗控制 (归集全屏、打印、iPad指引与清除数据)
        const openSettingsBtn = document.getElementById('btn-open-settings');
        const settingsModal = document.getElementById('settings-modal');
        const closeSettingsBtn = document.getElementById('btn-close-settings');
        const settingsPrintBtn = document.getElementById('btn-settings-print');
        const settingsIpadBtn = document.getElementById('btn-settings-ipad');
        const settingsFsBtn = document.getElementById('btn-settings-fullscreen');
        const settingsClearBtn = document.getElementById('btn-settings-cleardata');

        if (openSettingsBtn && settingsModal) {
            openSettingsBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this._modalOpenedFromSettings = false;
                this.refreshSettingsPanel();
                settingsModal.classList.add('visible');
            });
        }
        if (closeSettingsBtn && settingsModal) {
            closeSettingsBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                settingsModal.classList.remove('visible');
            });
        }
        if (settingsModal) {
            settingsModal.addEventListener('click', (e) => {
                if (e.target === settingsModal) {
                    if (window.soundManager) window.soundManager.playPop();
                    settingsModal.classList.remove('visible');
                }
            });
        }
        if (settingsPrintBtn) {
            settingsPrintBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                if (settingsModal) settingsModal.classList.remove('visible');
                this.printWorksheet();
            });
        }
        if (settingsIpadBtn) {
            settingsIpadBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this._modalOpenedFromSettings = true;
                if (settingsModal) settingsModal.classList.remove('visible');
                this.openIpadGuideModal();
            });
        }
        // 设置页学习概览卡片快捷入口：金星星 -> 扭蛋机，萌宠贴纸 -> 贴纸乐园
        const statStarsCard = document.getElementById('settings-stat-stars-card');
        if (statStarsCard) {
            statStarsCard.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this._modalOpenedFromSettings = true;
                if (settingsModal) settingsModal.classList.remove('visible');
                this.openGashapon();
            });
        }
        const statStickersCard = document.getElementById('settings-stat-stickers-card');
        if (statStickersCard) {
            statStickersCard.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this._modalOpenedFromSettings = true;
                if (settingsModal) settingsModal.classList.remove('visible');
                this.openStickerBook();
            });
        }
        const topFsBtn = document.getElementById('btn-toggle-fullscreen');
        if (topFsBtn) {
            topFsBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this.toggleFullscreen();
            });
        }
        if (settingsFsBtn) {
            settingsFsBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this.toggleFullscreen();
            });
        }
        const settingsUpdateBtn = document.getElementById('btn-settings-update');
        if (settingsUpdateBtn) {
            settingsUpdateBtn.addEventListener('click', async () => {
                if (window.soundManager) window.soundManager.playVictory();
                settingsUpdateBtn.textContent = '⏳ 正在加载最新版...';
                settingsUpdateBtn.disabled = true;
                try {
                    if ('caches' in window) {
                        const keys = await caches.keys();
                        await Promise.all(keys.map(k => caches.delete(k)));
                    }
                    if ('serviceWorker' in navigator) {
                        const regs = await navigator.serviceWorker.getRegistrations();
                        await Promise.all(regs.map(r => r.update().catch(() => {})));
                    }
                } catch (e) {}
                setTimeout(() => {
                    const freshUrl = window.location.origin + window.location.pathname + '?v=' + Date.now();
                    window.location.replace(freshUrl);
                }, 250);
            });
        }
        const settingsInstallPwaBtn = document.getElementById('btn-settings-install-pwa');
        if (settingsInstallPwaBtn) {
            settingsInstallPwaBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this.triggerPWAInstall();
            });
        }
        if (settingsClearBtn) {
            settingsClearBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                if (settingsModal) settingsModal.classList.remove('visible');
                this.requestClearDataWithParentGate();
            });
        }

        // iPad 连线与简介说明弹窗内部关闭
        const ipadModal = document.getElementById('ipad-guide-modal');
        const ipadCloseBtn = document.getElementById('ipad-guide-close-btn');
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

        // 全屏状态改变监听
        document.addEventListener('fullscreenchange', () => this.updateFullscreenButton());
        document.addEventListener('webkitfullscreenchange', () => this.updateFullscreenButton());

        // 清除本地数据二次确认弹窗
        const clearModal = document.getElementById('clear-data-modal');
        const cancelClearBtn = document.getElementById('btn-cancel-clear-data');
        const confirmClearBtn = document.getElementById('btn-confirm-clear-data');

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
                const copySuccess = () => {
                    const originalText = copyForIpadBtn.textContent;
                    copyForIpadBtn.textContent = '✅ 已复制网址！可在 iPad/电脑打开';
                    copyForIpadBtn.style.background = '#2ed573';
                    if (window.soundManager) window.soundManager.playCorrect();
                    setTimeout(() => {
                        copyForIpadBtn.textContent = originalText;
                        copyForIpadBtn.style.background = 'linear-gradient(135deg, #0984e3, #74b9ff)';
                    }, 2500);
                };
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(currentUrl).then(copySuccess).catch(() => {
                        this.fallbackCopyText(currentUrl, copySuccess);
                    });
                } else {
                    this.fallbackCopyText(currentUrl, copySuccess);
                }
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

        const closeBannerBtn = document.getElementById('btn-close-mobile-banner');
        const hintBanner = document.getElementById('mobile-hint-banner');
        if (closeBannerBtn && hintBanner) {
            closeBannerBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this._mobileBannerDismissed = true;
                hintBanner.style.display = 'none';
            });
        }

        // 监听折叠屏展开/合上或旋转，展开后宽屏 (>=620px) 自动收起窄屏提示条
        window.addEventListener('resize', () => {
            if (!hintBanner) return;
            if (window.innerWidth >= 620) {
                hintBanner.style.display = 'none';
            } else if (!this._mobileBannerDismissed && this.isMobilePhone()) {
                hintBanner.style.display = 'flex';
            }
        });

        // 3. 自定义输入汉字搜索 (过滤非法字符，仅提取有效汉字)
        const customInput = document.getElementById('custom-char-input');
        const customBtn = document.getElementById('btn-custom-char');
        const handleCustomSearch = () => {
            const val = (customInput.value || '').trim();
            if (!val) return;
            const hanziMatch = val.match(/[\u4e00-\u9fa5]/);
            if (!hanziMatch) {
                this.showToast('💡 请输入一个中文汉字进行练习哦！');
                if (window.soundManager) window.soundManager.playPop();
                return;
            }
            const firstChar = hanziMatch[0];
            if (this.examCenter && this.examCenter.activeAppTab === 'exam') {
                this.examCenter.switchAppTab('practice');
            }
            this.selectChar(firstChar);
            customInput.value = '';
            if (window.soundManager) window.soundManager.playPop();
            this.scheduleNavSync();
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
                this.hanziGuide.animate((res) => {
                    playAnimBtn.disabled = false;
                    if (res && res.success === false) {
                        this.setQuizStatus('💡 暂无该生僻字笔顺矢量，请在右侧画板直接临摹！');
                    } else {
                        this.setQuizStatus('笔顺演示完成！现在轮到你在右边画板练字啦！');
                    }
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
                    onUnavailable: () => {
                        startQuizBtn.classList.remove('pulse');
                        this.setQuizStatus('💡 此字暂未收录跟写数据，请在右侧画板亲手书写！');
                    },
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

        // 5.0 左侧笔顺框大小调节 (小 / 中 / 大)
        const frameSizeBtns = document.querySelectorAll('.frame-size-seg-btn');
        frameSizeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                const size = btn.dataset.frameSize;
                this.setGuideFrameSize(size);
                const tipMap = {
                    small: '🔍 演示框已切换为【紧凑尺寸】，识字卡更宽广',
                    medium: '🔍 演示框已切换为【标准尺寸】，适中舒适',
                    large: '🔍 演示框已切换为【大号尺寸】，跟写闯关更清晰！'
                };
                this.showToast(tipMap[size] || '已调整演示字框大小');
            });
        });

        const frameZoomBtn = document.getElementById('btn-toggle-frame-zoom');
        if (frameZoomBtn) {
            frameZoomBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.soundManager) window.soundManager.playPop();
                const nextSize = this.guideFrameSize === 'large' ? 'medium' : 'large';
                this.setGuideFrameSize(nextSize);
                this.showToast(nextSize === 'large' ? '🔍 已放大笔顺演示框！' : '🔍 已还原笔顺演示框！');
            });
        }

        // 5.05 右侧孩子写字区大小调节 (小 / 中 / 大 / 全幅 + 一键缩放 + 右下角无级拖拽)
        const canvasSizeBtns = document.querySelectorAll('.canvas-size-seg-btn');
        canvasSizeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                const mode = btn.dataset.canvasSize;
                this.setCanvasSizeMode(mode, true);
            });
        });

        const canvasZoomBtn = document.getElementById('btn-toggle-canvas-zoom');
        if (canvasZoomBtn) {
            ['pointerdown', 'mousedown', 'touchstart'].forEach(evt => {
                canvasZoomBtn.addEventListener(evt, (e) => e.stopPropagation(), { passive: true });
            });
            canvasZoomBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.soundManager) window.soundManager.playPop();
                if (window.innerWidth <= 600) {
                    const nextMode = (this.canvasSizeMode === 'large' || this.canvasSizeMode === 'xlarge') ? 'medium' : 'large';
                    this.setCanvasSizeMode(nextMode, true);
                } else {
                    const nextMode = this.canvasSizeMode === 'xlarge' ? 'large' : 'xlarge';
                    this.setCanvasSizeMode(nextMode, true);
                }
            });
        }

        // 右下角无级拖拽调节写字区大小手柄
        const resizeHandle = document.getElementById('canvas-resize-handle');
        const sizeIndicator = document.getElementById('canvas-size-indicator');
        if (resizeHandle) {
            let draggingResize = false;
            let startClientX = 0;
            let startClientY = 0;
            let startCanvasSize = 320;

            const showIndicator = (px) => {
                if (!sizeIndicator) return;
                sizeIndicator.textContent = `写字格: ${px} × ${px} px`;
                sizeIndicator.style.display = 'block';
            };

            const hideIndicator = () => {
                if (!sizeIndicator) return;
                sizeIndicator.style.display = 'none';
            };

            const onResizeMove = (e) => {
                if (!draggingResize || !this.canvasEngine) return;
                const pt = e.touches ? e.touches[0] : e;
                const dx = pt.clientX - startClientX;
                const dy = pt.clientY - startClientY;
                // 由于画板在容器内居中 (margin: auto)，右下角向外拉动 delta 时边长变化约为 delta * 1.6
                const delta = Math.round(Math.max(dx, dy) * 1.6);
                const maxAvail = this.canvasEngine.maxAvailSize || 500;
                const nextPx = Math.max(175, Math.min(maxAvail, startCanvasSize + delta));
                this.canvasEngine.setCustomSize(nextPx);
                showIndicator(this.canvasEngine.cssSize || nextPx);
                document.querySelectorAll('.canvas-size-seg-btn').forEach(b => b.classList.remove('active'));
            };

            const onResizeEnd = () => {
                if (!draggingResize) return;
                draggingResize = false;
                document.removeEventListener('pointermove', onResizeMove);
                document.removeEventListener('pointerup', onResizeEnd);
                document.removeEventListener('pointercancel', onResizeEnd);
                setTimeout(hideIndicator, 900);
            };

            resizeHandle.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!this.canvasEngine) return;
                draggingResize = true;
                startClientX = e.clientX;
                startClientY = e.clientY;
                startCanvasSize = this.canvasEngine.cssSize || 320;
                showIndicator(startCanvasSize);
                if (window.soundManager) window.soundManager.playPop();
                document.addEventListener('pointermove', onResizeMove);
                document.addEventListener('pointerup', onResizeEnd);
                document.addEventListener('pointercancel', onResizeEnd);
            });
        }

        // 5.1 演示速度调节 (分段大按钮 + 兼容下拉框)
        const speedSegBtns = document.querySelectorAll('.speed-seg-btn');
        const speedSelect = document.getElementById('select-anim-speed');

        speedSegBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                speedSegBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const spd = parseFloat(btn.dataset.speed);
                this.hanziGuide.setSpeed(spd);
                if (speedSelect) speedSelect.value = spd.toString();
            });
        });

        if (speedSelect) {
            speedSelect.addEventListener('change', (e) => {
                const spd = parseFloat(e.target.value);
                this.hanziGuide.setSpeed(spd);
                speedSegBtns.forEach(b => {
                    b.classList.toggle('active', parseFloat(b.dataset.speed) === spd);
                });
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
        const colorPaletteEl = document.getElementById('canvas-color-palette');
        brushBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                brushBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const bType = btn.dataset.brush;
                this.canvasEngine.setBrushType(bType);

                // 如果是橡皮擦，调色盘略微淡化提示无需选色
                if (colorPaletteEl) {
                    colorPaletteEl.style.opacity = bType === 'eraser' ? '0.45' : '1';
                }
            });
        });

        // 8. 颜色选择器 (大号触控圆点)
        const colorPills = document.querySelectorAll('.color-pill');
        colorPills.forEach(pill => {
            pill.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                colorPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                const col = pill.dataset.color;
                this.canvasEngine.setBrushColor(col);

                // 若之前在橡皮擦状态，选颜色时自动切回毛笔
                const eraserBtn = document.querySelector('.brush-btn[data-brush="eraser"]');
                const brushBtn = document.querySelector('.brush-btn[data-brush="brush"]');
                if (eraserBtn && eraserBtn.classList.contains('active') && brushBtn) {
                    eraserBtn.classList.remove('active');
                    brushBtn.classList.add('active');
                    this.canvasEngine.setBrushType('brush');
                    if (colorPaletteEl) colorPaletteEl.style.opacity = '1';
                }
            });
        });

        // 9. 画笔粗细：细/中/粗分段按键 + 长滑块双向联动
        const sizeSegBtns = document.querySelectorAll('.size-seg-btn');
        const sizeSlider = document.getElementById('brush-size-slider');

        sizeSegBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                sizeSegBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const sz = parseInt(btn.dataset.size, 10);
                this.canvasEngine.setBrushSize(sz);
                if (sizeSlider) sizeSlider.value = sz;
            });
        });

        if (sizeSlider) {
            sizeSlider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value, 10);
                this.canvasEngine.setBrushSize(val);
                sizeSegBtns.forEach(b => {
                    b.classList.toggle('active', parseInt(b.dataset.size, 10) === val);
                });
            });
        }

        // 10. 描红大开关 (iOS-Toggle) 与浓度调节
        const traceToggle = document.getElementById('toggle-trace-switch');
        const traceSlider = document.getElementById('trace-opacity-slider');
        const traceOpacityGroup = document.getElementById('trace-opacity-group');

        const updateTrace = () => {
            const show = traceToggle ? traceToggle.checked : true;
            const opacity = traceSlider ? parseFloat(traceSlider.value) : 0.35;
            if (traceOpacityGroup) {
                traceOpacityGroup.style.opacity = show ? '1' : '0.35';
                traceOpacityGroup.style.pointerEvents = show ? 'auto' : 'none';
            }
            this.canvasEngine.setTraceSettings(show, opacity);
        };

        if (traceToggle) traceToggle.addEventListener('change', () => {
            if (window.soundManager) window.soundManager.playPop();
            updateTrace();
        });
        if (traceSlider) traceSlider.addEventListener('input', updateTrace);

        // 10.1 手写笔手掌防误触切换控制
        const stylusBtn = document.getElementById('btn-toggle-stylus');
        if (stylusBtn) {
            stylusBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                const currentMode = this.canvasEngine.palmRejection;
                let newMode = 'auto';
                if (currentMode === 'auto') newMode = 'pen_only';
                else if (currentMode === 'pen_only') newMode = 'off';
                else newMode = 'auto';

                this.canvasEngine.setPalmRejection(newMode);
                this.updateStylusModeUI(newMode, this.canvasEngine.isStylusDetected, true);
                try {
                    localStorage.setItem('kid_app_palm_mode', newMode);
                } catch (e) {}
            });
        }

        // 10.2 手腕防误触虚拟垫板控制
        const wristGuardBtn = document.getElementById('btn-toggle-wrist-guard');
        const wristGuardBar = document.getElementById('wrist-guard-bar');
        const closeWristBtn = document.getElementById('btn-close-wrist-guard');

        if (wristGuardBtn && wristGuardBar) {
            wristGuardBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                const isHidden = wristGuardBar.style.display === 'none' || !wristGuardBar.style.display;
                if (isHidden) {
                    wristGuardBar.style.display = 'block';
                    wristGuardBtn.classList.add('active');
                    this.showToast('🛡️ 手腕防触垫已开启，手掌/手腕可舒适贴屏');
                } else {
                    wristGuardBar.style.display = 'none';
                    wristGuardBtn.classList.remove('active');
                }
            });
        }

        if (closeWristBtn && wristGuardBar && wristGuardBtn) {
            closeWristBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                wristGuardBar.style.display = 'none';
                wristGuardBtn.classList.remove('active');
            });
        }

        // 彻底隔绝手腕防误触垫板上的所有手掌与手指触控，避免穿透或触发画板事件
        if (wristGuardBar) {
            ['pointerdown', 'pointermove', 'touchstart', 'touchmove', 'mousedown'].forEach(evtName => {
                wristGuardBar.addEventListener(evtName, (e) => {
                    if (e.target && (e.target.id === 'btn-close-wrist-guard' || e.target.closest('#btn-close-wrist-guard'))) {
                        return;
                    }
                    e.stopPropagation();
                }, { passive: false });
            });
        }

        // 11. 撤销按钮 (支持误触清空一键恢复)
        const undoBtn = document.getElementById('btn-undo');
        if (undoBtn) {
            undoBtn.addEventListener('click', () => {
                const hadBackup = !!this.canvasEngine.lastClearedBackup;
                const success = this.canvasEngine.undo();
                if (hadBackup && success && !this.canvasEngine.lastClearedBackup) {
                    this.showToast('↩️ 已成功找回刚才清空的字迹！');
                }
            });
        }

        // 12. 清空画板按钮 (带误触即时撤销找回提示)
        const clearBtn = document.getElementById('btn-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                const hasDrawing = this.canvasEngine.hasDrawing();
                this.canvasEngine.clear(true);
                if (hasDrawing) {
                    this.showToast('🗑️ 画板已清空（若手腕误碰，点“↩️ 撤销”可立即恢复）');
                }
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

        // 15. 智能评分报告弹窗操作与语音朗读
        const evalModal = document.getElementById('eval-modal');
        const evalRetryBtn = document.getElementById('btn-eval-retry');
        const evalNextBtn = document.getElementById('btn-eval-next');
        const evalSpeakBtn = document.getElementById('btn-eval-speak');

        const handleCloseEvalModal = () => {
            this.closeEvalModal();
        };

        if (evalSpeakBtn) {
            evalSpeakBtn.addEventListener('click', () => {
                this.toggleEvalSpeech();
            });
        }

        if (evalRetryBtn && evalModal) {
            evalRetryBtn.addEventListener('click', () => {
                handleCloseEvalModal();
                if (window.soundManager) window.soundManager.playPop();
                evalModal.classList.remove('visible');
                this.canvasEngine.clear();
            });
        }

        if (evalNextBtn && evalModal) {
            evalNextBtn.addEventListener('click', () => {
                handleCloseEvalModal();
                if (window.soundManager) window.soundManager.playPop();
                evalModal.classList.remove('visible');
                this.selectNextChar();
            });
        }

        const evalGashaponBtn = document.getElementById('btn-eval-gashapon');
        if (evalGashaponBtn && evalModal) {
            evalGashaponBtn.addEventListener('click', () => {
                handleCloseEvalModal();
                if (window.soundManager) window.soundManager.playPop();
                evalModal.classList.remove('visible');
                this.openGashapon();
            });
        }

        if (evalModal) {
            evalModal.addEventListener('click', (e) => {
                if (e.target === evalModal) {
                    handleCloseEvalModal();
                    evalModal.classList.remove('visible');
                }
            });
        }

        // 键盘快捷键支持：按 Escape 键优雅退出当前所有弹窗
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Esc') {
                handleCloseEvalModal();
                const openModals = document.querySelectorAll('.modal-overlay.visible');
                if (openModals.length > 0) {
                    openModals.forEach(m => m.classList.remove('visible'));
                    if (window.soundManager) window.soundManager.playPop();
                }
            }
        });
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
            this.scheduleNavSync();
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
        if (window.innerWidth <= 600 && typeof this.switchMobileTab === 'function') {
            this.switchMobileTab('canvas');
        }
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

        // 如果拥有足够星星，显示扭蛋快捷按钮
        const evalGashaponBtn = document.getElementById('btn-eval-gashapon');
        if (evalGashaponBtn) {
            evalGashaponBtn.style.display = (this.stars >= this.eggCost) ? 'inline-flex' : 'none';
        }

        // 弹出报告弹窗并自动播放语音点评 (温柔姐姐晓晓神经语音)
        this.resetEvalSpeakButton();
        const modal = document.getElementById('eval-modal');
        if (modal) modal.classList.add('visible');

        if (this._evalSpeechTimer) {
            clearTimeout(this._evalSpeechTimer);
            this._evalSpeechTimer = null;
        }
        if (this.autoEvalSpeech && (!window.soundManager || window.soundManager.enabled !== false)) {
            const speakBtn = document.getElementById('btn-eval-speak');
            if (speakBtn) {
                speakBtn.classList.add('speaking');
                const lbl = speakBtn.querySelector('.eval-speak-text');
                if (lbl) lbl.textContent = '正在朗读...';
            }
            this._evalSpeechTimer = setTimeout(() => {
                this._evalSpeechTimer = null;
                if (modal && modal.classList.contains('visible')) {
                    this.startEvalSpeech();
                }
            }, 300);
        }
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
        this.updateGashaponBadge();
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
            this.scheduleNavSync();
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

    // 生成并打印标准田字格纸质练字帖 (所有动态字段均经过 HTML 转义保护)
    printWorksheet() {
        const char = this.escapeHtml(this.currentChar);
        const info = this.charInfo || {};
        const safePy = this.escapeHtml(info.pinyin || '');
        const safeIcon = this.escapeHtml(info.icon || '✏️');
        const safeLabel = this.escapeHtml(info.label || '');
        const safeEn = this.escapeHtml(info.en || '-');
        const safeRadical = this.escapeHtml(info.radical || '-');
        const safeStrokes = this.escapeHtml(info.strokes || '-');
        const safeWords = this.escapeHtml((info.words || []).join('、'));
        const safeSentence = this.escapeHtml(info.sentence || '');

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
                        <span class="py">${safePy}</span>
                        <div class="tianzi">${char}</div>
                    </div>
                    <div class="print-ill-box" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:58px; height:58px; border:1.5px dashed #f59e0b; border-radius:10px; margin:0 10px; background:#fffbeb;">
                        <span style="font-size:28px; line-height:1;">${safeIcon}</span>
                        <span style="font-size:10px; font-weight:bold; color:#b45309; margin-top:2px;">${safeLabel}</span>
                    </div>
                    <div class="print-info-text">
                        <p><strong>拼音：</strong>${safePy} &nbsp;&nbsp; <strong>英文：</strong>${safeEn} &nbsp;&nbsp; <strong>部首：</strong>${safeRadical} &nbsp;&nbsp; <strong>笔画：</strong>${safeStrokes} 画</p>
                        <p><strong>常用词语：</strong>${safeWords}</p>
                        <p><strong>经典例句：</strong>${safeSentence}</p>
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

    // 设备类型检测：是否为小屏窄视口手机（精确识别窄屏手机，排除展开态折叠屏、iPad、平板及电脑设备）
    isMobilePhone() {
        // 展开态折叠屏手机、iPad、平板及桌面浏览器（视口宽度 >= 620px）均拥有充足横向空间，不作为小屏手机提示
        if (window.innerWidth >= 620) {
            return false;
        }

        const ua = navigator.userAgent;
        // 明确排除 iPad (包含现代 iPadOS 桌面 UA: MacIntel + touchPoints) 与各类平板
        const isIPad = /iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        const isTablet = /Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua));
        if (isIPad || isTablet) {
            return false;
        }

        // 明确识别手机 UA：iPhone, iPod, Android Mobile 等 (且宽度 < 620px)
        const isPhoneUA = /iPhone|iPod/i.test(ua) || (/Android/i.test(ua) && /Mobile/i.test(ua)) || /Windows Phone/i.test(ua);
        if (isPhoneUA) {
            return true;
        }

        // 触屏移动设备且视口极窄（适配部分自定义内核移动浏览器）
        const hasTouch = (navigator.maxTouchPoints > 0) || ('ontouchstart' in window);
        const isSmallViewport = window.innerWidth < 620;
        if (hasTouch && isSmallViewport) {
            return true;
        }

        return false;
    }

    // 初始化 PWA Service Worker 与桌面安装提示
    initPWA() {
        const installBtn = document.getElementById('btn-settings-install-pwa');
        const installDesc = document.getElementById('pwa-install-desc');

        const markInstalled = (descText) => {
            if (installBtn) {
                installBtn.textContent = '已安装';
                installBtn.disabled = true;
                installBtn.classList.remove('primary');
                installBtn.classList.add('is-done');
            }
            if (installDesc && descText) {
                installDesc.textContent = descText;
            }
        };

        if (this.isStandaloneMode()) {
            markInstalled('正以桌面 App 模式全屏运行，支持离线练字');
        }

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredInstallPrompt = e;
            if (installBtn) {
                installBtn.textContent = '立即安装';
            }
            if (installDesc) {
                installDesc.textContent = '一键添加到桌面，无地址栏干扰，断网也能练字';
            }
        });

        window.addEventListener('appinstalled', () => {
            this.deferredInstallPrompt = null;
            markInstalled('已添加到桌面，可从桌面图标直接打开');
            this.showToast('🎉 已成功安装「快乐小书法家」到桌面！');
        });

        if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.protocol === 'http:')) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js').catch((err) => {
                    console.warn('ServiceWorker registration warning:', err);
                });
            });
            // 离线缓存接管页面后，若设置页正打开则即时刷新「离线可用」状态
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                const settingsModal = document.getElementById('settings-modal');
                if (settingsModal && settingsModal.classList.contains('visible')) {
                    this.refreshSettingsPanel();
                }
            });
        }
    }

    // 是否以桌面独立 App (PWA standalone) 模式运行
    isStandaloneMode() {
        return !!((window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true);
    }

    // 触发 PWA 桌面安装或展示安装指南
    async triggerPWAInstall() {
        if (this.isStandaloneMode()) {
            this.showToast('✅ 当前已经在桌面独立 App 模式下运行啦！');
            return;
        }

        if (this.deferredInstallPrompt) {
            try {
                this.deferredInstallPrompt.prompt();
                const { outcome } = await this.deferredInstallPrompt.userChoice;
                if (outcome === 'accepted') {
                    this.deferredInstallPrompt = null;
                }
            } catch (e) {
                console.warn('PWA install prompt error:', e);
            }
            return;
        }

        // Safari / 移动端浏览器未触发 beforeinstallprompt 时，打开图文添加到主屏幕指南
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal && settingsModal.classList.contains('visible')) {
            this._modalOpenedFromSettings = true;
            settingsModal.classList.remove('visible');
        }
        this.openIpadGuideModal();
        this.showToast('💡 请点击浏览器菜单中的【分享 ➔ 添加到主屏幕】或【安装应用】即可生成桌面图标！', 4000);
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

    // 更新全屏按钮显示状态 (同步顶栏与设置弹窗按键)
    updateFullscreenButton() {
        const isFullscreen = !!(document.fullscreenElement || 
                               document.webkitFullscreenElement || 
                               document.mozFullScreenElement || 
                               document.msFullscreenElement);
        const btn = document.getElementById('btn-toggle-fullscreen');
        if (btn) {
            btn.innerHTML = isFullscreen ? '🗗 退出全屏' : '⛶ 全屏';
            btn.classList.toggle('active', isFullscreen);
            btn.title = isFullscreen ? '退出浏览器全屏显示' : '切换浏览器全屏显示，沉浸式练字';
        }
        const settingsFsBtn = document.getElementById('btn-settings-fullscreen');
        if (settingsFsBtn) {
            settingsFsBtn.textContent = isFullscreen ? '退出全屏' : '进入全屏';
            settingsFsBtn.classList.toggle('active', isFullscreen);
        }
    }

    // 轻量消息提示 Toast
    showToast(message, duration = 2600) {
        const toast = document.getElementById('app-toast');
        if (!toast) return;
        toast.innerHTML = message;
        toast.classList.add('visible');
        if (this._toastTimer) clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            toast.classList.remove('visible');
        }, duration);
    }

    // 同步顶栏声音按钮与设置页声音开关状态
    updateSoundUI(enabled) {
        const isOn = enabled !== false;
        const soundToggle = document.getElementById('btn-sound-toggle');
        if (soundToggle) {
            soundToggle.textContent = isOn ? '🔊 声音开' : '🔇 静音中';
            soundToggle.classList.toggle('muted', !isOn);
        }
        const settingsSoundSwitch = document.getElementById('setting-sound-switch');
        if (settingsSoundSwitch) settingsSoundSwitch.checked = isOn;
        // 静音时自动朗读无法发声，设置页对应行淡化提示
        const autoSpeechRow = document.getElementById('setting-row-auto-speech');
        if (autoSpeechRow) autoSpeechRow.classList.toggle('is-disabled', !isOn);
    }

    // 同步设置页防误触模式分段按钮与说明文字
    syncSettingsPalmSeg(mode) {
        const descMap = {
            auto: '笔尖优先，手掌可放心贴屏',
            pen_only: '仅识别主动笔，屏蔽手掌手指',
            off: '手指与电容笔均可书写'
        };
        const activeMode = descMap[mode] ? mode : 'auto';
        document.querySelectorAll('#setting-palm-seg .settings-seg-btn').forEach(btn => {
            const isActive = btn.dataset.palmMode === activeMode;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
        });
        const desc = document.getElementById('setting-palm-desc');
        if (desc) desc.textContent = descMap[activeMode];
    }

    // 打开设置页时刷新学习概览、开关状态与运行环境信息
    refreshSettingsPanel() {
        const setText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };
        setText('settings-stat-stars', String(this.stars || 0));
        setText('settings-stat-chars', String((this.completedChars && this.completedChars.length) || 0));
        setText('settings-stat-stickers', `${(this.unlockedStickers && this.unlockedStickers.length) || 0}/${CALLIGRAPHY_STICKERS.length}`);
        setText('setting-print-desc', `「${this.currentChar}」字 A4 田字格字帖（描红 + 临摹）`);

        this.updateSoundUI(window.soundManager ? window.soundManager.enabled : true);
        const autoSpeechSwitch = document.getElementById('setting-auto-eval-speech-switch');
        if (autoSpeechSwitch) autoSpeechSwitch.checked = !!this.autoEvalSpeech;
        if (this.canvasEngine) this.syncSettingsPalmSeg(this.canvasEngine.palmRejection);
        this.updateFullscreenButton();

        // 桌面 App 模式下已无地址栏，隐藏浏览器全屏选项
        const isStandalone = this.isStandaloneMode();
        const fsRow = document.getElementById('setting-row-fullscreen');
        if (fsRow) fsRow.style.display = isStandalone ? 'none' : '';

        const modeChip = document.getElementById('settings-chip-mode');
        if (modeChip) {
            modeChip.textContent = isStandalone ? '📲 桌面 App 模式' : '🌐 浏览器模式';
            modeChip.classList.toggle('ok', isStandalone);
        }
        const offlineChip = document.getElementById('settings-chip-offline');
        if (offlineChip) {
            const offlineReady = !!(navigator.serviceWorker && navigator.serviceWorker.controller);
            offlineChip.textContent = offlineReady ? '✅ 已支持离线练字' : '⏳ 离线缓存准备中';
            offlineChip.classList.toggle('ok', offlineReady);
        }
    }

    // 更新防误触按钮与状态显示
    updateStylusModeUI(mode, isStylusDetected, showFeedback = false) {
        this.syncSettingsPalmSeg(mode);
        const stylusBtn = document.getElementById('btn-toggle-stylus');
        const badge = document.getElementById('stylus-guard-badge');
        if (!stylusBtn || !badge) return;

        stylusBtn.classList.remove('mode-pen_only', 'mode-off');
        if (mode === 'pen_only') {
            stylusBtn.classList.add('mode-pen_only');
            badge.textContent = '仅笔';
            if (showFeedback) {
                this.showToast('✏️ 防误触已设为【仅手写笔】：仅响应 Apple Pencil / 主动笔，彻底屏蔽手掌触控');
            }
        } else if (mode === 'off') {
            stylusBtn.classList.add('mode-off');
            badge.textContent = '通用';
            if (showFeedback) {
                this.showToast('🖐️ 防误触已设为【手笔通用】：手指、橡胶电容笔与主动笔均可自由书写');
            }
        } else {
            // auto 智能模式
            badge.textContent = isStylusDetected ? '智能' : '自动';
            if (showFeedback) {
                this.showToast('✨ 防误触已设为【智能识别】：笔尖绝对优先，主动笔书写时手掌可自然贴屏！');
            }
        }
    }

    // 家长算术安全验证锁：杜绝小朋友误操作清空星星与记录
    requestClearDataWithParentGate() {
        const num1 = Math.floor(Math.random() * 8) + 3; // 3 ~ 10
        const num2 = Math.floor(Math.random() * 8) + 2; // 2 ~ 9
        const expected = num1 + num2;
        const answer = prompt(`🛡️ 家长安全验证锁（防止小朋友误触数据清空）\n\n请家长口算作答：${num1} + ${num2} = ?`);
        if (answer === null) return; // 家长主动取消
        if (parseInt(answer.trim(), 10) !== expected) {
            alert('❌ 口算验证未通过，已取消清除数据操作。');
            if (window.soundManager) window.soundManager.playPop();
            return;
        }

        // 验证通过，弹出二次确认与数据统计展示
        const clearModal = document.getElementById('clear-data-modal');
        const clearStarsEl = document.getElementById('clear-modal-stars');
        const clearCharsEl = document.getElementById('clear-modal-chars');
        if (clearStarsEl) clearStarsEl.textContent = this.stars || 0;
        if (clearCharsEl) clearCharsEl.textContent = (this.completedChars && this.completedChars.length) || 0;
        if (clearModal) {
            this._modalOpenedFromSettings = true;
            clearModal.classList.add('visible');
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
            localStorage.removeItem('kid_app_stickers');

            // 保留家长偏好设置（声音、自动朗读、防误触模式、字框与写字区大小）及已阅读简介状态，仅清除学习数据
            const preservedKeys = [
                'kid_app_intro_seen',
                'kid_app_sound_enabled',
                'kid_app_auto_eval_speech',
                'kid_app_palm_mode',
                'kid_app_canvas_size',
                'kid_app_guide_frame_size'
            ];
            const preserved = {};
            preservedKeys.forEach(k => {
                const v = localStorage.getItem(k);
                if (v !== null) preserved[k] = v;
            });
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key && key.startsWith('kid_app_')) {
                    localStorage.removeItem(key);
                }
            }
            Object.keys(preserved).forEach(k => localStorage.setItem(k, preserved[k]));
        } catch (e) {
            console.error('清除本地数据失败:', e);
        }

        // 重置内部状态并刷新 UI
        this.stars = 0;
        this.completedChars = [];
        this.unlockedStickers = ['maliang', 'zhuangyuan', 'panda'];
        this.updateStarUI();
        this.updateGashaponBadge();
        this.renderCharList(this.currentCategory);
        if (this.canvasEngine) {
            this.canvasEngine.clear();
        }
        if (window.soundManager) {
            window.soundManager.playPop();
        }
        alert('✅ 本地所有练字记录、金星星及画板数据已成功清空重置！');
    }

    // ================= 16. 奖励系统：扭蛋机与贴纸乐园 =================
    updateGashaponBadge() {
        const badge = document.getElementById('gashapon-badge-count');
        if (!badge) return;
        const availableDraws = Math.floor(this.stars / this.eggCost);
        if (availableDraws > 0) {
            badge.textContent = availableDraws;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }

    bindRewardEvents() {
        // 扭蛋机触发按钮
        const btnGashapon = document.getElementById('btn-gashapon');
        const gashaponModal = document.getElementById('gashapon-modal');
        const btnCloseGashapon = document.getElementById('btn-close-gashapon');

        if (btnGashapon) {
            btnGashapon.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this.openGashapon();
            });
        }

        if (btnCloseGashapon && gashaponModal) {
            btnCloseGashapon.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                gashaponModal.classList.remove('visible');
            });
        }

        if (gashaponModal) {
            gashaponModal.addEventListener('click', (e) => {
                if (e.target === gashaponModal) {
                    if (window.soundManager) window.soundManager.playPop();
                    gashaponModal.classList.remove('visible');
                }
            });
        }

        // 贴纸乐园触发按钮
        const btnStickerBook = document.getElementById('btn-sticker-book');
        const stickerBookModal = document.getElementById('sticker-book-modal');
        const btnCloseStickerBook = document.getElementById('btn-close-sticker-book');

        if (btnStickerBook) {
            btnStickerBook.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this.openStickerBook();
            });
        }

        if (btnCloseStickerBook && stickerBookModal) {
            btnCloseStickerBook.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                stickerBookModal.classList.remove('visible');
            });
        }

        if (stickerBookModal) {
            stickerBookModal.addEventListener('click', (e) => {
                if (e.target === stickerBookModal) {
                    if (window.soundManager) window.soundManager.playPop();
                    stickerBookModal.classList.remove('visible');
                }
            });
        }

        // 贴纸乐园选项卡切换 (荣誉图鉴 vs 宣纸创意乐园)
        const tabBtns = document.querySelectorAll('.sticker-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const targetTab = btn.dataset.tab;
                const panels = document.querySelectorAll('.sticker-tab-panel');
                panels.forEach(p => p.classList.remove('active'));

                const targetPanel = document.getElementById(`tab-${targetTab}`);
                if (targetPanel) targetPanel.classList.add('active');
            });
        });

        // 清空创意乐园画布
        const btnClearPlayground = document.getElementById('btn-clear-playground');
        if (btnClearPlayground) {
            btnClearPlayground.addEventListener('click', () => {
                const canvas = document.getElementById('sticker-playground-canvas');
                if (canvas) {
                    canvas.innerHTML = '';
                    if (window.soundManager) window.soundManager.playEraser();
                }
            });
        }
    }

    openGashapon() {
        const modal = document.getElementById('gashapon-modal');
        if (modal) {
            modal.classList.add('visible');
            this.updateGashaponUI();
        }
    }

    updateGashaponUI() {
        const costText = document.getElementById('gashapon-cost-text');
        const drawBtn = document.getElementById('draw-egg-btn');
        const prizeDisplay = document.getElementById('gashapon-prize-display');

        if (costText) {
            costText.textContent = `当前金星: ⭐ ${this.stars} (每 ${this.eggCost} 颗金星可扭一次)`;
        }

        if (drawBtn) {
            if (this.stars >= this.eggCost) {
                drawBtn.disabled = false;
                drawBtn.textContent = `🎰 消耗 ${this.eggCost} 颗⭐ 扭蛋！`;
                drawBtn.onclick = () => this.drawEgg();
            } else {
                drawBtn.disabled = true;
                drawBtn.textContent = `还需要 ${this.eggCost - this.stars} 颗⭐ 才能扭蛋`;
                drawBtn.onclick = null;
            }
        }
    }

    drawEgg() {
        if (this.stars < this.eggCost) return;

        this.stars -= this.eggCost;
        localStorage.setItem('kid_app_stars', this.stars.toString());
        this.updateStarUI();

        const drawBtn = document.getElementById('draw-egg-btn');
        if (drawBtn) drawBtn.disabled = true;

        const prizeDisplay = document.getElementById('gashapon-prize-display');
        if (prizeDisplay) {
            prizeDisplay.innerHTML = `
                <div class="egg-rolling">
                    <div class="egg-animated">🔮</div>
                    <p class="rolling-text">扭蛋滚动中... 墨香溢出啦~</p>
                </div>
            `;
        }

        if (window.soundManager) window.soundManager.playPop();

        setTimeout(() => {
            const uncollected = CALLIGRAPHY_STICKERS.filter(s => !this.unlockedStickers.includes(s.id));
            let randomSticker;
            let isNew = false;

            // 80% 几率优先抽中未收集到的萌宠
            if (uncollected.length > 0 && Math.random() < 0.8) {
                randomSticker = uncollected[Math.floor(Math.random() * uncollected.length)];
                isNew = true;
            } else {
                randomSticker = CALLIGRAPHY_STICKERS[Math.floor(Math.random() * CALLIGRAPHY_STICKERS.length)];
                isNew = !this.unlockedStickers.includes(randomSticker.id);
            }

            if (isNew) {
                this.unlockedStickers.push(randomSticker.id);
                localStorage.setItem('kid_app_stickers', JSON.stringify(this.unlockedStickers));
            }

            if (window.soundManager) {
                window.soundManager.playVictory();
                window.soundManager.playFanfare();
            }
            this.fireConfetti();

            if (prizeDisplay) {
                prizeDisplay.innerHTML = `
                    <div class="prize-card pop-in">
                        <div class="prize-badge">${isNew ? '✨ 新伙伴加入！' : '🎉 获得闪亮金光贴纸！'}</div>
                        <div class="prize-emoji">${randomSticker.emoji}</div>
                        <div class="prize-name">${randomSticker.name}</div>
                        <div class="prize-title">【${randomSticker.title}】</div>
                    </div>
                `;
            }

            const voiceMsg = isNew 
                ? `恭喜你！解锁了新伙伴：${randomSticker.name}！` 
                : `获得了闪亮贴纸：${randomSticker.name}！`;
            if (window.soundManager) window.soundManager.speak(voiceMsg);

            this.updateGashaponUI();
            this.updateGashaponBadge();
        }, 1200);
    }

    openStickerBook() {
        const modal = document.getElementById('sticker-book-modal');
        if (modal) {
            modal.classList.add('visible');
            this.renderStickerBook();
            this.renderPlaygroundBar();
        }
    }

    renderStickerBook() {
        const grid = document.getElementById('stickers-grid');
        const unlockedCountEl = document.getElementById('unlocked-sticker-count');
        if (!grid) return;
        grid.innerHTML = '';

        if (unlockedCountEl) {
            unlockedCountEl.textContent = `${this.unlockedStickers.length} / ${CALLIGRAPHY_STICKERS.length}`;
        }

        CALLIGRAPHY_STICKERS.forEach(item => {
            const isUnlocked = this.unlockedStickers.includes(item.id);
            const card = document.createElement('div');
            card.className = `sticker-grid-item ${isUnlocked ? 'unlocked' : 'locked'}`;

            if (isUnlocked) {
                card.innerHTML = `
                    <div class="sticker-icon">${item.emoji}</div>
                    <div class="sticker-lbl">${item.name}</div>
                    <div class="sticker-tag">${item.title}</div>
                `;
                card.addEventListener('click', () => {
                    if (window.soundManager) {
                        window.soundManager.playStar();
                        window.soundManager.speak(item.soundText || item.name);
                    }
                    card.classList.add('wobble');
                    setTimeout(() => card.classList.remove('wobble'), 500);
                });
            } else {
                card.innerHTML = `
                    <div class="sticker-icon locked-icon">🔒</div>
                    <div class="sticker-lbl">???</div>
                    <div class="sticker-tag">扭蛋解锁</div>
                `;
            }

            grid.appendChild(card);
        });
    }

    renderPlaygroundBar() {
        const bar = document.getElementById('playground-stickers-bar');
        const playground = document.getElementById('sticker-playground-canvas');
        if (!bar || !playground) return;

        bar.innerHTML = '';
        const unlockedItems = CALLIGRAPHY_STICKERS.filter(s => this.unlockedStickers.includes(s.id));

        unlockedItems.forEach(item => {
            const chip = document.createElement('button');
            chip.className = 'playground-chip';
            chip.innerHTML = `${item.emoji} <span>${item.name}</span>`;
            chip.title = '点击放入宣纸卷轴';

            chip.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this.addStickerToPlayground(item, playground);
            });

            bar.appendChild(chip);
        });
    }

    addStickerToPlayground(item, playground) {
        const el = document.createElement('div');
        el.className = 'placed-playground-sticker pop-in';
        el.textContent = item.emoji;

        const pWidth = playground.clientWidth > 100 ? playground.clientWidth : 360;
        const pHeight = playground.clientHeight > 80 ? playground.clientHeight : 220;

        const x = Math.floor(Math.random() * (pWidth - 80)) + 20;
        const y = Math.floor(Math.random() * (pHeight - 80)) + 20;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;

        let isDragging = false;
        let startX, startY, origX, origY;
        let moved = false;

        const onPointerDown = (e) => {
            isDragging = true;
            moved = false;
            el.style.zIndex = '100';
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            startX = clientX;
            startY = clientY;
            origX = el.offsetLeft;
            origY = el.offsetTop;
            if (window.soundManager) window.soundManager.playPop();
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const dx = clientX - startX;
            const dy = clientY - startY;

            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                moved = true;
            }

            const curW = playground.clientWidth > 100 ? playground.clientWidth : 360;
            const curH = playground.clientHeight > 80 ? playground.clientHeight : 220;
            el.style.left = `${Math.max(4, Math.min(curW - 56, origX + dx))}px`;
            el.style.top = `${Math.max(4, Math.min(curH - 56, origY + dy))}px`;
        };

        const onPointerEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            el.style.zIndex = '10';
        };

        const onMouseDown = (e) => {
            onPointerDown(e);
            const cleanup = () => {
                onPointerEnd();
                document.removeEventListener('mousemove', onPointerMove);
                document.removeEventListener('mouseup', cleanup);
            };
            document.addEventListener('mousemove', onPointerMove);
            document.addEventListener('mouseup', cleanup);
        };
        el.addEventListener('mousedown', onMouseDown);

        el.addEventListener('touchstart', onPointerDown, { passive: true });
        document.addEventListener('touchmove', onPointerMove, { passive: true });
        document.addEventListener('touchend', onPointerEnd);

        el.addEventListener('click', (e) => {
            e.stopPropagation();
            if (moved) return; // 如果在拖动则不触发跳跃发声
            if (window.soundManager) {
                window.soundManager.playStar();
                window.soundManager.speak(item.soundText || item.name);
            }
            el.classList.add('jumping');
            setTimeout(() => el.classList.remove('jumping'), 600);
        });

        playground.appendChild(el);
    }

    // 剪贴板复制兜底处理
    fallbackCopyText(text, callback) {
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            if (callback) callback();
        } catch (e) {
            prompt('请长按复制本站网址：', text);
        }
    }

    // 切换左侧笔顺与跟写字框大小 (小 175px / 中 230px / 大 295px)
    setGuideFrameSize(size) {
        this.guideFrameSize = size || 'medium';
        const container = document.querySelector('.main-container');
        const studioCard = document.querySelector('.panel-left-studio');

        ['frame-size-small', 'frame-size-medium', 'frame-size-large'].forEach(cls => {
            if (container) container.classList.remove(cls);
            if (studioCard) studioCard.classList.remove(cls);
        });

        const activeCls = `frame-size-${this.guideFrameSize}`;
        if (container) container.classList.add(activeCls);
        if (studioCard) studioCard.classList.add(activeCls);

        document.querySelectorAll('.frame-size-seg-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.frameSize === this.guideFrameSize);
        });

        try {
            localStorage.setItem('kid_app_guide_frame_size', this.guideFrameSize);
        } catch (e) {}

        setTimeout(() => {
            if (this.hanziGuide) this.hanziGuide.resize();
            if (this.canvasEngine) this.canvasEngine.resize();
        }, 180);
    }

    // 切换右侧孩子写字区大小 (small / medium / large / xlarge)
    setCanvasSizeMode(mode, showFeedback = false) {
        this.canvasSizeMode = ['small', 'medium', 'large', 'xlarge'].includes(mode) ? mode : 'large';
        const isMobileNarrow = window.innerWidth <= 600;
        const effectiveMode = (isMobileNarrow && this.canvasSizeMode === 'xlarge') ? 'large' : this.canvasSizeMode;

        const container = document.querySelector('.main-container');
        if (container) {
            container.classList.toggle('canvas-size-xlarge', !isMobileNarrow && this.canvasSizeMode === 'xlarge');
        }

        document.querySelectorAll('.canvas-size-seg-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.canvasSize === effectiveMode);
        });

        const zoomBtn = document.getElementById('btn-toggle-canvas-zoom');
        if (zoomBtn) {
            const isXL = isMobileNarrow ? (effectiveMode === 'large') : (this.canvasSizeMode === 'xlarge');
            zoomBtn.textContent = isXL ? '🗗' : '⛶';
            zoomBtn.classList.toggle('active', isXL);
            zoomBtn.title = isXL ? '还原适中写字区' : '一键放大写字区';
        }

        try {
            localStorage.setItem('kid_app_canvas_size', this.canvasSizeMode);
        } catch (e) {}

        if (this.canvasEngine) {
            this.canvasEngine.setSizeMode(effectiveMode);
        }

        setTimeout(() => {
            if (this.canvasEngine) this.canvasEngine.resize(true);
            if (this.hanziGuide) this.hanziGuide.resize();
            if (showFeedback && this.canvasEngine) {
                const px = this.canvasEngine.cssSize || 340;
                const labelMap = {
                    small: `✍️ 写字区已调为【小号格】(${px}×${px}px)，适合精细控笔`,
                    medium: `✍️ 写字区已调为【中号格】(${px}×${px}px)，四周留白舒适`,
                    large: `✍️ 写字区已调为【标准大格】(${px}×${px}px)，书写宽广`,
                    xlarge: `✍️ 已开启【全幅超大写字区】(${px}×${px}px)，畅快挥毫！`
                };
                this.showToast(labelMap[effectiveMode] || '已调整写字区大小');
            }
        }, 120);
    }

    // 启动名师点评语音朗读 (由智能评分完成后自动触发，或手动点击触发)
    startEvalSpeech() {
        const btn = document.getElementById('btn-eval-speak');
        if (!btn || !this.lastEvaluationResult) return;

        const res = this.lastEvaluationResult;
        // 构造亲切、温暖、无 Emoji 且不超过 76 字的完整语音句子，完美契合晓晓神经语音合成
        const gradeClean = (res.grade || '')
            .replace(/[【】·\s]+/g, '，')
            .replace(/^，|，$/g, '');
        const cleanComment = (res.teacherComment || '')
            .replace(/[^\u4e00-\u9fa50-9，。！？、]/g, '');
        const firstSug = ((res.suggestions && res.suggestions[0]) || '')
            .replace(/^[^\u4e00-\u9fa5]+/g, '')
            .replace(/^(笔顺提示|结构建议|笔画方向|笔画数量)：/g, '');

        let speechText = `得分${res.totalScore}分，${gradeClean}！`;
        if (firstSug && (speechText.length + firstSug.length <= 76)) {
            speechText += firstSug;
        } else if (cleanComment && (speechText.length + cleanComment.length <= 76)) {
            speechText += cleanComment;
        } else if (firstSug) {
            speechText += firstSug.slice(0, Math.max(10, 75 - speechText.length));
        }

        btn.classList.add('speaking');
        const label = btn.querySelector('.eval-speak-text');
        if (label) label.textContent = '正在朗读...';

        if (window.soundManager) {
            window.soundManager.speak(speechText, () => {
                this.resetEvalSpeakButton();
            });
        }
    }

    // 切换名师点评语音朗读 (支持点击朗读与再次点击停止)
    toggleEvalSpeech() {
        const btn = document.getElementById('btn-eval-speak');
        if (!btn || !this.lastEvaluationResult) return;

        if (this._evalSpeechTimer) {
            clearTimeout(this._evalSpeechTimer);
            this._evalSpeechTimer = null;
            this.resetEvalSpeakButton();
            return;
        }

        if (window.soundManager && window.soundManager.isSpeaking && window.soundManager.isSpeaking()) {
            window.soundManager.stopSpeaking();
            this.resetEvalSpeakButton();
            return;
        }

        this.startEvalSpeech();
    }

    // 重置名师点评按钮状态
    resetEvalSpeakButton() {
        const btn = document.getElementById('btn-eval-speak');
        if (!btn) return;
        btn.classList.remove('speaking');
        const label = btn.querySelector('.eval-speak-text');
        if (label) label.textContent = '听点评';
    }

    // ================= 17. Android / 移动端系统返回键层级导航管理 =================
    // 让 Android 侧滑返回手势与物理返回键逐层回到上一级页面（弹窗 ➔ 子页 ➔ 闯关大厅），避免误触直接退出应用
    initBackNavigation() {
        if (this._backNavInitialized || typeof window === 'undefined' || !window.history) return;
        this._backNavInitialized = true;

        this._navSyncQueued = false;
        this._isHandlingPopState = false;
        this._rewindingToIdx = null;
        this._rewindSafetyTimer = null;

        const initState = window.history.state;
        if (initState && initState.__kidNav && typeof initState.idx === 'number' && initState.idx > 0 && initState.sessionId) {
            this._navSessionId = initState.sessionId;
            this._actualHistoryIdx = initState.idx;
            this._rootGuardArmed = true;
        } else {
            this._navSessionId = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
            this._actualHistoryIdx = 0;
            this._rootGuardArmed = false;
            try {
                window.history.replaceState({
                    __kidNav: true,
                    sessionId: this._navSessionId,
                    idx: 0
                }, '');
            } catch (e) {}
        }

        // 在真实用户手势激活 (pointerup / click / keydown) 时挂载根页面防误退守卫条目，
        // 遵循 Chrome Android History Manipulation Intervention 机制以确保系统返回手势可靠派发 popstate
        const armRootGuardOnGesture = (e) => {
            if (e && e.type === 'keydown' && (e.key === 'Escape' || e.key === 'Esc')) return;
            if (!this._rootGuardArmed) {
                this._rootGuardArmed = true;
                this.scheduleNavSync();
            }
        };
        ['pointerup', 'click', 'keydown'].forEach((evtName) => {
            window.addEventListener(evtName, armRootGuardOnGesture, { capture: true, passive: true });
        });

        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver(() => {
                this.scheduleNavSync();
            });
            document.querySelectorAll('.modal-overlay').forEach((modalEl) => {
                observer.observe(modalEl, { attributes: true, attributeFilter: ['class'] });
            });
            const mainContainer = document.getElementById('main-container');
            if (mainContainer) {
                observer.observe(mainContainer, { attributes: true, attributeFilter: ['class'] });
            }
            if (document.body) {
                observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
            }
            this._navMutationObserver = observer;
        }

        window.addEventListener('resize', () => {
            this.scheduleNavSync();
        });

        window.addEventListener('popstate', (event) => {
            const st = event.state;
            const prevIdx = this._actualHistoryIdx;
            if (st && st.__kidNav && st.sessionId === this._navSessionId && typeof st.idx === 'number') {
                this._actualHistoryIdx = st.idx;
            } else {
                this._actualHistoryIdx = 0;
            }

            // 应用内关闭/返回按钮主动触发的 history.go(-delta) 已对齐，不重复执行界面返回
            if (this._rewindingToIdx !== null) {
                if (this._rewindSafetyTimer) {
                    clearTimeout(this._rewindSafetyTimer);
                    this._rewindSafetyTimer = null;
                }
                this._rewindingToIdx = null;
                this.scheduleNavSync();
                return;
            }

            // 若浏览器触发了前进 (Forward)，将历史游标拉回与当前真实界面一致的深度
            if (this._actualHistoryIdx > prevIdx) {
                this.scheduleNavSync();
                return;
            }

            const depthBefore = this.computeNavDepth();
            if (depthBefore > 0) {
                const steps = Math.max(1, prevIdx - this._actualHistoryIdx);
                this._isHandlingPopState = true;
                try {
                    for (let i = 0; i < steps && this.computeNavDepth() > 0; i++) {
                        this.stepBackOneLevel();
                    }
                } finally {
                    this._isHandlingPopState = false;
                }
                if (this._actualHistoryIdx === 0) {
                    this._rootGuardArmed = false;
                }
                this.scheduleNavSync();
                return;
            }

            // 已在最顶层首页（🎮 闯关乐园大厅且无弹窗）：首次返回弹出温馨提示，再按一次即可自然退出
            if (this._actualHistoryIdx === 0) {
                this._rootGuardArmed = false;
            }
            this.showToast('👋 已在首页，再按一次返回即可退出', 2200);
        });

        this.scheduleNavSync();
    }

    getOpenModalStack() {
        const orderedIds = [
            'settings-modal',
            'mobile-device-modal',
            'ipad-guide-modal',
            'sticker-book-modal',
            'gashapon-modal',
            'reward-modal',
            'eval-modal',
            'clear-data-modal'
        ];
        const open = [];
        for (const id of orderedIds) {
            const el = document.getElementById(id);
            if (el && el.classList.contains('visible')) {
                open.push(id);
            }
        }
        document.querySelectorAll('.modal-overlay.visible').forEach((el) => {
            if (el.id && !open.includes(el.id)) {
                open.push(el.id);
            }
        });
        return open;
    }

    computeNavDepth() {
        let depth = 0;
        const ec = this.examCenter;
        const inGame = !!(ec && ec.activeGame);

        if (!ec || ec.activeAppTab === 'exam') {
            if (inGame) depth += 1;
        } else {
            if (inGame) depth += 1;
            depth += 1;

            const mainContainer = document.getElementById('main-container');
            const isMobileCanvasTab = (window.innerWidth <= 600)
                && !!(mainContainer && mainContainer.classList.contains('mobile-tab-canvas'));
            if (isMobileCanvasTab) {
                depth += 1;
            }
            if (this.hanziGuide && this.hanziGuide.isQuizMode) {
                depth += 1;
            }
        }

        const openModals = this.getOpenModalStack();
        if (openModals.length === 0) {
            this._modalOpenedFromSettings = false;
        } else {
            depth += openModals.length;
            if (this._modalOpenedFromSettings && !openModals.includes('settings-modal')) {
                depth += 1;
            }
        }

        return depth;
    }

    scheduleNavSync() {
        if (!this._backNavInitialized || this._navSyncQueued || this._isHandlingPopState) return;
        this._navSyncQueued = true;
        Promise.resolve().then(() => {
            this._navSyncQueued = false;
            this.syncNavigationHistory();
        });
    }

    syncNavigationHistory() {
        if (!this._backNavInitialized || this._isHandlingPopState || !window.history) return;
        if (this._rewindingToIdx !== null) return;

        const depth = this.computeNavDepth();
        const desiredIdx = depth + (this._rootGuardArmed ? 1 : 0);

        if (desiredIdx > this._actualHistoryIdx) {
            while (this._actualHistoryIdx < desiredIdx) {
                this._actualHistoryIdx += 1;
                try {
                    window.history.pushState({
                        __kidNav: true,
                        sessionId: this._navSessionId,
                        idx: this._actualHistoryIdx
                    }, '');
                } catch (e) {
                    break;
                }
            }
        } else if (desiredIdx < this._actualHistoryIdx) {
            const delta = this._actualHistoryIdx - desiredIdx;
            this._rewindingToIdx = desiredIdx;
            if (this._rewindSafetyTimer) clearTimeout(this._rewindSafetyTimer);
            this._rewindSafetyTimer = setTimeout(() => {
                this._rewindingToIdx = null;
                this._rewindSafetyTimer = null;
            }, 180);
            try {
                window.history.go(-delta);
            } catch (e) {
                clearTimeout(this._rewindSafetyTimer);
                this._rewindSafetyTimer = null;
                this._rewindingToIdx = null;
            }
        }
    }

    closeEvalModal() {
        if (this._evalSpeechTimer) {
            clearTimeout(this._evalSpeechTimer);
            this._evalSpeechTimer = null;
        }
        if (window.soundManager && window.soundManager.stopSpeaking) {
            window.soundManager.stopSpeaking();
        }
        this.resetEvalSpeakButton();
        const evalModal = document.getElementById('eval-modal');
        if (evalModal) {
            evalModal.classList.remove('visible');
        }
    }

    exitQuizGuideMode() {
        if (this.hanziGuide && this.hanziGuide.isQuizMode) {
            this.hanziGuide.reset();
        }
        const startQuizBtn = document.getElementById('btn-start-quiz');
        if (startQuizBtn) {
            startQuizBtn.classList.remove('pulse');
        }
        this.setQuizStatus('点击下方“播放笔顺”或“笔顺跟写闯关”开始练习！');
    }

    stepBackOneLevel() {
        document.body.classList.remove('writing-active');

        // 1. 优先关闭最顶层打开的弹窗；若子弹窗从「⚙️ 设置」进入，返回时回到上层「⚙️ 设置」
        const openModals = this.getOpenModalStack();
        if (openModals.length > 0) {
            const topId = openModals[openModals.length - 1];
            const shouldReturnToSettings = this._modalOpenedFromSettings
                && openModals.length === 1
                && topId !== 'settings-modal';

            if (window.soundManager) window.soundManager.playPop();

            if (topId === 'eval-modal') {
                this.closeEvalModal();
            } else if (topId === 'ipad-guide-modal') {
                const el = document.getElementById(topId);
                if (el) el.classList.remove('visible');
                try {
                    localStorage.setItem('kid_app_intro_seen', 'true');
                } catch (e) {}
            } else if (topId === 'mobile-device-modal') {
                const el = document.getElementById(topId);
                if (el) el.classList.remove('visible');
                try {
                    sessionStorage.setItem('kid_app_mobile_prompt_seen', 'true');
                    localStorage.setItem('kid_app_intro_seen', 'true');
                } catch (e) {}
            } else {
                const el = document.getElementById(topId);
                if (el) el.classList.remove('visible');
            }

            if (shouldReturnToSettings) {
                this._modalOpenedFromSettings = false;
                const settingsModal = document.getElementById('settings-modal');
                if (settingsModal) {
                    this.refreshSettingsPanel();
                    settingsModal.classList.add('visible');
                }
            }
            return true;
        }

        // 2. 位于「✍️ 趣味练字」：手机画板子页 ➔ 认字与笔顺 ➔ 退出笔顺跟写 ➔ 回到「🎮 闯关乐园」
        if (this.examCenter && this.examCenter.activeAppTab === 'practice') {
            const mainContainer = document.getElementById('main-container');
            const isMobileCanvasTab = (window.innerWidth <= 600)
                && !!(mainContainer && mainContainer.classList.contains('mobile-tab-canvas'));

            if (isMobileCanvasTab && typeof this.switchMobileTab === 'function') {
                this.switchMobileTab('studio');
                return true;
            }

            if (this.hanziGuide && this.hanziGuide.isQuizMode) {
                if (window.soundManager) window.soundManager.playPop();
                this.exitQuizGuideMode();
                return true;
            }

            if (window.soundManager) window.soundManager.playPop();
            this.examCenter.switchAppTab('exam');
            return true;
        }

        // 3. 位于「🎮 闯关乐园」具体小游戏时：返回闯关乐园游戏大厅
        if (this.examCenter && this.examCenter.activeAppTab === 'exam' && this.examCenter.activeGame) {
            if (window.soundManager && typeof window.soundManager.stopSpeaking === 'function') {
                window.soundManager.stopSpeaking();
            }
            this.examCenter.sfx('playPop');
            this.examCenter.showHub();
            return true;
        }

        return false;
    }
}

// 页面加载完成后启动
window.addEventListener('DOMContentLoaded', () => {
    window.kidApp = new KidWritingApp();
    window.kidApp.init();
});
