/**
 * sound.js - 儿童练字App 趣味音效与语音合成引擎
 * 采用 Web Audio API 原生合成音效，零音频文件依赖，离线可用，响应极快！
 */

class SoundManager {
    constructor() {
        this.ctx = null;
        this.enabled = typeof localStorage !== 'undefined' ? localStorage.getItem('kid_app_sound_enabled') !== 'false' : true;
        this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
        this.voices = [];
        this.chineseVoice = null;
        this.activeUtterance = null;
        this.currentAudio = null;

        this.initVoices();
        if (typeof window !== 'undefined' && this.synth) {
            this.synth.onvoiceschanged = () => this.initVoices();
        }

        this.setupAudioUnlock();
    }

    // 针对移动端 (iPad / iOS Safari / Android) 用户手势音频与语音预激活
    setupAudioUnlock() {
        if (typeof document === 'undefined') return;
        const unlock = () => {
            this.ensureAudioContext();
            if (this.synth) {
                try {
                    const dummy = new SpeechSynthesisUtterance('');
                    dummy.volume = 0;
                    this.synth.speak(dummy);
                } catch (e) {}
            }
        };
        ['touchstart', 'touchend', 'click'].forEach(evt => {
            document.addEventListener(evt, unlock, { once: true, passive: true });
        });
    }

    // 智能筛选最优质的标准普通话语音包 (微软晓晓/云希、苹果Siri/婷婷、谷歌普通话)
    initVoices() {
        if (!this.synth) return;
        try {
            this.voices = this.synth.getVoices() || [];
            if (this.voices.length > 0) {
                this.chineseVoice = 
                    this.voices.find(v => (v.lang === 'zh-CN' || v.lang === 'zh_CN') && (v.name.includes('Natural') || v.name.includes('Xiaoxiao') || v.name.includes('Yunxi') || v.name.includes('晓晓') || v.name.includes('云希')))
                    || this.voices.find(v => (v.lang === 'zh-CN' || v.lang === 'zh_CN') && (v.name.includes('Tingting') || v.name.includes('婷婷') || v.name.includes('Siri') || v.name.includes('Premium')))
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
            this.ctx.resume();
        }
    }

    // 切换声音开关
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('kid_app_sound_enabled', this.enabled ? 'true' : 'false');
        if (this.enabled) {
            this.playPop();
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

    // 8. 汉字专属高保真发音 (先播单字，再自然连贯播词)
    speakChar(char, sampleWord = null) {
        if (!char) return;
        this.speak(char, () => {
            if (sampleWord) {
                // 字与词之间保持 350ms 自然呼吸停顿
                setTimeout(() => {
                    this.speak(sampleWord);
                }, 350);
            }
        });
    }

    // 9. 智能语音朗读引擎 (单字优先有道真人母语高保真原声，词句与离线状态使用系统内置顶级神经语音)
    speak(text, onEnd = null) {
        if (!text) return;
        // 过滤非汉字拼音杂质，保留标准汉字与标点
        const cleanText = text.replace(/[a-zA-Zāáǎàōóǒòēéěèīíǐìūúǔùǖǘǚǜ]/g, '').trim() || text;
        if (!cleanText) return;

        // 停止之前的音频播放
        if (this.currentAudio) {
            try {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
            } catch (e) {}
            this.currentAudio = null;
        }

        // 单个汉字且网络连通时：100% 优先使用有道词典官方高保真真人发音 (纯正普通话女播音员录制)
        if (cleanText.length === 1 && typeof navigator !== 'undefined' && navigator.onLine !== false) {
            try {
                const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(cleanText)}&le=zh`;
                const audio = new Audio(audioUrl);
                this.currentAudio = audio;

                let hasFallback = false;
                const doFallback = () => {
                    if (hasFallback) return;
                    hasFallback = true;
                    this.currentAudio = null;
                    this.speakWithSynth(cleanText, onEnd);
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
            } catch (err) {
                // 如果创建 Audio 异常立即回退
            }
        }

        // 针对词语、短句、或单字离线回退：直接使用本地优质中文语音合成 (零延迟、零网络依赖、发音流畅自然)
        this.speakWithSynth(cleanText, onEnd);
    }

    // 本地优质中文语音合成 (彻底修复 WebKit 垃圾回收与 Safari 暂停问题)
    speakWithSynth(text, onEnd = null) {
        if (!this.synth) {
            if (onEnd) onEnd();
            return;
        }

        // 确保语音列表就绪
        if (!this.chineseVoice || this.voices.length === 0) {
            this.initVoices();
        }

        // 修复 Safari 暂停状态卡死问题
        if (this.synth.paused) {
            this.synth.resume();
        }

        // 避免 iOS Safari 多次触发 cancel 的竞争冲突
        if (this.synth.speaking) {
            this.synth.cancel();
        }

        try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.88; // 适合少儿听觉的自然慢速
            utterance.pitch = 1.05; // 稍微提升音调，亲切温和

            if (this.chineseVoice) {
                utterance.voice = this.chineseVoice;
            }

            // 保持实例强引用，彻底修复 WebKit 著名的垃圾回收提前中断 Bug (WebKit Bug 174066)
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

    // 10. 英文发音引擎 (点击汉字旁边的英文或插画英文时朗读，网络优先纯正美音，离线使用系统英语发音)
    speakEn(word, onEnd = null) {
        if (!word || !this.enabled) return;
        this.ensureAudioContext();

        // 停止之前的音频播放
        if (this.currentAudio) {
            try {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
            } catch (e) {}
            this.currentAudio = null;
        }

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

    // 本地英文语音合成回退
    speakEnWithSynth(word, onEnd = null) {
        if (!this.synth) {
            if (onEnd) onEnd();
            return;
        }

        if (this.synth.paused) this.synth.resume();
        if (this.synth.speaking) this.synth.cancel();

        try {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'en-US';
            utterance.rate = 0.85;

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
