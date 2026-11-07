/**
 * quiz-test.js - K班汉字闯关测试中心 (互动测评 + 错题特训 + A4试卷打印)
 * 1:1 还原课堂真题三大题型：
 *   一、看图写汉字 (Look at each picture and write the Chinese character)
 *   二、数笔画，填空 (Count the strokes and fill in the blanks)
 *   三、反义词连线 (Draw a line to match each word with its opposite)
 */

// 标准基础笔画选项库（符号 + 名称，贴合课堂填空习惯）
const STROKE_SHAPE_OPTIONS = [
    { id: 'heng', symbol: '一', name: '横', label: '一 (横)' },
    { id: 'shu', symbol: '丨', name: '竖', label: '丨 (竖)' },
    { id: 'pie', symbol: '丿', name: '撇', label: '丿 (撇)' },
    { id: 'dian_na', symbol: '丶', name: '点/捺', label: '丶 (点/捺)' },
    { id: 'piezhe', symbol: '𠃋', name: '撇折', label: '𠃋 (撇折)' },
    { id: 'hengzhe', symbol: '𠃍', name: '横折', label: '𠃍 (横折)' },
    { id: 'shuzhe', symbol: '∟', name: '竖折', label: '∟ (竖折)' },
    { id: 'shugou', symbol: '亅', name: '竖钩', label: '亅 (竖钩)' }
];

// 汉字闯关测试题库
const CHUNYU_K_EXAM_DATA = {
    title: '汉字闯关测试',
    // 第一大题：看图写汉字 22 题
    picWriteFull: [
        { char: '上', hintWord: '向上、上面', isFocus: true, note: '注意箭头指向上面是“上”，不要写成“下”哦！' },
        { char: '中', hintWord: '中间、中心', isFocus: false },
        { char: '右', hintWord: '右边、右手', isFocus: false },
        { char: '立', hintWord: '立正、站立', isFocus: false },
        { char: '来', hintWord: '过来、来到', isFocus: true, note: '共7画，先写横、点、撇、长横、竖、撇、捺' },
        { char: '山', hintWord: '高山、大山', isFocus: false },
        { char: '去', hintWord: '回去、出去', isFocus: true, note: '上面是“土”，下面第四画是撇折（𠃋）加一点' },
        { char: '禾', hintWord: '禾苗、禾谷', isFocus: true, note: '第一画是平撇（丿），下面是“木”，合起来是禾苗的“禾”！' },
        { char: '水', hintWord: '河水、喝水', isFocus: false },
        { char: '田', hintWord: '水田、田地', isFocus: false },
        { char: '石', hintWord: '石头、岩石', isFocus: false },
        { char: '左', hintWord: '左边、左手', isFocus: false },
        { char: '月', hintWord: '月亮、月儿', isFocus: false },
        { char: '坐', hintWord: '坐下、请坐', isFocus: true, note: '两个小人坐在土上，共7画，第六画是中间的竖（丨）' },
        { char: '日', hintWord: '红日、太阳', isFocus: false },
        { char: '人', altChars: ['入'], hintWord: '大人、人们（或入口）', isFocus: true, note: '撇高捺低是“人”，撇低捺高是“入”' },
        { char: '土', hintWord: '泥土、土地', isFocus: false },
        { char: '下', hintWord: '向下、下面', isFocus: true, note: '横在最上面、箭头往下指是“下”' },
        { char: '出', hintWord: '出去、出来', isFocus: true, note: '共5画：竖折、竖、长竖、竖折、竖' },
        { char: '火', hintWord: '火苗、大火', isFocus: false },
        { char: '走', hintWord: '走路、行走', isFocus: false },
        { char: '木', hintWord: '树木、木头', isFocus: false }
    ],
    // 第二大题：数笔画，填空（前 3 题为试卷原题，后 3 题为配套巩固）
    strokeQuestions: [
        {
            char: '来',
            pinyin: 'lái',
            totalStrokes: 7,
            askIndex: 4, // 1-based: 第四画
            askIndexCn: '四',
            answerId: 'heng',
            answerSymbol: '一',
            answerName: '横',
            strokeBreakdown: ['一 (横)', '丶 (点)', '丿 (撇)', '一 (横)', '丨 (竖)', '丿 (撇)', '丶 (捺)'],
            tip: '“来”字一共有 7 画：1横、2点、3撇、4长横、5竖、6撇、7捺，所以第四画是“一 (横)”！',
            isPaperOriginal: true
        },
        {
            char: '坐',
            pinyin: 'zuò',
            totalStrokes: 7,
            askIndex: 6, // 1-based: 第六画
            askIndexCn: '六',
            answerId: 'shu',
            answerSymbol: '丨',
            answerName: '竖',
            strokeBreakdown: ['丿 (撇)', '丶 (点)', '丿 (撇)', '丶 (点)', '一 (横)', '丨 (竖)', '一 (横)'],
            tip: '“坐”字先写左边小人（1撇2点），再写右边小人（3撇4点），接着写下面“土”的5短横、6竖、7长横，第六画是“丨 (竖)”！',
            isPaperOriginal: true
        },
        {
            char: '去',
            pinyin: 'qù',
            totalStrokes: 5,
            askIndex: 4, // 1-based: 第四画
            askIndexCn: '四',
            answerId: 'piezhe',
            answerSymbol: '𠃋',
            answerName: '撇折',
            strokeBreakdown: ['一 (横)', '丨 (竖)', '一 (横)', '𠃋 (撇折)', '丶 (点)'],
            tip: '“去”字上面是“土”（1横、2竖、3长横），第四画是一笔写成的“𠃋 (撇折)”，第五画是“丶 (点)”，一共 5 画！',
            isPaperOriginal: true
        },
        {
            char: '禾',
            pinyin: 'hé',
            totalStrokes: 5,
            askIndex: 1,
            askIndexCn: '一',
            answerId: 'pie',
            answerSymbol: '丿',
            answerName: '撇',
            strokeBreakdown: ['丿 (平撇)', '一 (横)', '丨 (竖)', '丿 (撇)', '丶 (捺)'],
            tip: '“禾”字比“木”字头上多了一笔平撇！1撇、2横、3竖、4撇、5捺，一共 5 画，第一画是“丿 (撇)”！',
            isPaperOriginal: false
        },
        {
            char: '上',
            pinyin: 'shàng',
            totalStrokes: 3,
            askIndex: 1,
            askIndexCn: '一',
            answerId: 'shu',
            answerSymbol: '丨',
            answerName: '竖',
            strokeBreakdown: ['丨 (竖)', '一 (短横)', '一 (长横)'],
            tip: '“上”字一共有 3 画：1竖、2短横、3底部长横，第一画是“丨 (竖)”！',
            isPaperOriginal: false
        },
        {
            char: '出',
            pinyin: 'chū',
            totalStrokes: 5,
            askIndex: 1,
            askIndexCn: '一',
            answerId: 'shuzhe',
            answerSymbol: '∟',
            answerName: '竖折',
            strokeBreakdown: ['∟ (竖折)', '丨 (竖)', '丨 (长竖)', '∟ (竖折)', '丨 (竖)'],
            tip: '“出”字一共有 5 画：1竖折、2短竖、3中间长竖、4竖折、5短竖，第一画是“∟ (竖折)”！',
            isPaperOriginal: false
        }
    ],
    // 第三大题：反义词连线（与试卷左右两列完全一致）
    antonymPairs: [
        { left: '多', right: '少', desc: '“多”的反义词是“少”（多少）' },
        { left: '出', right: '入', desc: '“出”的反义词是“入”（出入）' },
        { left: '右', right: '左', desc: '“右”的反义词是“左”（左右）' },
        { left: '小', right: '大', desc: '“小”的反义词是“大”（大小）' },
        { left: '去', right: '来', desc: '“去”的反义词是“来”（来去）' },
        { left: '下', right: '上', desc: '“下”的反义词是“上”（上下）' }
    ],
    rightColumnOrder: ['来', '大', '上', '入', '少', '左']
};

// 扩展随机题库（供“🎲 随机闯关卷”抽题）
const EXTRA_STROKE_QUESTION_POOL = [
    ...CHUNYU_K_EXAM_DATA.strokeQuestions,
    {
        char: '下',
        pinyin: 'xià',
        totalStrokes: 3,
        askIndex: 3,
        askIndexCn: '三',
        answerId: 'dian_na',
        answerSymbol: '丶',
        answerName: '点/捺',
        strokeBreakdown: ['一 (横)', '丨 (竖)', '丶 (点)'],
        tip: '“下”字一共有 3 画：1长横、2竖、3点，第三画是“丶 (点)”！'
    },
    {
        char: '山',
        pinyin: 'shān',
        totalStrokes: 3,
        askIndex: 2,
        askIndexCn: '二',
        answerId: 'shuzhe',
        answerSymbol: '∟',
        answerName: '竖折',
        strokeBreakdown: ['丨 (竖)', '∟ (竖折)', '丨 (竖)'],
        tip: '“山”字先写中间的 1竖，再写左边的 2竖折（∟），最后写右边的 3竖，共 3 画！'
    },
    {
        char: '水',
        pinyin: 'shuǐ',
        totalStrokes: 4,
        askIndex: 1,
        askIndexCn: '一',
        answerId: 'shugou',
        answerSymbol: '亅',
        answerName: '竖钩',
        strokeBreakdown: ['亅 (竖钩)', '𠃍 (横撇)', '丿 (撇)', '丶 (捺)'],
        tip: '“水”字共 4 画：先写中间的 1竖钩（亅），再写左边的 2横撇，接着是右边的 3撇、4捺！'
    },
    {
        char: '火',
        pinyin: 'huǒ',
        totalStrokes: 4,
        askIndex: 3,
        askIndexCn: '三',
        answerId: 'pie',
        answerSymbol: '丿',
        answerName: '撇',
        strokeBreakdown: ['丶 (点)', '丿 (小撇)', '丿 (长撇)', '丶 (捺)'],
        tip: '“火”字共 4 画：1左点、2右上小撇、3中间长撇、4捺，第三画是“丿 (撇)”！'
    },
    {
        char: '木',
        pinyin: 'mù',
        totalStrokes: 4,
        askIndex: 2,
        askIndexCn: '二',
        answerId: 'shu',
        answerSymbol: '丨',
        answerName: '竖',
        strokeBreakdown: ['一 (横)', '丨 (竖)', '丿 (撇)', '丶 (捺)'],
        tip: '“木”字共 4 画：1横、2竖、3撇、4捺，第二画是“丨 (竖)”！'
    },
    {
        char: '田',
        pinyin: 'tián',
        totalStrokes: 5,
        askIndex: 2,
        askIndexCn: '二',
        answerId: 'hengzhe',
        answerSymbol: '𠃍',
        answerName: '横折',
        strokeBreakdown: ['丨 (竖)', '𠃍 (横折)', '一 (横)', '丨 (竖)', '一 (横)'],
        tip: '“田”字共 5 画：1左竖、2横折（𠃍）、3中间横、4中间竖、5封口横！'
    },
    {
        char: '土',
        pinyin: 'tǔ',
        totalStrokes: 3,
        askIndex: 2,
        askIndexCn: '二',
        answerId: 'shu',
        answerSymbol: '丨',
        answerName: '竖',
        strokeBreakdown: ['一 (短横)', '丨 (竖)', '一 (长横)'],
        tip: '“土”字共 3 画：1短横、2竖、3长横，第二画是“丨 (竖)”！'
    },
    {
        char: '石',
        pinyin: 'shí',
        totalStrokes: 5,
        askIndex: 2,
        askIndexCn: '二',
        answerId: 'pie',
        answerSymbol: '丿',
        answerName: '撇',
        strokeBreakdown: ['一 (横)', '丿 (撇)', '丨 (竖)', '𠃍 (横折)', '一 (横)'],
        tip: '“石”字共 5 画：1横、2撇、3竖、4横折、5横，第二画是“丿 (撇)”！'
    }
];

const EXTRA_ANTONYM_POOL = [
    ...CHUNYU_K_EXAM_DATA.antonymPairs,
    { left: '开', right: '关', desc: '“开”的反义词是“关”（开关）' },
    { left: '高', right: '低', desc: '“高”的反义词是“低”（高低）' },
    { left: '前', right: '后', desc: '“前”的反义词是“后”（前后）' },
    { left: '里', right: '外', desc: '“里”的反义词是“外”（里外）' },
    { left: '远', right: '近', desc: '“远”的反义词是“近”（远近）' },
    { left: '水', right: '火', desc: '“水”和“火”是一对反义词（水火）' }
];

class ExamCenter {
    constructor(app) {
        this.app = app;
        this.activeAppTab = 'practice'; // 'practice' (趣味练字) | 'exam' (闯关测试)
        this.activeSection = 'sec1';    // 'sec1' | 'sec2' | 'sec3'

        this.picQuestions = [];
        this.currentPicIdx = 0;

        this.strokeQuestions = [];
        this.currentStrokeIdx = 0;
        this.strokeAnimTimer = null;
        this.highlightedStrokeIdx = -1; // 0-based

        this.antonymPairs = [];
        this.rightColChars = [];
        this.selectedLeftChar = null;
        this.selectedRightChar = null;
        this.matchedPairs = {}; // leftChar -> rightChar

        this.examCanvas = null;
        this._isInitialized = false;
    }

    initIfNeeded() {
        if (this._isInitialized) return;
        this._isInitialized = true;

        // 初始化看图写字专属米字格画板
        this.examCanvas = new HandwritingCanvas('examGridCanvas', 'examDrawCanvas', 'exam-canvas-box');
        this.examCanvas.setTraceSettings(false); // 默写模式默认隐藏红底字

        // 同步主画板防误触设置
        if (this.app && this.app.canvasEngine) {
            this.examCanvas.setPalmRejection(this.app.canvasEngine.palmRejection);
        }

        this.bindEvents();
        this.loadPaper(false);
    }

    // 切换主界面 Tab：'practice' (✍️ 趣味练字) vs 'exam' (📝 闯关测试)
    switchAppTab(tabName = 'practice') {
        this.initIfNeeded();
        this.activeAppTab = tabName;

        const practiceTabBtn = document.getElementById('primary-tab-practice');
        const examTabBtn = document.getElementById('primary-tab-exam');
        const examContainer = document.getElementById('exam-view-container');

        if (practiceTabBtn) practiceTabBtn.classList.toggle('active', tabName === 'practice');
        if (examTabBtn) examTabBtn.classList.toggle('active', tabName === 'exam');

        if (tabName === 'exam') {
            document.body.classList.add('app-mode-exam');
            if (examContainer) examContainer.style.display = 'flex';
            setTimeout(() => {
                if (this.examCanvas) {
                    this.examCanvas.resize(true);
                }
                this.renderAntonymLines();
            }, 60);
        } else {
            this.stopStrokeStepAnimation();
            document.body.classList.remove('app-mode-exam');
            if (examContainer) examContainer.style.display = 'none';
            setTimeout(() => {
                if (this.app && this.app.canvasEngine) {
                    this.app.canvasEngine.resize(true);
                }
                if (this.app && this.app.hanziGuide && typeof this.app.hanziGuide.resize === 'function') {
                    this.app.hanziGuide.resize();
                }
            }, 60);
        }
    }

    open() {
        this.switchAppTab('exam');
    }

    close() {
        this.switchAppTab('practice');
    }

    // 加载或刷新测试题库
    loadPaper(shuffle = false) {
        this.stopStrokeStepAnimation();

        if (!shuffle) {
            // 默认首套精选测试题（包含看图写字8题、数笔画5题、反义词连线6组）
            const rawList = CHUNYU_K_EXAM_DATA.picWriteFull.filter(q => q.isFocus);
            this.picQuestions = rawList.map(item => this.buildPicQuestion(item));
            this.strokeQuestions = CHUNYU_K_EXAM_DATA.strokeQuestions.slice(0, 5).map(q => ({
                ...q,
                userTotal: null,
                userStrokeId: null,
                checked: false,
                isCorrect: false
            }));
            this.antonymPairs = CHUNYU_K_EXAM_DATA.antonymPairs.map(p => ({ ...p }));
            this.rightColChars = [...CHUNYU_K_EXAM_DATA.rightColumnOrder];
        } else {
            // 换一套题：从全题库随机抽取 8 道看图写字、5 道数笔画、6 组反义词
            const pool = this.shuffleArray([...CHUNYU_K_EXAM_DATA.picWriteFull]).slice(0, 8);
            this.picQuestions = pool.map(item => this.buildPicQuestion(item));

            const stkPool = this.shuffleArray([...EXTRA_STROKE_QUESTION_POOL]).slice(0, 5);
            this.strokeQuestions = stkPool.map(q => ({
                ...q,
                userTotal: null,
                userStrokeId: null,
                checked: false,
                isCorrect: false
            }));

            const antPool = this.shuffleArray([...EXTRA_ANTONYM_POOL]).slice(0, 6);
            this.antonymPairs = antPool.map(p => ({ ...p }));
            this.rightColChars = this.shuffleArray(this.antonymPairs.map(p => p.right));
        }

        this.currentPicIdx = 0;
        this.currentStrokeIdx = 0;
        this.selectedLeftChar = null;
        this.selectedRightChar = null;
        this.matchedPairs = {};

        this.renderCurrentPicQuestion();
        this.renderCurrentStrokeQuestion();
        this.renderAntonymSection();
        this.updateOverallProgress();
    }

    buildPicQuestion(item) {
        const info = (typeof getCharInfo === 'function') ? getCharInfo(item.char) : null;
        const illUrl = (info && info.image) || (window.CHARACTER_ILLUSTRATION_MAP && window.CHARACTER_ILLUSTRATION_MAP[item.char]) || '';
        return {
            char: item.char,
            altChars: item.altChars || [],
            pinyin: (info && info.pinyin) || '',
            en: (info && info.en) || '',
            strokes: (info && info.strokes) || (window.STROKE_DATA_CACHE && window.STROKE_DATA_CACHE[item.char] ? window.STROKE_DATA_CACHE[item.char].strokes.length : 1),
            hintWord: item.hintWord || ((info && info.words && info.words.slice(0, 2).join('、')) || item.char),
            note: item.note || '',
            isFocus: !!item.isFocus,
            image: illUrl,
            status: 'pending', // 'pending' | 'correct' | 'wrong'
            score: 0,
            traceHintUsed: false
        };
    }

    shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    switchSection(secId) {
        this.activeSection = secId;
        this.stopStrokeStepAnimation();

        document.querySelectorAll('.exam-sec-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.sec === secId);
        });
        document.querySelectorAll('.exam-sec-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `exam-panel-${secId}`);
        });

        if (secId === 'sec1' && this.examCanvas) {
            setTimeout(() => this.examCanvas.resize(true), 60);
        } else if (secId === 'sec3') {
            setTimeout(() => this.renderAntonymLines(), 60);
        }
    }

    // ==================== 第一关：看图写汉字 ====================
    renderPicNavStrip() {
        const strip = document.getElementById('exam-pic-nav-strip');
        if (!strip) return;
        strip.innerHTML = '';

        this.picQuestions.forEach((q, idx) => {
            const pill = document.createElement('button');
            pill.type = 'button';
            let statusCls = '';
            let badgeText = `${idx + 1}`;
            if (q.status === 'correct') {
                statusCls = 'is-correct';
                badgeText = `${idx + 1} ✓`;
            } else if (q.status === 'wrong') {
                statusCls = 'is-wrong';
                badgeText = `${idx + 1} ✗`;
            }
            pill.className = `exam-q-pill ${idx === this.currentPicIdx ? 'active' : ''} ${statusCls} ${q.isFocus ? 'is-focus' : ''}`;
            pill.textContent = badgeText;
            pill.title = q.status === 'correct' ? `第 ${idx + 1} 题（已答对：${q.char}）` : `第 ${idx + 1} 题`;
            pill.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this.currentPicIdx = idx;
                this.renderCurrentPicQuestion();
            });
            strip.appendChild(pill);
        });
    }

    renderCurrentPicQuestion() {
        this.renderPicNavStrip();
        const q = this.picQuestions[this.currentPicIdx];
        if (!q) return;

        const indexLabel = document.getElementById('exam-pic-index-label');
        if (indexLabel) {
            indexLabel.innerHTML = `第 <strong>${this.currentPicIdx + 1}</strong> / ${this.picQuestions.length} 题`;
        }

        const imgEl = document.getElementById('exam-pic-img');
        if (imgEl) {
            imgEl.src = q.image;
            imgEl.alt = '看图写汉字题目插画';
        }

        const stampEl = document.getElementById('exam-pic-grade-stamp');
        if (stampEl) {
            if (q.status === 'correct') {
                stampEl.className = 'exam-grade-stamp correct visible';
                stampEl.textContent = '✓';
            } else if (q.status === 'wrong') {
                stampEl.className = 'exam-grade-stamp wrong visible';
                stampEl.textContent = '✗';
            } else {
                stampEl.className = 'exam-grade-stamp';
                stampEl.textContent = '';
            }
        }

        // 重置答案揭晓区与描红状态
        const feedbackBox = document.getElementById('exam-pic-feedback');
        if (feedbackBox) {
            if (q.status === 'correct') {
                feedbackBox.className = 'exam-pic-feedback is-correct';
                feedbackBox.innerHTML = `
                    <div class="exam-fb-header">
                        <span class="exam-fb-char">${q.char}</span>
                        <div class="exam-fb-meta">
                            <strong>🎉 默写正确！(${q.pinyin} · ${q.strokes}画)</strong>
                            <span>组词：${q.hintWord} ${q.note ? '｜' + q.note : ''}</span>
                        </div>
                    </div>
                `;
            } else {
                feedbackBox.className = 'exam-pic-feedback';
                feedbackBox.innerHTML = `
                    <div class="exam-fb-placeholder">
                        👀 仔细看上面的图画，在右侧米字格里<strong>凭记忆写出对应的汉字</strong>，写完点【✅ 提交批改】！
                        ${q.note ? `<div class="exam-fb-note">💡 温馨提示：${q.note}</div>` : ''}
                    </div>
                `;
            }
        }

        // 设置画板目标字模（默认关闭描红，真正考察默写）
        if (this.examCanvas) {
            const cachedData = window.STROKE_DATA_CACHE ? window.STROKE_DATA_CACHE[q.char] : null;
            this.examCanvas.setCharacter(q.char, cachedData);
            this.examCanvas.setTraceSettings(false);
            this.examCanvas.clear(false);
        }
        const traceBtn = document.getElementById('btn-exam-toggle-trace');
        if (traceBtn) {
            traceBtn.classList.remove('active');
            traceBtn.innerHTML = '💡 描红提示';
        }
    }

    speakCurrentPicHint() {
        const q = this.picQuestions[this.currentPicIdx];
        if (!q || !window.soundManager) return;
        window.soundManager.playPop();
        window.soundManager.speak(`请写出：${q.char}，${q.hintWord.split('、')[0]}的${q.char}`);
    }

    toggleExamTraceHint() {
        const q = this.picQuestions[this.currentPicIdx];
        if (!q || !this.examCanvas) return;
        if (window.soundManager) window.soundManager.playPop();

        const nextState = !this.examCanvas.showTrace;
        this.examCanvas.setTraceSettings(nextState);
        if (nextState) {
            q.traceHintUsed = true;
        }
        const traceBtn = document.getElementById('btn-exam-toggle-trace');
        if (traceBtn) {
            traceBtn.classList.toggle('active', nextState);
            traceBtn.innerHTML = nextState ? '🙈 隐藏描红' : '💡 描红提示';
        }
    }

    submitCurrentPicWriting() {
        const q = this.picQuestions[this.currentPicIdx];
        if (!q || !this.examCanvas) return;

        if (!this.examCanvas.hasDrawing()) {
            if (window.soundManager) window.soundManager.playPop();
            if (this.app) this.app.showToast('✏️ 请先在右侧米字格里写出汉字，再点击提交批改哦！');
            return;
        }

        // 支持一图多解（如试卷第16题“人/入”均可得分）+ 归一化骨架自由默写识别
        const candidateChars = [q.char, ...(q.altChars || [])];
        const recResult = window.chineseWritingEvaluator.recognizeAndEvaluateFreehand(
            this.examCanvas.drawCanvas,
            candidateChars,
            this.examCanvas.strokeList,
            this.examCanvas.cssSize
        );

        if (!recResult || !recResult.valid) {
            if (this.app) this.app.showToast(recResult ? recResult.message : '请多写几笔再提交批改哦！');
            return;
        }

        const isPass = recResult.isPass;
        const matchedChar = recResult.matchedChar;
        const expectedStrokes = recResult.expectedStrokes;
        const userStrokes = recResult.userStrokes;

        const stampEl = document.getElementById('exam-pic-grade-stamp');
        const feedbackBox = document.getElementById('exam-pic-feedback');

        if (isPass) {
            const wasAlreadyCorrect = (q.status === 'correct');
            q.status = 'correct';
            q.score = recResult.totalScore;

            if (stampEl) {
                stampEl.className = 'exam-grade-stamp correct visible pop-in';
                stampEl.textContent = '✓';
            }

            const strokeTip = recResult.strokeDiff !== 0
                ? `（注意标准为 ${expectedStrokes} 画，折笔一笔写成更规范哦）`
                : `· 共 ${expectedStrokes} 画`;

            if (feedbackBox) {
                feedbackBox.className = 'exam-pic-feedback is-correct';
                feedbackBox.innerHTML = `
                    <div class="exam-fb-header">
                        <span class="exam-fb-char">${matchedChar}</span>
                        <div class="exam-fb-meta">
                            <strong>🎉 太棒啦！默写正确 (${recResult.totalScore}分 · +3 ⭐)</strong>
                            <span>【${matchedChar}】(${q.pinyin}) ${strokeTip} · 组词：${q.hintWord}</span>
                        </div>
                        <button type="button" class="btn-exam-inline-next" id="btn-exam-fb-next">下一题 ➔</button>
                    </div>
                `;
                const nextBtn = document.getElementById('btn-exam-fb-next');
                if (nextBtn) {
                    nextBtn.addEventListener('click', () => this.nextPicQuestion());
                }
            }

            if (!wasAlreadyCorrect && this.app) {
                this.app.addStars(3, '看图默写闯关');
                this.app.markCharCompleted(matchedChar);
            }
            if (window.soundManager) {
                window.soundManager.playVictory();
                window.soundManager.speak(`答对啦！这是“${matchedChar}”字，写得真棒！`);
            }
        } else {
            q.status = 'wrong';
            q.score = recResult.totalScore;

            if (stampEl) {
                stampEl.className = 'exam-grade-stamp wrong visible pop-in';
                stampEl.textContent = '✗';
            }

            let reasonHint = `正确答案是【${q.char}】（共 ${expectedStrokes} 画，你写了 ${userStrokes} 画）。`;
            if (recResult.confusedWithChar) {
                reasonHint = `系统识别你写的更像【${recResult.confusedWithChar}】字哦！本题图片是【${q.char}】（共 ${expectedStrokes} 画）。`;
            } else if (!recResult.strokeCountAcceptable) {
                reasonHint = `笔画数不对哦：【${q.char}】一共有 ${expectedStrokes} 画，你写了 ${userStrokes} 画。`;
            } else {
                reasonHint = `字形结构与【${q.char}】还有差距（共 ${expectedStrokes} 画，可点下方“描红订正”跟着写一遍）！`;
            }

            if (feedbackBox) {
                feedbackBox.className = 'exam-pic-feedback is-wrong';
                feedbackBox.innerHTML = `
                    <div class="exam-fb-header">
                        <span class="exam-fb-char wrong">${q.char}</span>
                        <div class="exam-fb-meta">
                            <strong>🤔 没关系，我们来看看正确答案：【${q.char}】(${q.pinyin} · ${expectedStrokes}画)</strong>
                            <span>${reasonHint} ${q.note ? '｜' + q.note : ''}</span>
                        </div>
                        <button type="button" class="btn-exam-inline-trace" id="btn-exam-fb-trace">✍️ 描红订正一遍</button>
                    </div>
                `;
                const traceCorrectBtn = document.getElementById('btn-exam-fb-trace');
                if (traceCorrectBtn) {
                    traceCorrectBtn.addEventListener('click', () => {
                        if (this.examCanvas) {
                            this.examCanvas.clear(false);
                            this.examCanvas.setTraceSettings(true);
                        }
                        const traceBtn = document.getElementById('btn-exam-toggle-trace');
                        if (traceBtn) {
                            traceBtn.classList.add('active');
                            traceBtn.innerHTML = '🙈 隐藏描红';
                        }
                        if (window.soundManager) {
                            window.soundManager.playPop();
                            window.soundManager.speak(`来，跟着红色底样把“${q.char}”字端正地描一遍吧！`);
                        }
                    });
                }
            }

            if (window.soundManager) {
                window.soundManager.playPop();
                window.soundManager.speak(`这个图是“${q.char}”字，一共${expectedStrokes}画，点描红订正写一遍吧！`);
            }
        }

        this.renderPicNavStrip();
        this.updateOverallProgress();
    }

    prevPicQuestion() {
        if (window.soundManager) window.soundManager.playPop();
        if (this.currentPicIdx > 0) {
            this.currentPicIdx--;
            this.renderCurrentPicQuestion();
        }
    }

    nextPicQuestion() {
        if (window.soundManager) window.soundManager.playPop();
        if (this.currentPicIdx < this.picQuestions.length - 1) {
            this.currentPicIdx++;
            this.renderCurrentPicQuestion();
        } else {
            // 第一大题最后一题完成后引导进入第二大题
            if (this.app) {
                this.app.showToast('🎉 第一关【看图写汉字】已到最后一题，快去挑战第二关【数笔画，填空】吧！');
            }
            this.switchSection('sec2');
        }
    }

    // ==================== 第二关：数笔画，填空 ====================
    renderStrokeNavStrip() {
        const strip = document.getElementById('exam-stroke-nav-strip');
        if (!strip) return;
        strip.innerHTML = '';

        this.strokeQuestions.forEach((q, idx) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            let cls = '';
            let txt = `(${idx + 1}) “${q.char}”`;
            if (q.checked && q.isCorrect) {
                cls = 'is-correct';
                txt += ' ✓';
            } else if (q.checked && !q.isCorrect) {
                cls = 'is-wrong';
                txt += ' ✗';
            }
            btn.className = `exam-q-pill ${idx === this.currentStrokeIdx ? 'active' : ''} ${cls}`;
            btn.textContent = txt;
            btn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this.currentStrokeIdx = idx;
                this.renderCurrentStrokeQuestion();
            });
            strip.appendChild(btn);
        });
    }

    renderCurrentStrokeQuestion() {
        this.stopStrokeStepAnimation();
        this.renderStrokeNavStrip();

        const q = this.strokeQuestions[this.currentStrokeIdx];
        if (!q) return;

        // 默认不提前剧透高亮目标笔画；若已提交则直接高亮第 k 画
        this.highlightedStrokeIdx = q.checked ? (q.askIndex - 1) : -1;
        this.renderStrokeCharSVG(q.char, this.highlightedStrokeIdx, q.checked ? q.totalStrokes : 0);

        // 渲染填空句子：“来” 一共有 [ ? ] 画，第 四 画是 [ ? ]。
        const sentenceEl = document.getElementById('exam-stroke-sentence');
        if (sentenceEl) {
            const selectedStrokeObj = STROKE_SHAPE_OPTIONS.find(o => o.id === q.userStrokeId);
            const blank1Text = q.userTotal !== null ? `${q.userTotal}` : '？';
            const blank2Text = selectedStrokeObj ? `${selectedStrokeObj.symbol} (${selectedStrokeObj.name})` : '请选择笔画';

            let b1Class = q.userTotal !== null ? 'filled' : '';
            let b2Class = selectedStrokeObj ? 'filled' : '';
            if (q.checked) {
                b1Class = (q.userTotal === q.totalStrokes) ? 'correct' : 'wrong';
                b2Class = (q.userStrokeId === q.answerId) ? 'correct' : 'wrong';
            }

            sentenceEl.innerHTML = `
                <span class="stk-q-num">（${this.currentStrokeIdx + 1}）</span>
                <span class="stk-q-char">“${q.char}”</span>
                <span>一共有</span>
                <span class="stk-blank-pill ${b1Class}" id="stk-blank-total">${blank1Text}</span>
                <span>画，第<strong>${q.askIndexCn}</strong>画是</span>
                <span class="stk-blank-pill wide ${b2Class}" id="stk-blank-shape">${blank2Text}</span>
                <span>。</span>
            `;
        }

        // 渲染第一空：数字键盘 (1 ~ 10)
        const numPad = document.getElementById('exam-stroke-numpad');
        if (numPad) {
            numPad.innerHTML = '';
            for (let n = 1; n <= 10; n++) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `stk-num-btn ${q.userTotal === n ? 'active' : ''}`;
                btn.textContent = `${n}画`;
                btn.addEventListener('click', () => {
                    if (window.soundManager) window.soundManager.playPop();
                    q.userTotal = n;
                    q.checked = false;
                    this.renderCurrentStrokeQuestion();
                    if (q.userStrokeId !== null) {
                        this.checkCurrentStrokeAnswer();
                    }
                });
                numPad.appendChild(btn);
            }
        }

        // 渲染第二空：笔画形状按钮
        const shapePad = document.getElementById('exam-stroke-shapepad');
        if (shapePad) {
            shapePad.innerHTML = '';
            STROKE_SHAPE_OPTIONS.forEach(opt => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `stk-shape-btn ${q.userStrokeId === opt.id ? 'active' : ''}`;
                btn.innerHTML = `
                    <span class="stk-shape-sym">${opt.symbol}</span>
                    <span class="stk-shape-name">${opt.name}</span>
                `;
                btn.addEventListener('click', () => {
                    if (window.soundManager) window.soundManager.playPop();
                    q.userStrokeId = opt.id;
                    q.checked = false;
                    this.renderCurrentStrokeQuestion();
                    if (q.userTotal !== null) {
                        this.checkCurrentStrokeAnswer();
                    }
                });
                shapePad.appendChild(btn);
            });
        }

        // 渲染笔顺拆解小卡片与答题反馈
        this.renderStrokeBreakdownBar(q);
    }

    renderStrokeCharSVG(char, highlightIdx = -1, showNumbersUpTo = 0) {
        const box = document.getElementById('exam-stroke-svg-box');
        if (!box) return;
        const data = window.STROKE_DATA_CACHE ? window.STROKE_DATA_CACHE[char] : null;
        if (!data || !data.strokes) {
            box.innerHTML = `<div class="stk-svg-fallback">${char}</div>`;
            return;
        }

        let pathsHtml = '';
        data.strokes.forEach((d, idx) => {
            const isTarget = (idx === highlightIdx);
            const fill = isTarget ? '#ef4444' : '#334155';
            pathsHtml += `<path d="${d}" fill="${fill}" class="${isTarget ? 'stk-path-highlight' : ''}"></path>`;
        });

        // 在笔画起点标注序号 1, 2, 3...
        let labelsHtml = '';
        if (showNumbersUpTo > 0 && data.medians) {
            const limit = Math.min(showNumbersUpTo, data.medians.length);
            for (let i = 0; i < limit; i++) {
                const med = data.medians[i];
                if (med && med.length > 0) {
                    const [mx, my] = med[0];
                    // 转换 HanziWriter 坐标 (x, 900 - y) 到 SVG 视口
                    const sx = mx;
                    const sy = 900 - my;
                    const isTarget = (i === highlightIdx);
                    labelsHtml += `
                        <g transform="translate(${sx}, ${sy})">
                            <circle r="${isTarget ? 54 : 42}" fill="${isTarget ? '#ef4444' : '#0984e3'}" stroke="#ffffff" stroke-width="10"/>
                            <text text-anchor="middle" dominant-baseline="central" fill="#ffffff" font-size="${isTarget ? 58 : 46}" font-weight="900">${i + 1}</text>
                        </g>
                    `;
                }
            }
        }

        box.innerHTML = `
            <svg viewBox="0 0 1024 1024" class="exam-stroke-svg">
                <!-- 米字格辅助线 -->
                <line x1="0" y1="512" x2="1024" y2="512" stroke="#fca5a5" stroke-width="6" stroke-dasharray="18,14"/>
                <line x1="512" y1="0" x2="512" y2="1024" stroke="#fca5a5" stroke-width="6" stroke-dasharray="18,14"/>
                <line x1="0" y1="0" x2="1024" y2="1024" stroke="#fed7aa" stroke-width="4" stroke-dasharray="18,18"/>
                <line x1="1024" y1="0" x2="0" y2="1024" stroke="#fed7aa" stroke-width="4" stroke-dasharray="18,18"/>
                <g transform="scale(1, -1) translate(0, -900)">
                    ${pathsHtml}
                </g>
                ${labelsHtml}
            </svg>
        `;
    }

    renderStrokeBreakdownBar(q, activeStepCount = 0) {
        const bar = document.getElementById('exam-stroke-breakdown');
        if (!bar || !q) return;

        // 当用户已作答或正在播放“一笔一笔数”时展示拆解卡片
        const showCards = q.checked || activeStepCount > 0;
        if (!showCards) {
            bar.innerHTML = `
                <div class="stk-breakdown-hint">
                    👆 请先在下方选择 <strong>一共有几画</strong> 和 <strong>第${q.askIndexCn}画是什么笔画</strong>（不确定可以点左侧【🔢 一笔一笔数】哦！）
                </div>
            `;
            return;
        }

        const visibleCount = activeStepCount > 0 ? activeStepCount : q.strokeBreakdown.length;
        const chips = q.strokeBreakdown.slice(0, visibleCount).map((name, idx) => {
            const isAsk = (idx + 1 === q.askIndex);
            return `
                <span class="stk-step-chip ${isAsk ? 'is-target' : ''}">
                    <strong>第${idx + 1}画</strong> ${name}
                </span>
            `;
        }).join('');

        let resultBanner = '';
        if (q.checked) {
            if (q.isCorrect) {
                resultBanner = `<div class="stk-result-msg ok">🎉 答对啦 (+4 ⭐)！${q.tip}</div>`;
            } else {
                resultBanner = `<div class="stk-result-msg err">💡 正确答案：一共有 <strong>${q.totalStrokes}</strong> 画，第${q.askIndexCn}画是 <strong>${q.answerSymbol} (${q.answerName})</strong>。${q.tip}</div>`;
            }
        }

        bar.innerHTML = `
            <div class="stk-chips-row">${chips}</div>
            ${resultBanner}
        `;
    }

    // 互动动画：一笔一笔数给孩子看（高亮第 1, 2, ... N 画并最终停在题目问的第 k 画）
    playStrokeStepCounter() {
        const q = this.strokeQuestions[this.currentStrokeIdx];
        if (!q) return;
        this.stopStrokeStepAnimation();
        if (window.soundManager) window.soundManager.playPop();

        let step = 0;
        const total = q.totalStrokes;

        const runStep = () => {
            if (step < total) {
                const strokeIdx = step;
                step++;
                this.renderStrokeCharSVG(q.char, strokeIdx, step);
                this.renderStrokeBreakdownBar(q, step);
                if (window.soundManager) {
                    window.soundManager.playPop();
                }
                this.strokeAnimTimer = setTimeout(runStep, 680);
            } else {
                // 动画结束，聚焦高亮题目所问的第 askIndex 画
                this.renderStrokeCharSVG(q.char, q.askIndex - 1, total);
                this.renderStrokeBreakdownBar(q, total);
                if (window.soundManager) {
                    window.soundManager.speak(`“${q.char}”字一共有${q.totalStrokes}画，第${q.askIndexCn}画是${q.answerName}！`);
                }
            }
        };

        runStep();
    }

    stopStrokeStepAnimation() {
        if (this.strokeAnimTimer) {
            clearTimeout(this.strokeAnimTimer);
            this.strokeAnimTimer = null;
        }
    }

    checkCurrentStrokeAnswer() {
        const q = this.strokeQuestions[this.currentStrokeIdx];
        if (!q) return;

        if (q.userTotal === null || q.userStrokeId === null) {
            if (this.app) this.app.showToast('💡 请把两个空都选好后再核对答案哦！');
            return;
        }

        const wasCorrect = q.isCorrect;
        q.checked = true;
        q.isCorrect = (q.userTotal === q.totalStrokes && q.userStrokeId === q.answerId);

        this.renderCurrentStrokeQuestion();
        this.updateOverallProgress();

        if (q.isCorrect) {
            if (!wasCorrect && this.app) {
                this.app.addStars(4, '数笔画填空闯关');
            }
            if (window.soundManager) {
                window.soundManager.playVictory();
                window.soundManager.speak(`太棒啦！“${q.char}”字一共有${q.totalStrokes}画，第${q.askIndexCn}画是${q.answerName}！`);
            }
        } else {
            if (window.soundManager) {
                window.soundManager.playPop();
                window.soundManager.speak(`差一点点哦，“${q.char}”字一共有${q.totalStrokes}画，第${q.askIndexCn}画是${q.answerName}，看看红色高亮的那一笔吧！`);
            }
        }
    }

    // ==================== 第三关：反义词连线 ====================
    renderAntonymSection() {
        const leftCol = document.getElementById('exam-ant-left-col');
        const rightCol = document.getElementById('exam-ant-right-col');
        const statusEl = document.getElementById('exam-ant-status');
        if (!leftCol || !rightCol) return;

        leftCol.innerHTML = '';
        rightCol.innerHTML = '';

        const matchedLefts = Object.keys(this.matchedPairs);
        const matchedRights = Object.values(this.matchedPairs);

        this.antonymPairs.forEach((pair) => {
            const isMatched = matchedLefts.includes(pair.left);
            const isSelected = (this.selectedLeftChar === pair.left);
            const item = document.createElement('button');
            item.type = 'button';
            item.className = `ant-word-card left-card ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''}`;
            item.dataset.char = pair.left;
            item.innerHTML = `
                <span class="ant-char-text">${pair.left}</span>
                <span class="ant-dot left-dot"></span>
            `;
            item.addEventListener('click', () => this.onSelectLeftAntonym(pair.left));
            leftCol.appendChild(item);
        });

        this.rightColChars.forEach((rChar) => {
            const isMatched = matchedRights.includes(rChar);
            const isSelected = (this.selectedRightChar === rChar);
            const item = document.createElement('button');
            item.type = 'button';
            item.className = `ant-word-card right-card ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''}`;
            item.dataset.char = rChar;
            item.innerHTML = `
                <span class="ant-dot right-dot"></span>
                <span class="ant-char-text">${rChar}</span>
            `;
            item.addEventListener('click', () => this.onSelectRightAntonym(rChar));
            rightCol.appendChild(item);
        });

        if (statusEl) {
            const doneCount = matchedLefts.length;
            const totalCount = this.antonymPairs.length;
            if (doneCount === totalCount) {
                statusEl.className = 'exam-ant-status all-done';
                statusEl.innerHTML = `🎉 太厉害啦！${totalCount} 组反义词全部连线正确（全对 ✓）！`;
            } else {
                statusEl.className = 'exam-ant-status';
                statusEl.innerHTML = `👆 点击左边一个字，再点击右边相反意思的字连线！（已连对 <strong>${doneCount} / ${totalCount}</strong> 组）`;
            }
        }

        requestAnimationFrame(() => this.renderAntonymLines());
    }

    onSelectLeftAntonym(leftChar) {
        if (this.matchedPairs[leftChar]) {
            if (window.soundManager) {
                window.soundManager.playPop();
                window.soundManager.speak(`${leftChar}的反义词是${this.matchedPairs[leftChar]}`);
            }
            return;
        }
        if (window.soundManager) window.soundManager.playPop();
        this.selectedLeftChar = leftChar;
        if (this.selectedRightChar) {
            this.tryConnectAntonym(this.selectedLeftChar, this.selectedRightChar);
        } else {
            this.renderAntonymSection();
        }
    }

    onSelectRightAntonym(rightChar) {
        if (Object.values(this.matchedPairs).includes(rightChar)) {
            return;
        }
        if (window.soundManager) window.soundManager.playPop();
        this.selectedRightChar = rightChar;
        if (this.selectedLeftChar) {
            this.tryConnectAntonym(this.selectedLeftChar, this.selectedRightChar);
        } else {
            this.renderAntonymSection();
        }
    }

    tryConnectAntonym(leftChar, rightChar) {
        const pair = this.antonymPairs.find(p => p.left === leftChar);
        this.selectedLeftChar = null;
        this.selectedRightChar = null;

        if (pair && pair.right === rightChar) {
            this.matchedPairs[leftChar] = rightChar;
            this.renderAntonymSection();
            this.updateOverallProgress();

            if (this.app) {
                this.app.addStars(2, '反义词连线');
            }
            if (window.soundManager) {
                window.soundManager.playStar();
                window.soundManager.speak(`连对啦！“${leftChar}”的反义词是“${rightChar}”！`);
            }

            if (Object.keys(this.matchedPairs).length === this.antonymPairs.length) {
                if (this.app) this.app.fireConfetti();
                if (window.soundManager) window.soundManager.playVictory();
            }
        } else {
            // 连错提示动画
            this.renderAntonymSection();
            this.flashWrongAntonymLine(leftChar, rightChar);
            if (window.soundManager) {
                window.soundManager.playPop();
                window.soundManager.speak(`再想一想哦，“${leftChar}”和“${rightChar}”不是反义词呢！`);
            }
        }
    }

    renderAntonymLines(tempWrongPair = null) {
        const svg = document.getElementById('exam-ant-svg');
        const board = document.getElementById('exam-ant-board');
        if (!svg || !board) return;

        const boardRect = board.getBoundingClientRect();
        if (boardRect.width <= 0 || boardRect.height <= 0) return;

        svg.setAttribute('viewBox', `0 0 ${boardRect.width} ${boardRect.height}`);
        let html = '';

        const getDotCenter = (side, char) => {
            const selector = side === 'left'
                ? `#exam-ant-left-col .ant-word-card[data-char="${char}"] .left-dot`
                : `#exam-ant-right-col .ant-word-card[data-char="${char}"] .right-dot`;
            const dot = board.querySelector(selector);
            if (!dot) return null;
            const r = dot.getBoundingClientRect();
            return {
                x: r.left - boardRect.left + r.width / 2,
                y: r.top - boardRect.top + r.height / 2
            };
        };

        Object.entries(this.matchedPairs).forEach(([lChar, rChar]) => {
            const p1 = getDotCenter('left', lChar);
            const p2 = getDotCenter('right', rChar);
            if (p1 && p2) {
                const mx = p1.x + (p2.x - p1.x) * 0.78;
                const my = p1.y + (p2.y - p1.y) * 0.78;
                html += `
                    <line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#10b981" stroke-width="4.5" stroke-linecap="round"/>
                    <circle cx="${mx}" cy="${my}" r="13" fill="#ffffff" stroke="#10b981" stroke-width="2.5"/>
                    <text x="${mx}" y="${my + 1}" text-anchor="middle" dominant-baseline="central" fill="#ef4444" font-size="16" font-weight="900">✓</text>
                `;
            }
        });

        if (tempWrongPair) {
            const p1 = getDotCenter('left', tempWrongPair.left);
            const p2 = getDotCenter('right', tempWrongPair.right);
            if (p1 && p2) {
                html += `
                    <line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#ef4444" stroke-width="4" stroke-dasharray="8,6" stroke-linecap="round"/>
                `;
            }
        }

        svg.innerHTML = html;
    }

    flashWrongAntonymLine(leftChar, rightChar) {
        this.renderAntonymLines({ left: leftChar, right: rightChar });
        setTimeout(() => {
            this.renderAntonymLines();
        }, 650);
    }

    // ==================== 综合进度与成绩单 ====================
    updateOverallProgress() {
        const picDone = this.picQuestions.filter(q => q.status === 'correct').length;
        const stkDone = this.strokeQuestions.filter(q => q.checked && q.isCorrect).length;
        const antDone = Object.keys(this.matchedPairs).length;

        const b1 = document.getElementById('exam-tab-badge-1');
        const b2 = document.getElementById('exam-tab-badge-2');
        const b3 = document.getElementById('exam-tab-badge-3');
        if (b1) b1.textContent = `${picDone}/${this.picQuestions.length}`;
        if (b2) b2.textContent = `${stkDone}/${this.strokeQuestions.length}`;
        if (b3) b3.textContent = `${antDone}/${this.antonymPairs.length}`;

        // 百分制实时总分（第一关 50 分，第二关 25 分，第三关 25 分）
        const s1 = this.picQuestions.length > 0 ? (picDone / this.picQuestions.length) * 50 : 0;
        const s2 = this.strokeQuestions.length > 0 ? (stkDone / this.strokeQuestions.length) * 25 : 0;
        const s3 = this.antonymPairs.length > 0 ? (antDone / this.antonymPairs.length) * 25 : 0;
        const totalScore = Math.round(s1 + s2 + s3);

        const scorePill = document.getElementById('exam-live-score');
        if (scorePill) {
            scorePill.textContent = `${totalScore} 分`;
        }
    }

    // 打印同款 A4 纸质测试卷（还原课堂试卷版式：一、看图写汉字 二、数笔画填空 三、反义词连线）
    printExamPaper() {
        if (window.soundManager) window.soundManager.playPop();

        let printArea = document.getElementById('printable-area');
        if (!printArea) {
            printArea = document.createElement('div');
            printArea.id = 'printable-area';
            document.body.appendChild(printArea);
        }

        const picItems = this.picQuestions.slice(0, 20); // 16~20 题适配单张 A4
        const picGridHtml = picItems.map(q => `
            <div class="exam-print-pic-cell">
                <div class="exam-print-img-box">
                    <img src="${q.image}" alt="看图写字">
                </div>
                <div class="exam-print-mizi">
                    <span class="grid-cross-h"></span>
                    <span class="grid-cross-v"></span>
                </div>
            </div>
        `).join('');

        const stkItems = this.strokeQuestions.slice(0, 4);
        const stkHtml = stkItems.map((q, idx) => `
            <div class="exam-print-stk-row">
                （${idx + 1}）“<strong>${q.char}</strong>” 一共有 <span class="exam-print-line"></span> 画，第${q.askIndexCn}画是 <span class="exam-print-line"></span>。
            </div>
        `).join('');

        const antRowsHtml = this.antonymPairs.map((pair, idx) => {
            const rChar = this.rightColChars[idx] || pair.right;
            return `
                <div class="exam-print-ant-row">
                    <span class="ant-p-char">${pair.left}</span>
                    <span class="ant-p-dot">•</span>
                    <span class="ant-p-gap"></span>
                    <span class="ant-p-dot">•</span>
                    <span class="ant-p-char">${rChar}</span>
                </div>
            `;
        }).join('');

        const paperTitle = '快乐小书法家 · 汉字闯关测试卷';

        printArea.innerHTML = `
            <div class="print-sheet exam-print-sheet">
                <div class="print-header">
                    <h2>${paperTitle}</h2>
                    <div class="print-meta">
                        <span>姓名 (Name)：______________</span>
                        <span>日期：____年__月__日</span>
                        <span>得分：【 ______ / 100 】</span>
                    </div>
                </div>

                <div class="exam-print-section">
                    <h3>一、看图写汉字 (Look at each picture and write the Chinese character)</h3>
                    <div class="exam-print-pic-grid">
                        ${picGridHtml}
                    </div>
                </div>

                <div class="exam-print-bottom-cols">
                    <div class="exam-print-section exam-print-col-stk">
                        <h3>二、数笔画，填空 (Count the strokes and fill in the blanks)</h3>
                        <div class="exam-print-stk-list">
                            ${stkHtml}
                        </div>
                    </div>

                    <div class="exam-print-section exam-print-col-ant">
                        <h3>三、反义词连线 (Match each word with its opposite)</h3>
                        <div class="exam-print-ant-list">
                            ${antRowsHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;

        window.print();
    }

    bindEvents() {
        // 顶栏主 Tab 切换（✍️ 趣味练字 vs 📝 闯关测试）
        const practiceTabBtn = document.getElementById('primary-tab-practice');
        if (practiceTabBtn) {
            practiceTabBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this.switchAppTab('practice');
            });
        }

        const examTabBtn = document.getElementById('primary-tab-exam');
        if (examTabBtn) {
            examTabBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this.switchAppTab('exam');
            });
        }

        const settingsExamBtn = document.getElementById('btn-settings-exam');
        if (settingsExamBtn) {
            settingsExamBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                const settingsModal = document.getElementById('settings-modal');
                if (settingsModal) settingsModal.classList.remove('visible');
                this.switchAppTab('exam');
            });
        }

        // 换一套题按钮
        const refreshBtn = document.getElementById('btn-exam-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this.loadPaper(true);
                if (this.app) {
                    this.app.showToast('🎲 已为您换上一套新题目，快来挑战吧！');
                }
            });
        }

        // 三大题型 Tab 切换
        document.querySelectorAll('.exam-sec-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this.switchSection(tab.dataset.sec);
            });
        });

        // 打印同款试卷按钮
        const printBtn = document.getElementById('btn-exam-print-paper');
        if (printBtn) {
            printBtn.addEventListener('click', () => this.printExamPaper());
        }

        // 第一关：看图写字交互按钮
        const speakHintBtn = document.getElementById('btn-exam-speak-hint');
        if (speakHintBtn) {
            speakHintBtn.addEventListener('click', () => this.speakCurrentPicHint());
        }

        const traceHintBtn = document.getElementById('btn-exam-toggle-trace');
        if (traceHintBtn) {
            traceHintBtn.addEventListener('click', () => this.toggleExamTraceHint());
        }

        const undoBtn = document.getElementById('btn-exam-undo');
        if (undoBtn) {
            undoBtn.addEventListener('click', () => {
                if (this.examCanvas) this.examCanvas.undo();
                if (window.soundManager) window.soundManager.playPop();
            });
        }

        const clearBtn = document.getElementById('btn-exam-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (this.examCanvas) this.examCanvas.clear();
                if (window.soundManager) window.soundManager.playEraser();
            });
        }

        const submitPicBtn = document.getElementById('btn-exam-submit-pic');
        if (submitPicBtn) {
            submitPicBtn.addEventListener('click', () => this.submitCurrentPicWriting());
        }

        const prevPicBtn = document.getElementById('btn-exam-prev-pic');
        if (prevPicBtn) {
            prevPicBtn.addEventListener('click', () => this.prevPicQuestion());
        }

        const nextPicBtn = document.getElementById('btn-exam-next-pic');
        if (nextPicBtn) {
            nextPicBtn.addEventListener('click', () => this.nextPicQuestion());
        }

        // 第二关：数笔画交互按钮
        const countAnimBtn = document.getElementById('btn-exam-count-anim');
        if (countAnimBtn) {
            countAnimBtn.addEventListener('click', () => this.playStrokeStepCounter());
        }

        const prevStkBtn = document.getElementById('btn-exam-prev-stk');
        if (prevStkBtn) {
            prevStkBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                if (this.currentStrokeIdx > 0) {
                    this.currentStrokeIdx--;
                    this.renderCurrentStrokeQuestion();
                }
            });
        }

        const nextStkBtn = document.getElementById('btn-exam-next-stk');
        if (nextStkBtn) {
            nextStkBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                if (this.currentStrokeIdx < this.strokeQuestions.length - 1) {
                    this.currentStrokeIdx++;
                    this.renderCurrentStrokeQuestion();
                } else {
                    if (this.app) {
                        this.app.showToast('🎉 第二关【数笔画，填空】已完成，快去第三关【反义词连线】吧！');
                    }
                    this.switchSection('sec3');
                }
            });
        }

        // 第三关：反义词重置连线按钮
        const resetAntBtn = document.getElementById('btn-exam-reset-ant');
        if (resetAntBtn) {
            resetAntBtn.addEventListener('click', () => {
                if (window.soundManager) window.soundManager.playPop();
                this.matchedPairs = {};
                this.selectedLeftChar = null;
                this.selectedRightChar = null;
                this.rightColChars = this.shuffleArray([...this.rightColChars]);
                this.renderAntonymSection();
                this.updateOverallProgress();
            });
        }

        window.addEventListener('resize', () => {
            if (this.activeAppTab === 'exam' && this.activeSection === 'sec3') {
                this.renderAntonymLines();
            }
        });
    }
}

window.ExamCenter = ExamCenter;
