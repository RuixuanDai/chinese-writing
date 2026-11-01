"""
server.py - 专为局域网和 iPad 访问设计的本地服务器
自动识别本机局域网 IP 地址，提供 iPad 访问地址，挂载 /api/tts 在线 AI 神经网络真人语音接口，并启动 HTTP 服务
"""

import sys
import os
import re
import time
import hmac
import json
import socket
import hashlib
import urllib.parse
import urllib.request
import webbrowser
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

# 修复 Windows 控制台中文乱码与 Emoji 编码问题
if sys.platform == 'win32':
    try:
        os.system('chcp 65001 >nul')
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    except Exception:
        pass

PORT = 8080
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TTS_CACHE_DIR = os.path.join(BASE_DIR, '.local-data', 'tts-cache')
os.makedirs(TTS_CACHE_DIR, exist_ok=True)

ALLOWED_VOICES = {
    'zh-CN-XiaoxiaoNeural',
}
DEFAULT_VOICE = 'zh-CN-XiaoxiaoNeural'
TTS_CLIENT_SECRET = 'kmg-tts-2026-guard-v1'
CLOUDFLARE_TTS_FALLBACK = 'https://kid-math-game.pages.dev/api/tts'
MAX_DISK_CACHE_FILES = 500
MAX_MISS_PER_MINUTE = 20
_ip_rate_map: dict[str, tuple[int, int]] = {}


def load_azure_speech_credentials():
    """从环境变量或本地 .env.db.local / .env.local 自动读取共享的 Azure Speech 免费层密钥"""
    key = os.environ.get('AZURE_SPEECH_KEY', '').strip()
    region = os.environ.get('AZURE_SPEECH_REGION', '').strip()
    if key and region:
        return key, region

    candidate_files = [
        os.path.join(BASE_DIR, '.env.db.local'),
        os.path.join(BASE_DIR, '.env.local'),
        os.path.join(BASE_DIR, '.env'),
        os.path.abspath(os.path.join(BASE_DIR, '..', '..', 'kid_incentive', 'opus', '.env.db.local')),
    ]
    for path in candidate_files:
        if os.path.isfile(path):
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        if not line or line.startswith('#') or '=' not in line:
                            continue
                        k, v = line.split('=', 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        if k == 'AZURE_SPEECH_KEY' and not key:
                            key = v
                        elif k == 'AZURE_SPEECH_REGION' and not region:
                            region = v
            except Exception:
                pass
        if key and region:
            break
    return key, region


AZURE_KEY, AZURE_REGION = load_azure_speech_credentials()


def clean_tts_text(raw: str) -> str:
    if not raw:
        return ''
    text = re.sub(r'(\d{1,2}):00', r'\1点整', raw)
    text = re.sub(r'(\d{1,2}):30', r'\1点半', text)
    text = re.sub(r'(\d{1,2}):(\d{2})', r'\1点\2分', text)
    text = text.replace('+', ' 加 ').replace('−', ' 减 ').replace('-', ' 减 ')
    text = text.replace('×', ' 乘 ').replace('*', ' 乘 ').replace('÷', ' 除以 ').replace('=', ' 等于 ')
    text = re.sub(r'[✓✔✕✖✗▶◀▲▼•·|]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text[:80]


def escape_xml(text: str) -> str:
    return (
        text.replace('&', '&amp;')
        .replace('<', '&lt;')
        .replace('>', '&gt;')
        .replace('"', '&quot;')
        .replace("'", '&apos;')
    )


def verify_tts_signature(ts: str, sig: str, voice: str, rate: str, cleaned_text: str) -> bool:
    if not ts or not sig:
        return False
    try:
        ts_num = int(ts)
    except ValueError:
        return False
    if abs(int(time.time()) - ts_num) > 300:
        return False
    raw = f"{ts}|{voice}|{rate}|{cleaned_text}|{TTS_CLIENT_SECRET}"
    expected = hashlib.sha256(raw.encode('utf-8')).hexdigest()[:32]
    return hmac.compare_digest(sig, expected)


def check_ip_quota(client_ip: str) -> bool:
    min_bucket = int(time.time() // 60)
    prev_bucket, count = _ip_rate_map.get(client_ip, (min_bucket, 0))
    if prev_bucket != min_bucket:
        prev_bucket, count = min_bucket, 0
    if count >= MAX_MISS_PER_MINUTE:
        return False
    if len(_ip_rate_map) > 500:
        _ip_rate_map.clear()
    _ip_rate_map[client_ip] = (prev_bucket, count + 1)
    return True


def prune_disk_cache():
    """限制本地磁盘缓存最多保存 MAX_DISK_CACHE_FILES 个音频文件，防止恶意请求撑爆磁盘"""
    try:
        files = [
            os.path.join(TTS_CACHE_DIR, name)
            for name in os.listdir(TTS_CACHE_DIR)
            if name.endswith('.mp3')
        ]
        if len(files) > MAX_DISK_CACHE_FILES:
            files.sort(key=lambda p: os.path.getmtime(p))
            for old_file in files[: len(files) - MAX_DISK_CACHE_FILES]:
                try:
                    os.remove(old_file)
                except Exception:
                    pass
    except Exception:
        pass


def synthesize_tts_mp3(voice: str, rate: str, cleaned_text: str, client_ip: str = '127.0.0.1') -> tuple[bytes, str]:
    """合成或从本地磁盘缓存读取 MP3，返回 (mp3_bytes, provider_name)"""
    cache_key = hashlib.sha256(f"v1|{voice}|{rate}|{cleaned_text}".encode('utf-8')).hexdigest()
    cache_path = os.path.join(TTS_CACHE_DIR, f"{cache_key}.mp3")

    if os.path.isfile(cache_path):
        try:
            with open(cache_path, 'rb') as f:
                data = f.read()
            if len(data) >= 128:
                return data, 'local-disk-cache'
        except Exception:
            pass

    if not check_ip_quota(client_ip):
        raise PermissionError('Rate limit exceeded for new speech synthesis')

    mp3_data = None
    provider = 'unknown'

    # 1. 优先使用本机配置的 Azure AI Speech REST API (Free F0)
    if AZURE_KEY and AZURE_REGION:
        xml_lang = 'en-US' if voice.startswith('en-') else 'zh-CN'
        endpoint = f"https://{AZURE_REGION.lower()}.tts.speech.microsoft.com/cognitiveservices/v1"
        ssml = (
            f"<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' "
            f"xmlns:mstts='https://www.w3.org/2001/mstts' xml:lang='{xml_lang}'>"
            f"<voice name='{voice}'><prosody pitch='+0Hz' rate='{rate}' volume='+0%'>"
            f"{escape_xml(cleaned_text)}</prosody></voice></speak>"
        ).encode('utf-8')
        req = urllib.request.Request(
            endpoint,
            data=ssml,
            method='POST',
            headers={
                'Ocp-Apim-Subscription-Key': AZURE_KEY,
                'Content-Type': 'application/ssml+xml',
                'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
                'User-Agent': 'ChineseWritingLocalServer/1.0',
            },
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = resp.read()
            if len(data) >= 128:
                mp3_data = data
                provider = 'azure-neural-local'

    # 2. 若未配置本地密钥，自动带签名代理至线上 Cloudflare Pages 边缘函数并缓存到本地磁盘
    if not mp3_data:
        ts = str(int(time.time()))
        raw_sig = f"{ts}|{voice}|{rate}|{cleaned_text}|{TTS_CLIENT_SECRET}"
        sig = hashlib.sha256(raw_sig.encode('utf-8')).hexdigest()[:32]
        qs = urllib.parse.urlencode({'voice': voice, 'rate': rate, 'text': cleaned_text, 'ts': ts, 'sig': sig})
        req = urllib.request.Request(
            f"{CLOUDFLARE_TTS_FALLBACK}?{qs}",
            method='GET',
            headers={
                'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
                'Origin': f'http://localhost:{PORT}',
                'Referer': f'http://localhost:{PORT}/',
            },
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = resp.read()
            if len(data) >= 128:
                mp3_data = data
                provider = 'cloudflare-edge-proxy'

    if not mp3_data or len(mp3_data) < 128:
        raise RuntimeError('Empty TTS audio bytes')

    try:
        tmp_path = f"{cache_path}.{os.getpid()}.tmp"
        with open(tmp_path, 'wb') as f:
            f.write(mp3_data)
        os.replace(tmp_path, cache_path)
        prune_disk_cache()
    except Exception:
        pass

    return mp3_data, provider


def get_local_ip():
    """获取本机在当前局域网 (Wi-Fi) 中的 IPv4 地址"""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip


class NoCacheHTTPRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        if not self.path.startswith('/api/tts'):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def _is_forbidden_path(self, raw_path: str) -> bool:
        """拦截对隐藏文件 (.env, .git, .local-data) 与后端脚本 (server.py, functions) 的直接访问"""
        clean = urllib.parse.unquote(raw_path or '').replace('\\', '/')
        parts = [p for p in clean.split('/') if p and p != '.']
        for part in parts:
            if part.startswith('.') or part == '..':
                return True
        lower_path = '/'.join(parts).lower()
        if lower_path in ('server.py', 'wrangler.toml') or lower_path.startswith('functions/'):
            return True
        return False

    def do_HEAD(self):
        parsed = urllib.parse.urlparse(self.path)
        if self._is_forbidden_path(parsed.path):
            self.send_error(403, 'Forbidden')
            return
        return super().do_HEAD()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if self._is_forbidden_path(parsed.path):
            self.send_error(403, 'Forbidden')
            return

        # 在线 AI 神经网络语音接口 (/api/tts)
        if parsed.path == '/api/tts':
            qs = urllib.parse.parse_qs(parsed.query)
            raw_text = (qs.get('text') or [''])[0]
            cleaned = clean_tts_text(raw_text)
            if not cleaned:
                body = json.dumps({'error': 'Empty text'}).encode('utf-8')
                self.send_response(400)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return

            req_voice = (qs.get('voice') or [DEFAULT_VOICE])[0]
            voice = req_voice if req_voice in ALLOWED_VOICES else DEFAULT_VOICE
            req_rate = (qs.get('rate') or ['-2%'])[0]
            rate = req_rate if re.match(r'^[+-]?\d{1,2}%$', req_rate) else '-2%'
            ts = (qs.get('ts') or [''])[0]
            sig = (qs.get('sig') or [''])[0]

            if not verify_tts_signature(ts, sig, voice, rate, cleaned):
                body = json.dumps({'error': 'Forbidden: invalid or expired signature'}).encode('utf-8')
                self.send_response(403)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Cache-Control', 'no-store')
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return

            client_ip = self.client_address[0] if self.client_address else '127.0.0.1'

            try:
                mp3_bytes, provider = synthesize_tts_mp3(voice, rate, cleaned, client_ip)
                self.send_response(200)
                self.send_header('Content-Type', 'audio/mpeg')
                self.send_header('Content-Length', str(len(mp3_bytes)))
                self.send_header('Cache-Control', 'public, max-age=31536000, immutable')
                self.send_header('X-TTS-Provider', provider)
                self.end_headers()
                self.wfile.write(mp3_bytes)
            except PermissionError as e:
                body = json.dumps({'error': str(e)}).encode('utf-8')
                self.send_response(429)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Cache-Control', 'no-store')
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
            except Exception as e:
                body = json.dumps({'error': 'TTS synthesis unavailable'}).encode('utf-8')
                self.send_response(502)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Cache-Control', 'no-store')
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
            return

        return super().do_GET()


def main():
    os.chdir(BASE_DIR)
    local_ip = get_local_ip()
    tts_mode = f"Azure AI Speech ({AZURE_REGION})" if (AZURE_KEY and AZURE_REGION) else "Cloudflare Edge Proxy"

    print("=" * 60)
    print("  [快乐小书法家] 儿童练字 App 正在运行中")
    print(f"  [在线真人语音] Web-Online-TTS 已启用 (/api/tts -> {tts_mode})")
    print("=" * 60)
    print(f"\n💻 电脑本机访问地址:")
    print(f"   >>> http://localhost:{PORT}/index.html\n")
    print(f"📱 iPad / 平板 / 手机访问地址:")
    print(f"   >>> http://{local_ip}:{PORT}/index.html\n")
    print("-" * 60)
    print("📋 iPad 连接三步指南：")
    print("  1. 确保 iPad 和这台电脑连接在【同一个 Wi-Fi】下。")
    print(f"  2. 在 iPad 上打开 Safari 浏览器，输入：http://{local_ip}:{PORT}")
    print("  3. [推荐] 在 Safari 点击【分享按钮 ⎋】 -> 【添加到主屏幕】。")
    print("     即可变身全屏独立 App，支持 Apple Pencil 压感写字！")
    print("-" * 60)
    print("提示：保持此窗口开启，按 Ctrl + C 可关闭服务。\n")

    # 自动在电脑浏览器打开应用
    try:
        webbrowser.open(f'http://localhost:{PORT}/index.html')
    except Exception:
        pass

    try:
        with ThreadingHTTPServer(("0.0.0.0", PORT), NoCacheHTTPRequestHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务已关闭。祝小朋友练字天天进步！")
        sys.exit(0)
    except Exception as e:
        print(f"\n服务启动异常: {e}")
        print("您也可以直接在浏览器中打开 index.html 使用。")


if __name__ == '__main__':
    main()
