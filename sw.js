/**
 * sw.js - 快乐小书法家 PWA Service Worker
 * 采用「网络优先 + 离线缓存兜底 (Network-First with Offline Fallback)」策略：
 * 1. 联网状态下始终优先拉取最新 HTML/CSS/JS 并自动更新缓存，彻底避免旧版本强缓存不更新问题；
 * 2. 断网/弱网状态下无缝回退到本地 Cache Storage，支持 100% 离线练字、笔顺演示与离线语音。
 */

const CACHE_NAME = 'chinese-writing-pwa-v3.11';

const CORE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './css/style.css',
    './lib/confetti.browser.min.js',
    './lib/hanzi-writer.min.js',
    './lib/web-natural-tts.js',
    './lib/web-online-tts.js',
    './js/sound.js',
    './js/char-data.js',
    './js/stroke-cache.js',
    './js/canvas.js',
    './js/hanzi-guide.js',
    './js/evaluator.js',
    './js/quiz-test.js',
    './js/app.js',
    './assets/apple-touch-icon.png',
    './assets/icon-192.png',
    './assets/icon-512.png'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CORE_ASSETS).catch((err) => {
                console.warn('[SW] Pre-cache partial warning:', err);
            });
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('message', (event) => {
    if (!event.data) return;
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    } else if (event.data.type === 'CLEAR_CACHES') {
        event.waitUntil(
            caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        );
    }
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    // 仅处理 GET 请求；跨域 POST (如在线 TTS 接口) 直接放行由客户端处理
    if (req.method !== 'GET') return;

    const url = new URL(req.url);

    // 针对同源资源及笔顺 CDN JSON 数据：采用 Network-First (网络优先，离线兜底)
    if (url.origin === self.location.origin || url.hostname.includes('jsdelivr.net')) {
        event.respondWith(
            fetch(req)
                .then((networkRes) => {
                    if (networkRes && networkRes.status === 200) {
                        const resClone = networkRes.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(req, resClone);
                        });
                    }
                    return networkRes;
                })
                .catch(() => {
                    return caches.match(req).then((cachedRes) => {
                        if (cachedRes) return cachedRes;
                        return caches.match(req, { ignoreSearch: true }).then((fallbackRes) => {
                            if (fallbackRes) return fallbackRes;
                            if (req.mode === 'navigate') {
                                return caches.match('./index.html', { ignoreSearch: true });
                            }
                            return new Response('Offline', { status: 503, statusText: 'Offline' });
                        });
                    });
                })
        );
    }
});
