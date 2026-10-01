@echo off
cd /d "%~dp0"
python -u server.py
if errorlevel 1 (
    start "" "index.html"
)
