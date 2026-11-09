/**
 * char-data.js - 汉字题库与学龄分级字典
 * 精选适合少儿启蒙 (K-1 / K) 至小学 1-3 年级 (G1-G3) 的常用汉字 (400字)，涵盖12大趣味主题与5大学龄分级
 */

const CHARACTER_GRADES = [
    {
        "id": "all",
        "name": "🌈 全部学龄",
        "short": "全部",
        "age": "3-9岁",
        "desc": "全量 400 字题库",
        "defaultDiff": "standard"
    },
    {
        "id": "k-1",
        "name": "🐣 K-1 启蒙",
        "short": "K-1",
        "age": "3-4岁",
        "desc": "象形独体字与基础数字",
        "defaultDiff": "easy"
    },
    {
        "id": "k",
        "name": "🌱 K班 学前",
        "short": "K班",
        "age": "4-5岁",
        "desc": "高频生活与自然基础字",
        "defaultDiff": "easy"
    },
    {
        "id": "g1",
        "name": "🌿 G1 一年级",
        "short": "G1",
        "age": "5-6岁",
        "desc": "小学一年级核心生字",
        "defaultDiff": "standard"
    },
    {
        "id": "g2",
        "name": "🌳 G2 二年级",
        "short": "G2",
        "age": "6-7岁",
        "desc": "小学二年级常用合体字",
        "defaultDiff": "standard"
    },
    {
        "id": "g3",
        "name": "🏆 G3 进阶",
        "short": "G3+",
        "age": "7-9岁",
        "desc": "三四年级品德文化与进阶字",
        "defaultDiff": "hard"
    }
];

const CHARACTER_DIFFICULTIES = [
    {
        "id": "easy",
        "name": "🌱 轻松启蒙",
        "short": "轻松",
        "stars": 1,
        "desc": "3选项 · 慢速 · 自动拼音提示"
    },
    {
        "id": "standard",
        "name": "⭐ 标准闯关",
        "short": "标准",
        "stars": 2,
        "desc": "4选项 · 标准速度 · 词组提示"
    },
    {
        "id": "hard",
        "name": "🔥 挑战进阶",
        "short": "挑战",
        "stars": 3,
        "desc": "6选项 · 形近字干扰 · 严格评分"
    }
];

const CHARACTER_CATEGORIES = [
    {
        "id": "starter",
        "name": "🌟 启蒙入门",
        "color": "#ff7675",
        "chars": [
            {
                "char": "一",
                "pinyin": "yī",
                "en": "one",
                "strokes": 1,
                "radical": "一",
                "words": [
                    "一个",
                    "一天",
                    "第一"
                ],
                "sentence": "我是一个活泼可爱的小朋友。",
                "icon": "☝️",
                "label": "一个",
                "image": "assets/illustrations/yi_one.jpg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "二",
                "pinyin": "èr",
                "en": "two",
                "strokes": 2,
                "radical": "二",
                "words": [
                    "第二",
                    "二十",
                    "二月"
                ],
                "sentence": "一年有十二个月，二月有立春。",
                "icon": "✌️",
                "label": "两个",
                "image": "assets/illustrations/er_two.jpg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "三",
                "pinyin": "sān",
                "en": "three",
                "strokes": 3,
                "radical": "一",
                "words": [
                    "三个",
                    "三天",
                    "三月"
                ],
                "sentence": "天空中飘着三个美丽的小气球。",
                "icon": "👌",
                "label": "三个",
                "image": "assets/illustrations/san_three.jpg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "十",
                "pinyin": "shí",
                "en": "ten",
                "strokes": 2,
                "radical": "十",
                "words": [
                    "十个",
                    "十足",
                    "十分"
                ],
                "sentence": "我有十个手指头。",
                "icon": "🔟",
                "label": "十个",
                "image": "assets/illustrations/shi.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "人",
                "pinyin": "rén",
                "en": "person",
                "strokes": 2,
                "radical": "人",
                "words": [
                    "人们",
                    "好人",
                    "大人"
                ],
                "sentence": "做一个善良诚实的好人。",
                "icon": "🧑",
                "label": "人们",
                "image": "assets/illustrations/ren.jpg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "口",
                "pinyin": "kǒu",
                "en": "mouth",
                "strokes": 3,
                "radical": "口",
                "words": [
                    "门口",
                    "张口",
                    "大口"
                ],
                "sentence": "我们要大口大口吃蔬菜，身体棒棒的。",
                "icon": "👄",
                "label": "门口",
                "image": "assets/illustrations/kou.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "大",
                "pinyin": "dà",
                "en": "big",
                "strokes": 3,
                "radical": "大",
                "words": [
                    "大人",
                    "大树",
                    "大家"
                ],
                "sentence": "我张开双手，大声说：我长大了！",
                "icon": "🙆",
                "label": "长大",
                "image": "assets/illustrations/da_big.jpg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "小",
                "pinyin": "xiǎo",
                "en": "small",
                "strokes": 3,
                "radical": "小",
                "words": [
                    "小草",
                    "小孩",
                    "小心"
                ],
                "sentence": "手心里捧着一棵小小的绿芽。",
                "icon": "🤏",
                "label": "小苗",
                "image": "assets/illustrations/xiao_small.jpg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "上",
                "pinyin": "shàng",
                "en": "up",
                "strokes": 3,
                "radical": "一",
                "words": [
                    "上学",
                    "上下",
                    "向上"
                ],
                "sentence": "天天向上，努力学好本领。",
                "icon": "🧗",
                "label": "向上",
                "image": "assets/illustrations/shang.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "下",
                "pinyin": "xià",
                "en": "down",
                "strokes": 3,
                "radical": "一",
                "words": [
                    "下来",
                    "下午",
                    "向下"
                ],
                "sentence": "窗外下起了淅淅沥沥的春雨。",
                "icon": "🌧️",
                "label": "向下",
                "image": "assets/illustrations/xia.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "日",
                "pinyin": "rì",
                "en": "sun",
                "strokes": 4,
                "radical": "日",
                "words": [
                    "红日",
                    "日光",
                    "日月"
                ],
                "sentence": "一轮红日从东方冉冉升起，日光温暖照耀。",
                "icon": "☀️",
                "label": "红日",
                "image": "assets/illustrations/ri.jpg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "月",
                "pinyin": "yuè",
                "en": "moon",
                "strokes": 4,
                "radical": "月",
                "words": [
                    "月亮",
                    "月光",
                    "月份"
                ],
                "sentence": "弯弯的月亮像一条小船。",
                "icon": "🌙",
                "label": "月亮",
                "image": "assets/illustrations/yue.jpg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "水",
                "pinyin": "shuǐ",
                "en": "water",
                "strokes": 4,
                "radical": "水",
                "words": [
                    "喝水",
                    "清水",
                    "水果"
                ],
                "sentence": "我们要多喝温水，爱护身体。",
                "icon": "💧",
                "label": "清水",
                "image": "assets/illustrations/shui.jpg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "火",
                "pinyin": "huǒ",
                "en": "fire",
                "strokes": 4,
                "radical": "火",
                "words": [
                    "大火",
                    "火山",
                    "火焰"
                ],
                "sentence": "红红的火苗带给人们温暖。",
                "icon": "🔥",
                "label": "火焰",
                "image": "assets/illustrations/huo.jpg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "山",
                "pinyin": "shān",
                "en": "mountain",
                "strokes": 3,
                "radical": "山",
                "words": [
                    "高山",
                    "山水",
                    "爬山"
                ],
                "sentence": "远处的青山披着绿色的外衣。",
                "icon": "🏔️",
                "label": "高山",
                "image": "assets/illustrations/shan.jpg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "石",
                "pinyin": "shí",
                "en": "stone",
                "strokes": 5,
                "radical": "石",
                "words": [
                    "石头",
                    "宝石",
                    "岩石"
                ],
                "sentence": "溪流里的鹅卵石又圆又滑。",
                "icon": "🪨",
                "label": "石头",
                "image": "assets/illustrations/shi_stone.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "田",
                "pinyin": "tián",
                "en": "field",
                "strokes": 5,
                "radical": "田",
                "words": [
                    "田地",
                    "水田",
                    "农田"
                ],
                "sentence": "稻田里长满了金黄色的麦穗。",
                "icon": "🌾",
                "label": "稻田",
                "image": "assets/illustrations/tian_field.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "土",
                "pinyin": "tǔ",
                "en": "earth",
                "strokes": 3,
                "radical": "土",
                "words": [
                    "泥土",
                    "土地",
                    "黄土"
                ],
                "sentence": "肥沃的泥土滋养着幼苗。",
                "icon": "🪴",
                "label": "泥土",
                "image": "assets/illustrations/tu.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "木",
                "pinyin": "mù",
                "en": "tree",
                "strokes": 4,
                "radical": "木",
                "words": [
                    "树木",
                    "木头",
                    "积木"
                ],
                "sentence": "我用彩色积木搭了一座城堡。",
                "icon": "🪵",
                "label": "树木",
                "image": "assets/illustrations/mu.jpg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "天",
                "pinyin": "tiān",
                "en": "sky",
                "strokes": 4,
                "radical": "大",
                "words": [
                    "天空",
                    "白天",
                    "晴天"
                ],
                "sentence": "蓝天上飘着几朵雪白的云。",
                "icon": "🌤️",
                "label": "天空",
                "image": "assets/illustrations/tian_sky.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "子",
                "pinyin": "zǐ",
                "en": "child",
                "strokes": 3,
                "radical": "子",
                "words": [
                    "孩子",
                    "儿子",
                    "个子"
                ],
                "sentence": "我是爸爸妈妈最爱的好孩子。",
                "icon": "👶",
                "label": "孩子",
                "image": "assets/illustrations/zi.jpg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "中",
                "pinyin": "zhōng",
                "en": "middle",
                "strokes": 4,
                "radical": "丨",
                "words": [
                    "中间",
                    "中心",
                    "中国"
                ],
                "sentence": "小金箭正正射中了靶心正中间。",
                "icon": "🎯",
                "label": "中间",
                "image": "assets/illustrations/zhong.jpg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "文",
                "pinyin": "wén",
                "en": "culture",
                "strokes": 4,
                "radical": "文",
                "words": [
                    "文化",
                    "语文",
                    "课文"
                ],
                "sentence": "我们要认真学好语文和汉字。",
                "icon": "📜",
                "label": "文化",
                "image": "assets/illustrations/wen.jpg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "白",
                "pinyin": "bái",
                "en": "white",
                "strokes": 5,
                "radical": "白",
                "words": [
                    "白色",
                    "雪白",
                    "白云"
                ],
                "sentence": "天上飘着朵朵雪白的云朵。",
                "icon": "⚪",
                "label": "白色",
                "image": "assets/illustrations/bai_white.svg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "门",
                "pinyin": "mén",
                "en": "door",
                "strokes": 3,
                "radical": "门",
                "words": [
                    "大门",
                    "开门",
                    "校门"
                ],
                "sentence": "清晨我们高高兴兴走进校门。",
                "icon": "🚪",
                "label": "大门",
                "image": "assets/illustrations/men.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "云",
                "pinyin": "yún",
                "en": "cloud",
                "strokes": 4,
                "radical": "二",
                "words": [
                    "白云",
                    "乌云",
                    "彩云"
                ],
                "sentence": "朵朵白云像软绵绵的棉花糖。",
                "icon": "⛅",
                "label": "白云",
                "image": "assets/illustrations/yun.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "风",
                "pinyin": "fēng",
                "en": "wind",
                "strokes": 4,
                "radical": "风",
                "words": [
                    "春风",
                    "大风",
                    "微风"
                ],
                "sentence": "温暖的春风吹拂着绿草。",
                "icon": "🪁",
                "label": "春风",
                "image": "assets/illustrations/feng.svg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "雨",
                "pinyin": "yǔ",
                "en": "rain",
                "strokes": 8,
                "radical": "雨",
                "words": [
                    "春雨",
                    "下雨",
                    "雨水"
                ],
                "sentence": "春雨沙沙地下，滋润着泥土。",
                "icon": "☔",
                "label": "细雨",
                "image": "assets/illustrations/yu.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "禾",
                "pinyin": "hé",
                "en": "seedling",
                "strokes": 5,
                "radical": "禾",
                "words": [
                    "禾苗",
                    "春禾",
                    "木禾"
                ],
                "sentence": "田地里的绿禾苗在阳光下茁壮成长。",
                "icon": "🌾",
                "label": "禾苗",
                "image": "assets/illustrations/he.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "几",
                "pinyin": "jǐ",
                "en": "a few",
                "strokes": 2,
                "radical": "几",
                "words": [
                    "几个",
                    "几天",
                    "几点"
                ],
                "sentence": "地毯上有几块彩色的积木。",
                "icon": "🧱",
                "label": "几个",
                "image": "assets/illustrations/ji_few.jpg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "太",
                "pinyin": "tài",
                "en": "sun / great",
                "strokes": 4,
                "radical": "大",
                "words": [
                    "太阳",
                    "太空",
                    "太大"
                ],
                "sentence": "太阳公公把温暖灿烂的阳光洒满大地。",
                "icon": "🌞",
                "label": "太阳",
                "image": "assets/illustrations/tai.jpg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "生",
                "pinyin": "shēng",
                "en": "birth / grow",
                "strokes": 5,
                "radical": "生",
                "words": [
                    "学生",
                    "生活",
                    "生日"
                ],
                "sentence": "我们每天都在快乐地学习和生活。",
                "icon": "🌱",
                "label": "生长",
                "image": "assets/illustrations/sheng.jpg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "会",
                "pinyin": "huì",
                "en": "can / meet",
                "strokes": 6,
                "radical": "人",
                "words": [
                    "开会",
                    "学会",
                    "体会"
                ],
                "sentence": "我学会了搭积木城堡，真有成就感！",
                "icon": "👍",
                "label": "学会",
                "image": "assets/illustrations/hui_can.jpg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "来",
                "pinyin": "lái",
                "en": "come",
                "strokes": 7,
                "radical": "木",
                "words": [
                    "来到",
                    "回来",
                    "未来"
                ],
                "sentence": "小朋友张开双手，欢迎大家来到这里一起玩。",
                "icon": "👋",
                "label": "来到",
                "image": "assets/illustrations/lai_come.jpg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "去",
                "pinyin": "qù",
                "en": "go",
                "strokes": 5,
                "radical": "厶",
                "words": [
                    "回去",
                    "去年",
                    "过去"
                ],
                "sentence": "周末爸爸妈妈带我去公园看花。",
                "icon": "🚶",
                "label": "回去",
                "image": "assets/illustrations/qu.jpg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "出",
                "pinyin": "chū",
                "en": "out / exit",
                "strokes": 5,
                "radical": "凵",
                "words": [
                    "出来",
                    "出去",
                    "出发"
                ],
                "sentence": "小朋友推开家门，高高兴兴地出门去玩耍。",
                "icon": "🚪",
                "label": "出门",
                "image": "assets/illustrations/chu_exit.jpg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "入",
                "pinyin": "rù",
                "en": "enter",
                "strokes": 2,
                "radical": "入",
                "words": [
                    "进入",
                    "入门",
                    "入秋"
                ],
                "sentence": "小朋友们高高兴兴地进入美丽的校园。",
                "icon": "📥",
                "label": "进入",
                "image": "assets/illustrations/ru.jpg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "见",
                "pinyin": "jiàn",
                "en": "see",
                "strokes": 4,
                "radical": "见",
                "words": [
                    "看见",
                    "见面",
                    "再见"
                ],
                "sentence": "礼貌待人，放学回家记得和老师说再见。",
                "icon": "👀",
                "label": "看见",
                "image": "assets/illustrations/jian.jpg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "只",
                "pinyin": "zhī",
                "en": "measure word",
                "strokes": 5,
                "radical": "口",
                "words": [
                    "一只",
                    "两只",
                    "三只"
                ],
                "sentence": "树林里有一只百灵鸟在欢快地歌唱。",
                "icon": "🐾",
                "label": "一只",
                "image": "assets/illustrations/zhi_measure.svg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "个",
                "pinyin": "gè",
                "en": "piece / one",
                "strokes": 3,
                "radical": "人",
                "words": [
                    "一个",
                    "每个",
                    "个人"
                ],
                "sentence": "每个小朋友都有一双灵巧的小手。",
                "icon": "🎈",
                "label": "一个",
                "image": "assets/illustrations/ge_measure.svg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "王",
                "pinyin": "wáng",
                "en": "king",
                "radical": "王",
                "words": [
                    "大王",
                    "国王",
                    "王子"
                ],
                "sentence": "森林里的狮子大王戴着金灿灿的皇冠。",
                "icon": "👑",
                "label": "国王",
                "image": "assets/illustrations/wang_king.svg",
                "strokes": 4,
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "工",
                "pinyin": "gōng",
                "en": "work",
                "radical": "工",
                "words": [
                    "工人",
                    "工作",
                    "手工"
                ],
                "sentence": "勤劳的工人叔叔正在认真地建造房屋。",
                "icon": "👷",
                "label": "工人",
                "image": "assets/illustrations/gong_work.svg",
                "strokes": 3,
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "主",
                "pinyin": "zhǔ",
                "en": "host",
                "radical": "丶",
                "words": [
                    "主人",
                    "公主",
                    "主持"
                ],
                "sentence": "热情的小主人端出甜美的水果招待客人。",
                "icon": "🎀",
                "label": "主人",
                "image": "assets/illustrations/zhu_host.svg",
                "strokes": 5,
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "方",
                "pinyin": "fāng",
                "en": "square",
                "radical": "方",
                "words": [
                    "方正",
                    "正方形",
                    "地方"
                ],
                "sentence": "这块手帕是四四方方的正方形。",
                "icon": "🟦",
                "label": "方形",
                "image": "assets/illustrations/fang_square.svg",
                "strokes": 4,
                "grade": "k",
                "difficulty": 1
            }
        ]
    },
    {
        "id": "animals",
        "name": "🐾 可爱动物",
        "color": "#fdcb6e",
        "chars": [
            {
                "char": "马",
                "pinyin": "mǎ",
                "en": "horse",
                "strokes": 3,
                "radical": "马",
                "words": [
                    "小马",
                    "奔马",
                    "斑马"
                ],
                "sentence": "小马在广阔的草地上快乐地奔跑。",
                "icon": "🐴",
                "label": "小马",
                "image": "assets/illustrations/ma.jpg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "牛",
                "pinyin": "niú",
                "en": "cow",
                "strokes": 4,
                "radical": "牛",
                "words": [
                    "黄牛",
                    "奶牛",
                    "水牛"
                ],
                "sentence": "老黄牛勤勤恳恳地在田里耕作。",
                "icon": "🐂",
                "label": "黄牛",
                "image": "assets/illustrations/niu.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "羊",
                "pinyin": "yáng",
                "en": "sheep",
                "strokes": 6,
                "radical": "羊",
                "words": [
                    "小羊",
                    "山羊",
                    "绵羊"
                ],
                "sentence": "雪白的小绵羊身上毛茸茸的。",
                "icon": "🐑",
                "label": "绵羊",
                "image": "assets/illustrations/yang.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "鸟",
                "pinyin": "niǎo",
                "en": "bird",
                "strokes": 5,
                "radical": "鸟",
                "words": [
                    "小鸟",
                    "飞鸟",
                    "翠鸟"
                ],
                "sentence": "清晨，小鸟在枝头欢快地歌唱。",
                "icon": "🐦",
                "label": "小鸟",
                "image": "assets/illustrations/niao.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "鱼",
                "pinyin": "yú",
                "en": "fish",
                "strokes": 8,
                "radical": "鱼",
                "words": [
                    "金鱼",
                    "游鱼",
                    "小鱼"
                ],
                "sentence": "金色的小鱼在水草间吐着泡泡。",
                "icon": "🐟",
                "label": "金鱼",
                "image": "assets/illustrations/yu_fish.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "虫",
                "pinyin": "chóng",
                "en": "bug",
                "strokes": 6,
                "radical": "虫",
                "words": [
                    "小虫",
                    "害虫",
                    "瓢虫"
                ],
                "sentence": "七星瓢虫是庄稼的好帮手。",
                "icon": "🐛",
                "label": "小虫",
                "image": "assets/illustrations/chong.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "狗",
                "pinyin": "gǒu",
                "en": "dog",
                "strokes": 8,
                "radical": "犭",
                "words": [
                    "小狗",
                    "花狗",
                    "看门狗"
                ],
                "sentence": "忠诚的小狗摇着尾巴迎接主人。",
                "icon": "🐶",
                "label": "小狗",
                "image": "assets/illustrations/gou.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "猫",
                "pinyin": "māo",
                "en": "cat",
                "strokes": 11,
                "radical": "犭",
                "words": [
                    "花猫",
                    "熊猫",
                    "小猫"
                ],
                "sentence": "国宝大熊猫最喜欢吃新鲜的竹子。",
                "icon": "🐱",
                "label": "小猫",
                "image": "assets/illustrations/mao.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "兔",
                "pinyin": "tù",
                "en": "rabbit",
                "strokes": 8,
                "radical": "刀",
                "words": [
                    "白兔",
                    "小兔",
                    "野兔"
                ],
                "sentence": "小白兔蹦蹦跳跳，最爱吃胡萝卜。",
                "icon": "🐰",
                "label": "白兔",
                "image": "assets/illustrations/tu_rabbit.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "鸭",
                "pinyin": "yā",
                "en": "duck",
                "strokes": 10,
                "radical": "鸟",
                "words": [
                    "小鸭",
                    "野鸭",
                    "鸭子"
                ],
                "sentence": "春江水暖鸭先知。",
                "icon": "🦆",
                "label": "小鸭",
                "image": "assets/illustrations/ya.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "鹿",
                "pinyin": "lù",
                "en": "deer",
                "strokes": 11,
                "radical": "鹿",
                "words": [
                    "小鹿",
                    "梅花鹿",
                    "白鹿"
                ],
                "sentence": "美丽的小鹿在林间悠闲漫步。",
                "icon": "🦌",
                "label": "小鹿",
                "image": "assets/illustrations/lu.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "象",
                "pinyin": "xiàng",
                "en": "elephant",
                "strokes": 11,
                "radical": "豕",
                "words": [
                    "大象",
                    "象鼻",
                    "飞象"
                ],
                "sentence": "大象用长长的鼻子喝水和卷起果实。",
                "icon": "🐘",
                "label": "大象",
                "image": "assets/illustrations/xiang.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "鸡",
                "pinyin": "jī",
                "en": "chicken",
                "strokes": 7,
                "radical": "鸟",
                "words": [
                    "小鸡",
                    "公鸡",
                    "母鸡"
                ],
                "sentence": "大公鸡清晨喔喔啼，叫醒了太阳。",
                "icon": "🐔",
                "label": "公鸡",
                "image": "assets/illustrations/ji_chicken.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "鹅",
                "pinyin": "é",
                "en": "goose",
                "strokes": 12,
                "radical": "鸟",
                "words": [
                    "白鹅",
                    "天鹅",
                    "鹅毛"
                ],
                "sentence": "鹅，鹅，鹅，曲项向天歌，白毛浮绿水。",
                "icon": "🦢",
                "label": "天鹅",
                "image": "assets/illustrations/e.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "猪",
                "pinyin": "zhū",
                "en": "pig",
                "strokes": 11,
                "radical": "犭",
                "words": [
                    "小猪",
                    "花猪",
                    "金猪"
                ],
                "sentence": "可爱的小胖猪呼噜噜地睡得正香。",
                "icon": "🐷",
                "label": "小猪",
                "image": "assets/illustrations/zhu.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "熊",
                "pinyin": "xióng",
                "en": "bear",
                "strokes": 14,
                "radical": "灬",
                "words": [
                    "大熊",
                    "棕熊",
                    "黑熊"
                ],
                "sentence": "森林里住着憨态可掬的黑熊一家。",
                "icon": "🐻",
                "label": "大熊",
                "image": "assets/illustrations/xiong.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "龙",
                "pinyin": "lóng",
                "en": "dragon",
                "strokes": 5,
                "radical": "龙",
                "words": [
                    "神龙",
                    "飞龙",
                    "龙舟"
                ],
                "sentence": "我们都是自豪的龙的传人。",
                "icon": "🐲",
                "label": "神龙",
                "image": "assets/illustrations/long.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "虎",
                "pinyin": "hǔ",
                "en": "tiger",
                "strokes": 8,
                "radical": "虍",
                "words": [
                    "老虎",
                    "幼虎",
                    "白虎"
                ],
                "sentence": "威猛的老虎是森林之王。",
                "icon": "🐯",
                "label": "老虎",
                "image": "assets/illustrations/hu_tiger.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "猴",
                "pinyin": "hóu",
                "en": "monkey",
                "strokes": 12,
                "radical": "犭",
                "words": [
                    "猴子",
                    "小猴",
                    "金丝猴"
                ],
                "sentence": "机灵的小金丝猴在枝头荡秋千。",
                "icon": "🐵",
                "label": "猴子",
                "image": "assets/illustrations/hou.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "龟",
                "pinyin": "guī",
                "en": "turtle",
                "strokes": 7,
                "radical": "刀",
                "words": [
                    "乌龟",
                    "海龟",
                    "金龟"
                ],
                "sentence": "可爱的小乌龟不慌不忙地向前爬行。",
                "icon": "🐢",
                "label": "乌龟",
                "image": "assets/illustrations/gui.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "蝶",
                "pinyin": "dié",
                "en": "butterfly",
                "strokes": 15,
                "radical": "虫",
                "words": [
                    "蝴蝶",
                    "彩蝶",
                    "化蝶"
                ],
                "sentence": "美丽的蝴蝶在百花丛中翩翩起舞。",
                "icon": "🦋",
                "label": "彩蝶",
                "image": "assets/illustrations/die.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "蜂",
                "pinyin": "fēng",
                "en": "bee",
                "strokes": 13,
                "radical": "虫",
                "words": [
                    "蜜蜂",
                    "黄蜂",
                    "群蜂"
                ],
                "sentence": "勤劳的小蜜蜂迎着晨光去采蜜。",
                "icon": "🐝",
                "label": "蜜蜂",
                "image": "assets/illustrations/feng_bee.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "蛙",
                "pinyin": "wā",
                "en": "frog",
                "strokes": 12,
                "radical": "虫",
                "words": [
                    "青蛙",
                    "牛蛙",
                    "蛙鸣"
                ],
                "sentence": "池塘边的荷叶上蹲着一只绿色的小青蛙。",
                "icon": "🐸",
                "label": "青蛙",
                "image": "assets/illustrations/wa.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "狐",
                "pinyin": "hú",
                "en": "fox",
                "strokes": 8,
                "radical": "犭",
                "words": [
                    "狐狸",
                    "白狐",
                    "灵狐"
                ],
                "sentence": "机灵的小狐狸在茂密的林间奔跑。",
                "icon": "🦊",
                "label": "狐狸",
                "image": "assets/illustrations/hu_fox.svg",
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "狸",
                "pinyin": "lí",
                "en": "raccoon",
                "strokes": 10,
                "radical": "犭",
                "words": [
                    "狐狸",
                    "狸猫",
                    "小狸"
                ],
                "sentence": "小狐狸毛茸茸的尾巴格外漂亮。",
                "icon": "🦝",
                "label": "狸猫",
                "image": "assets/illustrations/li.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "豹",
                "pinyin": "bào",
                "en": "leopard",
                "strokes": 10,
                "radical": "豸",
                "words": [
                    "金钱豹",
                    "猎豹",
                    "黑豹"
                ],
                "sentence": "猎豹是陆地上奔跑速度最快的动物。",
                "icon": "🐆",
                "label": "猎豹",
                "image": "assets/illustrations/bao.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "狼",
                "pinyin": "láng",
                "en": "wolf",
                "strokes": 10,
                "radical": "犭",
                "words": [
                    "灰狼",
                    "狼群",
                    "野狼"
                ],
                "sentence": "狼群非常懂得团结协作的道理。",
                "icon": "🐺",
                "label": "野狼",
                "image": "assets/illustrations/lang.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "狮",
                "pinyin": "shī",
                "en": "lion",
                "strokes": 9,
                "radical": "犭",
                "words": [
                    "狮子",
                    "雄狮",
                    "海狮"
                ],
                "sentence": "威武雄壮的狮子在草原上休息。",
                "icon": "🦁",
                "label": "雄狮",
                "image": "assets/illustrations/shi_lion.svg",
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "鲸",
                "pinyin": "jīng",
                "en": "whale",
                "strokes": 16,
                "radical": "鱼",
                "words": [
                    "蓝鲸",
                    "巨鲸",
                    "座头鲸"
                ],
                "sentence": "庞大的蓝鲸在浩瀚的深海中自由畅游。",
                "icon": "🐋",
                "label": "蓝鲸",
                "image": "assets/illustrations/jing.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "雁",
                "pinyin": "yàn",
                "en": "wild goose",
                "strokes": 12,
                "radical": "隹",
                "words": [
                    "大雁",
                    "雁群",
                    "孤雁"
                ],
                "sentence": "秋天大雁排成整齐的人字形飞向南方。",
                "icon": "🪿",
                "label": "大雁",
                "image": "assets/illustrations/yan_goose.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "燕",
                "pinyin": "yàn",
                "en": "swallow",
                "strokes": 16,
                "radical": "灬",
                "words": [
                    "燕子",
                    "小燕",
                    "海燕"
                ],
                "sentence": "小燕子在温暖的春天从南方飞回来了。",
                "icon": "🕊️",
                "label": "燕子",
                "image": "assets/illustrations/yan_swallow.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "鹤",
                "pinyin": "hè",
                "en": "crane",
                "strokes": 15,
                "radical": "鸟",
                "words": [
                    "白鹤",
                    "仙鹤",
                    "丹顶鹤"
                ],
                "sentence": "优美的丹顶鹤在湖边翩翩起舞。",
                "icon": "🦩",
                "label": "仙鹤",
                "image": "assets/illustrations/he_crane.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "鼠",
                "pinyin": "shǔ",
                "en": "mouse",
                "radical": "鼠",
                "words": [
                    "松鼠",
                    "老鼠",
                    "袋鼠"
                ],
                "sentence": "机灵的小松鼠在松树枝头跳来跳去。",
                "icon": "🐭",
                "label": "小鼠",
                "image": "assets/illustrations/shu_mouse.svg",
                "strokes": 13,
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "蛇",
                "pinyin": "shé",
                "en": "snake",
                "radical": "虫",
                "words": [
                    "小蛇",
                    "青蛇",
                    "水蛇"
                ],
                "sentence": "春天来了，冬眠的小青蛇从草丛里钻了出来。",
                "icon": "🐍",
                "label": "小蛇",
                "image": "assets/illustrations/she_snake.svg",
                "strokes": 11,
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "虾",
                "pinyin": "xiā",
                "en": "shrimp",
                "radical": "虫",
                "words": [
                    "小虾",
                    "龙虾",
                    "河虾"
                ],
                "sentence": "清澈的小河里游着许多活蹦乱跳的小虾。",
                "icon": "🦐",
                "label": "小虾",
                "image": "assets/illustrations/xia_shrimp.svg",
                "strokes": 9,
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "蟹",
                "pinyin": "xiè",
                "en": "crab",
                "radical": "虫",
                "words": [
                    "螃蟹",
                    "海蟹",
                    "蟹壳"
                ],
                "sentence": "沙滩上的小螃蟹举着两只大钳子横着走。",
                "icon": "🦀",
                "label": "螃蟹",
                "image": "assets/illustrations/xie_crab.svg",
                "strokes": 19,
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "贝",
                "pinyin": "bèi",
                "en": "shell",
                "radical": "贝",
                "words": [
                    "贝壳",
                    "宝贝",
                    "海贝"
                ],
                "sentence": "我们在金色的海滩上捡到了漂亮的贝壳。",
                "icon": "🐚",
                "label": "贝壳",
                "image": "assets/illustrations/bei_shell.svg",
                "strokes": 4,
                "grade": "g1",
                "difficulty": 2
            }
        ]
    },
    {
        "id": "nature",
        "name": "🌸 大自然四季",
        "color": "#00b894",
        "chars": [
            {
                "char": "春",
                "pinyin": "chūn",
                "en": "spring",
                "strokes": 9,
                "radical": "日",
                "words": [
                    "春天",
                    "春风",
                    "春暖"
                ],
                "sentence": "春天来了，万物复苏，百花盛开。",
                "icon": "🌸",
                "label": "春天",
                "image": "assets/illustrations/chun.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "夏",
                "pinyin": "xià",
                "en": "summer",
                "strokes": 10,
                "radical": "夂",
                "words": [
                    "夏天",
                    "夏日",
                    "盛夏"
                ],
                "sentence": "夏天荷塘里开满了美丽的荷花。",
                "icon": "🌻",
                "label": "夏天",
                "image": "assets/illustrations/xia_summer.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "秋",
                "pinyin": "qiū",
                "en": "autumn",
                "strokes": 9,
                "radical": "禾",
                "words": [
                    "秋天",
                    "秋风",
                    "金秋"
                ],
                "sentence": "秋天到了，树叶换上了金黄的新装。",
                "icon": "🍁",
                "label": "秋天",
                "image": "assets/illustrations/qiu.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "冬",
                "pinyin": "dōng",
                "en": "winter",
                "strokes": 5,
                "radical": "夂",
                "words": [
                    "冬天",
                    "冬季",
                    "冬雪"
                ],
                "sentence": "冬天雪花飘飘，小朋友们一起堆雪人。",
                "icon": "⛄",
                "label": "冬天",
                "image": "assets/illustrations/dong.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "雪",
                "pinyin": "xuě",
                "en": "snow",
                "strokes": 11,
                "radical": "雨",
                "words": [
                    "雪花",
                    "白雪",
                    "下雪"
                ],
                "sentence": "洁白的雪花如蝴蝶般从天空中落下。",
                "icon": "❄️",
                "label": "雪花",
                "image": "assets/illustrations/xue.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "花",
                "pinyin": "huā",
                "en": "flower",
                "strokes": 7,
                "radical": "艹",
                "words": [
                    "花朵",
                    "鲜花",
                    "红花"
                ],
                "sentence": "花园里的花朵绽放出迷人的芬芳。",
                "icon": "🌺",
                "label": "鲜花",
                "image": "assets/illustrations/hua.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "草",
                "pinyin": "cǎo",
                "en": "grass",
                "strokes": 9,
                "radical": "艹",
                "words": [
                    "青草",
                    "小草",
                    "草原"
                ],
                "sentence": "坚强的小草破土而出，迎接阳光。",
                "icon": "🌿",
                "label": "青草",
                "image": "assets/illustrations/cao.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "海",
                "pinyin": "hǎi",
                "en": "sea",
                "strokes": 10,
                "radical": "氵",
                "words": [
                    "大海",
                    "海洋",
                    "海浪"
                ],
                "sentence": "辽阔的大海翻滚着洁白的浪花。",
                "icon": "🌊",
                "label": "大海",
                "image": "assets/illustrations/hai.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "星",
                "pinyin": "xīng",
                "en": "star",
                "strokes": 9,
                "radical": "日",
                "words": [
                    "星星",
                    "星空",
                    "火星"
                ],
                "sentence": "夜空中的星星一眨一眨地看着我们。",
                "icon": "⭐",
                "label": "星星",
                "image": "assets/illustrations/xing.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "阳",
                "pinyin": "yáng",
                "en": "sunshine",
                "strokes": 6,
                "radical": "阝",
                "words": [
                    "太阳",
                    "阳光",
                    "向阳"
                ],
                "sentence": "金灿灿的阳光照亮了每一个角落。",
                "icon": "☀️",
                "label": "阳光",
                "image": "assets/illustrations/yang_sun.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "光",
                "pinyin": "guāng",
                "en": "light",
                "strokes": 6,
                "radical": "儿",
                "words": [
                    "月光",
                    "光明",
                    "闪光"
                ],
                "sentence": "清澈的月光洒在静悄悄的小路上。",
                "icon": "✨",
                "label": "光芒",
                "image": "assets/illustrations/guang.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "树",
                "pinyin": "shù",
                "en": "tree",
                "strokes": 9,
                "radical": "木",
                "words": [
                    "大树",
                    "树林",
                    "绿树"
                ],
                "sentence": "大树张开双臂，为小鸟遮风挡雨。",
                "icon": "🌳",
                "label": "大树",
                "image": "assets/illustrations/shu_tree.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "林",
                "pinyin": "lín",
                "en": "forest",
                "strokes": 8,
                "radical": "木",
                "words": [
                    "森林",
                    "树林",
                    "竹林"
                ],
                "sentence": "茂密的森林空气清新，鸟语花香。",
                "icon": "🌲",
                "label": "森林",
                "image": "assets/illustrations/lin.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "叶",
                "pinyin": "yè",
                "en": "leaf",
                "strokes": 5,
                "radical": "口",
                "words": [
                    "树叶",
                    "绿叶",
                    "红叶"
                ],
                "sentence": "秋天的银杏叶像一把把金黄的小扇子。",
                "icon": "🍃",
                "label": "绿叶",
                "image": "assets/illustrations/ye.svg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "竹",
                "pinyin": "zhú",
                "en": "bamboo",
                "strokes": 6,
                "radical": "竹",
                "words": [
                    "竹子",
                    "竹林",
                    "翠竹"
                ],
                "sentence": "挺拔的竹子四季常青，生机盎然。",
                "icon": "🎋",
                "label": "翠竹",
                "image": "assets/illustrations/zhu_bamboo.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "江",
                "pinyin": "jiāng",
                "en": "river",
                "strokes": 6,
                "radical": "氵",
                "words": [
                    "长江",
                    "江水",
                    "江河"
                ],
                "sentence": "壮美的长江奔流不息，流向东方。",
                "icon": "🏞️",
                "label": "江水",
                "image": "assets/illustrations/jiang.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "河",
                "pinyin": "hé",
                "en": "river",
                "strokes": 8,
                "radical": "氵",
                "words": [
                    "小河",
                    "黄河",
                    "清河"
                ],
                "sentence": "小河清澈见底，鱼儿自由自在游弋。",
                "icon": "🌊",
                "label": "小河",
                "image": "assets/illustrations/he_river.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "湖",
                "pinyin": "hú",
                "en": "lake",
                "strokes": 12,
                "radical": "氵",
                "words": [
                    "湖水",
                    "西湖",
                    "太湖"
                ],
                "sentence": "美丽的西湖像一颗璀璨的绿宝石。",
                "icon": "⛵",
                "label": "碧湖",
                "image": "assets/illustrations/hu.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "空",
                "pinyin": "kōng",
                "en": "sky",
                "strokes": 8,
                "radical": "穴",
                "words": [
                    "天空",
                    "晴空",
                    "高空"
                ],
                "sentence": "飞鸟在晴朗的天空中展翅高飞。",
                "icon": "🌌",
                "label": "天空",
                "image": "assets/illustrations/kong_sky.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "地",
                "pinyin": "dì",
                "en": "earth",
                "strokes": 6,
                "radical": "土",
                "words": [
                    "大地",
                    "土地",
                    "田地"
                ],
                "sentence": "大地母亲哺育着无数绿色的生命。",
                "icon": "🌍",
                "label": "大地",
                "image": "assets/illustrations/di_earth.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "泉",
                "pinyin": "quán",
                "en": "spring",
                "strokes": 9,
                "radical": "水",
                "words": [
                    "泉水",
                    "清泉",
                    "甘泉"
                ],
                "sentence": "山间的清泉叮咚作响，宛如美妙的乐曲。",
                "icon": "⛲",
                "label": "清泉",
                "image": "assets/illustrations/quan.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "冰",
                "pinyin": "bīng",
                "en": "ice",
                "strokes": 6,
                "radical": "冫",
                "words": [
                    "冰雪",
                    "冰川",
                    "寒冰"
                ],
                "sentence": "冬天的小溪结上了一层晶莹的冰块。",
                "icon": "🧊",
                "label": "寒冰",
                "image": "assets/illustrations/bing.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "露",
                "pinyin": "lù",
                "en": "dew",
                "strokes": 21,
                "radical": "雨",
                "words": [
                    "露水",
                    "晨露",
                    "雨露"
                ],
                "sentence": "晶莹的晨露在绿叶上欢快地滚动。",
                "icon": "💧",
                "label": "晨露",
                "image": "assets/illustrations/lu_dew.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "晴",
                "pinyin": "qíng",
                "en": "sunny",
                "strokes": 12,
                "radical": "日",
                "words": [
                    "晴天",
                    "晴朗",
                    "放晴"
                ],
                "sentence": "雨过天晴，空中挂起了一道美丽的彩虹。",
                "icon": "🌤️",
                "label": "晴天",
                "image": "assets/illustrations/qing.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "阴",
                "pinyin": "yīn",
                "en": "cloudy",
                "strokes": 6,
                "radical": "阝",
                "words": [
                    "阴天",
                    "阴凉",
                    "光阴"
                ],
                "sentence": "一寸光阴一寸金，我们要好好珍惜时间。",
                "icon": "☁️",
                "label": "阴天",
                "image": "assets/illustrations/yin.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "雾",
                "pinyin": "wù",
                "en": "fog",
                "strokes": 13,
                "radical": "雨",
                "words": [
                    "晨雾",
                    "大雾",
                    "薄雾"
                ],
                "sentence": "清晨的薄雾像轻纱一般笼罩着群山。",
                "icon": "🌫️",
                "label": "晨雾",
                "image": "assets/illustrations/wu_fog.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "霜",
                "pinyin": "shuāng",
                "en": "frost",
                "strokes": 17,
                "radical": "雨",
                "words": [
                    "秋霜",
                    "严霜",
                    "冰霜"
                ],
                "sentence": "秋末早晨，草叶上凝结了洁白的霜花。",
                "icon": "🌨️",
                "label": "白霜",
                "image": "assets/illustrations/shuang.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "雷",
                "pinyin": "léi",
                "en": "thunder",
                "strokes": 13,
                "radical": "雨",
                "words": [
                    "打雷",
                    "雷雨",
                    "春雷"
                ],
                "sentence": "第一声春雷惊醒了正在冬眠的小动物。",
                "icon": "🌩️",
                "label": "春雷",
                "image": "assets/illustrations/lei.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "电",
                "pinyin": "diàn",
                "en": "lightning",
                "strokes": 5,
                "radical": "丨",
                "words": [
                    "闪电",
                    "雨电",
                    "电流"
                ],
                "sentence": "暴风雨前夕，天边划过一道耀眼的闪电。",
                "icon": "⚡",
                "label": "闪电",
                "image": "assets/illustrations/dian.svg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "虹",
                "pinyin": "hóng",
                "en": "rainbow",
                "strokes": 9,
                "radical": "虫",
                "words": [
                    "彩虹",
                    "长虹",
                    "飞虹"
                ],
                "sentence": "雨后天晴，天空绽放出七彩的彩虹。",
                "icon": "🌈",
                "label": "彩虹",
                "image": "assets/illustrations/hong_rainbow.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "泥",
                "pinyin": "ní",
                "en": "mud",
                "strokes": 8,
                "radical": "氵",
                "words": [
                    "泥土",
                    "红泥",
                    "烂泥"
                ],
                "sentence": "春雨过后，泥土里散发着清新的芬芳。",
                "icon": "🪴",
                "label": "红泥",
                "image": "assets/illustrations/ni.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "霞",
                "pinyin": "xiá",
                "en": "glow",
                "strokes": 17,
                "radical": "雨",
                "words": [
                    "朝霞",
                    "晚霞",
                    "彩霞"
                ],
                "sentence": "傍晚金红色的晚霞染红了大半个天空。",
                "icon": "🌄",
                "label": "晚霞",
                "image": "assets/illustrations/xia_sunset.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "今",
                "pinyin": "jīn",
                "en": "today",
                "radical": "人",
                "words": [
                    "今天",
                    "今年",
                    "今日"
                ],
                "sentence": "今天天气真晴朗，我们一起去公园春游。",
                "icon": "📅",
                "label": "今天",
                "image": "assets/illustrations/jin_today.svg",
                "strokes": 4,
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "明",
                "pinyin": "míng",
                "en": "bright",
                "radical": "日",
                "words": [
                    "明天",
                    "光明",
                    "明白"
                ],
                "sentence": "日和月合在一起，就是充满光明的明字。",
                "icon": "☀️",
                "label": "光明",
                "image": "assets/illustrations/ming_bright.svg",
                "strokes": 8,
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "午",
                "pinyin": "wǔ",
                "en": "noon",
                "radical": "十",
                "words": [
                    "中午",
                    "上午",
                    "下午"
                ],
                "sentence": "中午十二点，太阳高高挂在头顶正上方。",
                "icon": "🕛",
                "label": "中午",
                "image": "assets/illustrations/wu_noon.svg",
                "strokes": 4,
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "晚",
                "pinyin": "wǎn",
                "en": "evening",
                "radical": "日",
                "words": [
                    "晚上",
                    "夜晚",
                    "早晚"
                ],
                "sentence": "到了晚上，弯弯的月亮和星星在夜空闪烁。",
                "icon": "🌙",
                "label": "晚上",
                "image": "assets/illustrations/wan_evening.svg",
                "strokes": 11,
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "苗",
                "pinyin": "miáo",
                "en": "seedling",
                "radical": "艹",
                "words": [
                    "禾苗",
                    "树苗",
                    "青苗"
                ],
                "sentence": "春雨过后，田野里的绿色禾苗长得格外精神。",
                "icon": "🌱",
                "label": "禾苗",
                "image": "assets/illustrations/miao_seedling.svg",
                "strokes": 8,
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "芽",
                "pinyin": "yá",
                "en": "sprout",
                "radical": "艹",
                "words": [
                    "发芽",
                    "嫩芽",
                    "豆芽"
                ],
                "sentence": "泥土里的小种子破土而出，长出了嫩绿的新芽。",
                "icon": "🌿",
                "label": "发芽",
                "image": "assets/illustrations/ya_sprout.svg",
                "strokes": 7,
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "根",
                "pinyin": "gēn",
                "en": "root",
                "radical": "木",
                "words": [
                    "树根",
                    "生根",
                    "根本"
                ],
                "sentence": "大树的树根深深扎进泥土里汲取养分。",
                "icon": "🌳",
                "label": "树根",
                "image": "assets/illustrations/gen_root.svg",
                "strokes": 10,
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "枝",
                "pinyin": "zhī",
                "en": "branch",
                "radical": "木",
                "words": [
                    "树枝",
                    "枝头",
                    "柳枝"
                ],
                "sentence": "喜鹊站在高高的树枝上欢快地歌唱。",
                "icon": "🌿",
                "label": "树枝",
                "image": "assets/illustrations/zhi_branch.svg",
                "strokes": 8,
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "松",
                "pinyin": "sōng",
                "en": "pine",
                "radical": "木",
                "words": [
                    "松树",
                    "青松",
                    "松果"
                ],
                "sentence": "挺拔的松树一年四季都披着翠绿的衣裳。",
                "icon": "🌲",
                "label": "松树",
                "image": "assets/illustrations/song_pine.svg",
                "strokes": 8,
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "柳",
                "pinyin": "liǔ",
                "en": "willow",
                "radical": "木",
                "words": [
                    "柳树",
                    "垂柳",
                    "柳枝"
                ],
                "sentence": "春风吹过河岸，柳树垂下长长的绿色柳条。",
                "icon": "🌿",
                "label": "柳树",
                "image": "assets/illustrations/liu_willow.svg",
                "strokes": 9,
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "荷",
                "pinyin": "hé",
                "en": "lotus",
                "radical": "艹",
                "words": [
                    "荷花",
                    "荷叶",
                    "荷塘"
                ],
                "sentence": "夏天的池塘里开满了粉红的荷花，铺满碧绿的荷叶。",
                "icon": "🪷",
                "label": "荷花",
                "image": "assets/illustrations/he_lotus.svg",
                "strokes": 10,
                "grade": "g1",
                "difficulty": 2
            }
        ]
    },
    {
        "id": "body",
        "name": "👦 身体家庭",
        "color": "#6c5ce7",
        "chars": [
            {
                "char": "目",
                "pinyin": "mù",
                "en": "eye",
                "strokes": 5,
                "radical": "目",
                "words": [
                    "双目",
                    "目光",
                    "目睹"
                ],
                "sentence": "我们要好好爱护双目，让目光更加明亮清澈。",
                "icon": "👀",
                "label": "双目",
                "image": "assets/illustrations/mu_eye.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "耳",
                "pinyin": "ěr",
                "en": "ear",
                "strokes": 6,
                "radical": "耳",
                "words": [
                    "耳朵",
                    "双耳",
                    "听耳"
                ],
                "sentence": "竖起小耳朵，认真听老师讲课。",
                "icon": "👂",
                "label": "耳朵",
                "image": "assets/illustrations/er_ear.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "手",
                "pinyin": "shǒu",
                "en": "hand",
                "strokes": 4,
                "radical": "手",
                "words": [
                    "双手",
                    "小手",
                    "手心"
                ],
                "sentence": "一双勤劳的小手能创造很多奇迹。",
                "icon": "✋",
                "label": "小手",
                "image": "assets/illustrations/shou.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "足",
                "pinyin": "zú",
                "en": "foot",
                "strokes": 7,
                "radical": "足",
                "words": [
                    "双足",
                    "手足",
                    "足迹"
                ],
                "sentence": "一双可爱的小脚丫留下了欢快的足迹。",
                "icon": "🦶",
                "label": "双足",
                "image": "assets/illustrations/zu_feet.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "心",
                "pinyin": "xīn",
                "en": "heart",
                "strokes": 4,
                "radical": "心",
                "words": [
                    "开心",
                    "爱心",
                    "小心"
                ],
                "sentence": "今天过得非常有意义，我心里特别开心。",
                "icon": "❤️",
                "label": "爱心",
                "image": "assets/illustrations/xin.svg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "牙",
                "pinyin": "yá",
                "en": "tooth",
                "strokes": 4,
                "radical": "牙",
                "words": [
                    "刷牙",
                    "牙齿",
                    "门牙"
                ],
                "sentence": "早晚认真刷牙，牙齿健康洁白。",
                "icon": "🦷",
                "label": "门牙",
                "image": "assets/illustrations/ya_tooth.svg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "爸",
                "pinyin": "bà",
                "en": "dad",
                "strokes": 8,
                "radical": "父",
                "words": [
                    "爸爸",
                    "老爸",
                    "阿爸"
                ],
                "sentence": "爸爸的手温暖又有力量。",
                "icon": "👨",
                "label": "爸爸",
                "image": "assets/illustrations/ba.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "妈",
                "pinyin": "mā",
                "en": "mom",
                "strokes": 6,
                "radical": "女",
                "words": [
                    "妈妈",
                    "阿妈",
                    "大妈"
                ],
                "sentence": "妈妈的笑容像春天里的阳光一样温暖。",
                "icon": "👩",
                "label": "妈妈",
                "image": "assets/illustrations/ma_mom.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "家",
                "pinyin": "jiā",
                "en": "home",
                "strokes": 10,
                "radical": "宀",
                "words": [
                    "家里",
                    "家人",
                    "大家"
                ],
                "sentence": "温馨的家是充满欢笑的幸福港湾。",
                "icon": "🏡",
                "label": "家人",
                "image": "assets/illustrations/jia.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "友",
                "pinyin": "yǒu",
                "en": "friend",
                "strokes": 4,
                "radical": "又",
                "words": [
                    "朋友",
                    "好友",
                    "友情"
                ],
                "sentence": "好朋友之间要团结友爱、互帮互助。",
                "icon": "🤝",
                "label": "朋友",
                "image": "assets/illustrations/you_friend.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "哥",
                "pinyin": "gē",
                "en": "brother",
                "strokes": 10,
                "radical": "口",
                "words": [
                    "哥哥",
                    "大哥",
                    "表哥"
                ],
                "sentence": "大哥哥带我一起去操场踢足球。",
                "icon": "👦",
                "label": "哥哥",
                "image": "assets/illustrations/ge_brother.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "弟",
                "pinyin": "dì",
                "en": "younger brother",
                "strokes": 7,
                "radical": "弓",
                "words": [
                    "弟弟",
                    "小弟",
                    "表弟"
                ],
                "sentence": "小弟弟学走路的样子真可爱。",
                "icon": "🧒",
                "label": "弟弟",
                "image": "assets/illustrations/di_brother.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "姐",
                "pinyin": "jiě",
                "en": "sister",
                "strokes": 8,
                "radical": "女",
                "words": [
                    "姐姐",
                    "小姐",
                    "表姐"
                ],
                "sentence": "姐姐耐心地教我画水彩画。",
                "icon": "👧",
                "label": "姐姐",
                "image": "assets/illustrations/jie_sister.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "妹",
                "pinyin": "mèi",
                "en": "younger sister",
                "strokes": 8,
                "radical": "女",
                "words": [
                    "妹妹",
                    "小妹",
                    "表妹"
                ],
                "sentence": "小妹妹笑起来脸上露出甜甜的酒窝。",
                "icon": "👧",
                "label": "妹妹",
                "image": "assets/illustrations/mei_sister.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "头",
                "pinyin": "tóu",
                "en": "head",
                "strokes": 5,
                "radical": "大",
                "words": [
                    "头发",
                    "低头",
                    "带头"
                ],
                "sentence": "写字时不要把头低得太低，保护视力。",
                "icon": "🧑",
                "label": "头部",
                "image": "assets/illustrations/tou.svg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "鼻",
                "pinyin": "bí",
                "en": "nose",
                "strokes": 14,
                "radical": "鼻",
                "words": [
                    "鼻子",
                    "鼻梁",
                    "鼻尖"
                ],
                "sentence": "小花狗的鼻子可灵敏啦。",
                "icon": "👃",
                "label": "鼻子",
                "image": "assets/illustrations/bi_nose.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "身",
                "pinyin": "shēn",
                "en": "body",
                "strokes": 7,
                "radical": "身",
                "words": [
                    "身体",
                    "健身",
                    "全身"
                ],
                "sentence": "坚持体育锻炼，身体更加强壮健康。",
                "icon": "🧍",
                "label": "身体",
                "image": "assets/illustrations/shen.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "儿",
                "pinyin": "ér",
                "en": "child",
                "strokes": 2,
                "radical": "儿",
                "words": [
                    "儿童",
                    "少儿",
                    "儿子"
                ],
                "sentence": "我们是新时代朝气蓬勃的少年儿童。",
                "icon": "👶",
                "label": "儿童",
                "image": "assets/illustrations/er_child.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "老",
                "pinyin": "lǎo",
                "en": "elder",
                "strokes": 6,
                "radical": "老",
                "words": [
                    "老师",
                    "敬老",
                    "老人"
                ],
                "sentence": "我们要尊老爱幼，做一个懂礼貌的好学生。",
                "icon": "👴",
                "label": "老人",
                "image": "assets/illustrations/lao.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "师",
                "pinyin": "shī",
                "en": "teacher",
                "strokes": 6,
                "radical": "巾",
                "words": [
                    "老师",
                    "良师",
                    "导师"
                ],
                "sentence": "辛勤的老师是指引我们前行的明灯。",
                "icon": "👩‍🏫",
                "label": "老师",
                "image": "assets/illustrations/shi_teacher.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "爷",
                "pinyin": "yé",
                "en": "grandpa",
                "strokes": 6,
                "radical": "父",
                "words": [
                    "爷爷",
                    "姥爷",
                    "大爷"
                ],
                "sentence": "老爷爷笑眯眯地给我们讲好听的童话故事。",
                "icon": "👴",
                "label": "爷爷",
                "image": "assets/illustrations/ye_grandpa.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "奶",
                "pinyin": "nǎi",
                "en": "grandma",
                "strokes": 5,
                "radical": "女",
                "words": [
                    "奶奶",
                    "牛奶",
                    "姑奶"
                ],
                "sentence": "慈祥的奶奶亲手为我织了温暖的毛衣。",
                "icon": "👵",
                "label": "奶奶",
                "image": "assets/illustrations/nai_grandma.svg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "脸",
                "pinyin": "liǎn",
                "en": "face",
                "strokes": 11,
                "radical": "月",
                "words": [
                    "小脸",
                    "笑脸",
                    "脸蛋"
                ],
                "sentence": "小朋友的笑脸就像一朵盛开的向日葵。",
                "icon": "😊",
                "label": "笑脸",
                "image": "assets/illustrations/lian.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "眉",
                "pinyin": "méi",
                "en": "eyebrow",
                "strokes": 9,
                "radical": "目",
                "words": [
                    "眉毛",
                    "柳眉",
                    "展眉"
                ],
                "sentence": "小姑娘长着一双弯弯好看的柳叶眉。",
                "icon": "🤨",
                "label": "眉毛",
                "image": "assets/illustrations/mei_eyebrow.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "骨",
                "pinyin": "gǔ",
                "en": "bone",
                "strokes": 9,
                "radical": "骨",
                "words": [
                    "骨骼",
                    "骨头",
                    "强骨"
                ],
                "sentence": "常喝牛奶多晒太阳，骨骼会长得更加强壮。",
                "icon": "🦴",
                "label": "骨骼",
                "image": "assets/illustrations/gu_bone.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "腹",
                "pinyin": "fù",
                "en": "belly",
                "strokes": 13,
                "radical": "月",
                "words": [
                    "腹部",
                    "小腹",
                    "胸腹"
                ],
                "sentence": "小花猫吃得饱饱的，露出圆滚滚的腹部。",
                "icon": "🫃",
                "label": "腹部",
                "image": "assets/illustrations/fu_belly.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "亲",
                "pinyin": "qīn",
                "en": "parent",
                "strokes": 9,
                "radical": "立",
                "words": [
                    "母亲",
                    "亲人",
                    "亲切"
                ],
                "sentence": "温暖亲切的家庭是我们最安心的港湾。",
                "icon": "🫂",
                "label": "亲人",
                "image": "assets/illustrations/qin.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "幼",
                "pinyin": "yòu",
                "en": "young",
                "strokes": 5,
                "radical": "幺",
                "words": [
                    "幼儿",
                    "少幼",
                    "老幼"
                ],
                "sentence": "尊老爱幼是我们中华民族的传统美德。",
                "icon": "🍼",
                "label": "幼儿",
                "image": "assets/illustrations/you_young.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "女",
                "pinyin": "nǚ",
                "en": "girl",
                "radical": "女",
                "words": [
                    "女生",
                    "女儿",
                    "女孩"
                ],
                "sentence": "扎着羊角辫的小女孩笑得像花儿一样甜。",
                "icon": "👧",
                "label": "女孩",
                "image": "assets/illustrations/nv_girl.svg",
                "strokes": 3,
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "男",
                "pinyin": "nán",
                "en": "boy",
                "radical": "田",
                "words": [
                    "男生",
                    "男孩",
                    "男女"
                ],
                "sentence": "阳光活泼的小男孩在操场上快乐地奔跑。",
                "icon": "👦",
                "label": "男孩",
                "image": "assets/illustrations/nan_boy.svg",
                "strokes": 7,
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "我",
                "pinyin": "wǒ",
                "en": "I / me",
                "radical": "戈",
                "words": [
                    "我们",
                    "自己",
                    "我的"
                ],
                "sentence": "我是一名热爱学习、讲礼貌的好孩子。",
                "icon": "🙋",
                "label": "我们",
                "image": "assets/illustrations/wo_me.svg",
                "strokes": 7,
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "你",
                "pinyin": "nǐ",
                "en": "you",
                "radical": "亻",
                "words": [
                    "你好",
                    "你们",
                    "你的"
                ],
                "sentence": "早上见到老师和同学，要微笑着说声你好。",
                "icon": "👋",
                "label": "你好",
                "image": "assets/illustrations/ni_you.svg",
                "strokes": 7,
                "grade": "k-1",
                "difficulty": 1
            }
        ]
    },
    {
        "id": "school",
        "name": "🎒 学习校园",
        "color": "#0984e3",
        "chars": [
            {
                "char": "学",
                "pinyin": "xué",
                "en": "learn",
                "strokes": 8,
                "radical": "子",
                "words": [
                    "学习",
                    "学校",
                    "学生"
                ],
                "sentence": "我们每天都在探索和学习新知识。",
                "icon": "🎒",
                "label": "学习",
                "image": "assets/illustrations/xue_study.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "习",
                "pinyin": "xí",
                "en": "practice",
                "strokes": 3,
                "radical": "羽",
                "words": [
                    "练习",
                    "习字",
                    "温习"
                ],
                "sentence": "多温习、多练习，字就会越写越漂亮。",
                "icon": "📝",
                "label": "练习",
                "image": "assets/illustrations/xi_study.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "书",
                "pinyin": "shū",
                "en": "book",
                "strokes": 4,
                "radical": "乛",
                "words": [
                    "看书",
                    "图书",
                    "书包"
                ],
                "sentence": "书籍是人类进步的阶梯，多读书有益处。",
                "icon": "📖",
                "label": "书本",
                "image": "assets/illustrations/shu.svg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "写",
                "pinyin": "xiě",
                "en": "write",
                "strokes": 5,
                "radical": "冖",
                "words": [
                    "写字",
                    "听写",
                    "书写"
                ],
                "sentence": "坐姿端正，认认真真写好每一个中国字。",
                "icon": "✍️",
                "label": "写字",
                "image": "assets/illustrations/xie_write.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "读",
                "pinyin": "dú",
                "en": "read",
                "strokes": 10,
                "radical": "讠",
                "words": [
                    "读书",
                    "朗读",
                    "阅读"
                ],
                "sentence": "清晨教室里传来阵阵琅琅的读书声。",
                "icon": "🗣️",
                "label": "朗读",
                "image": "assets/illustrations/du_read.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "画",
                "pinyin": "huà",
                "en": "draw",
                "strokes": 8,
                "radical": "田",
                "words": [
                    "画画",
                    "画笔",
                    "风景画"
                ],
                "sentence": "我用五彩水彩笔画出心中的美好世界。",
                "icon": "🎨",
                "label": "画画",
                "image": "assets/illustrations/hua_draw.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "早",
                "pinyin": "zǎo",
                "en": "morning",
                "strokes": 6,
                "radical": "日",
                "words": [
                    "早上",
                    "早安",
                    "早晨"
                ],
                "sentence": "早睡早起身体好，做个健康好少年。",
                "icon": "🌅",
                "label": "早晨",
                "image": "assets/illustrations/zao.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "校",
                "pinyin": "xiào",
                "en": "school",
                "strokes": 10,
                "radical": "木",
                "words": [
                    "校园",
                    "校长",
                    "学校"
                ],
                "sentence": "美丽的校园里处处洋溢着欢声笑语。",
                "icon": "🏫",
                "label": "学校",
                "image": "assets/illustrations/xiao_school.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "正",
                "pinyin": "zhèng",
                "en": "right",
                "strokes": 5,
                "radical": "一",
                "words": [
                    "立正",
                    "端正",
                    "真正"
                ],
                "sentence": "写字时身体坐端正，握笔姿势要正确。",
                "icon": "📐",
                "label": "端正",
                "image": "assets/illustrations/zheng_straight.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "永",
                "pinyin": "yǒng",
                "en": "forever",
                "strokes": 5,
                "radical": "水",
                "words": [
                    "永远",
                    "永恒",
                    "永存"
                ],
                "sentence": "中华传统美德永远铭刻在每一个人的心间。",
                "icon": "🖋️",
                "label": "永远",
                "image": "assets/illustrations/yong_eternal.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "课",
                "pinyin": "kè",
                "en": "lesson",
                "strokes": 10,
                "radical": "讠",
                "words": [
                    "上课",
                    "课本",
                    "功课"
                ],
                "sentence": "铃声响，进教室，认真听讲专心上课。",
                "icon": "📚",
                "label": "上课",
                "image": "assets/illustrations/ke_lesson.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "笔",
                "pinyin": "bǐ",
                "en": "pen",
                "strokes": 10,
                "radical": "竹",
                "words": [
                    "毛笔",
                    "铅笔",
                    "画笔"
                ],
                "sentence": "握紧画笔，在宣纸上写下漂亮的笔迹。",
                "icon": "🖌️",
                "label": "毛笔",
                "image": "assets/illustrations/bi.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "本",
                "pinyin": "běn",
                "en": "notebook",
                "strokes": 5,
                "radical": "木",
                "words": [
                    "书本",
                    "本子",
                    "课本"
                ],
                "sentence": "书本里蕴藏着无穷无尽的科学秘密。",
                "icon": "📓",
                "label": "本子",
                "image": "assets/illustrations/ben_book.svg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "问",
                "pinyin": "wèn",
                "en": "ask",
                "strokes": 6,
                "radical": "门",
                "words": [
                    "问题",
                    "请问",
                    "提问"
                ],
                "sentence": "遇到不懂的问题，我们要主动向老师提问。",
                "icon": "❓",
                "label": "提问",
                "image": "assets/illustrations/wen_ask.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "歌",
                "pinyin": "gē",
                "en": "song",
                "strokes": 14,
                "radical": "欠",
                "words": [
                    "唱歌",
                    "儿歌",
                    "歌声"
                ],
                "sentence": "动听的儿歌陪伴我们快乐成长。",
                "icon": "🎵",
                "label": "儿歌",
                "image": "assets/illustrations/ge_song.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "诗",
                "pinyin": "shī",
                "en": "poem",
                "strokes": 8,
                "radical": "讠",
                "words": [
                    "古诗",
                    "诗人",
                    "诗歌"
                ],
                "sentence": "中华经典古诗韵味悠长，意境深远。",
                "icon": "📜",
                "label": "古诗",
                "image": "assets/illustrations/shi_poem.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "听",
                "pinyin": "tīng",
                "en": "listen",
                "strokes": 7,
                "radical": "口",
                "words": [
                    "听讲",
                    "倾听",
                    "动听"
                ],
                "sentence": "学会认真倾听他人的发言也是好习惯。",
                "icon": "🎧",
                "label": "听讲",
                "image": "assets/illustrations/ting_listen.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "说",
                "pinyin": "shuō",
                "en": "speak",
                "strokes": 9,
                "radical": "讠",
                "words": [
                    "说话",
                    "说明",
                    "诉说"
                ],
                "sentence": "说话要清楚明白，有礼貌地表达自己的想法。",
                "icon": "💬",
                "label": "说话",
                "image": "assets/illustrations/shuo_speak.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "答",
                "pinyin": "dá",
                "en": "answer",
                "strokes": 12,
                "radical": "竹",
                "words": [
                    "回答",
                    "问答",
                    "解答"
                ],
                "sentence": "积极举手，自信大声回答老师提问。",
                "icon": "🙋",
                "label": "回答",
                "image": "assets/illustrations/da_answer.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "乐",
                "pinyin": "lè",
                "en": "joy",
                "strokes": 5,
                "radical": "丿",
                "words": [
                    "快乐",
                    "音乐",
                    "乐园"
                ],
                "sentence": "快乐的小书法家们在这里共同进步。",
                "icon": "🎹",
                "label": "快乐",
                "image": "assets/illustrations/le_music.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "思",
                "pinyin": "sī",
                "en": "think",
                "strokes": 9,
                "radical": "心",
                "words": [
                    "思考",
                    "心思",
                    "思索"
                ],
                "sentence": "遇到难题勤于思考，培养解决问题的能力。",
                "icon": "💭",
                "label": "思考",
                "image": "assets/illustrations/si_think.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "知",
                "pinyin": "zhī",
                "en": "know",
                "strokes": 8,
                "radical": "矢",
                "words": [
                    "知识",
                    "求知",
                    "知道"
                ],
                "sentence": "知识就像辽阔的海洋，等待我们去探索。",
                "icon": "💡",
                "label": "知识",
                "image": "assets/illustrations/zhi_knowledge.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "识",
                "pinyin": "shí",
                "en": "recognize",
                "strokes": 7,
                "radical": "讠",
                "words": [
                    "认识",
                    "见识",
                    "学识"
                ],
                "sentence": "多读书多旅行，能让我们认识更广阔的世界。",
                "icon": "🔍",
                "label": "认识",
                "image": "assets/illustrations/shi_recognize.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "记",
                "pinyin": "jì",
                "en": "remember",
                "strokes": 5,
                "radical": "讠",
                "words": [
                    "记住",
                    "日记",
                    "记忆"
                ],
                "sentence": "上课认真做好笔记，重要内容牢记心间。",
                "icon": "🧠",
                "label": "记住",
                "image": "assets/illustrations/ji_note.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "算",
                "pinyin": "suàn",
                "en": "count",
                "strokes": 14,
                "radical": "竹",
                "words": [
                    "计算",
                    "心算",
                    "口算"
                ],
                "sentence": "每天坚持练习口算心算，反应又快又准。",
                "icon": "🧮",
                "label": "计算",
                "image": "assets/illustrations/suan_calc.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "题",
                "pinyin": "tí",
                "en": "problem",
                "strokes": 15,
                "radical": "页",
                "words": [
                    "题目",
                    "做题",
                    "习题"
                ],
                "sentence": "认真仔细审题，养成规范答题的好习惯。",
                "icon": "📋",
                "label": "做题",
                "image": "assets/illustrations/ti_quiz.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "册",
                "pinyin": "cè",
                "en": "booklet",
                "strokes": 5,
                "radical": "丿",
                "words": [
                    "画册",
                    "册子",
                    "书册"
                ],
                "sentence": "我最喜欢翻看图文并茂的彩色科学画册。",
                "icon": "📑",
                "label": "画册",
                "image": "assets/illustrations/ce_booklet.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "奖",
                "pinyin": "jiǎng",
                "en": "prize",
                "strokes": 9,
                "radical": "大",
                "words": [
                    "奖励",
                    "奖状",
                    "奖杯"
                ],
                "sentence": "期末获得了三好学生奖状，全家都为我高兴。",
                "icon": "🏆",
                "label": "奖状",
                "image": "assets/illustrations/jiang_award.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "字",
                "pinyin": "zì",
                "en": "character",
                "radical": "宀",
                "words": [
                    "汉字",
                    "写字",
                    "识字"
                ],
                "sentence": "我们在米字格里一笔一画认真练习写汉字。",
                "icon": "🀄",
                "label": "汉字",
                "image": "assets/illustrations/zi_char.svg",
                "strokes": 6,
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "词",
                "pinyin": "cí",
                "en": "word",
                "radical": "讠",
                "words": [
                    "词语",
                    "组词",
                    "诗词"
                ],
                "sentence": "把两个好朋友一样的汉字拼在一起就能组成词语。",
                "icon": "🧩",
                "label": "词语",
                "image": "assets/illustrations/ci_word.svg",
                "strokes": 7,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "句",
                "pinyin": "jù",
                "en": "sentence",
                "radical": "口",
                "words": [
                    "句子",
                    "造句",
                    "诗句"
                ],
                "sentence": "用学过的词语连成一句通顺完整的话吧。",
                "icon": "💬",
                "label": "句子",
                "image": "assets/illustrations/ju_sentence.svg",
                "strokes": 5,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "纸",
                "pinyin": "zhǐ",
                "en": "paper",
                "radical": "纟",
                "words": [
                    "白纸",
                    "折纸",
                    "宣纸"
                ],
                "sentence": "造纸术是中国古代伟大的四大发明之一。",
                "icon": "📄",
                "label": "白纸",
                "image": "assets/illustrations/zhi_paper.svg",
                "strokes": 7,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "墨",
                "pinyin": "mò",
                "en": "ink",
                "radical": "土",
                "words": [
                    "墨水",
                    "笔墨",
                    "水墨"
                ],
                "sentence": "毛笔蘸上乌黑发亮的墨汁，在宣纸上挥毫写字。",
                "icon": "🖤",
                "label": "笔墨",
                "image": "assets/illustrations/mo_ink.svg",
                "strokes": 15,
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "琴",
                "pinyin": "qín",
                "en": "piano",
                "radical": "王",
                "words": [
                    "钢琴",
                    "古琴",
                    "琴声"
                ],
                "sentence": "优美动听的钢琴声从音乐教室里飘了出来。",
                "icon": "🎹",
                "label": "钢琴",
                "image": "assets/illustrations/qin_piano.svg",
                "strokes": 12,
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "棋",
                "pinyin": "qí",
                "en": "chess",
                "radical": "木",
                "words": [
                    "下棋",
                    "围棋",
                    "象棋"
                ],
                "sentence": "周末我和爷爷在棋盘前开心地比赛下围棋。",
                "icon": "♟️",
                "label": "下棋",
                "image": "assets/illustrations/qi_chess.svg",
                "strokes": 12,
                "grade": "g2",
                "difficulty": 3
            }
        ]
    },
    {
        "id": "numbers",
        "name": "🔢 数字方位",
        "color": "#e17055",
        "chars": [
            {
                "char": "四",
                "pinyin": "sì",
                "en": "four",
                "strokes": 5,
                "radical": "囗",
                "words": [
                    "四季",
                    "四个",
                    "四方"
                ],
                "sentence": "一年有春、夏、秋、冬四个美丽的季节。",
                "icon": "🍀",
                "label": "四个",
                "image": "assets/illustrations/si.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "五",
                "pinyin": "wǔ",
                "en": "five",
                "strokes": 4,
                "radical": "一",
                "words": [
                    "五星",
                    "五个",
                    "五颜六色"
                ],
                "sentence": "五颜六色的气球飞向了蔚蓝的天空。",
                "icon": "🖐️",
                "label": "五个",
                "image": "assets/illustrations/wu.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "六",
                "pinyin": "liù",
                "en": "six",
                "strokes": 4,
                "radical": "八",
                "words": [
                    "六月",
                    "星期六",
                    "六个"
                ],
                "sentence": "六一儿童节是小朋友们最开心的节日。",
                "icon": "🎲",
                "label": "六个",
                "image": "assets/illustrations/liu.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "七",
                "pinyin": "qī",
                "en": "seven",
                "strokes": 2,
                "radical": "一",
                "words": [
                    "七色",
                    "七天",
                    "七巧板"
                ],
                "sentence": "神奇的七巧板能拼出各种有趣的动物。",
                "icon": "🌈",
                "label": "七个",
                "image": "assets/illustrations/qi.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "八",
                "pinyin": "bā",
                "en": "eight",
                "strokes": 2,
                "radical": "八",
                "words": [
                    "八方",
                    "八个",
                    "八月"
                ],
                "sentence": "八月桂花开，满园飘清香。",
                "icon": "🪙",
                "label": "八个",
                "image": "assets/illustrations/ba_num.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "九",
                "pinyin": "jiǔ",
                "en": "nine",
                "strokes": 2,
                "radical": "丿",
                "words": [
                    "九月",
                    "九重天",
                    "九州"
                ],
                "sentence": "九九乘法表，我们牢牢记心间。",
                "icon": "🎈",
                "label": "九个",
                "image": "assets/illustrations/jiu_nine.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "百",
                "pinyin": "bǎi",
                "en": "hundred",
                "strokes": 6,
                "radical": "白",
                "words": [
                    "百花",
                    "百鸟",
                    "百分"
                ],
                "sentence": "春天里百花齐放，争奇斗艳。",
                "icon": "💯",
                "label": "一百",
                "image": "assets/illustrations/bai_hundred.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "千",
                "pinyin": "qiān",
                "en": "thousand",
                "strokes": 3,
                "radical": "十",
                "words": [
                    "千里",
                    "千万",
                    "一千"
                ],
                "sentence": "千里之行，始于足下，我们要脚踏实地。",
                "icon": "🧊",
                "label": "一千",
                "image": "assets/illustrations/qian_thousand.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "万",
                "pinyin": "wàn",
                "en": "ten thousand",
                "strokes": 3,
                "radical": "一",
                "words": [
                    "万年",
                    "万里",
                    "千万"
                ],
                "sentence": "万里长城蜿蜒起伏，气势雄伟。",
                "icon": "🔢",
                "label": "一万",
                "image": "assets/illustrations/wan_tenthousand.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "亿",
                "pinyin": "yì",
                "en": "hundred million",
                "strokes": 3,
                "radical": "亻",
                "words": [
                    "亿万",
                    "一亿",
                    "十亿"
                ],
                "sentence": "十三亿中华儿女心连心。",
                "icon": "🌌",
                "label": "亿万",
                "image": "assets/illustrations/yi_hundredmillion.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "东",
                "pinyin": "dōng",
                "en": "east",
                "strokes": 5,
                "radical": "一",
                "words": [
                    "东方",
                    "东北",
                    "东风"
                ],
                "sentence": "红红的太阳从东方冉冉升起。",
                "icon": "🌅",
                "label": "东方",
                "image": "assets/illustrations/dong_east.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "西",
                "pinyin": "xī",
                "en": "west",
                "strokes": 6,
                "radical": "覀",
                "words": [
                    "西方",
                    "西瓜",
                    "日落西山"
                ],
                "sentence": "夏天吃上一块甜甜的西瓜真惬意。",
                "icon": "🌇",
                "label": "西方",
                "image": "assets/illustrations/xi_west.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "南",
                "pinyin": "nán",
                "en": "south",
                "strokes": 9,
                "radical": "十",
                "words": [
                    "南方",
                    "南海",
                    "南风"
                ],
                "sentence": "秋天到了，大雁成群结队飞往温暖的南方。",
                "icon": "🧭",
                "label": "南方",
                "image": "assets/illustrations/nan_south.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "北",
                "pinyin": "běi",
                "en": "north",
                "strokes": 5,
                "radical": "匕",
                "words": [
                    "北方",
                    "北京",
                    "北极"
                ],
                "sentence": "北斗七星指引着我们前行的方向。",
                "icon": "❄️",
                "label": "北方",
                "image": "assets/illustrations/bei_north.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "左",
                "pinyin": "zuǒ",
                "en": "left",
                "strokes": 5,
                "radical": "工",
                "words": [
                    "左手",
                    "左边",
                    "向左"
                ],
                "sentence": "过马路时要先看左边，再看右边。",
                "icon": "👈",
                "label": "左边",
                "image": "assets/illustrations/zuo.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "右",
                "pinyin": "yòu",
                "en": "right",
                "strokes": 5,
                "radical": "口",
                "words": [
                    "右手",
                    "右边",
                    "向右"
                ],
                "sentence": "我用右手握笔写出工整漂亮的汉字。",
                "icon": "👉",
                "label": "右边",
                "image": "assets/illustrations/you_right.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "前",
                "pinyin": "qián",
                "en": "front",
                "strokes": 9,
                "radical": "刂",
                "words": [
                    "前面",
                    "前进",
                    "从前"
                ],
                "sentence": "勇敢地向着心中的目标奋力前进。",
                "icon": "🏃",
                "label": "向前",
                "image": "assets/illustrations/qian_front.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "后",
                "pinyin": "hòu",
                "en": "behind",
                "strokes": 6,
                "radical": "口",
                "words": [
                    "后面",
                    "以后",
                    "随后"
                ],
                "sentence": "排队时站在后面，遵守秩序不拥挤。",
                "icon": "🚶",
                "label": "后面",
                "image": "assets/illustrations/hou_back.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "边",
                "pinyin": "biān",
                "en": "side",
                "strokes": 5,
                "radical": "辶",
                "words": [
                    "旁边",
                    "河边",
                    "右边"
                ],
                "sentence": "池塘边开满了星星点点的野花。",
                "icon": "🏞️",
                "label": "旁边",
                "image": "assets/illustrations/bian_edge.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "间",
                "pinyin": "jiān",
                "en": "room",
                "strokes": 7,
                "radical": "门",
                "words": [
                    "房间",
                    "时间",
                    "中间"
                ],
                "sentence": "我把自己的小房间收拾得整整齐齐、干干净净。",
                "icon": "⏱️",
                "label": "房间",
                "image": "assets/illustrations/jian_room.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "里",
                "pinyin": "lǐ",
                "en": "inside",
                "strokes": 7,
                "radical": "里",
                "words": [
                    "家里",
                    "树林里",
                    "心里"
                ],
                "sentence": "清澈的小溪里生活着许多小鱼虾。",
                "icon": "🏡",
                "label": "心里",
                "image": "assets/illustrations/li_inside.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "外",
                "pinyin": "wài",
                "en": "outside",
                "strokes": 5,
                "radical": "夕",
                "words": [
                    "外面",
                    "外语",
                    "野外"
                ],
                "sentence": "周末爸爸妈妈带我去野外放风筝。",
                "icon": "⛺",
                "label": "外边",
                "image": "assets/illustrations/wai_outside.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "半",
                "pinyin": "bàn",
                "en": "half",
                "strokes": 5,
                "radical": "十",
                "words": [
                    "一半",
                    "半天",
                    "半月"
                ],
                "sentence": "圆圆的饼干分成两半，和小伙伴一起分享。",
                "icon": "🌗",
                "label": "一半",
                "image": "assets/illustrations/ban_cookie.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "零",
                "pinyin": "líng",
                "en": "zero",
                "strokes": 13,
                "radical": "雨",
                "words": [
                    "零分",
                    "零钱",
                    "整零"
                ],
                "sentence": "无论是零点还是早晨，指针都在准时前行。",
                "icon": "⭕",
                "label": "零点",
                "image": "assets/illustrations/ling_zero.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "初",
                "pinyin": "chū",
                "en": "beginning",
                "strokes": 7,
                "radical": "刀",
                "words": [
                    "初升",
                    "初始",
                    "起初"
                ],
                "sentence": "旭日初升，给大地披上了一层金色的霞光。",
                "icon": "🌱",
                "label": "初始",
                "image": "assets/illustrations/chu_beginning.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "末",
                "pinyin": "mò",
                "en": "end",
                "strokes": 5,
                "radical": "木",
                "words": [
                    "周末",
                    "期末",
                    "月末"
                ],
                "sentence": "愉快的周末里，我和爸爸一起去放风筝。",
                "icon": "🔚",
                "label": "周末",
                "image": "assets/illustrations/mo_end.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "高",
                "pinyin": "gāo",
                "en": "high",
                "strokes": 10,
                "radical": "高",
                "words": [
                    "高山",
                    "高大",
                    "高兴"
                ],
                "sentence": "仰望高耸入云的山峰，心中充满敬佩。",
                "icon": "🗼",
                "label": "高大",
                "image": "assets/illustrations/gao_high.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "低",
                "pinyin": "dī",
                "en": "low",
                "strokes": 7,
                "radical": "亻",
                "words": [
                    "低头",
                    "高低",
                    "低空"
                ],
                "sentence": "写字时不要把头放得太低，保护好视力。",
                "icon": "📉",
                "label": "高低",
                "image": "assets/illustrations/di_low.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "远",
                "pinyin": "yuǎn",
                "en": "far",
                "strokes": 7,
                "radical": "辶",
                "words": [
                    "远方",
                    "远大",
                    "高远"
                ],
                "sentence": "树立远大崇高的理想，扬起航海的风帆。",
                "icon": "🔭",
                "label": "远方",
                "image": "assets/illustrations/yuan_far.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "近",
                "pinyin": "jìn",
                "en": "near",
                "strokes": 7,
                "radical": "辶",
                "words": [
                    "靠近",
                    "亲近",
                    "接近"
                ],
                "sentence": "公园离我家很近，步行几分钟就能到达。",
                "icon": "🔍",
                "label": "亲近",
                "image": "assets/illustrations/jin_near.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "多",
                "pinyin": "duō",
                "en": "many",
                "strokes": 6,
                "radical": "夕",
                "words": [
                    "许多",
                    "多少",
                    "多彩"
                ],
                "sentence": "果园里的红苹果真多呀，装满了大竹篮。",
                "icon": "🍎",
                "label": "许多",
                "image": "assets/illustrations/duo_many.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "少",
                "pinyin": "shǎo",
                "en": "few",
                "strokes": 4,
                "radical": "小",
                "words": [
                    "多少",
                    "很少",
                    "年少"
                ],
                "sentence": "盘子里的果子变少了，只剩下一个红苹果。",
                "icon": "🍒",
                "label": "多少",
                "image": "assets/illustrations/shao_few.svg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "长",
                "pinyin": "cháng",
                "en": "long",
                "radical": "长",
                "words": [
                    "长短",
                    "长江",
                    "长城"
                ],
                "sentence": "万里长城像一条巨龙蜿蜒在崇山峻岭之间。",
                "icon": "📏",
                "label": "长短",
                "image": "assets/illustrations/chang_long.svg",
                "strokes": 4,
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "短",
                "pinyin": "duǎn",
                "en": "short",
                "radical": "矢",
                "words": [
                    "长短",
                    "短小",
                    "短跑"
                ],
                "sentence": "尺子比一比，就知道哪支铅笔长、哪支铅笔短。",
                "icon": "📐",
                "label": "短小",
                "image": "assets/illustrations/duan_short.svg",
                "strokes": 12,
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "进",
                "pinyin": "jìn",
                "en": "enter",
                "radical": "辶",
                "words": [
                    "前进",
                    "进步",
                    "进去"
                ],
                "sentence": "每天坚持学习一点点，就能不断取得新进步。",
                "icon": "➡️",
                "label": "前进",
                "image": "assets/illustrations/jin_enter.svg",
                "strokes": 7,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "退",
                "pinyin": "tuì",
                "en": "retreat",
                "radical": "辶",
                "words": [
                    "后退",
                    "退步",
                    "退后"
                ],
                "sentence": "遇到困难要勇敢向前进，不要害怕往后退。",
                "icon": "⬅️",
                "label": "后退",
                "image": "assets/illustrations/tui_retreat.svg",
                "strokes": 9,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "深",
                "pinyin": "shēn",
                "en": "deep",
                "radical": "氵",
                "words": [
                    "深海",
                    "深浅",
                    "深秋"
                ],
                "sentence": "蔚蓝的大海深处住着巨大的蓝鲸。",
                "icon": "🌊",
                "label": "深浅",
                "image": "assets/illustrations/shen_deep.svg",
                "strokes": 11,
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "浅",
                "pinyin": "qiǎn",
                "en": "shallow",
                "radical": "氵",
                "words": [
                    "浅水",
                    "深浅",
                    "浅蓝"
                ],
                "sentence": "小鸭子在清澈见底的浅水滩里欢快地戏水。",
                "icon": "💧",
                "label": "浅水",
                "image": "assets/illustrations/qian_shallow.svg",
                "strokes": 8,
                "grade": "g2",
                "difficulty": 2
            }
        ]
    },
    {
        "id": "fruits",
        "name": "🍎 瓜果美食",
        "color": "#ff9f43",
        "chars": [
            {
                "char": "果",
                "pinyin": "guǒ",
                "en": "fruit",
                "strokes": 8,
                "radical": "木",
                "words": [
                    "水果",
                    "苹果",
                    "果实"
                ],
                "sentence": "秋天的果园里果实飘香，景色迷人。",
                "icon": "🍎",
                "label": "水果",
                "image": "assets/illustrations/guo.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "瓜",
                "pinyin": "guā",
                "en": "melon",
                "strokes": 5,
                "radical": "瓜",
                "words": [
                    "西瓜",
                    "甜瓜",
                    "冬瓜"
                ],
                "sentence": "夏天吃上一片冰甜可口的西瓜真舒服。",
                "icon": "🍉",
                "label": "西瓜",
                "image": "assets/illustrations/gua.svg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "桃",
                "pinyin": "táo",
                "en": "peach",
                "strokes": 10,
                "radical": "木",
                "words": [
                    "桃子",
                    "水蜜桃",
                    "桃花"
                ],
                "sentence": "粉红色的水蜜桃像小朋友圆圆的笑脸。",
                "icon": "🍑",
                "label": "桃子",
                "image": "assets/illustrations/tao.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "李",
                "pinyin": "lǐ",
                "en": "plum",
                "strokes": 7,
                "radical": "木",
                "words": [
                    "李子",
                    "桃李",
                    "李树"
                ],
                "sentence": "春天的果园里桃李争妍，美不胜收。",
                "icon": "🫐",
                "label": "李子",
                "image": "assets/illustrations/li_plum.svg",
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "梨",
                "pinyin": "lí",
                "en": "pear",
                "strokes": 11,
                "radical": "木",
                "words": [
                    "雪梨",
                    "梨花",
                    "鸭梨"
                ],
                "sentence": "甘甜可口的雪梨生津润肺。",
                "icon": "🍐",
                "label": "雪梨",
                "image": "assets/illustrations/li_pear.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "米",
                "pinyin": "mǐ",
                "en": "rice",
                "strokes": 6,
                "radical": "米",
                "words": [
                    "大米",
                    "米饭",
                    "玉米"
                ],
                "sentence": "粒粒皆辛苦，我们要珍惜每一粒白米饭。",
                "icon": "🍚",
                "label": "大米",
                "image": "assets/illustrations/mi.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "面",
                "pinyin": "miàn",
                "en": "noodles",
                "strokes": 9,
                "radical": "面",
                "words": [
                    "面条",
                    "面包",
                    "拉面"
                ],
                "sentence": "妈妈煮的热气腾腾的鸡蛋面真香。",
                "icon": "🍜",
                "label": "面条",
                "image": "assets/illustrations/mian.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "菜",
                "pinyin": "cài",
                "en": "vegetable",
                "strokes": 11,
                "radical": "艹",
                "words": [
                    "蔬菜",
                    "青菜",
                    "炒菜"
                ],
                "sentence": "多吃新鲜青菜，摄取丰富的维生素。",
                "icon": "🥬",
                "label": "蔬菜",
                "image": "assets/illustrations/cai.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "豆",
                "pinyin": "dòu",
                "en": "bean",
                "strokes": 7,
                "radical": "豆",
                "words": [
                    "红豆",
                    "黄豆",
                    "绿豆"
                ],
                "sentence": "夏天喝一碗消暑的绿豆汤，神清气爽。",
                "icon": "🫘",
                "label": "红豆",
                "image": "assets/illustrations/dou.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "茶",
                "pinyin": "chá",
                "en": "tea",
                "strokes": 9,
                "radical": "艹",
                "words": [
                    "绿茶",
                    "红茶",
                    "喝茶"
                ],
                "sentence": "淡淡的茶香让人心情宁静而愉悦。",
                "icon": "🍵",
                "label": "茶叶",
                "image": "assets/illustrations/cha.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "甜",
                "pinyin": "tián",
                "en": "sweet",
                "strokes": 11,
                "radical": "甘",
                "words": [
                    "香甜",
                    "甜美",
                    "甜瓜"
                ],
                "sentence": "熟透的草莓吃起来酸酸甜甜的。",
                "icon": "🍯",
                "label": "香甜",
                "image": "assets/illustrations/tian.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "香",
                "pinyin": "xiāng",
                "en": "fragrant",
                "strokes": 9,
                "radical": "香",
                "words": [
                    "花香",
                    "清香",
                    "香甜"
                ],
                "sentence": "厨房里飘出了刚出炉面包的诱人香气。",
                "icon": "🥐",
                "label": "清香",
                "image": "assets/illustrations/xiang_aroma.svg",
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "肉",
                "pinyin": "ròu",
                "en": "meat",
                "strokes": 6,
                "radical": "肉",
                "words": [
                    "牛肉",
                    "羊肉",
                    "鱼肉"
                ],
                "sentence": "多吃新鲜蔬菜少吃肥肉，荤素搭配更健康。",
                "icon": "🥩",
                "label": "牛肉",
                "image": "assets/illustrations/rou.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "饭",
                "pinyin": "fàn",
                "en": "meal",
                "strokes": 7,
                "radical": "饣",
                "words": [
                    "吃饭",
                    "米饭",
                    "早饭"
                ],
                "sentence": "按时吃早饭，上学精神饱满。",
                "icon": "🍱",
                "label": "米饭",
                "image": "assets/illustrations/fan.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "橙",
                "pinyin": "chéng",
                "en": "orange",
                "strokes": 16,
                "radical": "木",
                "words": [
                    "橙子",
                    "甜橙",
                    "橙汁"
                ],
                "sentence": "金黄饱满的橙子榨出来的橙汁酸甜可口。",
                "icon": "🍊",
                "label": "橙子",
                "image": "assets/illustrations/cheng.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "桔",
                "pinyin": "jú",
                "en": "tangerine",
                "strokes": 10,
                "radical": "木",
                "words": [
                    "桔子",
                    "金桔",
                    "桔林"
                ],
                "sentence": "秋天果园里挂满了金灿灿诱人的小桔子。",
                "icon": "🍊",
                "label": "桔子",
                "image": "assets/illustrations/ju.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "杏",
                "pinyin": "xìng",
                "en": "apricot",
                "strokes": 7,
                "radical": "木",
                "words": [
                    "杏树",
                    "甜杏",
                    "杏仁"
                ],
                "sentence": "初夏时节，枝头挂满了黄澄澄的甜杏。",
                "icon": "🍈",
                "label": "甜杏",
                "image": "assets/illustrations/xing_apricot.svg",
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "莓",
                "pinyin": "méi",
                "en": "berry",
                "strokes": 10,
                "radical": "艹",
                "words": [
                    "草莓",
                    "蓝莓",
                    "树莓"
                ],
                "sentence": "红彤彤的草莓鲜嫩多汁，香甜诱人。",
                "icon": "🍓",
                "label": "草莓",
                "image": "assets/illustrations/mei.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "汤",
                "pinyin": "tāng",
                "en": "soup",
                "strokes": 6,
                "radical": "氵",
                "words": [
                    "鲜汤",
                    "热汤",
                    "甜汤"
                ],
                "sentence": "冬天喝一碗热气腾腾的鸡汤，浑身暖和。",
                "icon": "🍲",
                "label": "热汤",
                "image": "assets/illustrations/tang_soup.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "糖",
                "pinyin": "táng",
                "en": "candy",
                "strokes": 16,
                "radical": "米",
                "words": [
                    "白糖",
                    "糖果",
                    "冰糖"
                ],
                "sentence": "过年时大家一起分享甜滋滋的各式糖果。",
                "icon": "🍬",
                "label": "糖果",
                "image": "assets/illustrations/tang_sugar.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "麦",
                "pinyin": "mài",
                "en": "wheat",
                "strokes": 7,
                "radical": "麦",
                "words": [
                    "小麦",
                    "麦田",
                    "麦穗"
                ],
                "sentence": "金色的麦浪随风起伏，预示着大丰收。",
                "icon": "🌾",
                "label": "麦穗",
                "image": "assets/illustrations/mai.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "粮",
                "pinyin": "liáng",
                "en": "grain",
                "strokes": 13,
                "radical": "米",
                "words": [
                    "粮食",
                    "口粮",
                    "干粮"
                ],
                "sentence": "节约每一粒珍贵的粮食，是对大自然的敬畏。",
                "icon": "🌽",
                "label": "粮食",
                "image": "assets/illustrations/liang.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "蛋",
                "pinyin": "dàn",
                "en": "egg",
                "radical": "虫",
                "words": [
                    "鸡蛋",
                    "蛋糕",
                    "鸟蛋"
                ],
                "sentence": "每天早餐吃一个营养丰富的鸡蛋，身体棒棒。",
                "icon": "🥚",
                "label": "鸡蛋",
                "image": "assets/illustrations/dan_egg.svg",
                "strokes": 11,
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "糕",
                "pinyin": "gāo",
                "en": "cake",
                "radical": "米",
                "words": [
                    "蛋糕",
                    "年糕",
                    "糕点"
                ],
                "sentence": "生日那天，全家人一起分享香甜的草莓蛋糕。",
                "icon": "🎂",
                "label": "蛋糕",
                "image": "assets/illustrations/gao_cake.svg",
                "strokes": 16,
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "饺",
                "pinyin": "jiǎo",
                "en": "dumpling",
                "radical": "饣",
                "words": [
                    "水饺",
                    "饺子",
                    "包饺子"
                ],
                "sentence": "过年的时候，我们全家人围在一起包热气腾腾的饺子。",
                "icon": "🥟",
                "label": "饺子",
                "image": "assets/illustrations/jiao_dumpling.svg",
                "strokes": 9,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "碗",
                "pinyin": "wǎn",
                "en": "bowl",
                "radical": "石",
                "words": [
                    "饭碗",
                    "瓷碗",
                    "洗碗"
                ],
                "sentence": "吃完饭后，我主动帮妈妈把饭碗洗得干干净净。",
                "icon": "🥣",
                "label": "饭碗",
                "image": "assets/illustrations/wan_bowl.svg",
                "strokes": 13,
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "筷",
                "pinyin": "kuài",
                "en": "chopsticks",
                "radical": "竹",
                "words": [
                    "筷子",
                    "碗筷",
                    "竹筷"
                ],
                "sentence": "我已经学会自己用筷子夹菜吃饭啦。",
                "icon": "🥢",
                "label": "筷子",
                "image": "assets/illustrations/kuai_chopsticks.svg",
                "strokes": 13,
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "勺",
                "pinyin": "sháo",
                "en": "spoon",
                "radical": "勹",
                "words": [
                    "勺子",
                    "汤勺",
                    "铁勺"
                ],
                "sentence": "喝热汤的时候，用小瓷勺一勺一勺慢慢喝。",
                "icon": "🥄",
                "label": "勺子",
                "image": "assets/illustrations/shao_spoon.svg",
                "strokes": 3,
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "盘",
                "pinyin": "pán",
                "en": "plate",
                "radical": "皿",
                "words": [
                    "盘子",
                    "果盘",
                    "圆盘"
                ],
                "sentence": "圆圆的果盘里摆满了洗干净的红苹果和甜桃子。",
                "icon": "🍽️",
                "label": "盘子",
                "image": "assets/illustrations/pan_plate.svg",
                "strokes": 11,
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "盐",
                "pinyin": "yán",
                "en": "salt",
                "radical": "皿",
                "words": [
                    "食盐",
                    "盐水",
                    "海盐"
                ],
                "sentence": "炒菜时放少许白白的食盐，菜肴味道更鲜美。",
                "icon": "🧂",
                "label": "食盐",
                "image": "assets/illustrations/yan_salt.svg",
                "strokes": 10,
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "油",
                "pinyin": "yóu",
                "en": "oil",
                "radical": "氵",
                "words": [
                    "香油",
                    "油菜",
                    "加油"
                ],
                "sentence": "金灿灿的菜籽油散发着浓郁的清香。",
                "icon": "🫗",
                "label": "香油",
                "image": "assets/illustrations/you_oil.svg",
                "strokes": 8,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "苦",
                "pinyin": "kǔ",
                "en": "bitter",
                "radical": "艹",
                "words": [
                    "苦瓜",
                    "吃苦",
                    "辛苦"
                ],
                "sentence": "碧绿的苦瓜虽然味道有点苦，但清热又有营养。",
                "icon": "🥒",
                "label": "苦瓜",
                "image": "assets/illustrations/ku_bitter.svg",
                "strokes": 8,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "酸",
                "pinyin": "suān",
                "en": "sour",
                "radical": "酉",
                "words": [
                    "酸甜",
                    "酸奶",
                    "酸梅"
                ],
                "sentence": "黄澄澄的柠檬尝一口酸溜溜的，做柠檬水最好喝。",
                "icon": "🍋",
                "label": "酸甜",
                "image": "assets/illustrations/suan_sour.svg",
                "strokes": 14,
                "grade": "g2",
                "difficulty": 3
            }
        ]
    },
    {
        "id": "colors_virtue",
        "name": "🌈 颜色品德",
        "color": "#10ac84",
        "chars": [
            {
                "char": "红",
                "pinyin": "hóng",
                "en": "red",
                "strokes": 6,
                "radical": "纟",
                "words": [
                    "红色",
                    "红花",
                    "鲜红"
                ],
                "sentence": "红红的苹果又香又甜，真好吃！",
                "icon": "🍎",
                "label": "红色",
                "image": "assets/illustrations/hong.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "黄",
                "pinyin": "huáng",
                "en": "yellow",
                "strokes": 11,
                "radical": "黄",
                "words": [
                    "黄色",
                    "金黄",
                    "蛋黄"
                ],
                "sentence": "秋天的银杏叶呈现出一片金黄。",
                "icon": "🟡",
                "label": "黄色",
                "image": "assets/illustrations/huang.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "蓝",
                "pinyin": "lán",
                "en": "blue",
                "strokes": 13,
                "radical": "艹",
                "words": [
                    "蓝色",
                    "蓝天",
                    "深蓝"
                ],
                "sentence": "在蔚蓝的天空下，白鸽自由自在地飞翔。",
                "icon": "🔷",
                "label": "蓝色",
                "image": "assets/illustrations/lan_blue.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "绿",
                "pinyin": "lǜ",
                "en": "green",
                "strokes": 11,
                "radical": "纟",
                "words": [
                    "绿色",
                    "绿树",
                    "草绿"
                ],
                "sentence": "青山绿水就是我们最宝贵的美好家园。",
                "icon": "🌿",
                "label": "绿色",
                "image": "assets/illustrations/lv.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "黑",
                "pinyin": "hēi",
                "en": "black",
                "strokes": 12,
                "radical": "黑",
                "words": [
                    "黑色",
                    "黑板",
                    "黑夜"
                ],
                "sentence": "夜晚的天空是深黑色的，繁星闪烁。",
                "icon": "🖤",
                "label": "黑色",
                "image": "assets/illustrations/hei_black.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "爱",
                "pinyin": "ài",
                "en": "love",
                "strokes": 10,
                "radical": "爫",
                "words": [
                    "爱心",
                    "关爱",
                    "可爱"
                ],
                "sentence": "爱是相互关怀与真诚的陪伴。",
                "icon": "💖",
                "label": "关爱",
                "image": "assets/illustrations/ai_love.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "善",
                "pinyin": "shàn",
                "en": "kind",
                "strokes": 12,
                "radical": "口",
                "words": [
                    "善良",
                    "善心",
                    "友善"
                ],
                "sentence": "心怀善良的人，生活处处充满阳光。",
                "icon": "😇",
                "label": "善良",
                "image": "assets/illustrations/shan_kind.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "美",
                "pinyin": "měi",
                "en": "beautiful",
                "strokes": 9,
                "radical": "羊",
                "words": [
                    "美丽",
                    "美好",
                    "美德"
                ],
                "sentence": "我们要用勤劳的双眼发现生活中的真善美。",
                "icon": "🦚",
                "label": "美丽",
                "image": "assets/illustrations/mei_beautiful.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "诚",
                "pinyin": "chéng",
                "en": "honest",
                "strokes": 8,
                "radical": "讠",
                "words": [
                    "诚实",
                    "诚信",
                    "真诚"
                ],
                "sentence": "诚实是做人最重要的美好品质。",
                "icon": "🤝",
                "label": "诚实",
                "image": "assets/illustrations/cheng_honest.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "礼",
                "pinyin": "lǐ",
                "en": "polite",
                "strokes": 5,
                "radical": "礻",
                "words": [
                    "礼貌",
                    "行礼",
                    "礼节"
                ],
                "sentence": "见到师长主动问好，做个讲礼貌的好少年。",
                "icon": "🎁",
                "label": "礼貌",
                "image": "assets/illustrations/li_polite.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "信",
                "pinyin": "xìn",
                "en": "trust",
                "strokes": 9,
                "radical": "亻",
                "words": [
                    "自信",
                    "信任",
                    "守信"
                ],
                "sentence": "言必信，行必果，做个说话算话的人。",
                "icon": "💌",
                "label": "自信",
                "image": "assets/illustrations/xin_trust.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "仁",
                "pinyin": "rén",
                "en": "benevolent",
                "strokes": 4,
                "radical": "亻",
                "words": [
                    "仁爱",
                    "仁心",
                    "宽仁"
                ],
                "sentence": "仁爱宽厚，温暖身边每一个朋友。",
                "icon": "🕊️",
                "label": "仁爱",
                "image": "assets/illustrations/ren_benevolent.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "德",
                "pinyin": "dé",
                "en": "virtue",
                "strokes": 15,
                "radical": "彳",
                "words": [
                    "品德",
                    "美德",
                    "德育"
                ],
                "sentence": "崇尚美德，做一个有道德守纪律的好学生。",
                "icon": "🌟",
                "label": "品德",
                "image": "assets/illustrations/de_virtue.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "和",
                "pinyin": "hé",
                "en": "peace",
                "strokes": 8,
                "radical": "口",
                "words": [
                    "和平",
                    "和睦",
                    "温和"
                ],
                "sentence": "同学之间和睦相处，团结友爱。",
                "icon": "🕊️",
                "label": "和平",
                "image": "assets/illustrations/he_peace.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "紫",
                "pinyin": "zǐ",
                "en": "purple",
                "strokes": 12,
                "radical": "糸",
                "words": [
                    "紫色",
                    "紫霞",
                    "紫花"
                ],
                "sentence": "初夏的紫藤花如梦幻般的紫色瀑布绽放。",
                "icon": "🟣",
                "label": "紫色",
                "image": "assets/illustrations/zi_color.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "青",
                "pinyin": "qīng",
                "en": "cyan",
                "strokes": 8,
                "radical": "青",
                "words": [
                    "青色",
                    "青草",
                    "青山"
                ],
                "sentence": "青山常在，绿水长流，大自然充满生机。",
                "icon": "🟢",
                "label": "青色",
                "image": "assets/illustrations/qing_cyan.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "敬",
                "pinyin": "jìng",
                "en": "respect",
                "strokes": 12,
                "radical": "攵",
                "words": [
                    "尊敬",
                    "敬礼",
                    "敬意"
                ],
                "sentence": "见到师长主动立正行礼，表达由衷敬意。",
                "icon": "🫡",
                "label": "敬礼",
                "image": "assets/illustrations/jing_respect.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "勤",
                "pinyin": "qín",
                "en": "diligent",
                "strokes": 13,
                "radical": "力",
                "words": [
                    "勤劳",
                    "勤奋",
                    "勤学"
                ],
                "sentence": "勤劳是一切财富与智慧的源泉。",
                "icon": "🐜",
                "label": "勤劳",
                "image": "assets/illustrations/qin_diligent.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "俭",
                "pinyin": "jiǎn",
                "en": "frugal",
                "strokes": 9,
                "radical": "亻",
                "words": [
                    "节俭",
                    "勤俭",
                    "俭朴"
                ],
                "sentence": "勤俭节约是中华民族世代相传的传统美德。",
                "icon": "🪙",
                "label": "节俭",
                "image": "assets/illustrations/jian_jar.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "宽",
                "pinyin": "kuān",
                "en": "forgiving",
                "strokes": 10,
                "radical": "宀",
                "words": [
                    "宽容",
                    "宽广",
                    "宽厚"
                ],
                "sentence": "拥有宽广的心胸，能包容不同的人和事。",
                "icon": "🏞️",
                "label": "宽广",
                "image": "assets/illustrations/kuan_wide.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "勇",
                "pinyin": "yǒng",
                "en": "brave",
                "strokes": 9,
                "radical": "力",
                "words": [
                    "勇敢",
                    "英勇",
                    "神勇"
                ],
                "sentence": "面对未知的挑战，我们要勇敢跨出第一步。",
                "icon": "🛡️",
                "label": "勇敢",
                "image": "assets/illustrations/yong_brave.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "恒",
                "pinyin": "héng",
                "en": "constant",
                "strokes": 9,
                "radical": "心",
                "words": [
                    "恒心",
                    "恒久",
                    "永恒"
                ],
                "sentence": "只有持之以恒、坚持不懈，才能摘得胜利果实。",
                "icon": "⏳",
                "label": "恒久",
                "image": "assets/illustrations/heng_constant.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "灰",
                "pinyin": "huī",
                "en": "gray",
                "radical": "火",
                "words": [
                    "灰色",
                    "灰兔",
                    "银灰"
                ],
                "sentence": "毛茸茸的小灰兔竖起长耳朵在草地上吃草。",
                "icon": "🩶",
                "label": "灰色",
                "image": "assets/illustrations/hui_gray.svg",
                "strokes": 6,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "粉",
                "pinyin": "fěn",
                "en": "pink",
                "radical": "米",
                "words": [
                    "粉色",
                    "粉红",
                    "花粉"
                ],
                "sentence": "春天桃花盛开，满树都是温柔的粉红色。",
                "icon": "🩷",
                "label": "粉色",
                "image": "assets/illustrations/fen_pink.svg",
                "strokes": 10,
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "金",
                "pinyin": "jīn",
                "en": "gold",
                "radical": "金",
                "words": [
                    "金色",
                    "黄金",
                    "金鱼"
                ],
                "sentence": "秋天的稻田像铺上了一层金光闪闪的地毯。",
                "icon": "🪙",
                "label": "金色",
                "image": "assets/illustrations/jin_gold.svg",
                "strokes": 8,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "银",
                "pinyin": "yín",
                "en": "silver",
                "radical": "钅",
                "words": [
                    "银色",
                    "白银",
                    "银河"
                ],
                "sentence": "晴朗的夏夜，天空中横跨着一条亮晶晶的银河。",
                "icon": "🥈",
                "label": "银色",
                "image": "assets/illustrations/yin_silver.svg",
                "strokes": 11,
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "玉",
                "pinyin": "yù",
                "en": "jade",
                "radical": "王",
                "words": [
                    "美玉",
                    "玉米",
                    "白玉"
                ],
                "sentence": "温润翠绿的美玉雕琢成了精致的玉佩。",
                "icon": "🟢",
                "label": "美玉",
                "image": "assets/illustrations/yu_jade.svg",
                "strokes": 5,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "宝",
                "pinyin": "bǎo",
                "en": "treasure",
                "radical": "宀",
                "words": [
                    "宝贝",
                    "宝藏",
                    "宝石"
                ],
                "sentence": "大海深处的宝箱里藏着五彩斑斓的宝石。",
                "icon": "💎",
                "label": "宝石",
                "image": "assets/illustrations/bao_treasure.svg",
                "strokes": 8,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "好",
                "pinyin": "hǎo",
                "en": "good",
                "radical": "女",
                "words": [
                    "好人",
                    "友好",
                    "美好"
                ],
                "sentence": "好朋友之间要互相帮助、团结友爱。",
                "icon": "👍",
                "label": "友好",
                "image": "assets/illustrations/hao_good.svg",
                "strokes": 6,
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "坏",
                "pinyin": "huài",
                "en": "bad",
                "radical": "土",
                "words": [
                    "好坏",
                    "坏人",
                    "损坏"
                ],
                "sentence": "我们要爱护玩具和图书，不要把它们弄坏。",
                "icon": "👎",
                "label": "好坏",
                "image": "assets/illustrations/huai_bad.svg",
                "strokes": 7,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "对",
                "pinyin": "duì",
                "en": "right",
                "radical": "寸",
                "words": [
                    "正确",
                    "对错",
                    "回答对"
                ],
                "sentence": "这道题你答对啦，老师奖励你一颗小红星。",
                "icon": "✅",
                "label": "正确",
                "image": "assets/illustrations/dui_right.svg",
                "strokes": 5,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "错",
                "pinyin": "cuò",
                "en": "wrong",
                "radical": "钅",
                "words": [
                    "错误",
                    "对错",
                    "写错"
                ],
                "sentence": "写错字没关系，擦干净重新认真写一遍就会进步。",
                "icon": "❌",
                "label": "对错",
                "image": "assets/illustrations/cuo_wrong.svg",
                "strokes": 13,
                "grade": "g2",
                "difficulty": 3
            }
        ]
    },
    {
        "id": "actions",
        "name": "🏃 行动生活",
        "color": "#5f27cd",
        "chars": [
            {
                "char": "立",
                "pinyin": "lì",
                "en": "stand",
                "strokes": 5,
                "radical": "立",
                "words": [
                    "起立",
                    "站立",
                    "立正"
                ],
                "sentence": "站立如松挺且直，展现昂扬好风貌。",
                "icon": "🧍",
                "label": "起立",
                "image": "assets/illustrations/li_stand.svg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "坐",
                "pinyin": "zuò",
                "en": "sit",
                "strokes": 7,
                "radical": "土",
                "words": [
                    "坐下",
                    "端坐",
                    "静坐"
                ],
                "sentence": "写字时身坐正，头放平，两臂平展。",
                "icon": "🪑",
                "label": "端坐",
                "image": "assets/illustrations/zuo_sit.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "走",
                "pinyin": "zǒu",
                "en": "walk",
                "strokes": 7,
                "radical": "走",
                "words": [
                    "走路",
                    "行走",
                    "起走"
                ],
                "sentence": "饭后走一走，活到九十九。",
                "icon": "🚶",
                "label": "走路",
                "image": "assets/illustrations/zou_walk.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "跑",
                "pinyin": "pǎo",
                "en": "run",
                "strokes": 12,
                "radical": "𧾷",
                "words": [
                    "跑步",
                    "赛跑",
                    "飞跑"
                ],
                "sentence": "我们在红色的塑胶跑道上奋力奔跑。",
                "icon": "🏃",
                "label": "跑步",
                "image": "assets/illustrations/pao.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "跳",
                "pinyin": "tiào",
                "en": "jump",
                "strokes": 13,
                "radical": "𧾷",
                "words": [
                    "跳绳",
                    "跳高",
                    "起跳"
                ],
                "sentence": "摇起彩绳跳起来，既强健体魄又开心。",
                "icon": "🦘",
                "label": "跳绳",
                "image": "assets/illustrations/tiao_jump.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "看",
                "pinyin": "kàn",
                "en": "look",
                "strokes": 9,
                "radical": "目",
                "words": [
                    "看见",
                    "看书",
                    "观看"
                ],
                "sentence": "认真看清每个汉字的间架结构再落笔。",
                "icon": "👁️",
                "label": "看见",
                "image": "assets/illustrations/kan_look.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "开",
                "pinyin": "kāi",
                "en": "open",
                "strokes": 4,
                "radical": "廾",
                "words": [
                    "开门",
                    "开心",
                    "开学"
                ],
                "sentence": "新学期开始了，校园里开满了美丽的花。",
                "icon": "🔓",
                "label": "开门",
                "image": "assets/illustrations/kai_open.svg",
                "grade": "k-1",
                "difficulty": 1
            },
            {
                "char": "关",
                "pinyin": "guān",
                "en": "close",
                "strokes": 6,
                "radical": "丷",
                "words": [
                    "关门",
                    "关心",
                    "关注"
                ],
                "sentence": "我们要互相关心，彼此互相照顾。",
                "icon": "🔒",
                "label": "关门",
                "image": "assets/illustrations/guan_close.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "飞",
                "pinyin": "fēi",
                "en": "fly",
                "strokes": 3,
                "radical": "飞",
                "words": [
                    "飞翔",
                    "飞机",
                    "飞鸟"
                ],
                "sentence": "放飞五彩斑斓的纸飞机，寄托远大理想。",
                "icon": "🚀",
                "label": "飞翔",
                "image": "assets/illustrations/fei.svg",
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "游",
                "pinyin": "yóu",
                "en": "swim",
                "strokes": 12,
                "radical": "氵",
                "words": [
                    "游泳",
                    "游戏",
                    "春游"
                ],
                "sentence": "春天老师带我们到大自然中春游踏青。",
                "icon": "🏊",
                "label": "游泳",
                "image": "assets/illustrations/you_swim.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "唱",
                "pinyin": "chàng",
                "en": "sing",
                "strokes": 11,
                "radical": "口",
                "words": [
                    "唱歌",
                    "歌唱",
                    "合唱"
                ],
                "sentence": "大家一起合唱一曲动听的少先队队歌。",
                "icon": "🎤",
                "label": "唱歌",
                "image": "assets/illustrations/chang_sing.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "玩",
                "pinyin": "wán",
                "en": "play",
                "strokes": 8,
                "radical": "王",
                "words": [
                    "玩耍",
                    "好玩",
                    "玩具"
                ],
                "sentence": "在安全的游戏区和小朋友们愉快地玩耍。",
                "icon": "🪀",
                "label": "玩具",
                "image": "assets/illustrations/wan_play.svg",
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "动",
                "pinyin": "dòng",
                "en": "move",
                "strokes": 6,
                "radical": "力",
                "words": [
                    "运动",
                    "劳动",
                    "动作"
                ],
                "sentence": "热爱体育运动，保持强健活泼的体魄。",
                "icon": "⚽",
                "label": "运动",
                "image": "assets/illustrations/dong_move.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "想",
                "pinyin": "xiǎng",
                "en": "think",
                "strokes": 13,
                "radical": "心",
                "words": [
                    "梦想",
                    "想念",
                    "想要"
                ],
                "sentence": "放飞心中的梦想，用智慧和勤奋创造明天。",
                "icon": "💭",
                "label": "梦想",
                "image": "assets/illustrations/xiang_think.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "抱",
                "pinyin": "bào",
                "en": "hug",
                "strokes": 8,
                "radical": "扌",
                "words": [
                    "拥抱",
                    "怀抱",
                    "抱抱"
                ],
                "sentence": "回到家给辛劳的爸爸妈妈一个大大的拥抱。",
                "icon": "🤗",
                "label": "拥抱",
                "image": "assets/illustrations/bao_hug.svg",
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "握",
                "pinyin": "wò",
                "en": "grasp",
                "strokes": 12,
                "radical": "扌",
                "words": [
                    "握手",
                    "握笔",
                    "把握"
                ],
                "sentence": "掌握正确的握笔姿势，写出刚劲有力的汉字。",
                "icon": "✍️",
                "label": "握笔",
                "image": "assets/illustrations/wo_grasp.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "招",
                "pinyin": "zhāo",
                "en": "wave",
                "strokes": 8,
                "radical": "扌",
                "words": [
                    "招手",
                    "招呼",
                    "招来"
                ],
                "sentence": "隔着窗户，小朋友热情地向老师招手问好。",
                "icon": "🙋",
                "label": "招手",
                "image": "assets/illustrations/zhao_wave.svg",
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "抬",
                "pinyin": "tái",
                "en": "lift",
                "strokes": 8,
                "radical": "扌",
                "words": [
                    "抬头",
                    "抬起",
                    "抬手"
                ],
                "sentence": "昂首挺胸，抬起自信的头颅迎接每一个清晨。",
                "icon": "🆙",
                "label": "抬起",
                "image": "assets/illustrations/tai_lift.svg",
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "迈",
                "pinyin": "mài",
                "en": "step",
                "strokes": 6,
                "radical": "辶",
                "words": [
                    "迈步",
                    "大迈",
                    "迈向"
                ],
                "sentence": "迈开坚实有力的脚步，向着梦想殿堂进发。",
                "icon": "👟",
                "label": "迈步",
                "image": "assets/illustrations/mai_stride.svg",
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "望",
                "pinyin": "wàng",
                "en": "gaze",
                "strokes": 11,
                "radical": "月",
                "words": [
                    "眺望",
                    "远望",
                    "希望"
                ],
                "sentence": "站在山峰之巅极目眺望，祖国大好河山尽收眼底。",
                "icon": "🔭",
                "label": "远望",
                "image": "assets/illustrations/wang_gaze.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "追",
                "pinyin": "zhuī",
                "en": "chase",
                "strokes": 9,
                "radical": "辶",
                "words": [
                    "追赶",
                    "追寻",
                    "追逐"
                ],
                "sentence": "在金色的阳光下，我们尽情追逐着五彩肥皂泡。",
                "icon": "🫧",
                "label": "追逐",
                "image": "assets/illustrations/zhui_chase.svg",
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "登",
                "pinyin": "dēng",
                "en": "climb",
                "strokes": 12,
                "radical": "癶",
                "words": [
                    "登山",
                    "攀登",
                    "登高"
                ],
                "sentence": "无限风光在险峰，勇于攀登才能领略绝美风景。",
                "icon": "🧗",
                "label": "登山",
                "image": "assets/illustrations/deng_climb.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "快",
                "pinyin": "kuài",
                "en": "fast",
                "strokes": 7,
                "radical": "忄",
                "words": [
                    "飞快",
                    "快速",
                    "快慢"
                ],
                "sentence": "高铁列车在平稳的钢轨上飞快地疾驰。",
                "icon": "🚄",
                "label": "飞快",
                "image": "assets/illustrations/kuai_fast.svg",
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "哭",
                "pinyin": "kū",
                "en": "cry",
                "radical": "口",
                "words": [
                    "哭泣",
                    "哭笑",
                    "大哭"
                ],
                "sentence": "摔倒了不哭泣，自己勇敢地站起来拍拍灰尘。",
                "icon": "😢",
                "label": "哭泣",
                "image": "assets/illustrations/ku_cry.svg",
                "strokes": 10,
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "笑",
                "pinyin": "xiào",
                "en": "smile",
                "radical": "竹",
                "words": [
                    "微笑",
                    "欢笑",
                    "笑脸"
                ],
                "sentence": "小朋友们脸上洋溢着灿烂甜美的笑容。",
                "icon": "😄",
                "label": "微笑",
                "image": "assets/illustrations/xiao_smile.svg",
                "strokes": 10,
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "睡",
                "pinyin": "shuì",
                "en": "sleep",
                "radical": "目",
                "words": [
                    "睡觉",
                    "睡眠",
                    "午睡"
                ],
                "sentence": "晚上早早盖好被子睡觉，明天一早精神百倍。",
                "icon": "😴",
                "label": "睡觉",
                "image": "assets/illustrations/shui_sleep.svg",
                "strokes": 13,
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "穿",
                "pinyin": "chuān",
                "en": "wear",
                "radical": "穴",
                "words": [
                    "穿衣",
                    "穿鞋",
                    "穿过"
                ],
                "sentence": "早上起床后，我自己穿好整洁的衣服去上学。",
                "icon": "👕",
                "label": "穿衣",
                "image": "assets/illustrations/chuan_wear.svg",
                "strokes": 9,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "洗",
                "pinyin": "xǐ",
                "en": "wash",
                "radical": "氵",
                "words": [
                    "洗手",
                    "洗脸",
                    "洗衣"
                ],
                "sentence": "吃饭前要把小手洗得干干净净，讲卫生不生病。",
                "icon": "🧼",
                "label": "洗手",
                "image": "assets/illustrations/xi_wash.svg",
                "strokes": 9,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "扫",
                "pinyin": "sǎo",
                "en": "sweep",
                "radical": "扌",
                "words": [
                    "打扫",
                    "扫地",
                    "扫把"
                ],
                "sentence": "我拿小扫把帮爸爸妈妈把地板扫得一尘不染。",
                "icon": "🧹",
                "label": "扫地",
                "image": "assets/illustrations/sao_sweep.svg",
                "strokes": 6,
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "拍",
                "pinyin": "pāi",
                "en": "clap / pat",
                "radical": "扌",
                "words": [
                    "拍手",
                    "拍球",
                    "拍照"
                ],
                "sentence": "伴着欢快的音乐节拍，大家一起开心地拍拍手。",
                "icon": "👏",
                "label": "拍球",
                "image": "assets/illustrations/pai_clap.svg",
                "strokes": 8,
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "拉",
                "pinyin": "lā",
                "en": "pull",
                "radical": "扌",
                "words": [
                    "拉手",
                    "拉车",
                    "拔河"
                ],
                "sentence": "好朋友手拉着手，排着整齐的队伍去操场。",
                "icon": "🤝",
                "label": "拉车",
                "image": "assets/illustrations/la_pull.svg",
                "strokes": 8,
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "推",
                "pinyin": "tuī",
                "en": "push",
                "radical": "扌",
                "words": [
                    "推车",
                    "推开",
                    "推动"
                ],
                "sentence": "推开窗户，清晨温暖的阳光和花香扑面而来。",
                "icon": "👐",
                "label": "推车",
                "image": "assets/illustrations/tui_push.svg",
                "strokes": 11,
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "吹",
                "pinyin": "chuī",
                "en": "blow",
                "radical": "口",
                "words": [
                    "吹风",
                    "吹泡泡",
                    "吹气"
                ],
                "sentence": "小朋友鼓起腮帮子，吹出了一串七彩的泡泡。",
                "icon": "🫧",
                "label": "吹泡",
                "image": "assets/illustrations/chui_blow.svg",
                "strokes": 7,
                "grade": "g1",
                "difficulty": 2
            }
        ]
    },
    {
        "id": "buildings",
        "name": "🏰 建筑交通",
        "color": "#2e86de",
        "chars": [
            {
                "char": "房",
                "pinyin": "fáng",
                "en": "house",
                "strokes": 8,
                "radical": "户",
                "words": [
                    "房屋",
                    "房间",
                    "楼房"
                ],
                "sentence": "阳光透过窗户洒满了整洁舒适的房间。",
                "icon": "🏠",
                "label": "房屋",
                "image": "assets/illustrations/fang.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "屋",
                "pinyin": "wū",
                "en": "room",
                "strokes": 9,
                "radical": "尸",
                "words": [
                    "房屋",
                    "屋子",
                    "木屋"
                ],
                "sentence": "森林里有一座童话般古朴的小木屋。",
                "icon": "🛖",
                "label": "屋子",
                "image": "assets/illustrations/wu_room.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "城",
                "pinyin": "chéng",
                "en": "city",
                "strokes": 9,
                "radical": "土",
                "words": [
                    "城市",
                    "城堡",
                    "城墙"
                ],
                "sentence": "长城像一条巨龙横卧在巍峨的崇山峻岭间。",
                "icon": "🏯",
                "label": "城市",
                "image": "assets/illustrations/cheng_castle.svg",
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "市",
                "pinyin": "shì",
                "en": "market",
                "strokes": 5,
                "radical": "巾",
                "words": [
                    "城市",
                    "市民",
                    "集市"
                ],
                "sentence": "现代化的大城市整洁美丽，交通四通八达。",
                "icon": "🏙️",
                "label": "集市",
                "image": "assets/illustrations/shi_market.svg",
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "街",
                "pinyin": "jiē",
                "en": "street",
                "strokes": 12,
                "radical": "行",
                "words": [
                    "街道",
                    "大街",
                    "逛街"
                ],
                "sentence": "走在繁华热闹的街道上，自觉遵守交通安全。",
                "icon": "🛣️",
                "label": "街道",
                "image": "assets/illustrations/jie_street.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "道",
                "pinyin": "dào",
                "en": "road",
                "strokes": 12,
                "radical": "辶",
                "words": [
                    "道路",
                    "大道",
                    "知道"
                ],
                "sentence": "通往成功的道路需要脚踏实地一步步走。",
                "icon": "🛤️",
                "label": "道路",
                "image": "assets/illustrations/dao_road.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "桥",
                "pinyin": "qiáo",
                "en": "bridge",
                "strokes": 10,
                "radical": "木",
                "words": [
                    "大桥",
                    "石桥",
                    "立交桥"
                ],
                "sentence": "宏伟的跨海大桥像飞虹横卧在碧波之上。",
                "icon": "🌉",
                "label": "大桥",
                "image": "assets/illustrations/qiao.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "亭",
                "pinyin": "tíng",
                "en": "pavilion",
                "strokes": 9,
                "radical": "亠",
                "words": [
                    "凉亭",
                    "长亭",
                    "亭台"
                ],
                "sentence": "雨后在荷花池边的红柱凉亭里小憩。",
                "icon": "⛩️",
                "label": "凉亭",
                "image": "assets/illustrations/ting.svg",
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "舟",
                "pinyin": "zhōu",
                "en": "boat",
                "strokes": 6,
                "radical": "舟",
                "words": [
                    "小舟",
                    "龙舟",
                    "神舟"
                ],
                "sentence": "端午节江面上敲锣打鼓赛龙舟。",
                "icon": "🛶",
                "label": "龙舟",
                "image": "assets/illustrations/zhou.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "船",
                "pinyin": "chuán",
                "en": "ship",
                "strokes": 11,
                "radical": "舟",
                "words": [
                    "轮船",
                    "帆船",
                    "小船"
                ],
                "sentence": "白色的帆船迎着金色的海风扬帆起航。",
                "icon": "🚢",
                "label": "轮船",
                "image": "assets/illustrations/chuan.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "车",
                "pinyin": "chē",
                "en": "car",
                "strokes": 4,
                "radical": "车",
                "words": [
                    "火车",
                    "汽车",
                    "自行车"
                ],
                "sentence": "乘坐飞驰的高铁列车领略祖国的大好山河。",
                "icon": "🚗",
                "label": "汽车",
                "image": "assets/illustrations/che.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "站",
                "pinyin": "zhàn",
                "en": "station",
                "strokes": 10,
                "radical": "立",
                "words": [
                    "车站",
                    "站点",
                    "站立"
                ],
                "sentence": "在公交站台耐心排队，文明礼让有序乘车。",
                "icon": "🚉",
                "label": "车站",
                "image": "assets/illustrations/zhan.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "路",
                "pinyin": "lù",
                "en": "road",
                "strokes": 13,
                "radical": "𧾷",
                "words": [
                    "马路",
                    "公路",
                    "道路"
                ],
                "sentence": "绿树成荫的林荫马路两旁盛开着各色鲜花。",
                "icon": "🛤️",
                "label": "马路",
                "image": "assets/illustrations/lu_road.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "轨",
                "pinyin": "guǐ",
                "en": "track",
                "strokes": 6,
                "radical": "车",
                "words": [
                    "铁轨",
                    "轨道",
                    "常轨"
                ],
                "sentence": "火车在平整光洁的钢轨上飞速疾驰。",
                "icon": "🚊",
                "label": "铁轨",
                "image": "assets/illustrations/gui_track.svg",
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "港",
                "pinyin": "gǎng",
                "en": "port",
                "strokes": 12,
                "radical": "氵",
                "words": [
                    "海港",
                    "港口",
                    "避风港"
                ],
                "sentence": "繁华热闹的海港里停泊着来自世界各地的巨轮。",
                "icon": "⚓",
                "label": "海港",
                "image": "assets/illustrations/gang.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "塔",
                "pinyin": "tǎ",
                "en": "tower",
                "strokes": 12,
                "radical": "土",
                "words": [
                    "高塔",
                    "宝塔",
                    "灯塔"
                ],
                "sentence": "夜色中明亮的灯塔指引着远航的船只回港。",
                "icon": "🗼",
                "label": "宝塔",
                "image": "assets/illustrations/ta.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "楼",
                "pinyin": "lóu",
                "en": "building",
                "strokes": 13,
                "radical": "木",
                "words": [
                    "楼房",
                    "大楼",
                    "高楼"
                ],
                "sentence": "登上一座高楼极目远眺，令人心旷神怡。",
                "icon": "🏢",
                "label": "大楼",
                "image": "assets/illustrations/lou.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "院",
                "pinyin": "yuàn",
                "en": "yard",
                "strokes": 9,
                "radical": "阝",
                "words": [
                    "庭院",
                    "院子",
                    "医院"
                ],
                "sentence": "农家小院里种满了香甜的葡萄和石榴。",
                "icon": "🏡",
                "label": "庭院",
                "image": "assets/illustrations/yuan.svg",
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "村",
                "pinyin": "cūn",
                "en": "village",
                "radical": "木",
                "words": [
                    "山村",
                    "农村",
                    "村庄"
                ],
                "sentence": "青山绿水间坐落着一个宁静美丽的小山村。",
                "icon": "🏡",
                "label": "山村",
                "image": "assets/illustrations/cun_village.svg",
                "strokes": 7,
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "乡",
                "pinyin": "xiāng",
                "en": "hometown",
                "radical": "乙",
                "words": [
                    "家乡",
                    "故乡",
                    "乡下"
                ],
                "sentence": "我的家乡有一条清澈见底的小河和金黄的稻田。",
                "icon": "🌾",
                "label": "家乡",
                "image": "assets/illustrations/xiang_hometown.svg",
                "strokes": 3,
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "园",
                "pinyin": "yuán",
                "en": "garden",
                "radical": "囗",
                "words": [
                    "公园",
                    "花园",
                    "果园"
                ],
                "sentence": "周末爸爸妈妈带我去公园赏花、放风筝。",
                "icon": "🏞️",
                "label": "公园",
                "image": "assets/illustrations/yuan_garden.svg",
                "strokes": 7,
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "场",
                "pinyin": "chǎng",
                "en": "field",
                "radical": "土",
                "words": [
                    "操场",
                    "广场",
                    "赛场"
                ],
                "sentence": "下课铃响了，同学们来到宽阔的操场上做运动。",
                "icon": "🏟️",
                "label": "操场",
                "image": "assets/illustrations/chang_field.svg",
                "strokes": 6,
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "店",
                "pinyin": "diàn",
                "en": "shop",
                "radical": "广",
                "words": [
                    "书店",
                    "商店",
                    "花店"
                ],
                "sentence": "街角的书店里摆满了五彩缤纷的儿童绘本。",
                "icon": "🏪",
                "label": "商店",
                "image": "assets/illustrations/dian_shop.svg",
                "strokes": 8,
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "机",
                "pinyin": "jī",
                "en": "airplane",
                "radical": "木",
                "words": [
                    "飞机",
                    "机器",
                    "手机"
                ],
                "sentence": "银白色的飞机穿过洁白的云层，在蓝天高高飞翔。",
                "icon": "✈️",
                "label": "飞机",
                "image": "assets/illustrations/ji_plane.svg",
                "strokes": 6,
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "铁",
                "pinyin": "tiě",
                "en": "iron / subway",
                "radical": "钅",
                "words": [
                    "地铁",
                    "高铁",
                    "磁铁"
                ],
                "sentence": "神奇的马蹄形磁铁能把铁钉稳稳地吸起来。",
                "icon": "🧲",
                "label": "磁铁",
                "image": "assets/illustrations/tie_iron.svg",
                "strokes": 10,
                "grade": "g3",
                "difficulty": 3
            }
        ]
    },
    {
        "id": "tradition",
        "name": "🏮 传统佳节",
        "color": "#ee5253",
        "chars": [
            {
                "char": "节",
                "pinyin": "jié",
                "en": "festival",
                "strokes": 5,
                "radical": "艹",
                "words": [
                    "节日",
                    "中秋节",
                    "端午节"
                ],
                "sentence": "春节是我们中华民族最热闹团圆的传统佳节。",
                "icon": "🎋",
                "label": "佳节",
                "image": "assets/illustrations/jie_festival.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "年",
                "pinyin": "nián",
                "en": "year",
                "strokes": 6,
                "radical": "干",
                "words": [
                    "新年",
                    "过年",
                    "拜年"
                ],
                "sentence": "过年穿新衣戴新帽，大家欢欢喜喜互相拜年。",
                "icon": "🧧",
                "label": "过年",
                "image": "assets/illustrations/nian.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "喜",
                "pinyin": "xǐ",
                "en": "joy",
                "strokes": 12,
                "radical": "口",
                "words": [
                    "欢喜",
                    "喜欢",
                    "喜悦"
                ],
                "sentence": "全家人围坐在一起吃团圆饭，心里满是喜悦。",
                "icon": "🥳",
                "label": "欢喜",
                "image": "assets/illustrations/xi_joy.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "庆",
                "pinyin": "qìng",
                "en": "celebrate",
                "strokes": 6,
                "radical": "广",
                "words": [
                    "庆祝",
                    "欢庆",
                    "国庆"
                ],
                "sentence": "锣鼓喧天欢庆国庆节，到处洋溢着节日气氛。",
                "icon": "🎉",
                "label": "国庆",
                "image": "assets/illustrations/qing_celebrate.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "贺",
                "pinyin": "hè",
                "en": "congratulate",
                "strokes": 9,
                "radical": "贝",
                "words": [
                    "祝贺",
                    "恭贺",
                    "贺卡"
                ],
                "sentence": "亲手制作一张漂亮的贺卡，写下对老师的祝福。",
                "icon": "💌",
                "label": "祝贺",
                "image": "assets/illustrations/he_congratulate.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "灯",
                "pinyin": "dēng",
                "en": "lantern",
                "strokes": 6,
                "radical": "火",
                "words": [
                    "花灯",
                    "红灯",
                    "彩灯"
                ],
                "sentence": "元宵节夜晚，街上挂满了五彩缤纷的花灯。",
                "icon": "🏮",
                "label": "花灯",
                "image": "assets/illustrations/deng_lantern.svg",
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "谜",
                "pinyin": "mí",
                "en": "riddle",
                "strokes": 11,
                "radical": "讠",
                "words": [
                    "字谜",
                    "谜语",
                    "猜谜"
                ],
                "sentence": "元宵猜字谜既开动脑筋，又格外有趣。",
                "icon": "❓",
                "label": "字谜",
                "image": "assets/illustrations/mi_riddle.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "饼",
                "pinyin": "bǐng",
                "en": "pastry",
                "strokes": 9,
                "radical": "饣",
                "words": [
                    "月饼",
                    "春饼",
                    "烧饼"
                ],
                "sentence": "中秋之夜一边赏满月，一边品尝香甜的月饼。",
                "icon": "🥮",
                "label": "月饼",
                "image": "assets/illustrations/bing_mooncake.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "团",
                "pinyin": "tuán",
                "en": "reunion",
                "strokes": 6,
                "radical": "囗",
                "words": [
                    "团圆",
                    "团结",
                    "团聚"
                ],
                "sentence": "中秋佳节月儿圆，阖家团聚笑开颜。",
                "icon": "👨‍👩‍👧‍👦",
                "label": "团聚",
                "image": "assets/illustrations/tuan_reunion.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "圆",
                "pinyin": "yuán",
                "en": "round",
                "strokes": 10,
                "radical": "囗",
                "words": [
                    "团圆",
                    "圆满",
                    "圆形"
                ],
                "sentence": "十五的月亮圆又圆，像一个大大的金盘。",
                "icon": "🌕",
                "label": "团圆",
                "image": "assets/illustrations/yuan_tangyuan.svg",
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "粽",
                "pinyin": "zòng",
                "en": "rice dumpling",
                "strokes": 14,
                "radical": "米",
                "words": [
                    "粽子",
                    "香粽",
                    "米粽"
                ],
                "sentence": "端午节吃香软糯的竹叶粽，纪念爱国诗人屈原。",
                "icon": "🍙",
                "label": "粽子",
                "image": "assets/illustrations/zong_dumpling.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "鼓",
                "pinyin": "gǔ",
                "en": "drum",
                "strokes": 13,
                "radical": "鼓",
                "words": [
                    "大鼓",
                    "打鼓",
                    "鼓声"
                ],
                "sentence": "龙舟争霸赛上，震耳欲聋的鼓声振奋人心。",
                "icon": "🥁",
                "label": "打鼓",
                "image": "assets/illustrations/gu_drum.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "旗",
                "pinyin": "qí",
                "en": "flag",
                "strokes": 14,
                "radical": "方",
                "words": [
                    "国旗",
                    "彩旗",
                    "旗帜"
                ],
                "sentence": "迎风飘扬的鲜艳旗帜将节日装扮得分外美丽。",
                "icon": "🚩",
                "label": "旗帜",
                "image": "assets/illustrations/qi_flag.svg",
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "联",
                "pinyin": "lián",
                "en": "couplet",
                "strokes": 12,
                "radical": "耳",
                "words": [
                    "春联",
                    "联欢",
                    "对联"
                ],
                "sentence": "大年三十贴春联，辞旧迎新福气满堂。",
                "icon": "🧧",
                "label": "春联",
                "image": "assets/illustrations/lian_couplet.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "钟",
                "pinyin": "zhōng",
                "en": "clock / bell",
                "strokes": 9,
                "radical": "钅",
                "words": [
                    "时钟",
                    "敲钟",
                    "钟声"
                ],
                "sentence": "新年零点的钟声敲响，迎来了崭新的一年。",
                "icon": "🔔",
                "label": "时钟",
                "image": "assets/illustrations/zhong_bell.svg",
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "戏",
                "pinyin": "xì",
                "en": "play",
                "strokes": 6,
                "radical": "戈",
                "words": [
                    "京戏",
                    "唱戏",
                    "游戏"
                ],
                "sentence": "传统京戏唱腔悠扬，舞台服饰色彩斑斓夺目。",
                "icon": "🎭",
                "label": "京戏",
                "image": "assets/illustrations/xi_opera.svg",
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "福",
                "pinyin": "fú",
                "en": "blessing",
                "strokes": 13,
                "radical": "礻",
                "words": [
                    "福气",
                    "幸福",
                    "祝福"
                ],
                "sentence": "门上贴上了大大的红福字，象征着幸福美满。",
                "icon": "🧧",
                "label": "福气",
                "image": "assets/illustrations/fu_blessing.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "愿",
                "pinyin": "yuàn",
                "en": "wish",
                "strokes": 14,
                "radical": "心",
                "words": [
                    "心愿",
                    "祝愿",
                    "愿望"
                ],
                "sentence": "新的一年，愿祖国繁荣昌盛，大家幸福健康。",
                "icon": "🌠",
                "label": "心愿",
                "image": "assets/illustrations/yuan_wish.svg",
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "国",
                "pinyin": "guó",
                "en": "country",
                "radical": "囗",
                "words": [
                    "祖国",
                    "中国",
                    "国家"
                ],
                "sentence": "我们热爱美丽的祖国，祝愿祖国繁荣富强。",
                "icon": "🇨🇳",
                "label": "祖国",
                "image": "assets/illustrations/guo_country.svg",
                "strokes": 8,
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "华",
                "pinyin": "huá",
                "en": "splendid",
                "radical": "十",
                "words": [
                    "中华",
                    "华夏",
                    "华丽"
                ],
                "sentence": "中华传统文化源远流长，汉字是璀璨的瑰宝。",
                "icon": "🏮",
                "label": "中华",
                "image": "assets/illustrations/hua_splendid.svg",
                "strokes": 6,
                "grade": "g3",
                "difficulty": 2
            },
            {
                "char": "京",
                "pinyin": "jīng",
                "en": "capital",
                "radical": "亠",
                "words": [
                    "北京",
                    "京城",
                    "京剧"
                ],
                "sentence": "北京是中国的首都，有雄伟壮观的天安门。",
                "icon": "🏯",
                "label": "北京",
                "image": "assets/illustrations/jing_capital.svg",
                "strokes": 8,
                "grade": "g3",
                "difficulty": 3
            }
        ]
    },
    {
        "id": "daily",
        "name": "🏠 生活日常",
        "color": "#0ea5e9",
        "chars": [
            {
                "char": "衣",
                "pinyin": "yī",
                "en": "clothes",
                "radical": "衣",
                "words": [
                    "衣服",
                    "上衣",
                    "毛衣"
                ],
                "sentence": "天冷了，妈妈给我穿上温暖舒适的毛衣。",
                "icon": "👚",
                "label": "衣服",
                "image": "assets/illustrations/yi_clothes.svg",
                "strokes": 6,
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "帽",
                "pinyin": "mào",
                "en": "hat",
                "radical": "巾",
                "words": [
                    "帽子",
                    "草帽",
                    "礼帽"
                ],
                "sentence": "夏天出门戴上遮阳草帽，就不怕太阳晒啦。",
                "icon": "👒",
                "label": "帽子",
                "image": "assets/illustrations/mao_hat.svg",
                "strokes": 12,
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "鞋",
                "pinyin": "xié",
                "en": "shoe",
                "radical": "革",
                "words": [
                    "鞋子",
                    "球鞋",
                    "穿鞋"
                ],
                "sentence": "穿上轻便的运动鞋，我们在跑道上跑得飞快。",
                "icon": "👟",
                "label": "球鞋",
                "image": "assets/illustrations/xie_shoe.svg",
                "strokes": 15,
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "袜",
                "pinyin": "wà",
                "en": "sock",
                "radical": "衤",
                "words": [
                    "袜子",
                    "棉袜",
                    "穿袜"
                ],
                "sentence": "柔软的条纹棉袜把小脚丫包裹得暖洋洋的。",
                "icon": "🧦",
                "label": "袜子",
                "image": "assets/illustrations/wa_sock.svg",
                "strokes": 10,
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "伞",
                "pinyin": "sǎn",
                "en": "umbrella",
                "radical": "人",
                "words": [
                    "雨伞",
                    "打伞",
                    "花伞"
                ],
                "sentence": "下雨啦，撑起五颜六色的小雨伞走在雨中。",
                "icon": "☂️",
                "label": "雨伞",
                "image": "assets/illustrations/san_umbrella.svg",
                "strokes": 6,
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "刀",
                "pinyin": "dāo",
                "en": "knife",
                "radical": "刀",
                "words": [
                    "小刀",
                    "剪刀",
                    "切刀"
                ],
                "sentence": "使用手工剪刀和小刀时一定要格外小心安全。",
                "icon": "🔪",
                "label": "小刀",
                "image": "assets/illustrations/dao_knife.svg",
                "strokes": 2,
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "尺",
                "pinyin": "chǐ",
                "en": "ruler",
                "radical": "尸",
                "words": [
                    "尺子",
                    "直尺",
                    "尺寸"
                ],
                "sentence": "用直尺比着画线，画出来的线条又平又直。",
                "icon": "📏",
                "label": "尺子",
                "image": "assets/illustrations/chi_ruler.svg",
                "strokes": 4,
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "包",
                "pinyin": "bāo",
                "en": "bag",
                "radical": "勹",
                "words": [
                    "书包",
                    "背包",
                    "面包"
                ],
                "sentence": "每天睡前我都会自己整理好第二天上学背的书包。",
                "icon": "🎒",
                "label": "书包",
                "image": "assets/illustrations/bao_bag.svg",
                "strokes": 5,
                "grade": "k",
                "difficulty": 1
            },
            {
                "char": "床",
                "pinyin": "chuáng",
                "en": "bed",
                "radical": "广",
                "words": [
                    "小床",
                    "起床",
                    "木床"
                ],
                "sentence": "清晨闹钟响了，我立刻从温暖的小床上起床。",
                "icon": "🛏️",
                "label": "小床",
                "image": "assets/illustrations/chuang_bed.svg",
                "strokes": 7,
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "桌",
                "pinyin": "zhuō",
                "en": "desk",
                "radical": "木",
                "words": [
                    "书桌",
                    "桌子",
                    "课桌"
                ],
                "sentence": "我的小书桌上整齐地摆放着课本和台灯。",
                "icon": "🪑",
                "label": "书桌",
                "image": "assets/illustrations/zhuo_desk.svg",
                "strokes": 10,
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "椅",
                "pinyin": "yǐ",
                "en": "chair",
                "radical": "木",
                "words": [
                    "椅子",
                    "木椅",
                    "桌椅"
                ],
                "sentence": "坐在椅子上写字时，要保持腰背挺直的好姿势。",
                "icon": "🪑",
                "label": "椅子",
                "image": "assets/illustrations/yi_chair.svg",
                "strokes": 12,
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "窗",
                "pinyin": "chuāng",
                "en": "window",
                "radical": "穴",
                "words": [
                    "窗户",
                    "窗台",
                    "窗帘"
                ],
                "sentence": "明亮的窗户外面是一片翠绿的草地和蓝天。",
                "icon": "🪟",
                "label": "窗户",
                "image": "assets/illustrations/chuang_window.svg",
                "strokes": 12,
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "球",
                "pinyin": "qiú",
                "en": "ball",
                "radical": "王",
                "words": [
                    "皮球",
                    "足球",
                    "地球"
                ],
                "sentence": "圆圆的皮球在地上拍一拍，高高地跳了起来。",
                "icon": "🏀",
                "label": "皮球",
                "image": "assets/illustrations/qiu_ball.svg",
                "strokes": 11,
                "grade": "k",
                "difficulty": 2
            },
            {
                "char": "镜",
                "pinyin": "jìng",
                "en": "mirror",
                "radical": "钅",
                "words": [
                    "镜子",
                    "眼镜",
                    "放大镜"
                ],
                "sentence": "出门前照一照镜子，看看衣帽有没有穿戴整齐。",
                "icon": "🪞",
                "label": "镜子",
                "image": "assets/illustrations/jing_mirror.svg",
                "strokes": 16,
                "grade": "g3",
                "difficulty": 3
            },
            {
                "char": "冷",
                "pinyin": "lěng",
                "en": "cold",
                "radical": "冫",
                "words": [
                    "寒冷",
                    "冰冷",
                    "冷热"
                ],
                "sentence": "冬天的北风呼呼吹，天气变得十分寒冷。",
                "icon": "🥶",
                "label": "寒冷",
                "image": "assets/illustrations/leng_cold.svg",
                "strokes": 7,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "热",
                "pinyin": "rè",
                "en": "hot",
                "radical": "灬",
                "words": [
                    "炎热",
                    "火热",
                    "热水"
                ],
                "sentence": "夏天的太阳火辣辣地照着，天气真炎热。",
                "icon": "🥵",
                "label": "炎热",
                "image": "assets/illustrations/re_hot.svg",
                "strokes": 10,
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "慢",
                "pinyin": "màn",
                "en": "slow",
                "radical": "忄",
                "words": [
                    "快慢",
                    "慢慢",
                    "缓慢"
                ],
                "sentence": "小蜗牛背着重重的壳，在树叶上一步一步慢慢爬。",
                "icon": "🐌",
                "label": "缓慢",
                "image": "assets/illustrations/man_slow.svg",
                "strokes": 14,
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "新",
                "pinyin": "xīn",
                "en": "new",
                "radical": "斤",
                "words": [
                    "崭新",
                    "新年",
                    "新衣"
                ],
                "sentence": "新学期开始了，老师发给我们崭新的语文课本。",
                "icon": "✨",
                "label": "崭新",
                "image": "assets/illustrations/xin_new.svg",
                "strokes": 13,
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "旧",
                "pinyin": "jiù",
                "en": "old",
                "radical": "日",
                "words": [
                    "新旧",
                    "陈旧",
                    "旧书"
                ],
                "sentence": "虽然这件衣服旧了，但洗得干干净净一样舒适。",
                "icon": "🕰️",
                "label": "新旧",
                "image": "assets/illustrations/jiu_old.svg",
                "strokes": 5,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "轻",
                "pinyin": "qīng",
                "en": "light",
                "radical": "车",
                "words": [
                    "轻轻",
                    "轻重",
                    "轻巧"
                ],
                "sentence": "洁白的羽毛轻轻地飘落在碧绿的草地上。",
                "icon": "🪶",
                "label": "轻轻",
                "image": "assets/illustrations/qing_light.svg",
                "strokes": 9,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "重",
                "pinyin": "zhòng",
                "en": "heavy",
                "radical": "里",
                "words": [
                    "沉重",
                    "轻重",
                    "重量"
                ],
                "sentence": "这个铁秤砣拿在手里沉甸甸的，真重呀。",
                "icon": "🏋️",
                "label": "重量",
                "image": "assets/illustrations/zhong_heavy.svg",
                "strokes": 9,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "干",
                "pinyin": "gān",
                "en": "dry",
                "radical": "干",
                "words": [
                    "干净",
                    "晒干",
                    "饼干"
                ],
                "sentence": "洗好的衣服挂在温暖的阳光下，很快就晒干了。",
                "icon": "👕",
                "label": "晒干",
                "image": "assets/illustrations/gan_dry.svg",
                "strokes": 3,
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "净",
                "pinyin": "jìng",
                "en": "clean",
                "radical": "冫",
                "words": [
                    "干净",
                    "洁净",
                    "明亮"
                ],
                "sentence": "擦完的盘子和玻璃窗亮晶晶的，真干净。",
                "icon": "✨",
                "label": "干净",
                "image": "assets/illustrations/jing_clean.svg",
                "strokes": 8,
                "grade": "g1",
                "difficulty": 2
            },
            {
                "char": "粗",
                "pinyin": "cū",
                "en": "thick",
                "radical": "米",
                "words": [
                    "粗细",
                    "粗壮",
                    "粗大"
                ],
                "sentence": "村口那棵百年老槐树的树干又粗又壮。",
                "icon": "🪵",
                "label": "粗壮",
                "image": "assets/illustrations/cu_thick.svg",
                "strokes": 11,
                "grade": "g2",
                "difficulty": 3
            },
            {
                "char": "细",
                "pinyin": "xì",
                "en": "thin / fine",
                "radical": "纟",
                "words": [
                    "粗细",
                    "细线",
                    "仔细"
                ],
                "sentence": "春雨像牛毛、像细丝一样密密地洒向大地。",
                "icon": "🧵",
                "label": "细丝",
                "image": "assets/illustrations/xi_thin.svg",
                "strokes": 8,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "胖",
                "pinyin": "pàng",
                "en": "chubby",
                "radical": "月",
                "words": [
                    "胖瘦",
                    "胖乎乎",
                    "小胖"
                ],
                "sentence": "胖乎乎的大熊猫抱着竹子吃得津津有味。",
                "icon": "🐼",
                "label": "胖瘦",
                "image": "assets/illustrations/pang_chubby.svg",
                "strokes": 9,
                "grade": "g2",
                "difficulty": 2
            },
            {
                "char": "瘦",
                "pinyin": "shòu",
                "en": "slender",
                "radical": "疒",
                "words": [
                    "胖瘦",
                    "瘦小",
                    "苗条"
                ],
                "sentence": "经常参加体育锻炼，身体结实匀称不挑食。",
                "icon": "🏃",
                "label": "瘦小",
                "image": "assets/illustrations/shou_thin.svg",
                "strokes": 14,
                "grade": "g2",
                "difficulty": 3
            }
        ]
    }
];

const COMMON_PINYIN_MAP = {
    "龙": {
        "pinyin": "lóng",
        "en": "dragon",
        "strokes": 5,
        "radical": "龙",
        "words": [
            "飞龙",
            "龙舟"
        ]
    },
    "虎": {
        "pinyin": "hǔ",
        "en": "tiger",
        "strokes": 8,
        "radical": "虍",
        "words": [
            "老虎",
            "白虎"
        ]
    },
    "文": {
        "pinyin": "wén",
        "en": "culture",
        "strokes": 4,
        "radical": "文",
        "words": [
            "文化",
            "语文"
        ]
    },
    "中": {
        "pinyin": "zhōng",
        "en": "middle",
        "strokes": 4,
        "radical": "丨",
        "words": [
            "中国",
            "中间"
        ]
    },
    "华": {
        "pinyin": "huá",
        "en": "splendid",
        "strokes": 6,
        "radical": "十",
        "words": [
            "中华",
            "华丽"
        ]
    },
    "国": {
        "pinyin": "guó",
        "en": "country",
        "strokes": 8,
        "radical": "囗",
        "words": [
            "国家",
            "国旗"
        ]
    },
    "美": {
        "pinyin": "měi",
        "en": "beautiful",
        "strokes": 9,
        "radical": "羊",
        "words": [
            "美丽",
            "美好"
        ]
    },
    "爱": {
        "pinyin": "ài",
        "en": "love",
        "strokes": 10,
        "radical": "爫",
        "words": [
            "可爱",
            "关爱"
        ]
    },
    "好": {
        "pinyin": "hǎo",
        "en": "good",
        "strokes": 6,
        "radical": "女",
        "words": [
            "好人",
            "良好"
        ]
    },
    "我": {
        "pinyin": "wǒ",
        "en": "I / me",
        "strokes": 7,
        "radical": "戈",
        "words": [
            "我们",
            "自我"
        ]
    },
    "你": {
        "pinyin": "nǐ",
        "en": "you",
        "strokes": 7,
        "radical": "亻",
        "words": [
            "你好",
            "你们"
        ]
    },
    "他": {
        "pinyin": "tā",
        "en": "he",
        "strokes": 5,
        "radical": "亻",
        "words": [
            "他们",
            "他人"
        ]
    },
    "她": {
        "pinyin": "tā",
        "en": "she",
        "strokes": 6,
        "radical": "女",
        "words": [
            "她们",
            "她俩"
        ]
    },
    "它": {
        "pinyin": "tā",
        "en": "it",
        "strokes": 5,
        "radical": "宀",
        "words": [
            "它们",
            "其它"
        ]
    },
    "乐": {
        "pinyin": "lè",
        "en": "joy",
        "strokes": 5,
        "radical": "丿",
        "words": [
            "快乐",
            "音乐"
        ]
    },
    "欢": {
        "pinyin": "huān",
        "en": "happy",
        "strokes": 6,
        "radical": "又",
        "words": [
            "欢乐",
            "喜欢"
        ]
    },
    "福": {
        "pinyin": "fú",
        "en": "blessing",
        "strokes": 13,
        "radical": "礻",
        "words": [
            "幸福",
            "福气"
        ]
    },
    "春": {
        "pinyin": "chūn",
        "en": "spring",
        "strokes": 9,
        "radical": "日",
        "words": [
            "春天",
            "春雨"
        ]
    },
    "江": {
        "pinyin": "jiāng",
        "en": "river",
        "strokes": 6,
        "radical": "氵",
        "words": [
            "长江",
            "江河"
        ]
    },
    "河": {
        "pinyin": "hé",
        "en": "river",
        "strokes": 8,
        "radical": "氵",
        "words": [
            "黄河",
            "小河"
        ]
    },
    "湖": {
        "pinyin": "hú",
        "en": "lake",
        "strokes": 12,
        "radical": "氵",
        "words": [
            "西湖",
            "湖水"
        ]
    },
    "海": {
        "pinyin": "hǎi",
        "en": "sea",
        "strokes": 10,
        "radical": "氵",
        "words": [
            "大海",
            "海洋"
        ]
    },
    "金": {
        "pinyin": "jīn",
        "en": "gold",
        "strokes": 8,
        "radical": "金",
        "words": [
            "金子",
            "金秋"
        ]
    },
    "安": {
        "pinyin": "ān",
        "en": "safe",
        "strokes": 6,
        "radical": "宀",
        "words": [
            "平安",
            "安静"
        ]
    },
    "康": {
        "pinyin": "kāng",
        "en": "healthy",
        "strokes": 11,
        "radical": "广",
        "words": [
            "健康",
            "小康"
        ]
    },
    "吉": {
        "pinyin": "jí",
        "en": "lucky",
        "strokes": 6,
        "radical": "口",
        "words": [
            "吉祥",
            "吉利"
        ]
    },
    "祥": {
        "pinyin": "xiáng",
        "en": "auspicious",
        "strokes": 10,
        "radical": "礻",
        "words": [
            "吉祥",
            "慈祥"
        ]
    },
    "平": {
        "pinyin": "píng",
        "en": "peaceful",
        "strokes": 5,
        "radical": "干",
        "words": [
            "平时",
            "和平"
        ]
    },
    "盛": {
        "pinyin": "shèng",
        "en": "flourishing",
        "strokes": 11,
        "radical": "皿",
        "words": [
            "盛开",
            "盛大"
        ]
    },
    "世": {
        "pinyin": "shì",
        "en": "world",
        "strokes": 5,
        "radical": "一",
        "words": [
            "世界",
            "世纪"
        ]
    },
    "宝": {
        "pinyin": "bǎo",
        "en": "treasure",
        "strokes": 8,
        "radical": "宀",
        "words": [
            "宝贝",
            "宝物"
        ]
    },
    "贝": {
        "pinyin": "bèi",
        "en": "shell",
        "strokes": 4,
        "radical": "贝",
        "words": [
            "贝壳",
            "分贝"
        ]
    },
    "星": {
        "pinyin": "xīng",
        "en": "star",
        "strokes": 9,
        "radical": "日",
        "words": [
            "星星",
            "星空"
        ]
    },
    "光": {
        "pinyin": "guāng",
        "en": "light",
        "strokes": 6,
        "radical": "儿",
        "words": [
            "阳光",
            "光明"
        ]
    },
    "明": {
        "pinyin": "míng",
        "en": "bright",
        "strokes": 8,
        "radical": "日",
        "words": [
            "明天",
            "明亮"
        ]
    },
    "聪": {
        "pinyin": "cōng",
        "en": "clever",
        "strokes": 15,
        "radical": "耳",
        "words": [
            "聪明",
            "失聪"
        ]
    },
    "智": {
        "pinyin": "zhì",
        "en": "wisdom",
        "strokes": 12,
        "radical": "日",
        "words": [
            "智慧",
            "智力"
        ]
    },
    "慧": {
        "pinyin": "huì",
        "en": "intelligent",
        "strokes": 15,
        "radical": "心",
        "words": [
            "智慧",
            "慧眼"
        ]
    },
    "勤": {
        "pinyin": "qín",
        "en": "diligent",
        "strokes": 13,
        "radical": "力",
        "words": [
            "勤劳",
            "勤奋"
        ]
    },
    "奋": {
        "pinyin": "fèn",
        "en": "strive",
        "strokes": 8,
        "radical": "大",
        "words": [
            "奋斗",
            "兴奋"
        ]
    },
    "勇": {
        "pinyin": "yǒng",
        "en": "brave",
        "strokes": 9,
        "radical": "力",
        "words": [
            "勇敢",
            "英勇"
        ]
    },
    "敢": {
        "pinyin": "gǎn",
        "en": "dare",
        "strokes": 11,
        "radical": "攵",
        "words": [
            "勇敢",
            "敢作"
        ]
    },
    "坚": {
        "pinyin": "jiān",
        "en": "firm",
        "strokes": 7,
        "radical": "土",
        "words": [
            "坚强",
            "坚持"
        ]
    },
    "强": {
        "pinyin": "qiáng",
        "en": "strong",
        "strokes": 12,
        "radical": "弓",
        "words": [
            "强大",
            "坚强"
        ]
    },
    "宇": {
        "pinyin": "yǔ",
        "en": "cosmos",
        "strokes": 6,
        "radical": "宀",
        "words": [
            "宇宙",
            "屋宇"
        ]
    },
    "宙": {
        "pinyin": "zhòu",
        "en": "universe",
        "strokes": 8,
        "radical": "宀",
        "words": [
            "宇宙"
        ]
    },
    "舟": {
        "pinyin": "zhōu",
        "en": "boat",
        "strokes": 6,
        "radical": "舟",
        "words": [
            "神舟",
            "龙舟"
        ]
    },
    "车": {
        "pinyin": "chē",
        "en": "car",
        "strokes": 4,
        "radical": "车",
        "words": [
            "火车",
            "汽车"
        ]
    },
    "船": {
        "pinyin": "chuán",
        "en": "ship",
        "strokes": 11,
        "radical": "舟",
        "words": [
            "小船",
            "飞船"
        ]
    },
    "旗": {
        "pinyin": "qí",
        "en": "flag",
        "strokes": 14,
        "radical": "方",
        "words": [
            "红旗",
            "国旗"
        ]
    },
    "庆": {
        "pinyin": "qìng",
        "en": "celebrate",
        "strokes": 6,
        "radical": "广",
        "words": [
            "欢庆",
            "校庆"
        ]
    },
    "贺": {
        "pinyin": "hè",
        "en": "congratulate",
        "strokes": 9,
        "radical": "贝",
        "words": [
            "祝贺",
            "贺卡"
        ]
    },
    "年": {
        "pinyin": "nián",
        "en": "year",
        "strokes": 6,
        "radical": "干",
        "words": [
            "新年",
            "少年"
        ]
    },
    "神": {
        "pinyin": "shén",
        "en": "magical",
        "strokes": 9,
        "radical": "礻",
        "words": [
            "神奇",
            "精神"
        ]
    },
    "奇": {
        "pinyin": "qí",
        "en": "curious",
        "strokes": 8,
        "radical": "大",
        "words": [
            "好奇",
            "奇妙"
        ]
    },
    "创": {
        "pinyin": "chuàng",
        "en": "create",
        "strokes": 6,
        "radical": "刂",
        "words": [
            "创造",
            "创新"
        ]
    },
    "造": {
        "pinyin": "zào",
        "en": "make",
        "strokes": 10,
        "radical": "辶",
        "words": [
            "制造",
            "创造"
        ]
    },
    "梦": {
        "pinyin": "mèng",
        "en": "dream",
        "strokes": 11,
        "radical": "木",
        "words": [
            "梦想",
            "美梦"
        ]
    },
    "想": {
        "pinyin": "xiǎng",
        "en": "think",
        "strokes": 13,
        "radical": "心",
        "words": [
            "思考",
            "梦想"
        ]
    },
    "科": {
        "pinyin": "kē",
        "en": "science",
        "strokes": 9,
        "radical": "禾",
        "words": [
            "科学",
            "科技"
        ]
    },
    "技": {
        "pinyin": "jì",
        "en": "technology",
        "strokes": 7,
        "radical": "扌",
        "words": [
            "技术",
            "技能"
        ]
    },
    "成": {
        "pinyin": "chéng",
        "en": "succeed",
        "strokes": 6,
        "radical": "戈",
        "words": [
            "成功",
            "成长"
        ]
    },
    "长": {
        "pinyin": "zhǎng",
        "en": "grow",
        "strokes": 4,
        "radical": "长",
        "words": [
            "长大",
            "成长"
        ]
    },
    "功": {
        "pinyin": "gōng",
        "en": "achievement",
        "strokes": 5,
        "radical": "力",
        "words": [
            "功夫",
            "成功"
        ]
    }
};

// 自动构建全局快速索引表（消除重复硬编码，保持 O(1) 查询与向下兼容）
const _CHAR_INDEX_MAP = {};
window.CHARACTER_EN_MAP = {};
window.CHARACTER_ILLUSTRATION_MAP = {};

for (const _cat of CHARACTER_CATEGORIES) {
    for (const _item of (_cat.chars || [])) {
        if (_item.image && !_item.image.includes('?')) {
            _item.image = _item.image + '?v=17';
        }
        if (!_CHAR_INDEX_MAP[_item.char]) {
            _CHAR_INDEX_MAP[_item.char] = { ..._item, category: _cat.name };
        }
        if (_item.en) window.CHARACTER_EN_MAP[_item.char] = _item.en;
        if (_item.image) window.CHARACTER_ILLUSTRATION_MAP[_item.char] = _item.image;
    }
}
for (const [_k, _v] of Object.entries(COMMON_PINYIN_MAP)) {
    if (_v.en && !window.CHARACTER_EN_MAP[_k]) window.CHARACTER_EN_MAP[_k] = _v.en;
}

/**
 * 获取汉字详细信息
 * 如果在预设库中则 O(1) 直接返回，否则返回动态构造的信息
 */
function getCharInfo(char) {
    if (!char || char.length === 0) return null;
    const target = char.charAt(0);

    // 1. 在预设库索引中 O(1) 查找
    if (_CHAR_INDEX_MAP[target]) {
        const found = _CHAR_INDEX_MAP[target];
        return {
            ...found,
            image: (window.CHARACTER_ILLUSTRATION_MAP && window.CHARACTER_ILLUSTRATION_MAP[target]) || found.image
        };
    }

    // 2. 在常见对照表中寻找
    if (COMMON_PINYIN_MAP[target]) {
        return {
            char: target,
            pinyin: COMMON_PINYIN_MAP[target].pinyin,
            en: COMMON_PINYIN_MAP[target].en || '',
            strokes: COMMON_PINYIN_MAP[target].strokes,
            radical: COMMON_PINYIN_MAP[target].radical,
            words: COMMON_PINYIN_MAP[target].words,
            sentence: `认真练好“${target}”字，成为小小书法家！`,
            icon: COMMON_PINYIN_MAP[target].icon || '✏️',
            label: COMMON_PINYIN_MAP[target].words[0] || target,
            category: '自定义练习'
        };
    }

    // 3. 通用兜底
    return {
        char: target,
        pinyin: 'hàn zì',
        en: 'character',
        strokes: '多',
        radical: '常用',
        words: [`练习“${target}”`],
        sentence: `跟着笔顺一笔一画练习“${target}”字吧！`,
        icon: '✍️',
        label: `练习“${target}”`,
        category: '自定义练习'
    };
}

window.CHARACTER_GRADES = CHARACTER_GRADES;
window.CHARACTER_DIFFICULTIES = CHARACTER_DIFFICULTIES;
window.CHARACTER_CATEGORIES = CHARACTER_CATEGORIES;
window.getCharInfo = getCharInfo;
