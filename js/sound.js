/**
 * sound.js - 儿童练字App 趣味音效与自然语音合成引擎
 * 集成 WebOnlineTTS (微软 Azure AI Speech zh-CN-XiaoxiaoNeural 晓晓真人神经语音 + 边缘缓存)
 * 与 WebNaturalTTS (智能分级自然人声 + 离线自动兜底) + Web Audio API 零延迟音效
 */

class SoundManager {
    constructor() {
        this.ctx = null;
        this.enabled = typeof localStorage !== 'undefined' ? localStorage.getItem('kid_app_sound_enabled') !== 'false' : true;
        this.onlineTts = null;
        this.tts = null;
        this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
        this.voices = [];
        this.chineseVoice = null;
        this.activeUtterance = null;
        this.currentAudio = null;
        this.prewarmed = false;
        this._speakSeq = 0;

        this.initTTS();
        this.initVoices();
        if (typeof window !== 'undefined' && this.synth) {
            this.synth.onvoiceschanged = () => this.initVoices();
        }

        this.setupAudioUnlock();
    }

    // 初始化 WebOnlineTTS (晓晓真人神经音色) 与 WebNaturalTTS (高品质自然离线兜底)
    initTTS() {
        if (typeof window !== 'undefined' && typeof window.OnlineNeuralTTS === 'function') {
            this.onlineTts = new window.OnlineNeuralTTS({
                endpoint: '/api/tts',
                fallbackEndpoint: 'https://kid-math-game.pages.dev/api/tts',
                rate: '-2%',
                muted: !this.enabled,
                autoUnlock: true
            });
            this.tts = this.onlineTts.offlineTts || null;
        }

        if (!this.tts && typeof window !== 'undefined' && typeof window.NaturalTTS === 'function') {
            this.tts = new window.NaturalTTS({
                lang: 'zh-CN',
                rate: 0.92,
                pitch: 1.0,
                volume: 1.0,
                filterEmojis: true,
                normalizeMath: true,
                cancelPrevious: true,
                autoUnlock: true
            });
        }
    }

    // 针对移动端 (iPad / iOS Safari / Android) 用户手势音频与语音预激活
    setupAudioUnlock() {
        if (typeof document === 'undefined') return;
        const unlock = () => {
            this.ensureAudioContext();
            if (this.onlineTts && typeof this.onlineTts.unlockAudio === 'function') {
                this.onlineTts.unlockAudio();
            } else if (this.tts && typeof this.tts.unlock === 'function') {
                this.tts.unlock();
            } else if (this.synth) {
                try {
                    const dummy = new SpeechSynthesisUtterance('');
                    dummy.volume = 0;
                    this.synth.speak(dummy);
                } catch (e) {}
            }
        };
        ['touchstart', 'touchend', 'click', 'pointerdown'].forEach(evt => {
            document.addEventListener(evt, unlock, { once: true, passive: true });
        });
    }

    // 智能筛选最优质的标准普通话语音包 (微软晓晓/云希、苹果Siri/婷婷、谷歌普通话)
    initVoices() {
        if (this.tts && typeof this.tts.getBestVoice === 'function') {
            this.chineseVoice = this.tts.getBestVoice('zh-CN');
        }
        if (!this.synth) return;
        try {
            this.voices = this.synth.getVoices() || [];
            if (this.voices.length > 0 && !this.chineseVoice) {
                this.chineseVoice =
                    this.voices.find(v => (v.lang === 'zh-CN' || v.lang === 'zh_CN') && (v.name.includes('Natural') || v.name.includes('Xiaoxiao') || v.name.includes('Yunxi') || v.name.includes('晓晓') || v.name.includes('云希')))
                    || this.voices.find(v => (v.lang === 'zh-CN' || v.lang === 'zh_CN') && (v.name.includes('Tingting') || v.name.includes('婷婷') || v.name.includes('Siri') || v.name.includes('Premium') || v.name.includes('Enhanced')))
                    || this.voices.find(v => v.lang === 'zh-CN' || v.lang === 'zh_CN')
                    || this.voices.find(v => v.lang && (v.lang.startsWith('zh') || v.lang.includes('cmn')));
            }
        } catch (e) {}
    }

    // 初始化 AudioContext (必须在用户交互后唤醒)
    ensureAudioContext() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
        if (this.onlineTts && typeof this.onlineTts.unlockAudio === 'function') {
            this.onlineTts.unlockAudio();
            if (!this.prewarmed) {
                this.prewarmed = true;
                this.onlineTts.prewarm([
                    '一，一个',
                    '我是一个活泼可爱的小朋友。',
                    '太棒啦！书写完成！'
                ]);
            }
        } else if (this.tts && typeof this.tts.unlock === 'function') {
            this.tts.unlock();
        }
    }

    // 切换声音开关
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('kid_app_sound_enabled', this.enabled ? 'true' : 'false');
        if (this.onlineTts && typeof this.onlineTts.setMuted === 'function') {
            this.onlineTts.setMuted(!this.enabled);
        }
        if (this.enabled) {
            this.playPop();
        } else {
            this.stopSpeaking();
        }
        return this.enabled;
    }

    // 1. 按钮气泡点击音效 (Pop)
    playPop() {
        if (!this.enabled) return;
        this.ensureAudioContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
    }

    // 2. 书写起笔音效 (Brush / Soft Swoosh)
    playBrush() {
        if (!this.enabled) return;
        this.ensureAudioContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
    }

    // 3. 笔画跟写正确音效 (Joyful Ding)
    playCorrect() {
        if (!this.enabled) return;
        this.ensureAudioContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25]; // C5, E5

        notes.forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const time = now + index * 0.08;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time);

            gain.gain.setValueAtTime(0.2, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(time);
            osc.stop(time + 0.25);
        });
    }

    // 4. 笔画写错温柔提示音 (Gentle Boing - 不刺耳，鼓励再试)
    playMistake() {
        if (!this.enabled) return;
        this.ensureAudioContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.2);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.22);
    }

    // 5. 练字完成欢呼胜利乐曲 (Fanfare Arpeggio)
    playVictory() {
        if (!this.enabled) return;
        this.ensureAudioContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // C5, E5, G5, C6 欢快大三和弦冲顶
        const chord = [523.25, 659.25, 783.99, 1046.50];

        chord.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const noteStart = now + idx * 0.1;
            const duration = idx === chord.length - 1 ? 0.6 : 0.22;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, noteStart);

            gain.gain.setValueAtTime(0.25, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.001, noteStart + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(noteStart);
            osc.stop(noteStart + duration);
        });
    }

    // 胜利号角音效 (Fanfare)
    playFanfare() {
        this.playVictory();
    }

    // 6. 星星获取光芒音效 (Twinkle)
    playStar() {
        if (!this.enabled) return;
        this.ensureAudioContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const freqs = [1046.5, 1318.5, 1567.98, 2093.0];
        freqs.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const time = now + i * 0.05;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time);

            gain.gain.setValueAtTime(0.15, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(time);
            osc.stop(time + 0.18);
        });
    }

    // 7. 橡皮擦清空音效 (Swoosh)
    playEraser() {
        if (!this.enabled) return;
        this.ensureAudioContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    // 8. 汉字专属高保真自然发音 (使用晓晓神经语音一气呵成连读“字，词”，停顿自然流畅)
    speakChar(char, sampleWord = null) {
        if (!char || !this.enabled) return;
        const phrase = sampleWord ? `${char}，${sampleWord}` : char;
        this.speak(phrase);
    }

    // 停止正在进行的所有语音播放与朗读合成
    stopSpeaking() {
        this._speakSeq += 1;
        if (this.onlineTts && typeof this.onlineTts.stop === 'function') {
            this.onlineTts.stop();
        }
        if (this.tts && typeof this.tts.stop === 'function') {
            this.tts.stop();
        }
        if (this.currentAudio) {
            try {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
            } catch (e) {}
            this.currentAudio = null;
        }
        if (this.synth) {
            try {
                this.synth.cancel();
            } catch (e) {}
        }
        this.activeUtterance = null;
    }

    // 检查当前是否正在朗读
    isSpeaking() {
        if (this.onlineTts) {
            const audioPlaying = !!(this.onlineTts.sharedAudio && !this.onlineTts.sharedAudio.paused);
            const fetching = !!this.onlineTts.activeAbort;
            const offlineSpeaking = !!(this.onlineTts.offlineTts && typeof this.onlineTts.offlineTts.isSpeaking === 'function' && this.onlineTts.offlineTts.isSpeaking());
            if (audioPlaying || fetching || offlineSpeaking) return true;
        }
        if (this.tts && typeof this.tts.isSpeaking === 'function' && this.tts.isSpeaking()) {
            return true;
        }
        return !!(this.currentAudio || (this.synth && (this.synth.speaking || this.synth.pending)));
    }

    // 9. 智能语音朗读引擎 (优先调用 WebOnlineTTS 微软晓晓 zh-CN-XiaoxiaoNeural 真人神经语音，断网自动无缝降级 WebNaturalTTS)
    speak(text, onEnd = null) {
        if (!text || !this.enabled) {
            if (typeof onEnd === 'function') onEnd();
            return;
        }

        // 深度清洗：剔除所有 Emoji 表情符、装饰符号与拼音杂质，仅保留自然发音中文、数字与标点
        let cleanText = String(text)
            .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83E[\uDD00-\uDDFF]/g, '')
            .replace(/[🚨📌💡✨✅👌⭐🏆·\(\)（）\n\r]/g, ' ')
            .replace(/[a-zA-Zāáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ]/g, '')
            .replace(/\s+/g, ' ')
            .trim();

        if (this.onlineTts && typeof this.onlineTts.cleanText === 'function') {
            cleanText = this.onlineTts.cleanText(cleanText);
        } else if (this.tts && typeof this.tts.cleanText === 'function') {
            cleanText = this.tts.cleanText(cleanText);
        }

        if (!cleanText) {
            if (typeof onEnd === 'function') onEnd();
            return;
        }

        // 停止之前的独立音频播放
        if (this.currentAudio) {
            try {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
            } catch (e) {}
            this.currentAudio = null;
        }

        this._speakSeq += 1;
        const seq = this._speakSeq;
        const finishCallback = () => {
            if (seq === this._speakSeq && typeof onEnd === 'function') {
                onEnd();
            }
        };

        // 1. 优先调用 WebOnlineTTS (zh-CN-XiaoxiaoNeural 晓晓 · 温柔姐姐 AI 神经真人语音)
        if (this.onlineTts && typeof this.onlineTts.speak === 'function') {
            this.onlineTts.muted = !this.enabled;
            this.onlineTts.speak(cleanText)
                .then(finishCallback)
                .catch(finishCallback);
            return;
        }

        // 2. 次选调用 WebNaturalTTS (本地自然人声优选，pitch=1.0 原声)
        if (this.tts && typeof this.tts.speak === 'function') {
            this.tts.speak(cleanText, {
                lang: 'zh-CN',
                rate: 0.92,
                pitch: 1.0,
                onEnd: finishCallback,
                onError: finishCallback
            });
            return;
        }

        // 3. 终极原生兜底
        this.speakWithSynth(cleanText, finishCallback);
    }

    // 本地优质中文语音合成兜底 (彻底修复 WebKit 垃圾回收与 Safari 暂停问题)
    speakWithSynth(text, onEnd = null) {
        if (!this.synth) {
            if (onEnd) onEnd();
            return;
        }

        if (!this.chineseVoice || this.voices.length === 0) {
            this.initVoices();
        }

        if (this.synth.paused) {
            this.synth.resume();
        }

        if (this.synth.speaking) {
            this.synth.cancel();
        }

        try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.92; // 从容亲切的自然语速
            utterance.pitch = 1.0; // 保持 1.0 原声自然音调，杜绝电子机械变调

            if (this.chineseVoice) {
                utterance.voice = this.chineseVoice;
            }

            this.activeUtterance = utterance;

            utterance.onend = () => {
                this.activeUtterance = null;
                if (onEnd) onEnd();
            };

            utterance.onerror = (e) => {
                console.warn('Speech synthesis utterance error:', e);
                this.activeUtterance = null;
                if (onEnd) onEnd();
            };

            this.synth.speak(utterance);
        } catch (e) {
            console.warn('speakWithSynth failed:', e);
            if (onEnd) onEnd();
        }
    }

    // 10. 英文发音引擎 (点击汉字旁边的英文徽标时朗读，网络优先纯正美音，离线使用 NaturalTTS 高品质英语发音)
    speakEn(word, onEnd = null) {
        if (!word || !this.enabled) return;
        this.ensureAudioContext();
        this.stopSpeaking();

        // 提取主要英文字词 (如 "too / great" 朗读 "too")
        const primaryWord = word.split('/')[0].replace(/[^a-zA-Z\s-]/g, '').trim();
        if (!primaryWord) return;

        // 网络优先：使用有道词典真人标准美音 (type=2 为美式发音)
        if (typeof navigator !== 'undefined' && navigator.onLine !== false) {
            try {
                const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(primaryWord)}&type=2`;
                const audio = new Audio(audioUrl);
                this.currentAudio = audio;

                let hasFallback = false;
                const doFallback = () => {
                    if (hasFallback) return;
                    hasFallback = true;
                    this.currentAudio = null;
                    this.speakEnWithSynth(primaryWord, onEnd);
                };

                audio.onended = () => {
                    this.currentAudio = null;
                    if (onEnd) onEnd();
                };

                audio.onerror = doFallback;

                const p = audio.play();
                if (p !== undefined) {
                    p.catch(doFallback);
                }
                return;
            } catch (err) {}
        }

        this.speakEnWithSynth(primaryWord, onEnd);
    }

    // 本地英文自然语音合成回退 (优先使用 WebNaturalTTS 优选英文自然人声)
    speakEnWithSynth(word, onEnd = null) {
        if (this.tts && typeof this.tts.speak === 'function') {
            this.tts.speak(word, {
                lang: 'en-US',
                rate: 0.88,
                pitch: 1.0,
                onEnd: () => {
                    if (onEnd) onEnd();
                },
                onError: () => {
                    if (onEnd) onEnd();
                }
            });
            return;
        }

        if (!this.synth) {
            if (onEnd) onEnd();
            return;
        }

        if (this.synth.paused) this.synth.resume();
        if (this.synth.speaking) this.synth.cancel();

        try {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'en-US';
            utterance.rate = 0.88;
            utterance.pitch = 1.0;

            const enVoice = (this.voices || []).find(v => (v.lang === 'en-US' || v.lang === 'en_US' || v.lang.startsWith('en')) && (v.name.includes('Natural') || v.name.includes('Siri') || v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('Guy')))
                || (this.voices || []).find(v => v.lang === 'en-US' || v.lang === 'en_US' || v.lang.startsWith('en'));

            if (enVoice) utterance.voice = enVoice;

            this.activeUtterance = utterance;
            utterance.onend = () => {
                this.activeUtterance = null;
                if (onEnd) onEnd();
            };
            utterance.onerror = () => {
                this.activeUtterance = null;
                if (onEnd) onEnd();
            };
            this.synth.speak(utterance);
        } catch (e) {
            if (onEnd) onEnd();
        }
    }
}

// 导出全局单例
window.soundManager = new SoundManager();
