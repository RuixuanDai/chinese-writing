# -*- coding: utf-8 -*-
import json
import re

file_path = 'js/char-data.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_cat = '''    ,{
        "id": "new_chars",
        "name": "🌈 更多生字",
        "color": "#a29bfe",
        "chars": [
            {
                "char": "春", "pinyin": "chūn", "en": "spring", "strokes": 9, "radical": "日",
                "words": ["春天", "春风"], "sentence": "春天来了，小花开放了。", "icon": "🌸", "label": "春天"
            },
            {
                "char": "夏", "pinyin": "xià", "en": "summer", "strokes": 10, "radical": "夂",
                "words": ["夏天", "夏季"], "sentence": "夏天我们可以去游泳。", "icon": "☀️", "label": "夏天"
            },
            {
                "char": "秋", "pinyin": "qiū", "en": "autumn", "strokes": 9, "radical": "禾",
                "words": ["秋天", "秋风"], "sentence": "秋天树叶都变黄了。", "icon": "🍂", "label": "秋天"
            },
            {
                "char": "冬", "pinyin": "dōng", "en": "winter", "strokes": 5, "radical": "夂",
                "words": ["冬天", "冬雪"], "sentence": "冬天会下白白的雪。", "icon": "⛄", "label": "冬天"
            },
            {
                "char": "快", "pinyin": "kuài", "en": "fast", "strokes": 7, "radical": "忄",
                "words": ["快乐", "飞快"], "sentence": "我每天都很快乐。", "icon": "😆", "label": "快乐"
            },
            {
                "char": "乐", "pinyin": "lè", "en": "happy", "strokes": 5, "radical": "丿",
                "words": ["快乐", "乐园"], "sentence": "游乐园真好玩！", "icon": "🎠", "label": "游乐园"
            }
        ]
    }
'''

# Find the end of the array
match = re.search(r'\];\s*function getCharInfo', content)
if match:
    insert_pos = match.start()
    new_content = content[:insert_pos] + new_cat + content[insert_pos:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Added new characters successfully.')
else:
    print('Could not find insert position.')