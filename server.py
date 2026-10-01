"""
server.py - 专为局域网和 iPad 访问设计的本地服务器
自动识别本机局域网 IP 地址，提供 iPad 访问地址，并启动 HTTP 服务
"""

import sys
import os

# 修复 Windows 控制台中文乱码与 Emoji 编码问题
if sys.platform == 'win32':
    try:
        os.system('chcp 65001 >nul')
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    except Exception:
        pass

import http.server
import socket
import socketserver
import webbrowser

PORT = 8080

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

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    local_ip = get_local_ip()

    print("=" * 60)
    print("  [快乐小书法家] 儿童练字 App 正在运行中")
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

    class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            super().end_headers()

    Handler = NoCacheHTTPRequestHandler
    socketserver.TCPServer.allow_reuse_address = True

    try:
        with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务已关闭。祝小朋友练字天天进步！")
        sys.exit(0)
    except Exception as e:
        print(f"\n服务启动异常: {e}")
        print("您也可以直接在浏览器中打开 index.html 使用。")

if __name__ == '__main__':
    main()
