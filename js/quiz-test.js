/**
 * quiz-test.js - 🎮 汉字闯关乐园 (Game Park · 默认首页)
 *
 * 8 个寓教于乐的汉字小游戏（不显示题号与题量，题库随机无限出题）：
 *   ✍️ 看图写字   🎈 气球选字   👂 听音找字   🧩 组词填空
 *   🔢 数笔画     🔗 反义词连线  🃏 翻牌配对   🔨 汉字打地鼠
 *
 * 答对即时奖励金星（与扭蛋机 / 贴纸乐园联动），连对触发连击庆祝，熊猫老师全程语音陪伴。
 * 类名保持 ExamCenter 以兼容 app.js 中的 switchAppTab / activeAppTab 调用。
 */

// ==================== 1. 基础笔画类型（SVG 矢量图标，跨设备显示一致） ====================
const GP_STROKE_TYPES = {
    heng: { name: '横', d: 'M14 54 L86 46' },
    shu: { name: '竖', d: 'M50 12 L50 88' },
    pie: { name: '撇', d: 'M66 12 Q62 56 20 86' },
    dian: { name: '点', d: 'M38 30 Q56 44 62 66' },
    na: { name: '捺', d: 'M20 16 Q44 62 90 80' },
    ti: { name: '提', d: 'M20 80 L84 32' },
    hengzhe: { name: '横折', d: 'M16 24 L78 24 L78 86' },
    shuzhe: { name: '竖折', d: 'M24 14 L24 76 L86 76' },
    piezhe: { name: '撇折', d: 'M56 12 L22 62 L84 52' },
    shugou: { name: '竖钩', d: 'M56 10 L56 82 L36 68' },
    hengpie: { name: '横撇', d: 'M16 22 L76 22 L28 86' },
    hengzhegou: { name: '横折钩', d: 'M14 22 L80 22 L80 84 L62 72' },
    shuwangou: { name: '竖弯钩', d: 'M22 12 L22 68 Q22 82 38 82 L84 82 L84 62' },
    hengou: { name: '横钩', d: 'M14 36 L80 36 L62 54' }
};

// 易混笔画（出题时优先作为干扰项，帮助孩子辨析）
const GP_STROKE_FAMILIES = {
    heng: ['shu', 'ti', 'pie'],
    shu: ['heng', 'pie', 'shugou'],
    pie: ['na', 'shu', 'ti'],
    dian: ['pie', 'heng', 'ti'],
    na: ['pie', 'heng', 'shu'],
    ti: ['heng', 'pie', 'dian'],
    hengzhe: ['shuzhe', 'hengpie', 'hengzhegou'],
    shuzhe: ['hengzhe', 'shuwangou', 'piezhe'],
    piezhe: ['shuzhe', 'pie', 'hengpie'],
    shugou: ['shu', 'hengzhegou', 'shuwangou'],
    hengpie: ['hengzhe', 'pie', 'hengou'],
    hengzhegou: ['hengzhe', 'shugou', 'hengpie'],
    shuwangou: ['shuzhe', 'shugou', 'hengzhegou'],
    hengou: ['heng', 'hengpie', 'hengzhe']
};

// ==================== 2. 标准笔顺笔画名称（依据现代汉语通用字笔顺规范，'?' 表示不出题的笔画） ====================
const GP_STROKE_TYPE_DATA = {
    '一': 'heng', '二': 'heng heng', '三': 'heng heng heng', '十': 'heng shu',
    '人': 'pie na', '入': 'pie na', '大': 'heng pie na', '天': 'heng heng pie na', '太': 'heng pie na dian',
    '口': 'shu hengzhe heng', '日': 'shu hengzhe heng heng', '目': 'shu hengzhe heng heng heng',
    '田': 'shu hengzhe heng shu heng', '中': 'shu hengzhe heng shu', '上': 'shu heng heng', '下': 'heng shu dian',
    '土': 'heng shu heng', '木': 'heng shu pie na', '本': 'heng shu pie na heng', '禾': 'pie heng shu pie na',
    '米': 'dian pie heng shu pie na', '来': 'heng dian pie heng shu pie na', '水': 'shugou hengpie pie na',
    '火': 'dian pie pie na', '山': 'shu shuzhe shu', '出': 'shuzhe shu shu shuzhe shu',
    '石': 'heng pie shu hengzhe heng', '左': 'heng pie heng shu heng', '右': 'pie heng shu hengzhe heng',
    '月': 'pie hengzhegou heng heng', '立': 'dian heng dian pie heng', '去': 'heng shu heng piezhe dian',
    '坐': 'pie dian pie dian heng shu heng', '走': 'heng shu heng shu heng pie na', '小': 'shugou pie dian',
    '少': 'shu pie dian pie', '多': 'pie hengpie dian pie hengpie dian', '四': 'shu hengzhe pie ? heng',
    '五': 'heng shu hengzhe heng', '六': 'dian heng pie dian', '七': 'heng shuwangou', '八': 'pie na', '九': 'pie ?',
    '开': 'heng heng pie shu', '关': 'dian pie heng heng pie na',
    '高': 'dian heng shu hengzhe heng shu hengzhegou shu hengzhe heng',
    '低': 'pie shu pie ? heng ? dian',
    '前': 'dian pie heng shu hengzhegou heng heng shu shugou', '后': 'pie pie heng shu hengzhe heng',
    '里': 'shu hengzhe heng heng shu heng heng', '外': 'pie hengpie dian shu dian',
    '羊': 'dian pie heng heng heng shu', '牛': 'pie heng heng shu',
    '春': 'heng heng heng pie na shu hengzhe heng heng', '夏': 'heng pie shu hengzhe heng heng heng pie hengpie na',
    '秋': 'pie heng shu pie dian dian pie pie ?', '冬': 'pie hengpie na dian dian',
    '鱼': 'pie hengpie shu hengzhe heng shu heng heng', '马': 'hengzhe ? heng', '鸟': 'pie hengzhegou dian ? heng',
    '飞': '? pie dian',
    '手': 'pie heng heng shugou', '足': 'shu hengzhe heng shu heng pie na', '心': 'dian ? dian dian',
    '书': 'hengzhe hengzhegou shu dian', '学': 'dian dian pie dian hengou hengpie shugou heng',
    '子': 'hengpie shugou heng', '文': 'dian heng pie na', '白': 'pie shu hengzhe heng heng',
    '门': 'dian shu hengzhegou', '云': 'heng heng piezhe dian', '风': 'pie ? pie dian',
    '雨': 'heng shu hengzhegou shu dian dian dian dian', '几': 'pie ?', '生': 'pie heng heng shu heng',
    '见': 'shu hengzhe pie shuwangou', '只': 'shu hengzhe heng pie dian', '个': 'pie ? shu',
    '虫': 'shu hengzhe heng shu ti dian', '龙': 'heng pie shuwangou pie dian',
    '花': 'heng shu shu pie shu pie shuwangou', '叶': 'shu hengzhe heng heng shu',
    '竹': 'pie heng shu pie heng shugou', '光': 'shu dian pie heng pie shuwangou',
    '阳': '? shu shu hengzhe heng heng', '地': 'heng shu ti hengzhegou shu shuwangou',
    '电': 'shu hengzhe heng heng shuwangou', '耳': 'heng shu shu heng heng ti', '牙': 'heng shuzhe shugou pie',
    '头': 'dian dian heng pie dian', '儿': 'pie shuwangou', '老': 'heng shu heng pie pie shuwangou',
    '友': 'heng pie hengpie na', '习': 'hengzhegou dian ti', '写': 'dian hengou ? ? ?',
    '正': 'heng shu heng shu heng', '早': 'shu hengzhe heng heng heng shu',
    '永': 'dian hengzhegou hengpie pie na', '百': 'heng pie shu hengzhe heng heng', '千': 'pie heng shu',
    '万': 'heng hengzhegou pie', '东': 'heng piezhe shugou pie dian', '西': 'heng shu hengzhe pie ? heng',
    '北': 'shu heng ti pie shuwangou', '半': 'dian pie heng heng shu',
    '果': 'shu hengzhe heng heng heng shu pie na', '瓜': 'pie pie ? dian na',
    '豆': 'heng shu hengzhe heng dian pie heng', '红': 'piezhe piezhe ti heng shu heng',
    '车': 'heng piezhe heng shu', '舟': 'pie pie hengzhegou dian heng dian', '年': 'pie heng heng shu heng shu',
    '会': 'pie na heng heng piezhe dian', '妈': '? pie ti hengzhe ? heng', '江': 'dian dian ti heng shu heng',
    '冰': 'dian ti shugou hengpie pie na', '边': 'hengzhegou pie dian ? ?',
    '虎': 'shu heng hengou pie heng shuwangou pie ?', '兔': 'pie hengpie shu hengzhe heng pie shuwangou dian',
    '鸭': 'shu hengzhe heng heng shu pie hengzhegou dian ? heng', '龟': 'pie hengpie shu hengzhe heng heng shuwangou',
    '鸡': 'hengpie dian pie hengzhegou dian ? heng', '豹': 'pie dian dian pie ? ? ? pie hengzhegou dian',
    '狗': 'pie ? pie pie hengzhegou shu hengzhe heng', '狸': 'pie ? pie shu hengzhe heng heng shu heng heng',
    '海': 'dian dian ti pie heng shuzhe ? dian heng dian', '狮': 'pie ? pie shu pie heng shu hengzhegou shu',
    '星': 'shu hengzhe heng heng pie heng heng shu heng', '林': 'heng shu pie dian heng shu pie na',
    '空': 'dian dian hengou pie dian heng shu heng', '树': 'heng shu pie dian hengpie dian heng shugou dian',
    '河': 'dian dian ti heng shu hengzhe heng shugou', '泉': 'pie shu hengzhe heng heng shugou hengpie pie na',
    '狼': 'pie ? pie dian hengzhe heng heng ? pie na', '阴': '? shu pie hengzhegou heng heng',
    '虹': 'shu hengzhe heng shu ti dian heng shu heng', '爸': 'pie dian pie na hengzhe shu heng shuwangou',
    '家': 'dian dian hengou heng pie ? pie pie pie na', '弟': 'dian pie hengzhe heng ? shugou pie',
    '妹': 'piezhe pie heng heng heng shu pie na', '身': 'pie shu hengzhegou heng heng ti pie',
    '泥': 'dian dian ti hengzhe heng pie pie shuwangou', '哥': 'heng shu hengzhe heng shu heng shu hengzhe heng shugou',
    '爷': 'pie dian pie na ? shu', '奶': 'piezhe pie heng ? pie',
    '眉': 'hengzhe shu heng pie shu hengzhe heng heng heng', '骨': 'shu hengzhe hengzhe dian hengou shu hengzhegou heng heng',
    '姐': 'piezhe pie heng shu hengzhe heng heng heng', '亲': 'dian heng dian pie heng heng shugou pie dian',
    '读': 'dian ? heng shu hengou dian dian heng pie dian', '校': 'heng shu pie dian dian heng pie dian pie na',
    '笔': 'pie heng dian pie heng dian pie heng heng shuwangou', '幼': 'piezhe piezhe dian hengzhegou pie',
    '课': 'dian ? shu hengzhe heng heng heng shu pie na', '师': 'shu pie heng shu hengzhegou shu',
    '问': 'dian shu hengzhegou shu hengzhe heng', '听': 'shu hengzhe heng pie pie heng shu',
    '诗': 'dian ? heng shu heng heng shugou dian', '说': 'dian ? dian pie shu hengzhe heng pie shuwangou',
    '知': 'pie heng heng pie dian shu hengzhe heng', '画': 'heng shu hengzhe heng shu heng shuzhe shu',
    '乐': 'pie shuzhe shugou pie dian', '思': 'shu hengzhe heng shu heng dian ? dian dian',
    '识': 'dian ? shu hengzhe heng pie dian', '草': 'heng shu shu shu hengzhe heng heng heng shu',
    '记': 'dian ? hengzhe heng shuwangou', '亿': 'pie shu ?', '远': 'heng heng pie shuwangou dian ? ?',
    '狐': 'pie ? pie pie pie ? dian na', '初': 'dian hengpie shu pie dian hengzhegou pie',
    '南': 'heng shu shu hengzhegou dian pie heng heng shu', '桃': 'heng shu pie dian pie dian ti shuwangou pie dian',
    '册': 'pie hengzhegou pie hengzhegou heng', '奖': 'dian ti shu pie hengpie dian heng pie na',
    '李': 'heng shu pie na hengpie shugou heng', '面': 'heng pie shu hengzhegou shu shu heng heng heng',
    '末': 'heng heng shu pie na', '近': 'pie pie heng shu dian ? ?',
    '间': 'dian shu hengzhegou shu hengzhe heng heng', '香': 'pie heng shu pie na shu hengzhe heng heng',
    '肉': 'shu hengzhegou pie dian pie dian', '饭': 'pie hengou ? pie pie hengpie na',
    '茶': 'heng shu shu pie na heng shugou pie dian', '杏': 'heng shu pie na shu hengzhe heng',
    '汤': 'dian dian ti ? pie pie', '麦': 'heng heng shu heng pie hengpie na',
    '爱': 'pie dian dian pie dian hengou heng pie hengpie na', '美': 'dian pie heng heng shu heng heng pie na',
    '礼': 'dian hengpie shu dian shuwangou', '莓': 'heng shu shu pie heng shuzhe ? dian heng dian',
    '和': 'pie heng shu pie dian shu hengzhe heng', '诚': 'dian ? heng pie hengzhegou ? pie dian',
    '仁': 'pie shu heng heng', '信': 'pie shu dian heng heng heng shu hengzhe heng',
    '青': 'heng heng shu heng shu hengzhegou heng heng', '宽': 'dian dian hengou heng shu shu shu hengzhe pie shuwangou',
    '恒': 'dian dian shu heng shu hengzhe heng heng heng', '看': 'pie heng heng pie shu hengzhe heng heng heng',
    '俭': 'pie shu pie na heng dian dian pie heng', '抬': 'heng shugou ti piezhe dian shu hengzhe heng',
    '招': 'heng shugou ti hengzhegou pie shu hengzhe heng', '勇': 'hengpie dian shu hengzhegou heng heng shu hengzhegou pie',
    '抱': 'heng shugou ti pie hengzhegou hengzhe heng shuwangou', '快': 'dian dian shu hengzhe heng pie na',
    '追': 'pie shu hengzhe heng hengzhe heng dian ? ?', '动': 'heng heng piezhe dian hengzhegou pie',
    '房': 'dian hengzhe heng pie dian heng hengzhegou pie', '城': 'heng shu ti heng pie hengzhegou ? pie dian',
    '市': 'dian heng shu hengzhegou shu', '迈': 'heng hengzhegou pie dian ? ?',
    '屋': 'hengzhe heng pie heng piezhe dian heng shu heng', '站': 'dian heng dian pie ti shu heng shu hengzhe heng',
    '桥': 'heng shu pie dian pie heng pie na pie shu', '院': '? shu dian dian hengou heng heng pie shuwangou',
    '节': 'heng shu shu ? shu', '庆': 'dian heng pie heng pie na',
    '亭': 'dian heng shu hengzhe heng dian hengou heng shugou', '轨': 'heng piezhe shu ti pie ?',
    '贺': 'hengzhegou pie shu hengzhe heng shu hengzhe pie dian', '桔': 'heng shu pie dian heng shu heng shu hengzhe heng',
    '饼': 'pie hengou ? dian pie heng heng pie shu', '团': 'shu hengzhe heng shugou pie heng',
    '圆': 'shu hengzhe shu hengzhe heng shu hengzhe pie dian heng', '灯': 'dian pie pie dian heng shugou',
    '戏': 'hengpie dian heng ? pie dian', '钟': 'pie heng heng heng ? shu hengzhe heng shu',
    '玩': 'heng heng shu ti heng heng pie shuwangou',
    '女': '? pie heng', '男': 'shu hengzhe heng shu heng hengzhegou pie',
    '我': 'pie heng shugou ti ? pie dian', '你': 'pie shu pie hengou shugou pie dian',
    '好': '? pie heng hengpie shugou heng', '王': 'heng heng shu heng',
    '工': 'heng shu heng', '主': 'dian heng heng shu heng',
    '今': 'pie na dian hengpie', '明': 'shu hengzhe heng heng pie hengzhegou heng heng',
    '午': 'pie heng heng shu', '苗': 'heng shu shu shu hengzhe heng shu heng',
    '芽': 'heng shu shu heng piezhe shugou pie', '根': 'heng shu pie dian hengzhe heng heng ? pie na',
    '枝': 'heng shu pie dian heng shu hengpie na', '松': 'heng shu pie dian pie dian piezhe dian',
    '柳': 'heng shu pie dian pie ? pie hengzhegou shu', '荷': 'heng shu shu pie shu heng shu hengzhe heng shugou',
    '虾': 'shu hengzhe heng shu ti dian heng shu dian', '贝': 'shu hengzhe pie dian',
    '哭': 'shu hengzhe heng shu hengzhe heng heng pie na dian', '笑': 'pie heng dian pie heng dian pie heng pie na',
    '穿': 'dian dian hengou pie dian heng piezhe shugou pie', '洗': 'dian dian ti pie heng shu heng pie shuwangou',
    '扫': 'heng shugou ti hengzhe heng heng', '拍': 'heng shugou ti pie shu hengzhe heng heng',
    '拉': 'heng shugou ti dian heng dian pie heng', '吹': 'shu hengzhe heng pie hengou pie na',
    '饺': 'pie hengou ? dian heng pie dian pie na', '勺': 'pie hengzhegou dian',
    '盐': 'heng shu ti shu dian shu hengzhe shu shu heng', '油': 'dian dian ti shu hengzhe heng shu heng',
    '字': 'dian dian hengou hengpie shugou heng', '词': 'dian ? hengzhegou heng shu hengzhe heng',
    '句': 'pie hengzhegou shu hengzhe heng', '纸': 'piezhe piezhe ti pie ? heng ?',
    '灰': 'heng pie dian pie pie na', '粉': 'dian pie heng shu pie dian pie na hengzhegou pie',
    '金': 'pie na heng heng shu dian pie heng', '玉': 'heng heng shu heng dian',
    '宝': 'dian dian hengou heng heng shu heng dian', '方': 'dian heng hengzhegou pie',
    '长': 'pie heng ? na', '冷': 'dian ti pie na dian hengpie dian',
    '热': 'heng shugou ti pie ? dian dian dian dian dian', '旧': 'shu shu hengzhe heng heng',
    '轻': 'heng piezhe shu ti hengpie dian heng shu heng', '重': 'pie heng shu hengzhe heng heng shu heng heng',
    '干': 'heng heng shu', '净': 'dian ti pie hengou hengzhe heng heng shugou',
    '苦': 'heng shu shu heng shu shu hengzhe heng', '坏': 'heng shu ti heng pie shu dian',
    '对': 'hengpie dian heng shugou dian', '进': 'heng heng pie shu dian ? na',
    '退': 'hengzhe heng heng ? pie dian dian ? na', '浅': 'dian dian ti heng heng ? pie dian',
    '细': 'piezhe piezhe ti shu hengzhe heng shu heng', '胖': 'pie hengzhegou heng heng dian pie heng heng shu',
    '衣': 'dian heng pie ? pie na', '袜': 'dian hengpie shu pie dian heng heng shu pie na',
    '伞': 'pie na dian pie heng shu', '刀': 'hengzhegou pie',
    '尺': 'hengzhe heng pie na', '包': 'pie hengzhegou hengzhe heng shuwangou',
    '床': 'dian heng pie heng shu pie na', '桌': 'shu heng shu hengzhe heng heng heng shu pie na',
    '国': 'shu hengzhe heng heng shu heng dian heng', '华': 'pie shu pie shuwangou heng shu',
    '京': 'dian heng shu hengzhe heng shugou pie dian', '村': 'heng shu pie dian heng shugou dian',
    '乡': 'piezhe piezhe pie', '园': 'shu hengzhe heng heng pie shuwangou heng',
    '场': 'heng shu ti ? pie pie', '店': 'dian heng pie shu heng shu hengzhe heng',
    '机': 'heng shu pie dian pie ?', '铁': 'pie heng heng heng ? pie heng heng pie na'
};

// ==================== 3. 反义词好朋友（35 组，可配小图标帮助理解，支持按年级筛选） ====================
const GP_ANTONYM_PAIRS = [
    { a: '大', b: '小', ea: '🐘', eb: '🐭', g: 'k-1' }, { a: '多', b: '少', ea: '🍇', eb: '🍒', g: 'k' }, { a: '上', b: '下', ea: '⬆️', eb: '⬇️', g: 'k-1' },
    { a: '左', b: '右', ea: '⬅️', eb: '➡️', g: 'k-1' }, { a: '出', b: '入', ea: '🚪', eb: '🏠', g: 'k' }, { a: '来', b: '去', ea: '👋', eb: '🚶', g: 'k' },
    { a: '开', b: '关', ea: '🔓', eb: '🔒', g: 'k-1' }, { a: '高', b: '低', ea: '🦒', eb: '🐜', g: 'g1' }, { a: '前', b: '后', g: 'g1' },
    { a: '里', b: '外', ea: '📦', eb: '🌳', g: 'g1' }, { a: '远', b: '近', ea: '🔭', eb: '🔍', g: 'g1' }, { a: '长', b: '短', ea: '🐍', eb: '🐛', g: 'k' },
    { a: '黑', b: '白', ea: '⚫', eb: '⚪', g: 'k' }, { a: '冷', b: '热', ea: '🥶', eb: '🥵', g: 'g2' },
    { a: '快', b: '慢', ea: '🐇', eb: '🐢', g: 'g2' }, { a: '早', b: '晚', ea: '🌅', eb: '🌙', g: 'k' },
    { a: '天', b: '地', ea: '☁️', eb: '🌏', g: 'k-1' }, { a: '东', b: '西', g: 'g1' }, { a: '南', b: '北', g: 'g1' },
    { a: '男', b: '女', ea: '👦', eb: '👧', g: 'k-1' }, { a: '有', b: '无', g: 'g1' }, { a: '胖', b: '瘦', ea: '🐼', eb: '🏃', g: 'g2' },
    { a: '好', b: '坏', ea: '👍', eb: '👎', g: 'g2' }, { a: '新', b: '旧', ea: '✨', eb: '🕰️', g: 'g2' }, { a: '对', b: '错', ea: '✅', eb: '❌', g: 'g2' },
    { a: '哭', b: '笑', ea: '😭', eb: '😄', g: 'k' }, { a: '买', b: '卖', ea: '🛒', eb: '🏷️', g: 'g2' }, { a: '真', b: '假', g: 'g3' },
    { a: '正', b: '反', g: 'g2' }, { a: '轻', b: '重', ea: '🪶', eb: '🏋️', g: 'g2' }, { a: '深', b: '浅', g: 'g2' }, { a: '粗', b: '细', g: 'g2' },
    { a: '甜', b: '苦', ea: '🍬', eb: '🍵', g: 'g2' }, { a: '方', b: '圆', ea: '🟦', eb: '🔵', g: 'k' }, { a: '进', b: '退', g: 'g2' }
];

// 抽象字及纯情境插画字（不适合单靠看图猜字，仍用于听音 / 组词 / 数笔画游戏）
const GP_ABSTRACT_CHARS = '大小中来去出入空光地子文白几太生会见只个学习写读正永课问说答乐思知识记算题百千万亿东西南北左右前后边间里外半零初末高低远近多少爱善美诚礼信仁德和敬勤俭宽勇恒想动快节年喜庆贺谜团圆戏福愿甜香亲幼今明午晚好坏对错长短进退深浅冷热新旧轻重干粗细胖瘦主方我你词句华乡';
// 看图默写不出的字（图片难以唯一对应）
const GP_WRITE_EXCLUDE = '只个会几习写永半正生见太友老本早东西北百千万主方我你今明午晚词句好坏对错长短进退深浅冷热新旧轻重干粗细胖瘦华乡';
// 插画里直接画有汉字的字（会泄露答案，不用于看图类游戏）
const GP_TEXT_IN_PICTURE = '只个师粮站喜贺谜饼联福万东西南北左右习早永课识字';

// 意思/画面元素相近的字组：互不作为干扰项，翻牌时不同时出现，彻底避免看图选字歧义
const GP_SIMILAR_GROUPS = [
    '天空晴云日阳虹霞夏热明晚午', '雨云阴雷电雾伞', '雪冰冬霜冷', '雾露霜', '星月夜晚',
    '水江河湖海泉露冰汤茶深浅洗净油', '海港舟船桥鱼鲸龟游虾蟹贝宝',
    '木树林叶秋霜根枝松柳村', '树果桃李梨橙桔杏瓜', '花草春芽苗禾竹菜叶兰梅莲菊荷苦', '土地泥田山石禾苗草根芽',
    '山石高登村乡', '房屋院楼家亲校城亭塔门开关市街道桥村乡园场店京国华窗床桌椅', '车路道街站轨桥市机铁', '港塔灯火光明红日阳京华',
    '人儿友哥弟姐妹爸妈爷奶老师幼立身头脸坐走跑跳迈登追游抱招抬唱读看笑哭腹男女我你王主工穿洗扫拍拉推吹睡',
    '头脸目眉口鼻耳牙心腹手足身看听唱笑哭吹睡镜',
    '手握抱招抬拍拉推扫洗一二三四五六七八九十', '一二三红黄蓝球粉灰', '上下里外玩球红黄橙',
    '足走跑跳迈登追立坐进退鞋袜',
    '米饭粮麦面禾豆饼团圆蛋糕饺碗筷勺盘盐油', '果桃李梨橙桔杏瓜菜苦酸甜',
    '鸟雁燕鹤鸡鸭鹅飞春蛋', '鱼鲸龟海虾蟹贝', '狗狼狐狸鼠', '猫虎豹狮鼠', '虫蝶蜂追蛇虾蟹',
    '书本册读学诗画笔写字词句纸墨琴棋尺刀包桌椅', '画笔红粉', '画笔黄', '画笔蓝', '画笔绿', '画笔黑灰', '画笔紫', '画笔青', '画笔白',
    '蓝青', '绿青', '红紫粉', '黑白灰银', '金银玉宝王主',
    '唱歌乐听耳琴', '看望见目镜', '福喜庆贺年节团圆灯龙国华京',
    '衣帽鞋袜伞穿包干新旧'
];

// 字形相近的字（作为干扰项，练习细致辨认）
const GP_VISUAL_CONFUSERS = {
    '日': '目白田电旧', '目': '日白自贝', '白': '日百自', '田': '日电男', '电': '田', '木': '禾本米村机', '禾': '木米',
    '本': '木', '米': '来木粉', '来': '米', '大': '天太人', '天': '大', '太': '大', '人': '入八大今伞', '入': '人八',
    '八': '人入', '土': '上工王干', '上': '土下', '下': '上', '千': '十干午', '十': '千干午', '口': '日中田国园', '中': '口虫',
    '山': '出', '出': '山', '牛': '年午生', '年': '牛午', '鸟': '马鸡鸭', '马': '鸟妈', '儿': '几九', '几': '儿九机', '九': '儿几刀',
    '万': '方刀', '方': '万刀', '石': '右', '右': '石左', '左': '右工', '少': '小沙', '小': '少水', '去': '云', '云': '去会',
    '水': '永冰', '冰': '水冷净', '永': '水衣', '东': '车', '车': '东轻', '早': '草什', '草': '早苗苦荷', '江': '红河洗油', '红': '江纸细',
    '虫': '中虾蛇', '竹': '个笑筷笔', '门': '问间', '问': '门间', '鱼': '鸟', '叶': '十', '立': '六拉', '六': '立',
    '王': '主玉工土', '主': '王玉', '玉': '王主宝国', '工': '土王干左', '干': '千十土工午', '午': '牛干千',
    '刀': '力几九万尺', '尺': '刀尸', '贝': '见目', '见': '贝', '今': '人会伞', '明': '日月朋', '我': '找成', '你': '他',
    '女': '妈姐妹好', '子': '字好学', '字': '子宝学', '包': '句勺抱', '勺': '包句', '句': '包勺'
};

// 看图写字专属优选双字提示词（彻底消除同义画面歧义，如「太阳」区分“阳/日”，「开门」区分“开/门”）
const GP_PW_CLUE_WORDS = {
    '一': '第一', '二': '二月', '三': '三个', '四': '四季', '五': '五星',
    '六': '六月', '七': '七色', '八': '八方', '九': '九月', '十': '十分',
    '人': '大人', '入': '出入', '出': '出来', '来': '本来', '去': '出去',
    '日': '红日', '阳': '太阳', '光': '月光', '水': '喝水', '江': '长江', '冰': '冰雪',
    '土': '泥土', '地': '大地', '田': '水田', '木': '木头', '禾': '禾苗',
    '口': '张口', '牙': '刷牙', '目': '目光', '眉': '眉毛', '耳': '耳朵', '足': '手足', '走': '走路',
    '头': '头发', '身': '身体', '子': '孩子', '儿': '儿童', '妈': '爸妈',
    '家': '家人', '房': '房屋', '屋': '屋子', '院': '院子', '门': '大门', '开': '开门', '关': '关门',
    '书': '看书', '学': '学习', '文': '语文', '抬': '抬起', '钟': '时钟',
    '边': '河边', '里': '家里', '外': '外面', '后': '后面',
    '王': '国王', '工': '工人', '鼠': '松鼠', '蛇': '小蛇', '虾': '小虾', '蟹': '螃蟹', '贝': '贝壳',
    '苗': '禾苗', '芽': '发芽', '根': '树根', '枝': '树枝', '松': '松树', '柳': '柳树', '荷': '荷花',
    '女': '女孩', '男': '男孩', '纸': '白纸', '墨': '笔墨', '琴': '钢琴', '棋': '下棋',
    '蛋': '鸡蛋', '糕': '蛋糕', '饺': '饺子', '碗': '饭碗', '筷': '筷子', '勺': '勺子', '盘': '盘子',
    '盐': '食盐', '油': '香油', '苦': '苦瓜', '酸': '酸梅', '灰': '灰色', '粉': '粉色',
    '金': '黄金', '银': '白银', '玉': '美玉', '宝': '宝石', '哭': '哭泣', '笑': '微笑',
    '睡': '睡觉', '穿': '穿衣', '洗': '洗手', '扫': '扫地', '拍': '拍球', '拉': '拉车', '推': '推车', '吹': '吹风',
    '国': '祖国', '京': '北京', '村': '山村', '园': '公园', '场': '操场', '店': '商店', '机': '飞机', '铁': '磁铁',
    '衣': '衣服', '帽': '帽子', '鞋': '球鞋', '袜': '袜子', '伞': '雨伞', '刀': '小刀', '尺': '尺子', '包': '书包',
    '床': '小床', '桌': '书桌', '椅': '椅子', '窗': '窗户', '球': '皮球', '镜': '镜子', '慢': '慢慢', '净': '干净'
};

// 组词填空：多音字读音修正 & 不宜配单字插画的转义复合词
const GP_WORD_PINYIN_OVERRIDES = {
    '音乐:1': 'yuè', '少儿:0': 'shào', '年少:1': 'shào', '少幼:0': 'shào'
};
const GP_WORD_NO_IMAGE = new Set([
    '马上', '开心', '关心', '小心', '点心', '中心', '放心', '用心', '好心',
    '生气', '客气', '力气', '东西', '花生', '火车', '风车', '水手', '明白',
    '大人', '小人', '高人', '大方', '多少', '大小', '高低', '长短', '早晚'
]);

// ==================== 4. 游戏列表 ====================
const GP_GAMES = [
    { id: 'picwrite', icon: '✍️', title: '看图写字', desc: '看图片，凭记忆写出汉字', theme: 'orange', intro: '图上画的是什么？在米字格里写出来吧！' },
    { id: 'balloon', icon: '🎈', title: '气球选字', desc: '看图片，戳破正确的气球', theme: 'pink', intro: '图上是什么字？戳破写着这个字的气球！' },
    { id: 'listen', icon: '👂', title: '听音找字', desc: '听声音，找出读到的字', theme: 'blue', intro: '仔细听，找出我读的是哪个字！' },
    { id: 'word', icon: '🧩', title: '组词填空', desc: '选一个字，拼成词语', theme: 'purple', intro: '听一听，选一个字把词语补完整！' },
    { id: 'stroke', icon: '🔢', title: '数笔画', desc: '数一数，汉字有几画', theme: 'amber', intro: '数一数，这个字一共有几画？' },
    { id: 'antonym', icon: '🔗', title: '反义词连线', desc: '找朋友，连连意思相反的字', theme: 'teal', intro: '先点左边的字，再点右边意思相反的字！' },
    { id: 'memory', icon: '🎴', title: '翻牌配对', desc: '翻翻看，图片配汉字', theme: 'indigo', intro: '翻开两张牌，把图片和汉字配成好朋友！' },
    { id: 'mole', icon: '🔨', title: '汉字打地鼠', desc: '看图听音，敲出正确的字', theme: 'green', intro: '地鼠举着汉字冒出来啦！敲出和图片一样的字！' }
];

const GP_CN_NUM = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
const GP_PRAISES = ['太棒啦！', '答对啦！', '真厉害！', '好眼力！', '你真聪明！', '完全正确！', '了不起！'];

function gpShuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function gpPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function gpToneless(py) {
    return (py || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ü/g, 'v').toLowerCase().trim();
}

function gpStrokeIcon(typeId) {
    const t = GP_STROKE_TYPES[typeId];
    if (!t) return '';
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${t.d}" fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

class ExamCenter {
    constructor(app) {
        this.app = app;
        this.activeAppTab = 'exam'; // 默认首页：闯关乐园
        this.activeGame = null;     // null = 游戏大厅
        this.examCanvas = null;
        this._isInitialized = false;

        this.timers = new Set();
        this.moleTimers = new Set();
        this.queues = {};
        this.lastPicked = {};
        this.combo = 0;
        this.sessionStars = 0;
        this.introSpoken = {};
        this.svgUid = 0;
        this.strokeAnimTimer = null;

        this.storedStars = this.loadJSON('kid_app_game_stars_v1', {});
        this.weakChars = this.loadJSON('kid_app_weak_chars_v1', {});
        this.scopeMode = 'all'; // 'all' | 'cat' | 'weak'
        this.gradeFilter = this.loadJSON('kid_app_grade_filter_v1', 'all'); // 'all' | 'k-1' | 'k' | 'g1' | 'g2' | 'g3'
        this.difficulty = this.loadJSON('kid_app_difficulty_v1', 'standard'); // 'easy' | 'standard' | 'hard'
        this.todayStats = this.loadToday();
    }

    // ==================== 初始化与数据池 ====================
    initIfNeeded() {
        if (this._isInitialized) return;
        this._isInitialized = true;

        this.buildPools();

        if (typeof HandwritingCanvas === 'function' && document.getElementById('examDrawCanvas')) {
            this.examCanvas = new HandwritingCanvas('examGridCanvas', 'examDrawCanvas', 'exam-canvas-box');
            this.examCanvas.setTraceSettings(false);
            if (this.app && this.app.canvasEngine) {
                this.examCanvas.setPalmRejection(this.app.canvasEngine.palmRejection);
            }
        }

        this.bindEvents();
        this.showHub();
    }

    buildPools() {
        const cats = (typeof CHARACTER_CATEGORIES !== 'undefined') ? CHARACTER_CATEGORIES : (window.CHARACTER_CATEGORIES || []);
        const illMap = window.CHARACTER_ILLUSTRATION_MAP || {};
        const cache = window.STROKE_DATA_CACHE || {};

        this.charInfoMap = {};
        cats.forEach(cat => {
            (cat.chars || []).forEach(item => {
                if (!item || !item.char || this.charInfoMap[item.char]) return;
                const info = (typeof getCharInfo === 'function' ? getCharInfo(item.char) : null) || item;
                this.charInfoMap[item.char] = {
                    char: item.char,
                    pinyin: info.pinyin || item.pinyin || '',
                    words: Array.isArray(info.words) ? info.words.filter(w => typeof w === 'string') : [],
                    image: info.image || item.image || illMap[item.char] || '',
                    catId: cat.id,
                    grade: info.grade || item.grade || 'g1',
                    difficulty: info.difficulty || item.difficulty || 2
                };
            });
        });

        const abstract = new Set(GP_ABSTRACT_CHARS);
        const writeEx = new Set(GP_WRITE_EXCLUDE);
        const textInPic = new Set(GP_TEXT_IN_PICTURE);
        this.allChars = Object.keys(this.charInfoMap);
        this.picturePool = this.allChars.filter(ch => this.charInfoMap[ch].image && !abstract.has(ch) && !textInPic.has(ch));
        this.picturePoolSet = new Set(this.picturePool);
        this.listenPool = this.allChars.filter(ch => this.charInfoMap[ch].pinyin);
        this.writingPool = this.allChars.filter(ch => cache[ch] && cache[ch].medians && cache[ch].medians.length <= 10
            && this.charInfoMap[ch].image && !abstract.has(ch) && !writeEx.has(ch) && !textInPic.has(ch));
        this.strokePool = Object.keys(cache).filter(ch => cache[ch].medians && cache[ch].medians.length <= 10);

        // 组词填空题库：所有双字词（排除叠词）
        this.allWords = new Set();
        this.wordPool = [];
        this.allChars.forEach(ch => this.charInfoMap[ch].words.forEach(w => this.allWords.add(w)));
        this.allChars.forEach(ch => {
            const seen = new Set();
            this.charInfoMap[ch].words.forEach(w => {
                if (w.length !== 2 || w[0] === w[1] || seen.has(w)) return;
                const idx = w.indexOf(ch);
                if (idx < 0) return;
                seen.add(w);
                this.wordPool.push({ target: ch, word: w, idx });
            });
        });

        if (!this.writingPool.length) this.writingPool = Object.keys(cache);
        if (!this.picturePool.length) this.picturePool = this.allChars.slice();
        if (!this.listenPool.length) this.listenPool = this.allChars.slice();
    }

    info(ch) {
        return this.charInfoMap ? this.charInfoMap[ch] : null;
    }

    py(ch) {
        const info = this.info(ch);
        return info ? info.pinyin : '';
    }

    // 提取题目条目对应的目标汉字（兼容单字字符串或 { target, word, idx } 组词对象）
    itemChar(item) {
        if (!item) return '';
        return typeof item === 'string' ? item : (item.target || '');
    }

    // 根据当前学龄分级（K-1 / K / G1 / G2 / G3）与出题范围模式过滤题池，并在题数不足时平滑兜底
    filterPoolByScope(pool) {
        if (!pool || !pool.length) return pool;
        let base = pool;
        if (this.gradeFilter && this.gradeFilter !== 'all') {
            const byGrade = pool.filter(it => {
                const info = this.info(this.itemChar(it));
                return info && info.grade === this.gradeFilter;
            });
            if (byGrade.length >= 4) base = byGrade;
        }
        if (this.scopeMode === 'all') return base;
        if (this.scopeMode === 'cat') {
            const catId = (this.app && this.app.currentCategory) || 'starter';
            const filtered = base.filter(it => {
                const info = this.info(this.itemChar(it));
                return info && info.catId === catId;
            });
            if (filtered.length >= 4) return filtered;
            const catAllGrades = pool.filter(it => {
                const info = this.info(this.itemChar(it));
                return info && info.catId === catId;
            });
            return catAllGrades.length >= 4 ? catAllGrades : base;
        }
        if (this.scopeMode === 'weak') {
            const weakKeys = new Set(Object.keys(this.weakChars || {}).filter(k => this.weakChars[k] > 0));
            const weakFiltered = base.filter(it => weakKeys.has(this.itemChar(it)));
            if (weakFiltered.length >= 4) return weakFiltered;
            const completed = new Set((this.app && Array.isArray(this.app.completedChars)) ? this.app.completedChars : []);
            const unmastered = base.filter(it => weakKeys.has(this.itemChar(it)) || !completed.has(this.itemChar(it)));
            return unmastered.length >= 4 ? unmastered : base;
        }
        return base;
    }

    // 切换学龄分级（并可联动推荐难度）
    setGradeFilter(gradeId, syncDefaultDiff = true, fromApp = false) {
        const grades = window.CHARACTER_GRADES || [];
        const gMeta = grades.find(g => g.id === gradeId) || { id: 'all', name: '🌈 全部学龄', defaultDiff: 'standard' };
        this.gradeFilter = gMeta.id;
        this.saveJSON('kid_app_grade_filter_v1', this.gradeFilter);
        if (syncDefaultDiff && gMeta.defaultDiff) {
            this.difficulty = gMeta.defaultDiff;
            this.saveJSON('kid_app_difficulty_v1', this.difficulty);
        }
        this.queues = {};
        this.renderLevelBar();
        if (!fromApp && this.app && typeof this.app.onGradeOrDiffChange === 'function') {
            this.app.onGradeOrDiffChange(this.gradeFilter, this.difficulty, true);
        }
        if (!fromApp && this.app && typeof this.app.showToast === 'function') {
            const dMeta = (window.CHARACTER_DIFFICULTIES || []).find(d => d.id === this.difficulty);
            const count = this.gradeFilter === 'all'
                ? this.allChars.length
                : this.allChars.filter(c => this.info(c) && this.info(c).grade === this.gradeFilter).length;
            this.app.showToast(`🎓 已切换为【${gMeta.name}】（共 ${count} 字）· 难度：${dMeta ? dMeta.name : this.difficulty}`);
        }
    }

    // 切换闯关与评测难度（easy / standard / hard）
    setDifficulty(diffId, fromApp = false) {
        const diffs = window.CHARACTER_DIFFICULTIES || [];
        const dMeta = diffs.find(d => d.id === diffId) || { id: 'standard', name: '⭐ 标准闯关', desc: '' };
        this.difficulty = dMeta.id;
        this.saveJSON('kid_app_difficulty_v1', this.difficulty);
        this.renderLevelBar();
        if (!fromApp && this.app && typeof this.app.onGradeOrDiffChange === 'function') {
            this.app.onGradeOrDiffChange(this.gradeFilter, this.difficulty, true);
        }
        if (!fromApp && this.app && typeof this.app.showToast === 'function') {
            this.app.showToast(`⚡ 已切换为【${dMeta.name}】：${dMeta.desc}`);
        }
        // 若正在舞台游戏中，立即刷新当前小游戏题目以应用新难度
        if (!fromApp && this.activeGame) {
            this.enterGame(this.activeGame);
        }
    }

    // 渲染大厅学龄分级与难度筛选栏 + 舞台顶部难度徽章
    renderLevelBar() {
        const grades = window.CHARACTER_GRADES || [
            { id: 'all', name: '🌈 全部学龄', short: '全部', age: '3-9岁' },
            { id: 'k-1', name: '🐣 K-1 启蒙', short: 'K-1', age: '3-4岁' },
            { id: 'k',   name: '🌱 K班 学前', short: 'K班', age: '4-5岁' },
            { id: 'g1',  name: '🌿 G1 一年级', short: 'G1', age: '5-6岁' },
            { id: 'g2',  name: '🌳 G2 二年级', short: 'G2', age: '6-7岁' },
            { id: 'g3',  name: '🏆 G3 进阶',  short: 'G3+', age: '7-9岁' }
        ];
        const diffs = window.CHARACTER_DIFFICULTIES || [
            { id: 'easy',     name: '🌱 轻松启蒙', short: '🌱 轻松', desc: '3选项 · 慢速 · 自动拼音提示' },
            { id: 'standard', name: '⭐ 标准闯关', short: '⭐ 标准', desc: '4选项 · 标准速度 · 词组提示' },
            { id: 'hard',     name: '🔥 挑战进阶', short: '🔥 挑战', desc: '6选项 · 形近字干扰 · 严格评分' }
        ];

        const gradeContainer = document.getElementById('game-grade-pills');
        if (gradeContainer) {
            gradeContainer.innerHTML = grades.map(g => {
                const count = g.id === 'all'
                    ? (this.allChars ? this.allChars.length : 400)
                    : (this.allChars ? this.allChars.filter(c => this.info(c) && this.info(c).grade === g.id).length : 0);
                const active = this.gradeFilter === g.id ? 'active' : '';
                return `<button type="button" class="gp-grade-pill ${active}" data-grade="${g.id}" title="${g.name}（${g.age} · ${count}字）">
                    <span class="gp-pill-name">${g.name}</span>
                    <span class="gp-pill-sub">${g.age} · ${count}字</span>
                </button>`;
            }).join('');
        }

        const diffContainer = document.getElementById('game-diff-pills');
        if (diffContainer) {
            diffContainer.innerHTML = diffs.map(d => {
                const active = this.difficulty === d.id ? 'active' : '';
                return `<button type="button" class="gp-diff-pill diff-${d.id} ${active}" data-diff="${d.id}" title="${d.name}：${d.desc}">
                    <span class="gp-pill-name">${d.name}</span>
                    <span class="gp-pill-sub">${d.desc}</span>
                </button>`;
            }).join('');
        }

        const gCur = grades.find(g => g.id === this.gradeFilter) || grades[0];
        const dCur = diffs.find(d => d.id === this.difficulty) || diffs[1];
        const dEmoji = this.difficulty === 'easy' ? '🌱' : (this.difficulty === 'hard' ? '🔥' : '⭐');
        const gIconMatch = gCur.name.match(/^[^\s]+/);
        const gIcon = gIconMatch ? gIconMatch[0] : '🎓';
        const dShortLabel = (dCur.short || dCur.name || '').replace(/^[^\u4e00-\u9fa5A-Za-z0-9]+/, '').trim();

        const hubBadge = document.getElementById('btn-hub-level-setting');
        if (hubBadge) {
            hubBadge.textContent = `${gIcon} ${gCur.short} · ${dEmoji}${dShortLabel}`;
            hubBadge.dataset.diff = this.difficulty;
            hubBadge.dataset.grade = this.gradeFilter;
        }

        const stageBadge = document.getElementById('btn-game-stage-diff');
        if (stageBadge) {
            stageBadge.textContent = `${gCur.short} · ${dEmoji}${dShortLabel}`;
            stageBadge.dataset.diff = this.difficulty;
        }
    }

    openLevelSettings() {
        this.sfx('playPop');
        const settingsModal = document.getElementById('settings-modal');
        if (!settingsModal) return;
        this.renderLevelBar();
        if (this.app && typeof this.app.refreshSettingsPanel === 'function') {
            this.app.refreshSettingsPanel();
        }
        settingsModal.classList.add('visible');
        if (this.app && typeof this.app.scheduleNavSync === 'function') {
            this.app.scheduleNavSync();
        }
    }

    // 从题库随机无限出题（洗牌队列 + 错题智能优先复现，避免连续重复）
    pickNext(key, pool) {
        if (!pool || !pool.length) return null;
        let q = this.queues[key];
        if (!q || !q.length) {
            const scoped = this.filterPoolByScope(pool);
            q = gpShuffle(scoped.slice());
            const last = this.lastPicked[key];
            // 错题加权：将薄弱汉字优先排在队列后半段（pop 时更早出现），帮助自然复习巩固
            const weakMap = this.weakChars || {};
            if (Object.keys(weakMap).length > 0 && q.length > 4) {
                q.sort((a, b) => {
                    const wa = weakMap[this.itemChar(a)] ? 1 : 0;
                    const wb = weakMap[this.itemChar(b)] ? 1 : 0;
                    return wa - wb;
                });
            }
            if (q.length > 1 && q[q.length - 1] === last) {
                [q[0], q[q.length - 1]] = [q[q.length - 1], q[0]];
            }
            this.queues[key] = q;
        }
        const item = q.pop();
        this.lastPicked[key] = item;
        return item;
    }

    // 记录薄弱/答错汉字（用于智能复习队列）
    markWeakChar(ch, delta = 1) {
        if (!ch || typeof ch !== 'string') return;
        this.weakChars = this.weakChars || {};
        this.weakChars[ch] = Math.min(5, (this.weakChars[ch] || 0) + delta);
        this.saveJSON('kid_app_weak_chars_v1', this.weakChars);
        this.updateScopeBtn();
    }

    // 答对后逐步消解薄弱标记
    markMasteredChar(ch) {
        if (!ch || !this.weakChars || !this.weakChars[ch]) return;
        this.weakChars[ch] -= 1;
        if (this.weakChars[ch] <= 0) {
            delete this.weakChars[ch];
        }
        this.saveJSON('kid_app_weak_chars_v1', this.weakChars);
        this.updateScopeBtn();
    }

    // 获取当前舞台题目对应的核心目标汉字
    currentTargetChar() {
        switch (this.activeGame) {
            case 'picwrite': return (this.pw && this.pw.char) || '';
            case 'balloon': return (this.bl && this.bl.char) || '';
            case 'listen': return (this.ls && this.ls.char) || '';
            case 'word': return (this.wd && this.wd.target) || '';
            case 'stroke': return (this.sk && this.sk.char) || '';
            case 'mole': return (this.ml && this.ml.target) || '';
            default: return '';
        }
    }

    // 同步舞台右上角「📖 学这字」联动按钮显隐
    syncPracticeCharBtn() {
        const btn = document.getElementById('btn-game-practice-char');
        if (!btn) return;
        const ch = this.currentTargetChar();
        btn.hidden = !ch;
    }

    // 一键跳转到「趣味练字」学习当前题目汉字并自动播放笔顺演示
    practiceCurrentChar() {
        const ch = this.currentTargetChar();
        if (!ch || !this.app) return;
        this.sfx('playPop');
        this.markWeakChar(ch, 1);
        this.switchAppTab('practice');
        if (typeof this.app.selectChar === 'function') {
            this.app.selectChar(ch);
        }
        setTimeout(() => {
            if (this.app.hanziGuide && typeof this.app.hanziGuide.animate === 'function') {
                this.app.hanziGuide.animate();
            }
            if (typeof this.app.showToast === 'function') {
                this.app.showToast(`📖 已为您打开「${ch}」的笔顺演示与画板，练好后点顶部「🎮 闯关乐园」即可继续闯关！`);
            }
        }, 200);
    }

    // 切换大厅闯关出题范围（全部题库 -> 当前分类 -> 错题巩固）
    cycleScopeMode() {
        this.sfx('playPop');
        const order = ['all', 'cat', 'weak'];
        const nextIdx = (order.indexOf(this.scopeMode) + 1) % order.length;
        this.scopeMode = order[nextIdx];
        this.queues = {};
        this.updateScopeBtn();
        if (this.app && typeof this.app.showToast === 'function') {
            if (this.scopeMode === 'all') {
                this.app.showToast('🌟 已切换为【全部题库】：从全部 12 大主题 400 个汉字中随机出题');
            } else if (this.scopeMode === 'cat') {
                const cats = (typeof CHARACTER_CATEGORIES !== 'undefined') ? CHARACTER_CATEGORIES : (window.CHARACTER_CATEGORIES || []);
                const cur = cats.find(c => c.id === (this.app.currentCategory || 'starter'));
                const name = cur ? cur.name : '当前分类';
                this.app.showToast(`🎯 已切换为【${name}】：优先从当前选中的练字主题出题`);
            } else {
                const weakCount = Object.keys(this.weakChars || {}).length;
                this.app.showToast(weakCount > 0
                    ? `💡 已切换为【错题巩固】：优先复习 ${weakCount} 个易错汉字与未掌握汉字`
                    : '💡 已切换为【巩固未练字】：优先考察还没有拿过小红花的汉字');
            }
        }
    }

    updateScopeBtn() {
        const btn = document.getElementById('btn-game-scope');
        if (!btn) return;
        if (this.scopeMode === 'cat') {
            const cats = (typeof CHARACTER_CATEGORIES !== 'undefined') ? CHARACTER_CATEGORIES : (window.CHARACTER_CATEGORIES || []);
            const cur = cats.find(c => c.id === ((this.app && this.app.currentCategory) || 'starter'));
            const shortName = cur ? cur.name.replace(/^[^\s]+\s*/, '') : '当前分类';
            btn.textContent = `🎯 ${shortName}`;
            btn.dataset.scope = 'cat';
        } else if (this.scopeMode === 'weak') {
            const weakCount = Object.keys(this.weakChars || {}).length;
            btn.textContent = weakCount > 0 ? `💡 错题(${weakCount})` : '💡 待巩固';
            btn.dataset.scope = 'weak';
        } else {
            btn.textContent = '🌟 全部题库';
            btn.dataset.scope = 'all';
        }
    }

    sameGroup(a, b) {
        return GP_SIMILAR_GROUPS.some(g => g.includes(a) && g.includes(b));
    }

    // 生成选项：1 个字形相近字 + 同类字 + 其他字，排除意思相近 / 同音 / 可组成别的词的字
    buildOptions(target, total = 4, opts = {}) {
        const { pool, avoidHomophone = false, validator = null, sameCatCount = 1, targetPinyin = '' } = opts;
        const picked = [];
        const tInfo = this.info(target) || {};
        const tTone = gpToneless(targetPinyin || tInfo.pinyin);
        const ok = (c) => {
            if (!c || c === target || picked.includes(c)) return false;
            const info = this.info(c);
            if (!info) return false;
            if (this.sameGroup(target, c)) return false;
            if (avoidHomophone && tTone && gpToneless(info.pinyin) === tTone) return false;
            if (validator && !validator(c)) return false;
            return true;
        };
        const need = Math.max(0, total - 1);

        const visual = gpShuffle((GP_VISUAL_CONFUSERS[target] || '').split(''));
        const maxVisual = this.difficulty === 'hard' ? 2 : 1;
        for (const c of visual) {
            if (picked.length >= maxVisual) break;
            if (ok(c)) picked.push(c);
        }

        const src = gpShuffle((pool && pool.length ? pool : this.allChars).slice());
        let sameCat = 0;
        for (const c of src) {
            if (picked.length >= need || sameCat >= sameCatCount) break;
            const info = this.info(c);
            if (info && info.catId === tInfo.catId && ok(c)) {
                picked.push(c);
                sameCat++;
            }
        }
        for (const c of src) {
            if (picked.length >= need) break;
            if (ok(c)) picked.push(c);
        }
        return gpShuffle([target, ...picked.slice(0, need)]);
    }

    // ==================== 声音、计时器与本地存储 ====================
    soundOn() {
        return !!(window.soundManager && window.soundManager.enabled !== false);
    }

    speak(text, onEnd) {
        if (!text || this.activeAppTab !== 'exam' || !this.soundOn()) {
            return;
        }
        try {
            window.soundManager.speak(text, onEnd);
        } catch (e) {}
    }

    clueWord(ch) {
        if (GP_PW_CLUE_WORDS[ch]) return GP_PW_CLUE_WORDS[ch];
        const info = this.info(ch);
        const w = info ? info.words.find(x => x.length === 2 && x.includes(ch) && x[0] !== x[1]) : null;
        return w || '';
    }

    charPrompt(ch) {
        const w = this.clueWord(ch);
        return w ? `${ch}，${w}的${ch}` : ch;
    }

    sayChar(ch, onEnd) {
        this.speak(this.charPrompt(ch), onEnd);
    }

    sfx(name) {
        const sm = window.soundManager;
        if (sm && typeof sm[name] === 'function') {
            try { sm[name](); } catch (e) {}
        }
    }

    later(fn, ms) {
        const id = setTimeout(() => {
            this.timers.delete(id);
            fn();
        }, ms);
        this.timers.add(id);
        return id;
    }

    clearTimers() {
        this.timers.forEach(id => clearTimeout(id));
        this.timers.clear();
    }

    moleLater(fn, ms) {
        const id = setTimeout(() => {
            this.moleTimers.delete(id);
            fn();
        }, ms);
        this.moleTimers.add(id);
        return id;
    }

    clearMoleTimers() {
        this.moleTimers.forEach(id => clearTimeout(id));
        this.moleTimers.clear();
    }

    loadJSON(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            return fallback;
        }
    }

    saveJSON(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {}
    }

    todayKey() {
        const d = new Date();
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }

    loadToday() {
        const saved = this.loadJSON('kid_app_game_today_v1', null);
        if (saved && saved.date === this.todayKey()) return saved;
        return { date: this.todayKey(), stars: 0 };
    }

    // ==================== 主 Tab 切换（🎮 闯关乐园 / ✍️ 趣味练字） ====================
    switchAppTab(tabName = 'practice') {
        this.initIfNeeded();
        this.activeAppTab = tabName;

        const practiceTabBtn = document.getElementById('primary-tab-practice');
        const examTabBtn = document.getElementById('primary-tab-exam');
        const examContainer = document.getElementById('exam-view-container');
        [[practiceTabBtn, 'practice'], [examTabBtn, 'exam']].forEach(([btn, name]) => {
            if (!btn) return;
            btn.classList.toggle('active', tabName === name);
            btn.setAttribute('aria-selected', tabName === name ? 'true' : 'false');
        });
        if (examContainer) examContainer.style.display = '';

        if (tabName === 'exam') {
            document.body.classList.add('app-mode-exam');
            this.later(() => this.onStageVisible(), 60);
        } else {
            this.pauseMole();
            this.stopStrokeAnimation();
            if (window.soundManager && typeof window.soundManager.stopSpeaking === 'function') {
                window.soundManager.stopSpeaking();
            }
            document.body.classList.remove('app-mode-exam');
            setTimeout(() => {
                if (this.app && this.app.canvasEngine) {
                    this.app.canvasEngine.resize(true);
                }
                if (this.app && this.app.hanziGuide && typeof this.app.hanziGuide.resize === 'function') {
                    this.app.hanziGuide.resize();
                }
                try {
                    const activeCat = document.querySelector('.cat-tab-btn.active');
                    if (activeCat) activeCat.scrollIntoView({ block: 'nearest', inline: 'center' });
                    const activeChar = document.querySelector('.char-card-btn.active');
                    if (activeChar) activeChar.scrollIntoView({ block: 'nearest', inline: 'center' });
                } catch (e) {}
            }, 60);
        }
        if (this.app && typeof this.app.scheduleNavSync === 'function') {
            this.app.scheduleNavSync();
        }
    }

    open() {
        this.switchAppTab('exam');
    }

    close() {
        this.switchAppTab('practice');
    }

    onStageVisible() {
        if (this.activeGame === 'picwrite' && this.examCanvas) {
            this.examCanvas.resize(true);
        } else if (this.activeGame === 'antonym') {
            this.renderAntonymLines();
        }
    }

    // ==================== 游戏大厅 ====================
    showHub() {
        this.clearTimers();
        this.pauseMole();
        this.stopStrokeAnimation();
        this.activeGame = null;

        const hub = document.getElementById('game-hub');
        const stage = document.getElementById('game-stage');
        if (hub) hub.hidden = false;
        if (stage) stage.hidden = true;
        this.renderHub();
        if (this.app && typeof this.app.scheduleNavSync === 'function') {
            this.app.scheduleNavSync();
        }
    }

    renderHub() {
        const grid = document.getElementById('game-card-grid');
        if (grid) {
            grid.innerHTML = GP_GAMES.map((g, i) => `
                <div role="button" tabindex="0" class="game-card theme-${g.theme}" data-game="${g.id}" style="--n:${i}" aria-label="${g.title}：${g.desc}">
                    <div class="game-card-art"><span class="game-card-emoji">${g.icon}</span></div>
                    <div class="game-card-body">
                        <span class="game-card-title">${g.title}</span>
                        <span class="game-card-desc">${g.desc}</span>
                    </div>
                    <div class="game-card-foot">
                        <span class="game-card-stars">⭐ ${this.storedStars[g.id] || 0}</span>
                        <span class="game-card-play">开始 ▶</span>
                    </div>
                </div>
            `).join('');
        }
        const today = document.getElementById('game-hub-today');
        if (today) today.textContent = `⭐ 今日 ${this.todayStats.stars}`;
        this.updateScopeBtn();
        this.renderLevelBar();
        this.syncPracticeCharBtn();
    }

    enterGame(gameId) {
        const g = GP_GAMES.find(x => x.id === gameId);
        if (!g) return;
        this.clearTimers();
        this.pauseMole();
        this.stopStrokeAnimation();

        this.activeGame = gameId;
        this.combo = 0;
        this.sessionStars = 0;

        const hub = document.getElementById('game-hub');
        const stage = document.getElementById('game-stage');
        if (hub) hub.hidden = true;
        if (stage) {
            stage.hidden = false;
            stage.className = `game-stage theme-${g.theme}`;
        }
        const icon = document.getElementById('game-title-icon');
        const title = document.getElementById('game-title-text');
        if (icon) icon.textContent = g.icon;
        if (title) title.textContent = g.title;
        document.querySelectorAll('.game-panel').forEach(p => {
            p.classList.toggle('active', p.dataset.game === gameId);
        });
        this.renderLevelBar();
        this.updateStats();
        this.setMascot(g.intro, 'idle');

        // 自带语音题干的游戏不再额外朗读介绍，避免语音互相打断
        const selfVoiced = ['listen', 'word', 'stroke', 'mole'];
        if (!selfVoiced.includes(gameId) && !this.introSpoken[gameId]) {
            this.introSpoken[gameId] = true;
            this.speak(g.intro);
        }

        const starters = {
            picwrite: () => this.startPicwrite(),
            balloon: () => this.nextBalloon(),
            listen: () => this.startListen(),
            word: () => this.nextWord(),
            stroke: () => this.nextStroke(),
            antonym: () => this.newAntonymRound(),
            memory: () => this.newMemoryRound(),
            mole: () => this.startMole()
        };
        if (starters[gameId]) starters[gameId]();
        if (this.app && typeof this.app.scheduleNavSync === 'function') {
            this.app.scheduleNavSync();
        }
    }

    // ==================== 公共反馈：熊猫老师、金星、连对 ====================
    setMascot(html, mood = 'idle') {
        const faces = { idle: '🐼', happy: '🥳', oops: '🤔', wow: '🤩', think: '🧐' };
        const face = document.getElementById('game-mascot-face');
        const bubble = document.getElementById('game-mascot-bubble');
        if (face) {
            face.textContent = faces[mood] || '🐼';
            face.classList.remove('bounce');
            void face.offsetWidth;
            face.classList.add('bounce');
        }
        if (bubble) {
            bubble.innerHTML = html;
            bubble.classList.remove('pop');
            void bubble.offsetWidth;
            bubble.classList.add('pop');
        }
        this.syncPracticeCharBtn();
    }

    praise() {
        if (this.combo >= 3) {
            return gpPick([`连对 ${this.combo} 次，太厉害啦！`, `${this.combo} 连对！你是汉字小达人！`, `连对 ${this.combo} 次，继续加油！`]);
        }
        return gpPick(GP_PRAISES);
    }

    registerCorrect() {
        this.combo += 1;
        const cur = this.currentTargetChar();
        if (cur) this.markMasteredChar(cur);
        this.updateStats();
        if (this.combo >= 5 && this.combo % 5 === 0) {
            if (this.app && typeof this.app.fireConfetti === 'function') this.app.fireConfetti();
            this.sfx('playFanfare');
        }
    }

    registerWrong() {
        this.combo = 0;
        const cur = this.currentTargetChar();
        if (cur) this.markWeakChar(cur, 1);
        this.updateStats();
    }

    updateStats() {
        const starsEl = document.getElementById('game-stars');
        if (starsEl) starsEl.textContent = `⭐ ${this.sessionStars}`;
        const comboEl = document.getElementById('game-combo');
        if (comboEl) {
            comboEl.hidden = this.combo < 2;
            comboEl.textContent = `🔥 连对 ×${this.combo}`;
        }
    }

    awardStars(n, anchorEl = null) {
        if (!n || n <= 0) return;
        this.sessionStars += n;
        const g = this.activeGame;
        if (g) {
            this.storedStars[g] = (this.storedStars[g] || 0) + n;
            this.saveJSON('kid_app_game_stars_v1', this.storedStars);
        }
        if (this.todayStats.date !== this.todayKey()) this.todayStats = { date: this.todayKey(), stars: 0 };
        this.todayStats.stars += n;
        this.saveJSON('kid_app_game_today_v1', this.todayStats);
        if (this.app && typeof this.app.addStars === 'function') this.app.addStars(n, '汉字闯关乐园');

        this.updateStats();
        const starsEl = document.getElementById('game-stars');
        if (starsEl) {
            starsEl.classList.remove('bump');
            void starsEl.offsetWidth;
            starsEl.classList.add('bump');
        }
        if (anchorEl) this.floatReward(anchorEl, `+${n} ⭐`);
    }

    floatReward(anchorEl, text) {
        try {
            const r = anchorEl.getBoundingClientRect();
            if (!r.width && !r.height) return;
            const el = document.createElement('div');
            el.className = 'gp-float-reward';
            el.textContent = text;
            el.style.left = `${r.left + r.width / 2}px`;
            el.style.top = `${r.top + Math.min(r.height * 0.35, 60)}px`;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 1200);
        } catch (e) {}
    }

    burstAt(el, colors) {
        if (typeof confetti !== 'function' || !el) return;
        try {
            const r = el.getBoundingClientRect();
            confetti({
                particleCount: 26,
                spread: 70,
                startVelocity: 22,
                scalar: 0.75,
                ticks: 80,
                origin: {
                    x: (r.left + r.width / 2) / window.innerWidth,
                    y: (r.top + r.height / 2) / window.innerHeight
                },
                colors: colors || ['#f472b6', '#facc15', '#60a5fa', '#34d399', '#a78bfa']
            });
        } catch (e) {}
    }

    flash(el, cls, ms = 500) {
        if (!el) return;
        el.classList.remove(cls);
        void el.offsetWidth;
        el.classList.add(cls);
        setTimeout(() => el.classList.remove(cls), ms);
    }

    // ==================== 游戏 1：✍️ 看图写字（自由默写 + 智能识别） ====================
    startPicwrite() {
        this.nextPicwrite();
        this.later(() => {
            if (this.examCanvas) this.examCanvas.resize(true);
        }, 60);
    }

    nextPicwrite() {
        const ch = this.pickNext('picwrite', this.writingPool);
        if (!ch) return;
        const info = this.info(ch) || { pinyin: '', image: '' };
        this.pw = { char: ch, usedHint: false, usedTrace: false, status: 'pending', failCount: 0 };

        const img = document.getElementById('pw-img');
        if (img) {
            img.src = info.image;
            img.alt = '看图写字：图上画的是什么？';
            this.flash(img, 'gp-pop-in', 500);
        }
        const stamp = document.getElementById('pw-stamp');
        if (stamp) {
            stamp.className = 'pw-stamp';
            stamp.textContent = '';
        }
        const pyTag = document.getElementById('pw-pinyin');
        if (pyTag) {
            pyTag.hidden = (this.difficulty !== 'easy');
            pyTag.textContent = info.pinyin;
        }
        this.renderPwClue(ch, false);
        this.setTraceButton(false);
        this.setPwFeedback('idle');
        this.setPwSubmitLabel(false);

        if (this.examCanvas) {
            const cache = window.STROKE_DATA_CACHE || {};
            this.examCanvas.setCharacter(ch, cache[ch] || null);
            this.examCanvas.setTraceSettings(false);
            this.examCanvas.clear(false);
        }
        const cw = this.clueWord(ch);
        const masked = cw ? cw.replace(ch, '（？）') : '这个字';
        const diffTip = this.difficulty === 'easy' ? `（拼音：${info.pinyin}）` : '';
        this.setMascot(`看图填词：<strong>${masked}</strong>${diffTip}，在米字格里写出来吧！`, 'idle');
    }

    renderPwClue(ch, revealed = false) {
        const clueEl = document.getElementById('pw-word-clue');
        if (!clueEl) return;
        const cw = this.clueWord(ch);
        if (!cw || cw.length !== 2 || !cw.includes(ch)) {
            clueEl.hidden = true;
            clueEl.innerHTML = '';
            return;
        }
        clueEl.hidden = false;
        clueEl.innerHTML = cw.split('').map(c => {
            if (c === ch) {
                return revealed
                    ? `<span class="pw-clue-ans">${c}</span>`
                    : `<span class="pw-clue-blank">？</span>`;
            }
            return `<span class="pw-clue-known">${c}</span>`;
        }).join('');
    }

    setTraceButton(on) {
        const btn = document.getElementById('btn-pw-trace');
        if (!btn) return;
        btn.classList.toggle('active', on);
        btn.textContent = on ? '🙈 收起描红' : '✏️ 描红';
    }

    setPwSubmitLabel(isNext) {
        const btn = document.getElementById('btn-exam-submit-pic');
        if (btn) btn.textContent = isNext ? '下一题 ➔' : '✅ 写好了';
    }

    setPwFeedback(state, html = '') {
        const box = document.getElementById('pw-feedback');
        if (!box) return;
        box.className = `pw-feedback ${state === 'correct' ? 'is-correct' : (state === 'wrong' ? 'is-wrong' : '')}`;
        box.innerHTML = (state === 'idle' && !html)
            ? '<div class="pw-fb-idle">👀 看图想一想，在米字格里写出这个字，写好后点 <strong>✅ 写好了</strong>！</div>'
            : html;
    }

    pwSubmit() {
        if (!this.pw || !this.examCanvas) return;
        if (this.pw.status === 'correct') {
            this.sfx('playPop');
            this.nextPicwrite();
            return;
        }
        if (!this.examCanvas.hasDrawing()) {
            this.sfx('playPop');
            if (this.app) this.app.showToast('✏️ 先在米字格里写出汉字，再点“写好了”哦！');
            return;
        }
        const evaluator = window.chineseWritingEvaluator;
        if (!evaluator || typeof evaluator.recognizeAndEvaluateFreehand !== 'function') return;

        const ch = this.pw.char;
        const res = evaluator.recognizeAndEvaluateFreehand(
            this.examCanvas.drawCanvas,
            [ch],
            this.examCanvas.strokeList,
            this.examCanvas.cssSize,
            null,
            this.difficulty || 'standard'
        );
        if (!res || !res.valid) {
            if (this.app) this.app.showToast(res ? res.message : '请多写几笔再提交哦！');
            return;
        }

        const info = this.info(ch) || { pinyin: '' };
        const stamp = document.getElementById('pw-stamp');
        const word = this.clueWord(ch) || (info.words || []).find(w => w.length === 2 && w.includes(ch)) || '';

        if (res.isPass) {
            this.pw.status = 'correct';
            const stars = (this.pw.failCount > 0 || this.pw.usedTrace) ? 1 : (this.pw.usedHint ? 2 : 3);
            if (stamp) {
                stamp.className = 'pw-stamp correct show';
                stamp.textContent = '✓';
            }
            this.renderPwClue(ch, true);
            this.registerCorrect();
            this.awardStars(stars, stamp);
            if (this.app && typeof this.app.markCharCompleted === 'function') this.app.markCharCompleted(ch);

            const strokeTip = res.strokeDiff !== 0 ? `（标准写法是 ${res.expectedStrokes} 画哦）` : '';
            this.setPwFeedback('correct', `
                <div class="pw-fb-row">
                    <span class="pw-fb-char">${ch}</span>
                    <div class="pw-fb-text">
                        <strong>🎉 写对啦！+${stars} ⭐</strong>
                        <span>${info.pinyin}${word ? ' · ' + word : ''}${strokeTip}</span>
                    </div>
                    <button type="button" class="btn-game-primary" data-pw-act="next">下一题 ➔</button>
                </div>
            `);
            this.setPwSubmitLabel(true);
            this.sfx('playVictory');
            this.setMascot(`${this.praise()} 就是“${ch}”字！`, 'happy');
            this.speak(`写对啦！${this.charPrompt(ch)}`);
        } else {
            // 检查小朋友是否把同义画面写成了另一个同组好字（如看到太阳写了“日”，看到开门写了“门”）
            const cache = window.STROKE_DATA_CACHE || {};
            const validUserStrokes = evaluator.filterValidStrokes(this.examCanvas.strokeList, this.examCanvas.cssSize);
            let sameGroupWritten = null;
            for (const cand of Object.keys(cache)) {
                if (cand === ch || !this.sameGroup(ch, cand)) continue;
                const cData = cache[cand];
                if (!cData || !cData.medians) continue;
                const stdN = cData.medians.length;
                if (res.userStrokes < stdN - 1 || res.userStrokes > stdN + 2) continue;
                const cMatch = evaluator.computeCanonicalSimilarity(
                    validUserStrokes,
                    cData,
                    this.examCanvas.cssSize,
                    cand
                );
                if (cMatch.similarity >= 60 &&
                    Math.abs(cMatch.effectiveStrokeCount - stdN) <= 1 &&
                    cMatch.uncoveredStdStrokes === 0 &&
                    cMatch.extraUserStrokes === 0 &&
                    cMatch.rasterSim >= 0.56) {
                    sameGroupWritten = cand;
                    break;
                }
            }

            if (sameGroupWritten) {
                this.sfx('playPop');
                const targetWordTip = word ? `「${word}」的` : '';
                this.setPwFeedback('idle', `
                    <div class="pw-fb-row">
                        <span class="pw-fb-char">${sameGroupWritten}</span>
                        <div class="pw-fb-text">
                            <strong>👏 你写的“${sameGroupWritten}”字很工整哦！</strong>
                            <span>不过这题考的是${targetWordTip}“<strong>${ch}</strong>”（${info.pinyin}），清空重写“${ch}”试试吧！</span>
                        </div>
                        <div class="pw-fb-actions">
                            <button type="button" class="btn-hint tone-blue" data-pw-act="clear">🗑️ 清空重写</button>
                            <button type="button" class="btn-hint tone-red" data-pw-act="trace">✏️ 描红提示</button>
                        </div>
                    </div>
                `);
                this.setMascot(`你写的“${sameGroupWritten}”真棒！这题词语是${word || ch}，试试写“${ch}”吧！`, 'think');
                this.speak(`你写的${sameGroupWritten}字真棒！不过这题要写${this.charPrompt(ch)}哦！`);
                return;
            }

            this.pw.status = 'wrong';
            this.pw.failCount += 1;
            if (stamp) {
                stamp.className = 'pw-stamp wrong show';
                stamp.textContent = '✗';
            }
            this.registerWrong();

            let reason = `这个字是“${ch}”，一共 ${res.expectedStrokes} 画。`;
            if (res.confusedWithChar) {
                reason = `你写的更像“${res.confusedWithChar}”字哦！图上是“${ch}”。`;
            } else if (!res.strokeCountAcceptable) {
                reason = `“${ch}”一共 ${res.expectedStrokes} 画，你写了 ${res.userStrokes} 画。`;
            }
            this.setPwFeedback('wrong', `
                <div class="pw-fb-row">
                    <span class="pw-fb-char wrong">${ch}</span>
                    <div class="pw-fb-text">
                        <strong>🤔 差一点点！正确答案：${ch}（${info.pinyin}）</strong>
                        <span>${reason}</span>
                    </div>
                    <div class="pw-fb-actions">
                        <button type="button" class="btn-hint tone-red" data-pw-act="trace">✏️ 描红订正</button>
                        <button type="button" class="btn-hint tone-gold" data-pw-act="practice">📖 学笔顺</button>
                        <button type="button" class="btn-hint tone-blue" data-pw-act="next">下一题 ➔</button>
                    </div>
                </div>
            `);
            this.sfx('playMistake');
            this.setMascot(`差一点点！这个字是“${ch}”，描红写一遍吧！`, 'oops');
            this.speak(`这个字是${this.charPrompt(ch)}，我们描红写一遍吧！`);
        }
    }

    pwFeedbackAction(act) {
        if (act === 'next') {
            this.sfx('playPop');
            this.nextPicwrite();
        } else if (act === 'practice') {
            this.practiceCurrentChar();
        } else if (act === 'clear') {
            this.sfx('playEraser');
            if (this.examCanvas) this.examCanvas.clear(false);
            this.setPwFeedback('idle');
        } else if (act === 'trace') {
            this.sfx('playPop');
            if (this.examCanvas) {
                this.examCanvas.clear(false);
                this.examCanvas.setTraceSettings(true);
            }
            this.pw.usedTrace = true;
            this.setTraceButton(true);
            this.setMascot(`跟着红色底字，把“${this.pw.char}”描一遍，再点“写好了”！`, 'think');
        }
    }

    // ==================== 游戏 2：🎈 气球选字 ====================
    nextBalloon() {
        const ch = this.pickNext('balloon', this.picturePool);
        if (!ch) return;
        const info = this.info(ch);
        const optCount = this.difficulty === 'easy' ? 3 : (this.difficulty === 'hard' ? 6 : 4);
        const options = this.buildOptions(ch, optCount, { pool: this.picturePool, sameCatCount: this.difficulty === 'hard' ? 2 : 1 });
        this.bl = { char: ch, tries: 0, hinted: false, locked: false };

        const img = document.getElementById('bl-img');
        if (img) {
            img.src = info.image;
            img.alt = '气球选字：图上是什么字？';
            this.flash(img, 'gp-pop-in', 500);
        }
        const colors = gpShuffle(['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'teal']);
        const sky = document.getElementById('bl-sky');
        if (sky) {
            sky.dataset.count = String(optCount);
            sky.innerHTML = `
                <span class="bl-cloud c1" aria-hidden="true">☁️</span>
                <span class="bl-cloud c2" aria-hidden="true">☁️</span>
                <span class="bl-cloud c3" aria-hidden="true">☁️</span>
                ${options.map((c, i) => `
                    <button type="button" class="balloon bc-${colors[i % colors.length]}" data-char="${c}" style="--i:${i}" aria-label="气球：${c}">
                        <span class="balloon-body"><span class="balloon-char">${c}</span></span>
                        <span class="balloon-tie"></span>
                        <span class="balloon-string"></span>
                    </button>
                `).join('')}
            `;
        }
        this.setMascot('图上是什么字？戳破写着这个字的气球！', 'idle');
    }

    onBalloonTap(btn) {
        if (!this.bl || this.bl.locked || !btn || btn.disabled) return;
        const c = btn.dataset.char;
        if (c === this.bl.char) {
            this.bl.locked = true;
            btn.classList.add('popped');
            this.burstAt(btn);
            this.sfx('playCorrect');
            this.registerCorrect();
            this.awardStars((this.bl.tries === 0 && !this.bl.hinted) ? 2 : 1, btn);
            this.setMascot(`${this.praise()} 是“${c}”（${this.py(c)}）！`, 'happy');
            this.sayChar(c);
            document.querySelectorAll('#bl-sky .balloon').forEach(b => {
                if (b !== btn) b.classList.add('fly-away');
            });
            this.later(() => this.nextBalloon(), 1800);
        } else {
            this.bl.tries += 1;
            btn.disabled = true;
            btn.classList.add('wrong');
            this.sfx('playMistake');
            if (this.bl.tries === 1) this.registerWrong();
            const py = this.py(c);
            this.setMascot(`这是“${c}”${py ? '（' + py + '）' : ''}，再找找看！`, 'oops');
        }
    }

    balloonHint() {
        if (!this.bl) return;
        this.bl.hinted = true;
        this.sfx('playPop');
        this.sayChar(this.bl.char);
        this.setMascot('听一听，再找出这个字的气球！', 'think');
    }

    // ==================== 游戏 3：👂 听音找字 ====================
    startListen() {
        this.updateListenSoundTip();
        this.nextListen();
    }

    nextListen() {
        const ch = this.pickNext('listen', this.listenPool);
        if (!ch) return;
        const optCount = this.difficulty === 'easy' ? 3 : (this.difficulty === 'hard' ? 6 : 4);
        const options = this.buildOptions(ch, optCount, { pool: this.listenPool, avoidHomophone: true, sameCatCount: this.difficulty === 'hard' ? 2 : 1 });
        this.ls = { char: ch, tries: 0, locked: false };

        const grid = document.getElementById('ls-options');
        if (grid) {
            grid.dataset.count = String(optCount);
            const showPy = this.difficulty === 'easy' ? 'revealed' : '';
            grid.innerHTML = options.map(c => `
                <button type="button" class="ls-card ${showPy}" data-char="${c}" aria-label="选项：${c}">
                    <span class="ls-card-char">${c}</span>
                    <span class="ls-card-py">${this.py(c)}</span>
                </button>
            `).join('');
        }
        this.setMascot('🔊 仔细听，我读的是哪个字？', 'idle');
        this.later(() => this.playListenPrompt(), 400);
    }

    playListenPrompt() {
        if (!this.ls || this.ls.locked || this.activeGame !== 'listen') return;
        const btn = document.getElementById('btn-ls-play');
        if (btn) {
            btn.classList.add('playing');
            this.later(() => btn.classList.remove('playing'), 1800);
        }
        this.updateListenSoundTip();
        this.sayChar(this.ls.char);
    }

    updateListenSoundTip() {
        const tip = document.getElementById('btn-ls-sound-on');
        if (tip) tip.hidden = this.soundOn();
    }

    enableSoundForGame() {
        if (window.soundManager && !this.soundOn()) {
            const enabled = window.soundManager.toggle();
            if (this.app && typeof this.app.updateSoundUI === 'function') this.app.updateSoundUI(enabled);
        }
        this.updateListenSoundTip();
        this.later(() => this.playListenPrompt(), 200);
    }

    onListenTap(card) {
        if (!this.ls || this.ls.locked || !card || card.disabled) return;
        const c = card.dataset.char;
        if (c === this.ls.char) {
            this.ls.locked = true;
            card.classList.add('correct', 'revealed');
            this.sfx('playCorrect');
            this.registerCorrect();
            this.awardStars(this.ls.tries === 0 ? 2 : 1, card);
            this.setMascot(`${this.praise()} 就是“${c}”！`, 'happy');
            this.later(() => this.nextListen(), 1600);
        } else {
            const curChar = this.ls.char;
            this.ls.tries += 1;
            card.disabled = true;
            card.classList.add('wrong', 'revealed');
            this.sfx('playMistake');
            if (this.ls.tries === 1) this.registerWrong();
            this.setMascot(`这是“${c}”（${this.py(c)}），再听一遍哦！`, 'oops');
            this.speak(`这是${c}，再听一遍。`, () => this.later(() => {
                if (this.ls && !this.ls.locked && this.ls.char === curChar) this.playListenPrompt();
            }, 200));
        }
    }

    // ==================== 游戏 4：🧩 组词填空 ====================
    pickWordImage(word) {
        if (!word || word.length !== 2 || GP_WORD_NO_IMAGE.has(word) || !this.picturePoolSet) return '';
        if (word === '开门' || word === '关门') {
            return this.picturePoolSet.has(word[0]) ? this.info(word[0]).image : '';
        }
        const suffixes = '子头儿面边里外上下前后中色';
        if (suffixes.includes(word[1]) && this.picturePoolSet.has(word[0])) {
            return this.info(word[0]).image;
        }
        if (this.picturePoolSet.has(word[1])) return this.info(word[1]).image;
        if (this.picturePoolSet.has(word[0])) return this.info(word[0]).image;
        return '';
    }

    nextWord() {
        const entry = this.pickNext('word', this.wordPool);
        if (!entry) return;
        const { target, word, idx } = entry;
        const targetPy = GP_WORD_PINYIN_OVERRIDES[`${word}:${idx}`] || this.py(target);
        const validator = (c) => {
            const cand = idx === 0 ? c + word[1] : word[0] + c;
            return !this.allWords.has(cand);
        };
        const optCount = this.difficulty === 'easy' ? 3 : (this.difficulty === 'hard' ? 6 : 4);
        const options = this.buildOptions(target, optCount, {
            pool: this.listenPool,
            avoidHomophone: true,
            targetPinyin: targetPy,
            validator,
            sameCatCount: this.difficulty === 'hard' ? 2 : 1
        });
        this.wd = { target, word, idx, tries: 0, locked: false };

        const imgSrc = this.pickWordImage(word);
        const img = document.getElementById('wd-img');
        const imgFrame = img ? img.closest('.wd-img-frame') : null;
        if (imgFrame) imgFrame.hidden = !imgSrc;
        if (img) {
            if (imgSrc) {
                img.src = imgSrc;
                img.alt = '组词填空提示图';
                this.flash(img, 'gp-pop-in', 500);
            } else {
                img.removeAttribute('src');
            }
        }
        const wordEl = document.getElementById('wd-word');
        if (wordEl) {
            wordEl.innerHTML = word.split('').map((c, i) => (i === idx
                ? `<span class="wd-slot"><span class="wd-py">${targetPy}</span><span class="wd-blank" id="wd-blank">？</span></span>`
                : `<span class="wd-slot"><span class="wd-py is-empty" aria-hidden="true">&nbsp;</span><span class="wd-char">${c}</span></span>`)).join('');
        }
        const opts = document.getElementById('wd-options');
        if (opts) {
            opts.dataset.count = String(optCount);
            opts.innerHTML = options.map(c => `
                <button type="button" class="wd-piece" data-char="${c}" aria-label="选项：${c}">
                    <span class="wd-piece-char">${c}</span>
                </button>
            `).join('');
        }
        this.setMascot('看拼音、听一听，选一个字把词语补完整！', 'idle');
        this.later(() => this.speak(word), 400);
    }

    onWordTap(btn) {
        if (!this.wd || this.wd.locked || !btn || btn.disabled) return;
        const c = btn.dataset.char;
        if (c === this.wd.target) {
            this.wd.locked = true;
            btn.classList.add('correct');
            const blank = document.getElementById('wd-blank');
            if (blank) {
                blank.textContent = c;
                blank.classList.add('filled');
            }
            this.sfx('playCorrect');
            this.registerCorrect();
            this.awardStars(this.wd.tries === 0 ? 2 : 1, btn);
            this.setMascot(`${this.praise()} “${this.wd.word}”！`, 'happy');
            this.speak(this.wd.word);
            this.later(() => this.nextWord(), 1800);
        } else {
            this.wd.tries += 1;
            btn.disabled = true;
            btn.classList.add('wrong');
            this.sfx('playMistake');
            if (this.wd.tries === 1) this.registerWrong();
            this.setMascot(`不是“${c}”哦，再听一听这个词语！`, 'oops');
            this.speak(this.wd.word);
        }
    }

    // ==================== 游戏 5：🔢 数笔画 ====================
    nextStroke() {
        this.stopStrokeAnimation();
        const ch = this.pickNext('stroke', this.strokePool);
        if (!ch) return;
        const data = (window.STROKE_DATA_CACHE || {})[ch];
        const total = data.medians.length;
        const types = (GP_STROKE_TYPE_DATA[ch] || '').split(' ').filter(Boolean);
        const askable = types.length === total
            ? types.map((t, i) => (GP_STROKE_TYPES[t] ? i : -1)).filter(i => i >= 0)
            : [];
        const askIdx = askable.length ? gpPick(askable) : -1;
        this.sk = { char: ch, total, types, askIdx, step: 1, tries: 0, locked: false, done: false };

        this.renderStrokeStatic(-1, 0);
        const q = document.getElementById('sk-question');
        if (q) q.innerHTML = `<span class="sk-q-char">“${ch}”</span>一共有 <span class="sk-q-blank" id="sk-q-blank">?</span> 画？`;

        const nums = this.buildNumberOptions(total);
        const opts = document.getElementById('sk-options');
        if (opts) {
            opts.className = 'sk-options nums';
            opts.innerHTML = nums.map(n => `
                <button type="button" class="sk-num" data-num="${n}" aria-label="${n}画"><b>${n}</b><small>画</small></button>
            `).join('');
        }
        const fb = document.getElementById('sk-feedback');
        if (fb) fb.innerHTML = '';
        const nextBtn = document.getElementById('btn-sk-next');
        if (nextBtn) nextBtn.hidden = true;

        this.setMascot(`数一数，“${ch}”字一共有几画？`, 'idle');
        this.speak(`数一数，${ch}字一共有几画？`);
    }

    buildNumberOptions(total) {
        const targetSize = this.difficulty === 'easy' ? 3 : (this.difficulty === 'hard' ? 5 : 4);
        const set = new Set([total]);
        const cands = gpShuffle([total - 2, total - 1, total + 1, total + 2, total + 3].filter(n => n >= 1 && n <= 16));
        for (const n of cands) {
            if (set.size >= targetSize) break;
            set.add(n);
        }
        while (set.size < targetSize) set.add(Math.max(...set) + 1);
        return [...set].sort((a, b) => a - b);
    }

    buildStrokeTypeOptions(answer) {
        const picked = [answer];
        const banned = new Set([answer]);
        if (answer === 'dian') banned.add('na');
        if (answer === 'na') banned.add('dian');
        const family = gpShuffle((GP_STROKE_FAMILIES[answer] || []).slice());
        for (const t of family) {
            if (picked.length >= 3) break;
            if (!banned.has(t) && !picked.includes(t)) picked.push(t);
        }
        const rest = gpShuffle(Object.keys(GP_STROKE_TYPES));
        for (const t of rest) {
            if (picked.length >= 4) break;
            if (!banned.has(t) && !picked.includes(t)) picked.push(t);
        }
        return gpShuffle(picked);
    }

    onStrokeNum(btn) {
        const sk = this.sk;
        if (!sk || sk.step !== 1 || sk.locked || !btn || btn.disabled) return;
        const n = parseInt(btn.dataset.num, 10);
        if (n === sk.total) {
            sk.locked = true;
            btn.classList.add('correct');
            this.fillStrokeBlank(n);
            this.sfx('playCorrect');
            this.registerCorrect();
            if (sk.tries === 0) this.awardStars(1, btn);
            this.renderStrokeStatic(-1, sk.total);
            this.setMascot(`${this.praise()} “${sk.char}”一共 ${sk.total} 画！`, 'happy');
            this.later(() => this.goStrokeStep2(), 1300);
        } else {
            sk.tries += 1;
            btn.disabled = true;
            btn.classList.add('wrong');
            this.sfx('playMistake');
            if (sk.tries === 1) this.registerWrong();
            if (sk.tries >= 2) {
                sk.locked = true;
                this.setMascot('我们一起一笔一笔数一数！', 'think');
                this.playStrokeCount(() => {
                    const right = document.querySelector(`#sk-options .sk-num[data-num="${sk.total}"]`);
                    if (right) right.classList.add('correct');
                    this.fillStrokeBlank(sk.total);
                    this.later(() => this.goStrokeStep2(), 1000);
                });
            } else {
                this.setMascot('再仔细数一数哦！也可以点“一笔一笔数给我看”。', 'oops');
            }
        }
    }

    fillStrokeBlank(n) {
        const blank = document.getElementById('sk-q-blank');
        if (blank) {
            blank.textContent = n;
            blank.classList.add('filled');
        }
    }

    goStrokeStep2() {
        const sk = this.sk;
        if (!sk) return;
        // 轻松模式（K-1/K 启蒙）只考总笔画数，答对直接庆祝过关，不考专业笔画名称
        if (sk.askIdx < 0 || this.difficulty === 'easy') {
            this.finishStroke();
            return;
        }
        sk.step = 2;
        sk.tries = 0;
        sk.locked = false;
        this.renderStrokeStatic(sk.askIdx, sk.total);
        const q = document.getElementById('sk-question');
        if (q) q.innerHTML = `<span class="sk-q-char">“${sk.char}”</span>的第 <span class="sk-q-em">${GP_CN_NUM[sk.askIdx]}</span> 画是什么笔画？`;
        const opts = document.getElementById('sk-options');
        if (opts) {
            opts.className = 'sk-options types';
            opts.innerHTML = this.buildStrokeTypeOptions(sk.types[sk.askIdx]).map(t => `
                <button type="button" class="sk-type" data-type="${t}" aria-label="${GP_STROKE_TYPES[t].name}">
                    ${gpStrokeIcon(t)}
                    <span class="sk-type-name">${GP_STROKE_TYPES[t].name}</span>
                </button>
            `).join('');
        }
        this.setMascot(`看看红色高亮的第 ${sk.askIdx + 1} 画，是什么笔画？`, 'idle');
        this.speak(`第${GP_CN_NUM[sk.askIdx]}画是什么笔画？`);
    }

    onStrokeType(btn) {
        const sk = this.sk;
        if (!sk || sk.step !== 2 || sk.locked || !btn || btn.disabled) return;
        const answer = sk.types[sk.askIdx];
        const name = GP_STROKE_TYPES[answer].name;
        if (btn.dataset.type === answer) {
            sk.locked = true;
            btn.classList.add('correct');
            this.renderStrokeStatic(sk.askIdx, sk.total);
            this.sfx('playCorrect');
            this.registerCorrect();
            if (sk.tries === 0) this.awardStars(1, btn);
            this.setMascot(`${this.praise()} 第${GP_CN_NUM[sk.askIdx]}画是“${name}”！`, 'happy');
            this.speak(`对啦，第${GP_CN_NUM[sk.askIdx]}画是${name}。`);
            this.finishStroke();
        } else {
            sk.tries += 1;
            btn.disabled = true;
            btn.classList.add('wrong');
            this.sfx('playMistake');
            if (sk.tries === 1) this.registerWrong();
            if (sk.tries >= 2) {
                sk.locked = true;
                const right = document.querySelector(`#sk-options .sk-type[data-type="${answer}"]`);
                if (right) right.classList.add('correct');
                this.renderStrokeStatic(sk.askIdx, sk.total);
                this.setMascot(`看红色的那一笔，第${GP_CN_NUM[sk.askIdx]}画是“${name}”。`, 'think');
                this.speak(`第${GP_CN_NUM[sk.askIdx]}画是${name}。`);
                this.finishStroke();
            } else {
                this.setMascot('再看看这一笔的样子，想一想！', 'oops');
            }
        }
    }

    finishStroke() {
        const sk = this.sk;
        if (!sk) return;
        sk.done = true;
        const fb = document.getElementById('sk-feedback');
        if (fb) {
            const allKnown = sk.types.length === sk.total && sk.types.every(t => GP_STROKE_TYPES[t]);
            const chips = allKnown
                ? sk.types.map((t, i) => `<span class="sk-chip ${i === sk.askIdx ? 'hl' : ''}"><b>${i + 1}</b>${GP_STROKE_TYPES[t].name}</span>`).join('')
                : '';
            fb.innerHTML = `
                <div class="sk-summary">📖 “${sk.char}”一共 <b>${sk.total}</b> 画${allKnown ? '：' : '。'}</div>
                ${chips ? `<div class="sk-chips">${chips}</div>` : ''}
            `;
        }
        const nextBtn = document.getElementById('btn-sk-next');
        if (nextBtn) nextBtn.hidden = false;
    }

    // 静态渲染汉字：highlightIdx 为红色高亮笔画，numbersUpTo 为显示序号的笔画数
    renderStrokeStatic(highlightIdx = -1, numbersUpTo = 0) {
        const box = document.getElementById('sk-svg-box');
        const sk = this.sk;
        if (!box || !sk) return;
        const data = (window.STROKE_DATA_CACHE || {})[sk.char];
        if (!data) {
            box.innerHTML = `<div class="sk-fallback">${sk.char}</div>`;
            return;
        }
        const paths = data.strokes.map((d, i) => `<path d="${d}" fill="${i === highlightIdx ? '#ef4444' : '#1e293b'}"></path>`).join('');
        box.innerHTML = `
            <svg viewBox="0 0 1024 1024" class="sk-svg" aria-label="${sk.char}">
                ${this.strokeGridSvg()}
                <g transform="scale(1, -1) translate(0, -900)">${paths}</g>
                <g class="sk-labels">${this.strokeLabelsSvg(data, numbersUpTo, highlightIdx)}</g>
            </svg>
        `;
    }

    strokeGridSvg() {
        return `
            <line x1="0" y1="512" x2="1024" y2="512" stroke="#fca5a5" stroke-width="5" stroke-dasharray="18,14"/>
            <line x1="512" y1="0" x2="512" y2="1024" stroke="#fca5a5" stroke-width="5" stroke-dasharray="18,14"/>
            <line x1="0" y1="0" x2="1024" y2="1024" stroke="#fed7aa" stroke-width="4" stroke-dasharray="18,18"/>
            <line x1="1024" y1="0" x2="0" y2="1024" stroke="#fed7aa" stroke-width="4" stroke-dasharray="18,18"/>
        `;
    }

    strokeLabelSvg(data, i, isHighlight) {
        const med = data.medians[i];
        if (!med || !med.length) return '';
        const [mx, my] = med[0];
        return `
            <g transform="translate(${mx}, ${900 - my})" class="sk-label">
                <circle r="${isHighlight ? 52 : 42}" fill="${isHighlight ? '#ef4444' : '#2563eb'}" stroke="#ffffff" stroke-width="9"/>
                <text text-anchor="middle" dominant-baseline="central" fill="#ffffff" font-size="${isHighlight ? 56 : 46}" font-weight="900">${i + 1}</text>
            </g>
        `;
    }

    strokeLabelsSvg(data, upTo, highlightIdx) {
        let html = '';
        const limit = Math.min(upTo, data.medians.length);
        for (let i = 0; i < limit; i++) {
            if (i !== highlightIdx) html += this.strokeLabelSvg(data, i, false);
        }
        if (highlightIdx >= 0 && highlightIdx < limit) {
            html += this.strokeLabelSvg(data, highlightIdx, true);
        }
        return html;
    }

    // 一笔一笔书写动画（按标准笔顺逐笔描出并标上序号）
    playStrokeCount(onDone) {
        const sk = this.sk;
        const box = document.getElementById('sk-svg-box');
        if (!sk || !box) return;
        const data = (window.STROKE_DATA_CACHE || {})[sk.char];
        if (!data) return;
        this.stopStrokeAnimation();
        this.sfx('playPop');

        const uid = `sk${++this.svgUid}`;
        const lens = data.medians.map(m => {
            let len = 0;
            for (let i = 1; i < m.length; i++) len += Math.hypot(m[i][0] - m[i - 1][0], m[i][1] - m[i - 1][1]);
            return Math.max(len, 20);
        });
        const clips = data.strokes.map((d, i) => `<clipPath id="${uid}-c${i}"><path d="${d}"/></clipPath>`).join('');
        const outlines = data.strokes.map(d => `<path d="${d}" fill="#e2e8f0"></path>`).join('');
        const animated = data.medians.map((m, i) => {
            const L = lens[i] + 10;
            const pts = m.map(p => `${p[0]},${p[1]}`).join(' ');
            return `<g clip-path="url(#${uid}-c${i})"><polyline class="sk-anim" data-idx="${i}" points="${pts}"
                stroke-dasharray="${L} ${L + 420}" stroke-dashoffset="${L + 110}"/></g>`;
        }).join('');

        box.innerHTML = `
            <svg viewBox="0 0 1024 1024" class="sk-svg" aria-label="${sk.char} 笔顺演示">
                <defs>${clips}</defs>
                ${this.strokeGridSvg()}
                <g transform="scale(1, -1) translate(0, -900)">${outlines}${animated}</g>
                <g class="sk-labels"></g>
            </svg>
        `;

        const labels = box.querySelector('.sk-labels');
        const polylines = box.querySelectorAll('.sk-anim');
        let i = 0;
        const step = () => {
            if (i >= polylines.length) {
                this.strokeAnimTimer = null;
                if (onDone) onDone();
                else this.speak(`${sk.char}字一共${sk.total}画。`);
                return;
            }
            const pl = polylines[i];
            const dur = Math.min(0.75, 0.25 + lens[i] / 1600);
            pl.style.transition = `stroke-dashoffset ${dur}s linear`;
            void pl.getBoundingClientRect();
            pl.style.strokeDashoffset = '0';
            if (labels) labels.insertAdjacentHTML('beforeend', this.strokeLabelSvg(data, i, false));
            this.sfx('playPop');
            i += 1;
            this.strokeAnimTimer = setTimeout(step, dur * 1000 + 260);
        };
        this.strokeAnimTimer = setTimeout(step, 200);
    }

    stopStrokeAnimation() {
        if (this.strokeAnimTimer) {
            clearTimeout(this.strokeAnimTimer);
            this.strokeAnimTimer = null;
        }
    }

    // ==================== 游戏 6：🔗 反义词连线 ====================
    newAntonymRound() {
        const pairCount = this.difficulty === 'easy' ? 4 : (this.difficulty === 'hard' ? 7 : 6);
        let poolPairs = GP_ANTONYM_PAIRS.slice();
        if (this.gradeFilter && this.gradeFilter !== 'all') {
            const gradeOrder = ['k-1', 'k', 'g1', 'g2', 'g3'];
            const maxIdx = Math.max(1, gradeOrder.indexOf(this.gradeFilter));
            const allowed = new Set(gradeOrder.slice(0, maxIdx + 1));
            const filtered = poolPairs.filter(p => allowed.has(p.g || 'g1'));
            if (filtered.length >= pairCount) poolPairs = filtered;
        }
        const pairs = gpShuffle(poolPairs).slice(0, pairCount);
        this.ant = {
            pairs,
            right: gpShuffle(pairs.map(p => p.b)),
            selL: null,
            selR: null,
            matched: {},
            mistakes: 0,
            done: false
        };
        const btn = document.getElementById('btn-ant-new');
        if (btn) {
            btn.textContent = '🔄 换一组';
            btn.classList.remove('pulse');
        }
        this.setAntStatus('💡 点一点字，可以听到它的读音哦！');
        this.renderAntonym();
    }

    setAntStatus(text, done = false) {
        const el = document.getElementById('ant-status');
        if (!el) return;
        el.className = `ant-status ${done ? 'all-done' : ''}`;
        el.innerHTML = text;
    }

    renderAntonym() {
        const ant = this.ant;
        const leftCol = document.getElementById('exam-ant-left-col');
        const rightCol = document.getElementById('exam-ant-right-col');
        if (!ant || !leftCol || !rightCol) return;
        const matchedRights = Object.values(ant.matched);
        const emojiOf = {};
        ant.pairs.forEach(p => {
            if (p.ea) emojiOf[p.a] = p.ea;
            if (p.eb) emojiOf[p.b] = p.eb;
        });

        leftCol.innerHTML = ant.pairs.map(p => `
            <button type="button" class="ant-word-card left-card ${ant.matched[p.a] ? 'matched' : ''} ${ant.selL === p.a ? 'selected' : ''}" data-side="left" data-char="${p.a}">
                <span class="ant-emoji">${emojiOf[p.a] || ''}</span>
                <span class="ant-char-text">${p.a}</span>
                <span class="ant-dot left-dot"></span>
            </button>
        `).join('');
        rightCol.innerHTML = ant.right.map(c => `
            <button type="button" class="ant-word-card right-card ${matchedRights.includes(c) ? 'matched' : ''} ${ant.selR === c ? 'selected' : ''}" data-side="right" data-char="${c}">
                <span class="ant-dot right-dot"></span>
                <span class="ant-char-text">${c}</span>
                <span class="ant-emoji">${emojiOf[c] || ''}</span>
            </button>
        `).join('');
        requestAnimationFrame(() => this.renderAntonymLines());
    }

    onAntonymTap(card) {
        const ant = this.ant;
        if (!ant || ant.done || !card) return;
        const side = card.dataset.side;
        const c = card.dataset.char;
        if (side === 'left') {
            if (ant.matched[c]) return;
            ant.selL = (ant.selL === c) ? null : c;
        } else {
            if (Object.values(ant.matched).includes(c)) return;
            ant.selR = (ant.selR === c) ? null : c;
        }
        this.sfx('playPop');
        this.speak(c);
        if (ant.selL && ant.selR) {
            this.tryConnectAntonym(ant.selL, ant.selR);
        } else {
            this.renderAntonym();
        }
    }

    tryConnectAntonym(l, r) {
        const ant = this.ant;
        const pair = ant.pairs.find(p => p.a === l);
        ant.selL = null;
        ant.selR = null;
        if (pair && pair.b === r) {
            ant.matched[l] = r;
            this.renderAntonym();
            this.sfx('playStar');
            this.registerCorrect();
            const rCard = document.querySelector(`#exam-ant-right-col .ant-word-card[data-char="${r}"]`);
            this.awardStars(1, rCard);
            this.setMascot(`${this.praise()} “${l}”和“${r}”意思相反！`, 'happy');
            this.speak(`${l}和${r}，意思相反！`);
            if (Object.keys(ant.matched).length === ant.pairs.length) {
                ant.done = true;
                const bonus = ant.mistakes === 0 ? 2 : 1;
                this.later(() => {
                    this.awardStars(bonus, document.getElementById('exam-ant-board'));
                    if (this.app && typeof this.app.fireConfetti === 'function') this.app.fireConfetti();
                    this.sfx('playVictory');
                    this.setAntStatus(`🎉 全部连对啦！奖励 ${bonus} 颗星星！`, true);
                    this.setMascot('全部连对啦！点“下一组”继续挑战吧！', 'wow');
                    const btn = document.getElementById('btn-ant-new');
                    if (btn) {
                        btn.textContent = '下一组 ➔';
                        btn.classList.add('pulse');
                    }
                }, 650);
            }
        } else {
            ant.mistakes += 1;
            this.renderAntonym();
            this.registerWrong();
            this.sfx('playMistake');
            this.flashWrongAntonymLine(l, r);
            ['left', 'right'].forEach(side => {
                const ch = side === 'left' ? l : r;
                const el = document.querySelector(`#exam-ant-${side}-col .ant-word-card[data-char="${ch}"]`);
                this.flash(el, 'wrong', 500);
            });
            this.setMascot(`“${l}”和“${r}”不是一对哦，再想一想！`, 'oops');
        }
    }

    getAntDotCenter(side, ch) {
        const board = document.getElementById('exam-ant-board');
        if (!board) return null;
        const dot = board.querySelector(`#exam-ant-${side}-col .ant-word-card[data-char="${ch}"] .ant-dot`);
        if (!dot) return null;
        const b = board.getBoundingClientRect();
        const r = dot.getBoundingClientRect();
        return { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height / 2 };
    }

    renderAntonymLines(tempWrong = null) {
        const svg = document.getElementById('exam-ant-svg');
        const board = document.getElementById('exam-ant-board');
        if (!svg || !board || !this.ant) return;
        const b = board.getBoundingClientRect();
        if (b.width <= 0 || b.height <= 0) return;
        svg.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`);

        let html = '';
        Object.entries(this.ant.matched).forEach(([l, r]) => {
            const p1 = this.getAntDotCenter('left', l);
            const p2 = this.getAntDotCenter('right', r);
            if (!p1 || !p2) return;
            const mx = p1.x + (p2.x - p1.x) * 0.78;
            const my = p1.y + (p2.y - p1.y) * 0.78;
            html += `
                <line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#14b8a6" stroke-width="5" stroke-linecap="round"/>
                <circle cx="${mx}" cy="${my}" r="13" fill="#ffffff" stroke="#14b8a6" stroke-width="3"/>
                <text x="${mx}" y="${my + 1}" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="900" fill="#0f766e">✓</text>
            `;
        });
        if (tempWrong) {
            const p1 = this.getAntDotCenter('left', tempWrong.l);
            const p2 = this.getAntDotCenter('right', tempWrong.r);
            if (p1 && p2) {
                html += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#ef4444" stroke-width="5" stroke-dasharray="10,8" stroke-linecap="round"/>`;
            }
        }
        svg.innerHTML = html;
    }

    flashWrongAntonymLine(l, r) {
        this.renderAntonymLines({ l, r });
        this.later(() => this.renderAntonymLines(), 700);
    }

    // ==================== 游戏 7：🃏 翻牌配对 ====================
    newMemoryRound() {
        const targetPairs = this.difficulty === 'easy' ? 4 : (this.difficulty === 'hard' ? 8 : 6);
        const scopedPool = this.filterPoolByScope(this.picturePool);
        const chosen = [];
        const usedCats = {};
        for (const c of gpShuffle(scopedPool.slice())) {
            if (chosen.length >= targetPairs) break;
            if (chosen.some(x => this.sameGroup(x, c))) continue;
            const cat = this.info(c).catId;
            if ((usedCats[cat] || 0) >= 3) continue;
            chosen.push(c);
            usedCats[cat] = (usedCats[cat] || 0) + 1;
        }
        // 若同组过滤导致不足，从全图库补齐
        if (chosen.length < targetPairs) {
            for (const c of gpShuffle(this.picturePool.slice())) {
                if (chosen.length >= targetPairs) break;
                if (chosen.includes(c) || chosen.some(x => this.sameGroup(x, c))) continue;
                chosen.push(c);
            }
        }
        const cards = gpShuffle(chosen.flatMap(c => [{ key: c, kind: 'pic' }, { key: c, kind: 'char' }]))
            .map((card, i) => ({ ...card, id: i, matched: false }));
        this.mm = { cards, open: [], lock: false, flips: 0, matchedPairs: 0, total: chosen.length };

        const grid = document.getElementById('mm-grid');
        if (grid) {
            grid.dataset.pairs = String(chosen.length);
            grid.innerHTML = cards.map(card => `
                <div role="button" tabindex="0" class="mm-card" data-id="${card.id}" aria-label="翻牌">
                    <div class="mm-inner">
                        <div class="mm-face mm-back"><span class="mm-back-emoji">🐼</span></div>
                        <div class="mm-face mm-front ${card.kind}">
                            ${card.kind === 'pic'
                                ? `<img src="${this.info(card.key).image}" alt="" draggable="false">`
                                : `<span class="mm-char">${card.key}</span>`}
                        </div>
                    </div>
                </div>
            `).join('');
        }
        const btn = document.getElementById('btn-mm-restart');
        if (btn) btn.classList.remove('pulse');
        const status = document.getElementById('mm-status');
        if (status) {
            status.className = 'mm-status';
            status.textContent = '💡 记住翻开过的牌在哪里，配对更快哦！';
        }
        this.setMascot('翻开两张牌，把图片和汉字配成好朋友！', 'idle');
    }

    onMemoryTap(btn) {
        const mm = this.mm;
        if (!mm || mm.lock || !btn) return;
        const card = mm.cards[parseInt(btn.dataset.id, 10)];
        if (!card || card.matched || mm.open.includes(card.id)) return;

        btn.classList.add('flipped');
        this.sfx('playPop');
        mm.open.push(card.id);
        if (mm.open.length < 2) {
            if (card.kind === 'char') this.speak(card.key);
            return;
        }

        mm.flips += 1;
        const [a, b] = mm.open.map(id => mm.cards[id]);
        const grid = document.getElementById('mm-grid');
        const btnA = grid ? grid.querySelector(`.mm-card[data-id="${a.id}"]`) : null;
        const btnB = grid ? grid.querySelector(`.mm-card[data-id="${b.id}"]`) : null;

        if (a.key === b.key && a.kind !== b.kind) {
            a.matched = true;
            b.matched = true;
            mm.open = [];
            mm.matchedPairs += 1;
            [btnA, btnB].forEach(el => el && el.classList.add('matched'));
            this.sfx('playCorrect');
            this.registerCorrect();
            this.awardStars(1, btn);
            this.sayChar(a.key);
            this.setMascot(`${this.praise()} “${a.key}”配对成功！`, 'happy');
            if (mm.matchedPairs === mm.total) this.later(() => this.finishMemory(), 800);
        } else {
            if (card.kind === 'char') this.speak(card.key);
            mm.lock = true;
            this.registerWrong();
            this.setMascot('不是一对哦，记住它们的位置！', 'oops');
            this.later(() => {
                [btnA, btnB].forEach(el => el && el.classList.remove('flipped'));
                mm.open = [];
                mm.lock = false;
            }, 1000);
        }
    }

    finishMemory() {
        const mm = this.mm;
        const bonus = mm.flips <= mm.total + 3 ? 3 : (mm.flips <= mm.total + 7 ? 2 : 1);
        this.awardStars(bonus, document.getElementById('mm-grid'));
        if (this.app && typeof this.app.fireConfetti === 'function') this.app.fireConfetti();
        this.sfx('playVictory');
        this.setMascot(`全部配对成功！奖励 ${bonus} 颗星星！`, 'wow');
        this.speak('太棒啦，全部配对成功！');
        const status = document.getElementById('mm-status');
        if (status) {
            status.className = 'mm-status all-done';
            status.textContent = `🎉 全部配对成功！奖励 ${bonus} 颗星星，再玩一局吧！`;
        }
        const btn = document.getElementById('btn-mm-restart');
        if (btn) btn.classList.add('pulse');
    }

    // ==================== 游戏 8：🔨 汉字打地鼠 ====================
    startMole() {
        const field = document.getElementById('ml-field');
        if (field && !field.children.length) {
            field.innerHTML = Array.from({ length: 6 }, (_, i) => `
                <div class="ml-hole" data-idx="${i}">
                    <div class="ml-pit"></div>
                    <div class="ml-clip">
                        <div class="ml-mole" aria-hidden="true">
                            <span class="ml-ear l"></span><span class="ml-ear r"></span>
                            <span class="ml-body"></span>
                            <span class="ml-eye l"></span><span class="ml-eye r"></span>
                            <span class="ml-nose"></span>
                            <span class="ml-sign"></span>
                        </div>
                    </div>
                    <div class="ml-lip"></div>
                </div>
            `).join('');
        }
        this.ml = { running: false, switching: false, target: null, hits: 0, sinceTarget: 0, token: 0, distractors: [] };
        this.resetMoleHoles();
        this.pickMoleTarget(false);
        this.setMoleButton();
        this.setMascot('地鼠就要冒出来啦！敲出和图片一样的字！', 'idle');
        this.moleLater(() => {
            if (this.activeGame === 'mole' && this.ml && !this.ml.running) this.resumeMole();
        }, 450);
    }

    pickMoleTarget(announce = true) {
        if (!this.ml) return;
        const ch = this.pickNext('mole', this.picturePool);
        if (!ch) return;
        this.ml.target = ch;
        this.ml.hits = 0;
        this.ml.sinceTarget = 0;
        this.ml.switching = false;
        this.resetMoleHoles();
        this.ml.distractors = this.buildOptions(ch, 6, { pool: this.picturePool, sameCatCount: 2 }).filter(c => c !== ch);
        const img = document.getElementById('ml-target-img');
        if (img) {
            img.src = this.info(ch).image;
            this.flash(img, 'gp-pop-in', 500);
        }
        if (announce) {
            this.setMascot('换新目标啦！看图片，敲出这个字！', 'wow');
            this.sayChar(ch);
        }
    }

    setMoleButton() {
        const btn = document.getElementById('btn-ml-toggle');
        if (!btn || !this.ml) return;
        btn.textContent = this.ml.running ? '⏸️ 暂停' : (this.ml.started ? '▶️ 继续' : '▶️ 开始');
        btn.classList.toggle('pulse', !this.ml.running);
    }

    toggleMole() {
        if (!this.ml) return;
        if (this.ml.running) {
            this.pauseMole();
            this.setMascot('休息一下，点“继续”接着敲地鼠！', 'idle');
        } else {
            this.resumeMole();
        }
    }

    resumeMole() {
        if (!this.ml) return;
        this.ml.running = true;
        this.ml.started = true;
        this.setMoleButton();
        this.setMascot('看图片，敲出这个字！', 'idle');
        this.sayChar(this.ml.target);
        this.moleLater(() => this.spawnMole(), 900);
    }

    pauseMole() {
        this.clearMoleTimers();
        if (!this.ml) return;
        this.ml.running = false;
        this.resetMoleHoles();
        this.setMoleButton();
    }

    resetMoleHoles() {
        document.querySelectorAll('#ml-field .ml-hole').forEach(h => h.classList.remove('up', 'hit', 'miss'));
    }

    spawnMole() {
        const ml = this.ml;
        if (!ml || !ml.running) return;
        const maxUp = this.difficulty === 'hard' ? 3 : 2;
        const stayMs = this.difficulty === 'easy' ? 3300 : (this.difficulty === 'hard' ? 1900 : 2600);
        const nextDelay = this.difficulty === 'easy' ? (1100 + Math.random() * 500) : (this.difficulty === 'hard' ? (660 + Math.random() * 400) : (900 + Math.random() * 520));
        if (!ml.switching) {
            const holes = Array.from(document.querySelectorAll('#ml-field .ml-hole'));
            const free = holes.filter(h => !h.classList.contains('up'));
            const upCount = holes.length - free.length;
            if (free.length && upCount < maxUp) {
                const hole = gpPick(free);
                const targetUp = holes.some(h => h.classList.contains('up') && h.dataset.char === ml.target);
                let ch;
                if (!targetUp && (ml.sinceTarget >= 2 || Math.random() < 0.48)) {
                    ch = ml.target;
                    ml.sinceTarget = 0;
                } else {
                    ch = gpPick(ml.distractors.length ? ml.distractors : this.picturePool.filter(c => c !== ml.target));
                    ml.sinceTarget += 1;
                }
                const token = ++ml.token;
                hole.dataset.char = ch;
                hole.dataset.token = String(token);
                const sign = hole.querySelector('.ml-sign');
                if (sign) sign.textContent = ch;
                hole.classList.remove('hit', 'miss');
                hole.classList.add('up');
                this.moleLater(() => {
                    if (hole.dataset.token === String(token)) hole.classList.remove('up', 'hit', 'miss');
                }, stayMs);
            }
        }
        this.moleLater(() => this.spawnMole(), nextDelay);
    }

    onMoleTap(hole) {
        const ml = this.ml;
        if (!ml || !ml.running || ml.switching || !hole || !hole.classList.contains('up') || hole.classList.contains('hit') || hole.classList.contains('miss')) return;
        const ch = hole.dataset.char;
        const token = hole.dataset.token;
        const hitsNeeded = this.difficulty === 'easy' ? 2 : 3;
        if (ch === ml.target) {
            hole.classList.add('hit');
            this.burstAt(hole, ['#facc15', '#f97316', '#22c55e']);
            this.sfx('playCorrect');
            this.registerCorrect();
            this.awardStars(1, hole);
            ml.hits += 1;
            this.moleLater(() => {
                if (hole.dataset.token === token) hole.classList.remove('up', 'hit');
            }, 520);
            if (ml.hits >= hitsNeeded) {
                ml.switching = true;
                this.moleLater(() => this.pickMoleTarget(true), 650);
            } else {
                this.setMascot(`${this.praise()} 敲中“${ch}”啦！`, 'happy');
            }
        } else {
            hole.classList.add('miss');
            this.sfx('playMistake');
            this.registerWrong();
            this.setMascot(`哎呀，这是“${ch}”，再看看图片！`, 'oops');
            this.moleLater(() => {
                if (hole.dataset.token === token) hole.classList.remove('up', 'miss');
            }, 560);
        }
    }

    // ==================== A4 纸质试卷打印（随机出题） ====================
    printExamPaper() {
        this.sfx('playPop');
        let printArea = document.getElementById('printable-area');
        if (!printArea) {
            printArea = document.createElement('div');
            printArea.id = 'printable-area';
            document.body.appendChild(printArea);
        }
        const cache = window.STROKE_DATA_CACHE || {};

        const scopedWriting = this.filterPoolByScope(this.writingPool);
        const picItems = gpShuffle(scopedWriting.slice()).slice(0, 10).map(ch => this.info(ch)).filter(Boolean);
        const picGridHtml = picItems.map(q => {
            const cw = this.clueWord(q.char);
            const clueTxt = cw ? cw.replace(q.char, '（  ）') : '';
            return `
            <div class="exam-print-pic-cell">
                <div class="exam-print-img-box"><img src="${q.image}" alt="看图写字"></div>
                ${clueTxt ? `<div style="font-size:12px;font-weight:700;color:#334155;">${clueTxt}</div>` : ''}
                <div class="exam-print-mizi"><span class="grid-cross-h"></span><span class="grid-cross-v"></span></div>
            </div>
        `;
        }).join('');

        const stkItems = gpShuffle(Object.keys(GP_STROKE_TYPE_DATA).filter(ch => {
            const types = GP_STROKE_TYPE_DATA[ch].split(' ');
            return cache[ch] && cache[ch].medians.length === types.length && types.length <= 8 && types.some(t => GP_STROKE_TYPES[t]);
        })).slice(0, 4).map(ch => {
            const types = GP_STROKE_TYPE_DATA[ch].split(' ');
            const askable = types.map((t, i) => (GP_STROKE_TYPES[t] ? i : -1)).filter(i => i >= 0);
            return { char: ch, ask: gpPick(askable) };
        });
        const stkHtml = stkItems.map((q, idx) => `
            <div class="exam-print-stk-row">
                （${idx + 1}）“<strong>${q.char}</strong>” 一共有 <span class="exam-print-line"></span> 画，第${GP_CN_NUM[q.ask]}画是 <span class="exam-print-line"></span>。
            </div>
        `).join('');

        const antPairs = gpShuffle(GP_ANTONYM_PAIRS.slice()).slice(0, 6);
        const rightOrder = gpShuffle(antPairs.map(p => p.b));
        const antRowsHtml = antPairs.map((pair, idx) => `
            <div class="exam-print-ant-row">
                <span class="ant-p-char">${pair.a}</span>
                <span class="ant-p-dot">•</span>
                <span class="ant-p-gap"></span>
                <span class="ant-p-dot">•</span>
                <span class="ant-p-char">${rightOrder[idx]}</span>
            </div>
        `).join('');

        printArea.innerHTML = `
            <div class="print-sheet exam-print-sheet">
                <div class="print-header">
                    <h2>快乐小书法家 · 汉字闯关测试卷</h2>
                    <div class="print-meta">
                        <span>姓名 (Name)：______________</span>
                        <span>日期：____年__月__日</span>
                        <span>得分：【 ______ / 100 】</span>
                    </div>
                </div>
                <div class="exam-print-section">
                    <h3>一、看图写汉字 (Look at each picture and write the Chinese character)</h3>
                    <div class="exam-print-pic-grid">${picGridHtml}</div>
                </div>
                <div class="exam-print-bottom-cols">
                    <div class="exam-print-section exam-print-col-stk">
                        <h3>二、数笔画，填空 (Count the strokes and fill in the blanks)</h3>
                        <div class="exam-print-stk-list">${stkHtml}</div>
                    </div>
                    <div class="exam-print-section exam-print-col-ant">
                        <h3>三、反义词连线 (Match each word with its opposite)</h3>
                        <div class="exam-print-ant-list">${antRowsHtml}</div>
                    </div>
                </div>
            </div>
        `;
        window.print();
    }

    // ==================== 事件绑定 ====================
    bindEvents() {
        const on = (id, evt, fn) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener(evt, fn);
        };
        const delegate = (id, selector, fn, evt = 'click') => {
            const root = document.getElementById(id);
            if (!root) return;
            root.addEventListener(evt, (e) => {
                const target = e.target.closest(selector);
                if (target && root.contains(target)) fn(target, e);
            });
        };

        // 顶栏主 Tab
        on('primary-tab-practice', 'click', () => {
            this.sfx('playPop');
            this.switchAppTab('practice');
        });
        on('primary-tab-exam', 'click', () => {
            this.sfx('playPop');
            this.switchAppTab('exam');
        });
        on('btn-settings-exam', 'click', () => {
            this.sfx('playPop');
            const settingsModal = document.getElementById('settings-modal');
            if (settingsModal) settingsModal.classList.remove('visible');
            this.switchAppTab('exam');
            this.showHub();
        });

        // 大厅与舞台
        delegate('game-card-grid', '.game-card', (card) => {
            this.sfx('playPop');
            this.enterGame(card.dataset.game);
        });
        on('btn-game-back', 'click', () => {
            this.sfx('playPop');
            if (window.soundManager && typeof window.soundManager.stopSpeaking === 'function') window.soundManager.stopSpeaking();
            this.showHub();
        });
        on('btn-game-random', 'click', () => {
            this.sfx('playPop');
            this.enterGame(gpPick(GP_GAMES).id);
        });
        on('btn-game-scope', 'click', () => this.cycleScopeMode());
        on('btn-hub-level-setting', 'click', () => this.openLevelSettings());
        on('btn-game-practice-char', 'click', () => this.practiceCurrentChar());
        on('btn-exam-print-paper', 'click', () => {
            const settingsModal = document.getElementById('settings-modal');
            if (settingsModal) settingsModal.classList.remove('visible');
            this.printExamPaper();
        });
        delegate('game-grade-pills', '.gp-grade-pill', (pill) => {
            this.sfx('playPop');
            this.setGradeFilter(pill.dataset.grade, true);
        });
        delegate('game-diff-pills', '.gp-diff-pill', (pill) => {
            this.sfx('playPop');
            this.setDifficulty(pill.dataset.diff);
        });
        on('btn-game-stage-diff', 'click', () => {
            this.sfx('playPop');
            const order = ['easy', 'standard', 'hard'];
            const next = order[(order.indexOf(this.difficulty) + 1) % order.length];
            this.setDifficulty(next);
        });

        // 看图写字
        on('pw-img', 'click', () => {
            if (!this.pw) return;
            this.sfx('playPop');
            this.sayChar(this.pw.char);
        });
        on('pw-word-clue', 'click', () => {
            if (!this.pw) return;
            this.sfx('playPop');
            this.sayChar(this.pw.char);
        });
        on('btn-pw-speak', 'click', () => {
            if (!this.pw) return;
            this.pw.usedHint = true;
            this.sfx('playPop');
            this.sayChar(this.pw.char);
        });
        on('btn-pw-pinyin', 'click', () => {
            if (!this.pw) return;
            this.pw.usedHint = true;
            this.sfx('playPop');
            const tag = document.getElementById('pw-pinyin');
            if (tag) {
                tag.hidden = false;
                this.flash(tag, 'gp-pop-in', 500);
            }
        });
        on('btn-pw-trace', 'click', () => {
            if (!this.pw || !this.examCanvas) return;
            this.sfx('playPop');
            const next = !this.examCanvas.showTrace;
            this.examCanvas.setTraceSettings(next);
            if (next) this.pw.usedTrace = true;
            this.setTraceButton(next);
        });
        on('btn-exam-undo', 'click', () => {
            if (this.examCanvas) this.examCanvas.undo();
            this.sfx('playPop');
        });
        on('btn-exam-clear', 'click', () => {
            if (this.examCanvas) this.examCanvas.clear();
            this.sfx('playEraser');
        });
        on('btn-pw-skip', 'click', () => {
            this.sfx('playPop');
            this.nextPicwrite();
        });
        on('btn-exam-submit-pic', 'click', () => this.pwSubmit());
        delegate('pw-feedback', '[data-pw-act]', (btn) => this.pwFeedbackAction(btn.dataset.pwAct));

        // 气球选字
        delegate('bl-sky', '.balloon', (btn) => this.onBalloonTap(btn));
        on('bl-img', 'click', () => this.balloonHint());
        on('btn-bl-speak', 'click', () => this.balloonHint());

        // 听音找字
        delegate('ls-options', '.ls-card', (card) => this.onListenTap(card));
        on('btn-ls-play', 'click', () => {
            this.sfx('playPop');
            this.playListenPrompt();
        });
        on('btn-ls-sound-on', 'click', () => this.enableSoundForGame());

        // 组词填空
        delegate('wd-options', '.wd-piece', (btn) => this.onWordTap(btn));
        on('wd-img', 'click', () => {
            if (!this.wd) return;
            this.sfx('playPop');
            this.speak(this.wd.word);
        });
        on('wd-word', 'click', () => {
            if (!this.wd) return;
            this.sfx('playPop');
            this.speak(this.wd.word);
        });
        on('btn-wd-speak', 'click', () => {
            if (!this.wd) return;
            this.sfx('playPop');
            this.speak(this.wd.word);
        });

        // 数笔画
        delegate('sk-options', '.sk-num', (btn) => this.onStrokeNum(btn));
        delegate('sk-options', '.sk-type', (btn) => this.onStrokeType(btn));
        on('btn-sk-count', 'click', () => {
            if (!this.sk) return;
            this.playStrokeCount(() => {
                const sk = this.sk;
                if (!sk) return;
                this.renderStrokeStatic(sk.step === 2 ? sk.askIdx : -1, sk.total);
                this.speak(`${sk.char}字一共${sk.total}画。`);
            });
        });
        on('btn-sk-next', 'click', () => {
            this.sfx('playPop');
            this.nextStroke();
        });
        on('btn-sk-skip', 'click', () => {
            this.sfx('playPop');
            this.nextStroke();
        });

        // 反义词连线
        delegate('exam-ant-board', '.ant-word-card', (card) => this.onAntonymTap(card));
        on('btn-ant-new', 'click', () => {
            this.sfx('playPop');
            this.newAntonymRound();
        });
        const antBoard = document.getElementById('exam-ant-board');
        if (antBoard && typeof ResizeObserver === 'function') {
            this._antResizeObs = new ResizeObserver(() => {
                if (this.activeAppTab === 'exam' && this.activeGame === 'antonym') {
                    this.renderAntonymLines();
                }
            });
            this._antResizeObs.observe(antBoard);
        }

        // 翻牌配对
        delegate('mm-grid', '.mm-card', (btn) => this.onMemoryTap(btn));
        on('btn-mm-restart', 'click', () => {
            this.sfx('playPop');
            this.newMemoryRound();
        });

        // 打地鼠（pointerdown 响应更灵敏）
        delegate('ml-field', '.ml-hole', (hole, e) => {
            if (e && e.cancelable) e.preventDefault();
            this.onMoleTap(hole);
        }, 'pointerdown');
        on('btn-ml-toggle', 'click', () => {
            this.sfx('playPop');
            this.toggleMole();
        });
        on('ml-target-img', 'click', () => {
            if (!this.ml || !this.ml.target) return;
            this.sfx('playPop');
            this.sayChar(this.ml.target);
        });
        on('btn-ml-speak', 'click', () => {
            if (!this.ml || !this.ml.target) return;
            this.sfx('playPop');
            this.sayChar(this.ml.target);
        });

        window.addEventListener('resize', () => {
            if (this.activeAppTab === 'exam' && this.activeGame === 'antonym') {
                this.renderAntonymLines();
            }
        });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.ml && this.ml.running) this.pauseMole();
        });
    }
}

window.ExamCenter = ExamCenter;
