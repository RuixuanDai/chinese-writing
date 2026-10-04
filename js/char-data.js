/**
 * char-data.js - 汉字题库与分类字典
 * 精选适合少儿启蒙、小学1-3年级的常用汉字 (近300字)，涵盖11大趣味主题，配备精准拼音、看图识字插画、部首、笔画、词组和童趣例句
 */

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
                "image": "assets/illustrations/yi_one.jpg"
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
                "image": "assets/illustrations/er_two.jpg"
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
                "image": "assets/illustrations/san_three.jpg"
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
                "label": "十个"
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
                "label": "人们"
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
                "label": "门口"
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
                "image": "assets/illustrations/da_big.jpg"
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
                "image": "assets/illustrations/xiao_small.jpg"
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
                "label": "向上"
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
                "label": "向下"
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
                "label": "红日"
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
                "label": "月亮"
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
                "label": "清水"
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
                "label": "火焰"
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
                "label": "高山"
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
                "label": "石头"
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
                "label": "稻田"
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
                "label": "泥土"
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
                "label": "树木"
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
                "image": "assets/illustrations/tian_sky.svg"
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
                "label": "孩子"
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
                "label": "中间"
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
                "label": "文化"
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
                "image": "assets/illustrations/bai_white.svg"
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
                "label": "大门"
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
                "label": "白云"
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
                "label": "春风"
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
                "label": "细雨"
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
                "label": "禾苗"
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
                "image": "assets/illustrations/ji_few.jpg"
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
                "label": "太阳"
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
                "label": "生长"
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
                "image": "assets/illustrations/hui_can.jpg"
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
                "image": "assets/illustrations/lai_come.jpg"
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
                "label": "回去"
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
                "image": "assets/illustrations/chu_exit.jpg"
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
                "label": "进入"
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
                "label": "看见"
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
                "image": "assets/illustrations/zhi_measure.svg"
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
                "image": "assets/illustrations/ge_measure.svg"
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
                "label": "小马"
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
                "label": "黄牛"
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
                "label": "绵羊"
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
                "label": "小鸟"
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
                "label": "金鱼"
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
                "label": "小虫"
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
                "label": "小狗"
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
                "label": "小猫"
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
                "label": "白兔"
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
                "label": "小鸭"
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
                "label": "小鹿"
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
                "label": "大象"
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
                "label": "公鸡"
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
                "label": "天鹅"
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
                "label": "小猪"
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
                "label": "大熊"
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
                "label": "神龙"
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
                "image": "assets/illustrations/hu_tiger.svg"
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
                "label": "猴子"
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
                "label": "乌龟"
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
                "label": "彩蝶"
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
                "label": "蜜蜂"
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
                "label": "青蛙"
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
                "label": "狐狸"
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
                "label": "狸猫"
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
                "label": "猎豹"
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
                "label": "野狼"
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
                "label": "雄狮"
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
                "label": "蓝鲸"
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
                "label": "大雁"
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
                "label": "燕子"
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
                "label": "仙鹤"
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
                "label": "春天"
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
                "label": "夏天"
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
                "label": "秋天"
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
                "label": "冬天"
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
                "label": "雪花"
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
                "label": "鲜花"
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
                "label": "青草"
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
                "label": "大海"
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
                "label": "星星"
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
                "label": "阳光"
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
                "label": "光芒"
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
                "label": "大树"
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
                "label": "森林"
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
                "label": "绿叶"
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
                "label": "翠竹"
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
                "label": "江水"
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
                "label": "小河"
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
                "label": "碧湖"
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
                "label": "天空"
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
                "label": "大地"
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
                "label": "清泉"
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
                "label": "寒冰"
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
                "label": "晨露"
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
                "label": "晴天"
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
                "label": "阴天"
            },
            {
                "char": "雾",
                "pinyin": "wù",
                "en": "fog",
                "strokes": 18,
                "radical": "雨",
                "words": [
                    "晨雾",
                    "大雾",
                    "薄雾"
                ],
                "sentence": "清晨的薄雾像轻纱一般笼罩着群山。",
                "icon": "🌫️",
                "label": "晨雾"
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
                "label": "白霜"
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
                "label": "春雷"
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
                "label": "闪电"
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
                "label": "彩虹"
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
                "label": "红泥"
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
                "label": "晚霞"
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
                "label": "双目"
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
                "label": "耳朵"
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
                "label": "小手"
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
                "image": "assets/illustrations/zu_feet.svg"
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
                "label": "爱心"
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
                "label": "门牙"
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
                "label": "爸爸"
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
                "label": "妈妈"
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
                "label": "家人"
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
                "label": "朋友"
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
                "label": "哥哥"
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
                "label": "弟弟"
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
                "label": "姐姐"
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
                "label": "妹妹"
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
                "label": "头部"
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
                "label": "鼻子"
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
                "label": "身体"
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
                "label": "儿童"
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
                "label": "老人"
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
                "label": "老师"
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
                "label": "爷爷"
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
                "label": "奶奶"
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
                "label": "笑脸"
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
                "label": "眉毛"
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
                "label": "骨骼"
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
                "label": "腹部"
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
                "label": "亲人"
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
                "label": "幼儿"
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
                "label": "学习"
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
                "label": "练习"
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
                "label": "书本"
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
                "label": "写字"
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
                "label": "朗读"
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
                "label": "画画"
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
                "label": "早晨"
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
                "label": "学校"
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
                "label": "端正"
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
                "label": "永远"
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
                "label": "上课"
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
                "label": "毛笔"
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
                "label": "本子"
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
                "label": "提问"
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
                "label": "儿歌"
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
                "label": "古诗"
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
                "label": "听讲"
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
                "label": "说话"
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
                "label": "回答"
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
                "label": "快乐"
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
                "label": "思考"
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
                "label": "知识"
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
                "label": "认识"
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
                "label": "记住"
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
                "label": "计算"
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
                "label": "做题"
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
                "label": "画册"
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
                "label": "奖状"
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
                "label": "四个"
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
                "label": "五个"
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
                "label": "六个"
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
                "label": "七个"
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
                "label": "八个"
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
                "image": "assets/illustrations/jiu_nine.svg"
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
                "label": "一百"
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
                "image": "assets/illustrations/qian_thousand.svg"
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
                "image": "assets/illustrations/wan_tenthousand.svg"
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
                "image": "assets/illustrations/yi_hundredmillion.svg"
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
                "label": "东方"
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
                "label": "西方"
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
                "label": "南方"
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
                "label": "北方"
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
                "label": "左边"
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
                "label": "右边"
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
                "label": "向前"
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
                "label": "后面"
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
                "label": "旁边"
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
                "label": "房间"
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
                "label": "心里"
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
                "label": "外边"
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
                "image": "assets/illustrations/ban_cookie.svg"
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
                "label": "零点"
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
                "label": "初始"
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
                "label": "周末"
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
                "label": "高大"
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
                "label": "低头"
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
                "label": "远方"
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
                "label": "亲近"
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
                "label": "水果"
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
                "label": "西瓜"
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
                "label": "桃子"
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
                "label": "李子"
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
                "label": "雪梨"
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
                "label": "大米"
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
                "label": "面条"
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
                "label": "蔬菜"
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
                "label": "红豆"
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
                "label": "茶叶"
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
                "label": "香甜"
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
                "label": "清香"
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
                "label": "牛肉"
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
                "label": "米饭"
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
                "label": "橙子"
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
                "label": "桔子"
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
                "label": "甜杏"
            },
            {
                "char": "莓",
                "pinyin": "méi",
                "en": "berry",
                "strokes": 11,
                "radical": "艹",
                "words": [
                    "草莓",
                    "蓝莓",
                    "树莓"
                ],
                "sentence": "红彤彤的草莓鲜嫩多汁，香甜诱人。",
                "icon": "🍓",
                "label": "草莓"
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
                "label": "热汤"
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
                "label": "糖果"
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
                "label": "麦穗"
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
                "label": "粮食"
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
                "label": "红色"
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
                "label": "黄色"
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
                "image": "assets/illustrations/lan_blue.svg"
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
                "label": "绿色"
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
                "image": "assets/illustrations/hei_black.svg"
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
                "label": "关爱"
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
                "label": "善良"
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
                "label": "美丽"
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
                "label": "诚实"
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
                "label": "礼貌"
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
                "label": "自信"
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
                "label": "仁爱"
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
                "label": "品德"
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
                "label": "和平"
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
                "label": "紫色"
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
                "label": "青色"
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
                "label": "敬礼"
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
                "label": "勤劳"
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
                "image": "assets/illustrations/jian_jar.svg"
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
                "label": "宽广"
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
                "label": "勇敢"
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
                "label": "恒久"
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
                "label": "起立"
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
                "label": "端坐"
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
                "label": "走路"
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
                "label": "跑步"
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
                "label": "跳绳"
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
                "label": "看见"
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
                "label": "开门"
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
                "label": "关门"
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
                "label": "飞翔"
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
                "label": "游泳"
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
                "label": "唱歌"
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
                "label": "玩具"
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
                "label": "运动"
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
                "label": "梦想"
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
                "label": "拥抱"
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
                "label": "握笔"
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
                "label": "招手"
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
                "label": "抬头"
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
                "label": "迈步"
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
                "label": "远望"
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
                "label": "追逐"
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
                "label": "登山"
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
                "image": "assets/illustrations/kuai_fast.svg"
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
                "label": "房屋"
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
                "label": "房屋"
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
                "label": "城市"
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
                "label": "集市"
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
                "label": "街道"
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
                "label": "道路"
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
                "label": "大桥"
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
                "label": "凉亭"
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
                "label": "龙舟"
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
                "label": "轮船"
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
                "label": "汽车"
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
                "label": "车站"
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
                "label": "马路"
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
                "label": "铁轨"
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
                "label": "海港"
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
                "label": "宝塔"
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
                "label": "大楼"
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
                "label": "庭院"
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
                "label": "佳节"
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
                "label": "过年"
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
                "label": "欢喜"
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
                "label": "国庆"
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
                "label": "祝贺"
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
                "label": "花灯"
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
                "label": "字谜"
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
                "label": "月饼"
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
                "label": "团聚"
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
                "label": "团圆"
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
                "label": "粽子"
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
                "label": "打鼓"
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
                "label": "旗帜"
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
                "label": "春联"
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
                "label": "时钟"
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
                "label": "京戏"
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
                "label": "福气"
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
                "label": "心愿"
            }
        ]
    }
];

const COMMON_PINYIN_MAP = {
    '龙': { pinyin: 'lóng', en: 'dragon', strokes: 5, radical: '龙', words: ['飞龙', '龙舟'] },
    '虎': { pinyin: 'hǔ', en: 'tiger', strokes: 8, radical: '虍', words: ['老虎', '白虎'] },
    '文': { pinyin: 'wén', en: 'culture', strokes: 4, radical: '文', words: ['文化', '语文'] },
    '中': { pinyin: 'zhōng', en: 'middle', strokes: 4, radical: '丨', words: ['中国', '中间'] },
    '华': { pinyin: 'huá', en: 'splendid', strokes: 6, radical: '十', words: ['中华', '华丽'] },
    '国': { pinyin: 'guó', en: 'country', strokes: 8, radical: '囗', words: ['国家', '国旗'] },
    '美': { pinyin: 'měi', en: 'beautiful', strokes: 9, radical: '羊', words: ['美丽', '美好'] },
    '爱': { pinyin: 'ài', en: 'love', strokes: 10, radical: '爫', words: ['可爱', '关爱'] },
    '好': { pinyin: 'hǎo', en: 'good', strokes: 6, radical: '女', words: ['好人', '良好'] },
    '我': { pinyin: 'wǒ', en: 'I / me', strokes: 7, radical: '戈', words: ['我们', '自我'] },
    '你': { pinyin: 'nǐ', en: 'you', strokes: 7, radical: '亻', words: ['你好', '你们'] },
    '他': { pinyin: 'tā', en: 'he', strokes: 5, radical: '亻', words: ['他们', '他人'] },
    '她': { pinyin: 'tā', en: 'she', strokes: 6, radical: '女', words: ['她们', '她俩'] },
    '它': { pinyin: 'tā', en: 'it', strokes: 5, radical: '宀', words: ['它们', '其它'] },
    '乐': { pinyin: 'lè', en: 'joy', strokes: 5, radical: '丿', words: ['快乐', '音乐'] },
    '欢': { pinyin: 'huān', en: 'happy', strokes: 6, radical: '又', words: ['欢乐', '喜欢'] },
    '福': { pinyin: 'fú', en: 'blessing', strokes: 13, radical: '礻', words: ['幸福', '福气'] },
    '春': { pinyin: 'chūn', en: 'spring', strokes: 9, radical: '日', words: ['春天', '春雨'] },
    '江': { pinyin: 'jiāng', en: 'river', strokes: 6, radical: '氵', words: ['长江', '江河'] },
    '河': { pinyin: 'hé', en: 'river', strokes: 8, radical: '氵', words: ['黄河', '小河'] },
    '湖': { pinyin: 'hú', en: 'lake', strokes: 12, radical: '氵', words: ['西湖', '湖水'] },
    '海': { pinyin: 'hǎi', en: 'sea', strokes: 10, radical: '氵', words: ['大海', '海洋'] },
    '金': { pinyin: 'jīn', en: 'gold', strokes: 8, radical: '金', words: ['金子', '金秋'] },
    '安': { pinyin: 'ān', en: 'safe', strokes: 6, radical: '宀', words: ['平安', '安静'] },
    '康': { pinyin: 'kāng', en: 'healthy', strokes: 11, radical: '广', words: ['健康', '小康'] },
    '吉': { pinyin: 'jí', en: 'lucky', strokes: 6, radical: '口', words: ['吉祥', '吉利'] },
    '祥': { pinyin: 'xiáng', en: 'auspicious', strokes: 10, radical: '礻', words: ['吉祥', '慈祥'] },
    '平': { pinyin: 'píng', en: 'peaceful', strokes: 5, radical: '干', words: ['平时', '和平'] },
    '盛': { pinyin: 'shèng', en: 'flourishing', strokes: 11, radical: '皿', words: ['盛开', '盛大'] },
    '世': { pinyin: 'shì', en: 'world', strokes: 5, radical: '一', words: ['世界', '世纪'] },
    '宝': { pinyin: 'bǎo', en: 'treasure', strokes: 8, radical: '宀', words: ['宝贝', '宝物'] },
    '贝': { pinyin: 'bèi', en: 'shell', strokes: 4, radical: '贝', words: ['贝壳', '分贝'] },
    '星': { pinyin: 'xīng', en: 'star', strokes: 9, radical: '日', words: ['星星', '星空'] },
    '光': { pinyin: 'guāng', en: 'light', strokes: 6, radical: '儿', words: ['阳光', '光明'] },
    '明': { pinyin: 'míng', en: 'bright', strokes: 8, radical: '日', words: ['明天', '明亮'] },
    '聪': { pinyin: 'cōng', en: 'clever', strokes: 15, radical: '耳', words: ['聪明', '失聪'] },
    '智': { pinyin: 'zhì', en: 'wisdom', strokes: 12, radical: '日', words: ['智慧', '智力'] },
    '慧': { pinyin: 'huì', en: 'intelligent', strokes: 15, radical: '心', words: ['智慧', '慧眼'] },
    '勤': { pinyin: 'qín', en: 'diligent', strokes: 13, radical: '力', words: ['勤劳', '勤奋'] },
    '奋': { pinyin: 'fèn', en: 'strive', strokes: 8, radical: '大', words: ['奋斗', '兴奋'] },
    '勇': { pinyin: 'yǒng', en: 'brave', strokes: 9, radical: '力', words: ['勇敢', '英勇'] },
    '敢': { pinyin: 'gǎn', en: 'dare', strokes: 11, radical: '攵', words: ['勇敢', '敢作'] },
    '坚': { pinyin: 'jiān', en: 'firm', strokes: 7, radical: '土', words: ['坚强', '坚持'] },
    '强': { pinyin: 'qiáng', en: 'strong', strokes: 12, radical: '弓', words: ['强大', '坚强'] },
    '宇': { pinyin: 'yǔ', en: 'cosmos', strokes: 6, radical: '宀', words: ['宇宙', '屋宇'] },
    '宙': { pinyin: 'zhòu', en: 'universe', strokes: 8, radical: '宀', words: ['宇宙'] },
    '舟': { pinyin: 'zhōu', en: 'boat', strokes: 6, radical: '舟', words: ['神舟', '龙舟'] },
    '车': { pinyin: 'chē', en: 'car', strokes: 4, radical: '车', words: ['火车', '汽车'] },
    '船': { pinyin: 'chuán', en: 'ship', strokes: 11, radical: '舟', words: ['小船', '飞船'] },
    '旗': { pinyin: 'qí', en: 'flag', strokes: 14, radical: '方', words: ['红旗', '国旗'] },
    '庆': { pinyin: 'qìng', en: 'celebrate', strokes: 6, radical: '广', words: ['欢庆', '校庆'] },
    '贺': { pinyin: 'hè', en: 'congratulate', strokes: 9, radical: '贝', words: ['祝贺', '贺卡'] },
    '年': { pinyin: 'nián', en: 'year', strokes: 6, radical: '干', words: ['新年', '少年'] },
    '神': { pinyin: 'shén', en: 'magical', strokes: 9, radical: '礻', words: ['神奇', '精神'] },
    '奇': { pinyin: 'qí', en: 'curious', strokes: 8, radical: '大', words: ['好奇', '奇妙'] },
    '创': { pinyin: 'chuàng', en: 'create', strokes: 6, radical: '刂', words: ['创造', '创新'] },
    '造': { pinyin: 'zào', en: 'make', strokes: 10, radical: '辶', words: ['制造', '创造'] },
    '梦': { pinyin: 'mèng', en: 'dream', strokes: 11, radical: '木', words: ['梦想', '美梦'] },
    '想': { pinyin: 'xiǎng', en: 'think', strokes: 13, radical: '心', words: ['思考', '梦想'] },
    '科': { pinyin: 'kē', en: 'science', strokes: 9, radical: '禾', words: ['科学', '科技'] },
    '技': { pinyin: 'jì', en: 'technology', strokes: 7, radical: '扌', words: ['技术', '技能'] },
    '成': { pinyin: 'chéng', en: 'succeed', strokes: 6, radical: '戈', words: ['成功', '成长'] },
    '长': { pinyin: 'zhǎng', en: 'grow', strokes: 4, radical: '长', words: ['长大', '成长'] },
    '功': { pinyin: 'gōng', en: 'achievement', strokes: 5, radical: '力', words: ['功夫', '成功'] }
};

/**
 * 获取汉字详细信息
 * 如果在预设库中则直接返回，否则返回动态构造的信息
 */
function getCharInfo(char) {
    if (!char || char.length === 0) return null;
    const target = char.charAt(0);

    // 1. 在预设库中寻找
    for (const cat of CHARACTER_CATEGORIES) {
        const found = cat.chars.find(c => c.char === target);
        if (found) {
            return { 
                ...found, 
                category: cat.name,
                image: (window.CHARACTER_ILLUSTRATION_MAP && window.CHARACTER_ILLUSTRATION_MAP[target]) || found.image
            };
        }
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

window.CHARACTER_CATEGORIES = CHARACTER_CATEGORIES;
window.getCharInfo = getCharInfo;

window.CHARACTER_EN_MAP = {
    "一": "one",
    "二": "two",
    "三": "three",
    "十": "ten",
    "人": "person",
    "口": "mouth",
    "大": "big",
    "小": "small",
    "上": "up",
    "下": "down",
    "日": "sun",
    "月": "moon",
    "水": "water",
    "火": "fire",
    "山": "mountain",
    "石": "stone",
    "田": "field",
    "土": "earth",
    "木": "tree",
    "天": "sky",
    "子": "child",
    "中": "middle",
    "文": "culture",
    "白": "white",
    "门": "door",
    "云": "cloud",
    "风": "wind",
    "雨": "rain",
    "禾": "seedling",
    "几": "a few",
    "太": "too / very",
    "生": "birth / grow",
    "会": "can / meet",
    "来": "come",
    "去": "go",
    "出": "out / exit",
    "入": "enter",
    "见": "see",
    "只": "measure word",
    "个": "piece / one",
    "马": "horse",
    "牛": "cow",
    "羊": "sheep",
    "鸟": "bird",
    "鱼": "fish",
    "虫": "bug",
    "狗": "dog",
    "猫": "cat",
    "兔": "rabbit",
    "鸭": "duck",
    "鹿": "deer",
    "象": "elephant",
    "鸡": "chicken",
    "鹅": "goose",
    "猪": "pig",
    "熊": "bear",
    "龙": "dragon",
    "虎": "tiger",
    "猴": "monkey",
    "龟": "turtle",
    "蝶": "butterfly",
    "蜂": "bee",
    "蛙": "frog",
    "狐": "fox",
    "狸": "raccoon",
    "豹": "leopard",
    "狼": "wolf",
    "狮": "lion",
    "鲸": "whale",
    "雁": "wild goose",
    "燕": "swallow",
    "鹤": "crane",
    "春": "spring",
    "夏": "summer",
    "秋": "autumn",
    "冬": "winter",
    "雪": "snow",
    "花": "flower",
    "草": "grass",
    "海": "sea",
    "星": "star",
    "阳": "sunshine",
    "光": "light",
    "树": "tree",
    "林": "forest",
    "叶": "leaf",
    "竹": "bamboo",
    "江": "river",
    "河": "river",
    "湖": "lake",
    "空": "sky",
    "地": "earth",
    "泉": "spring",
    "冰": "ice",
    "露": "dew",
    "晴": "sunny",
    "阴": "cloudy",
    "雾": "fog",
    "霜": "frost",
    "雷": "thunder",
    "电": "lightning",
    "虹": "rainbow",
    "泥": "mud",
    "霞": "glow",
    "目": "eye",
    "耳": "ear",
    "手": "hand",
    "足": "foot",
    "心": "heart",
    "牙": "tooth",
    "爸": "dad",
    "妈": "mom",
    "家": "home",
    "友": "friend",
    "哥": "brother",
    "弟": "younger brother",
    "姐": "sister",
    "妹": "younger sister",
    "头": "head",
    "鼻": "nose",
    "身": "body",
    "儿": "child",
    "老": "elder",
    "师": "teacher",
    "爷": "grandpa",
    "奶": "grandma",
    "脸": "face",
    "眉": "eyebrow",
    "骨": "bone",
    "腹": "belly",
    "亲": "parent",
    "幼": "young",
    "学": "learn",
    "习": "practice",
    "书": "book",
    "写": "write",
    "读": "read",
    "画": "draw",
    "早": "morning",
    "校": "school",
    "正": "right",
    "永": "forever",
    "课": "lesson",
    "笔": "pen",
    "本": "notebook",
    "问": "ask",
    "歌": "song",
    "诗": "poem",
    "听": "listen",
    "说": "speak",
    "答": "answer",
    "乐": "joy",
    "思": "think",
    "知": "know",
    "识": "recognize",
    "记": "remember",
    "算": "count",
    "题": "problem",
    "册": "booklet",
    "奖": "prize",
    "四": "four",
    "五": "five",
    "六": "six",
    "七": "seven",
    "八": "eight",
    "九": "nine",
    "百": "hundred",
    "千": "thousand",
    "万": "ten thousand",
    "亿": "hundred million",
    "东": "east",
    "西": "west",
    "南": "south",
    "北": "north",
    "左": "left",
    "右": "right",
    "前": "front",
    "后": "behind",
    "边": "side",
    "间": "room",
    "里": "inside",
    "外": "outside",
    "半": "half",
    "零": "zero",
    "初": "beginning",
    "末": "end",
    "高": "high",
    "低": "low",
    "远": "far",
    "近": "near",
    "果": "fruit",
    "瓜": "melon",
    "桃": "peach",
    "李": "plum",
    "梨": "pear",
    "米": "rice",
    "面": "noodles",
    "菜": "vegetable",
    "豆": "bean",
    "茶": "tea",
    "甜": "sweet",
    "香": "fragrant",
    "肉": "meat",
    "饭": "meal",
    "橙": "orange",
    "桔": "tangerine",
    "杏": "apricot",
    "莓": "berry",
    "汤": "soup",
    "糖": "candy",
    "麦": "wheat",
    "粮": "grain",
    "红": "red",
    "黄": "yellow",
    "蓝": "blue",
    "绿": "green",
    "黑": "black",
    "爱": "love",
    "善": "kind",
    "美": "beautiful",
    "诚": "honest",
    "礼": "polite",
    "信": "trust",
    "仁": "benevolent",
    "德": "virtue",
    "和": "peace",
    "紫": "purple",
    "青": "cyan",
    "敬": "respect",
    "勤": "diligent",
    "俭": "frugal",
    "宽": "forgiving",
    "勇": "brave",
    "恒": "constant",
    "立": "stand",
    "坐": "sit",
    "走": "walk",
    "跑": "run",
    "跳": "jump",
    "看": "look",
    "开": "open",
    "关": "close",
    "飞": "fly",
    "游": "swim",
    "唱": "sing",
    "玩": "play",
    "动": "move",
    "想": "think",
    "抱": "hug",
    "握": "grasp",
    "招": "wave",
    "抬": "lift",
    "迈": "step",
    "望": "gaze",
    "追": "chase",
    "登": "climb",
    "房": "house",
    "屋": "room",
    "城": "city",
    "市": "market",
    "街": "street",
    "道": "road",
    "桥": "bridge",
    "亭": "pavilion",
    "舟": "boat",
    "船": "ship",
    "车": "car",
    "站": "station",
    "路": "road",
    "轨": "track",
    "港": "port",
    "塔": "tower",
    "楼": "building",
    "院": "yard",
    "节": "festival",
    "年": "year",
    "喜": "joy",
    "庆": "celebrate",
    "贺": "congratulate",
    "灯": "lantern",
    "谜": "riddle",
    "饼": "pastry",
    "团": "reunion",
    "圆": "round",
    "粽": "rice dumpling",
    "鼓": "drum",
    "旗": "flag",
    "联": "couplet",
    "钟": "clock / bell",
    "戏": "play",
    "福": "blessing",
    "愿": "wish",
    "华": "splendid",
    "国": "country",
    "好": "good",
    "我": "I / me",
    "你": "you",
    "他": "he",
    "她": "she",
    "它": "it",
    "欢": "happy",
    "金": "gold",
    "安": "safe",
    "康": "healthy",
    "吉": "lucky",
    "祥": "auspicious",
    "平": "peaceful",
    "盛": "flourishing",
    "世": "world",
    "宝": "treasure",
    "贝": "shell",
    "明": "bright",
    "聪": "clever",
    "智": "wisdom",
    "慧": "intelligent",
    "奋": "strive",
    "敢": "dare",
    "坚": "firm",
    "强": "strong",
    "宇": "cosmos",
    "宙": "universe",
    "神": "magical",
    "奇": "curious",
    "创": "create",
    "造": "make",
    "梦": "dream",
    "科": "science",
    "技": "technology",
    "成": "succeed",
    "长": "grow",
    "功": "achievement"
};

// --- 高品质专属看图识字插画库 (高清绘本水彩插画与精细矢量图，替代粗糙emoji) ---
window.CHARACTER_ILLUSTRATION_MAP = {
    "一": "assets/illustrations/yi_one.jpg",
    "二": "assets/illustrations/er_two.jpg",
    "三": "assets/illustrations/san_three.jpg",
    "十": "assets/illustrations/shi.svg",
    "人": "assets/illustrations/ren.jpg",
    "口": "assets/illustrations/kou.svg",
    "日": "assets/illustrations/ri.jpg",
    "月": "assets/illustrations/yue.jpg",
    "水": "assets/illustrations/shui.jpg",
    "火": "assets/illustrations/huo.jpg",
    "山": "assets/illustrations/shan.jpg",
    "石": "assets/illustrations/shi_stone.svg",
    "田": "assets/illustrations/tian_field.svg",
    "土": "assets/illustrations/tu.svg",
    "木": "assets/illustrations/mu.jpg",
    "禾": "assets/illustrations/he.svg",
    "天": "assets/illustrations/tian_sky.svg",
    "大": "assets/illustrations/da_big.jpg",
    "小": "assets/illustrations/xiao_small.jpg",
    "上": "assets/illustrations/shang.svg",
    "下": "assets/illustrations/xia.svg",
    "子": "assets/illustrations/zi.jpg",
    "中": "assets/illustrations/zhong.jpg",
    "文": "assets/illustrations/wen.jpg",
    "白": "assets/illustrations/bai_white.svg",
    "门": "assets/illustrations/men.svg",
    "云": "assets/illustrations/yun.svg",
    "风": "assets/illustrations/feng.svg",
    "雨": "assets/illustrations/yu.svg",
    "几": "assets/illustrations/ji_few.jpg",
    "太": "assets/illustrations/tai.jpg",
    "生": "assets/illustrations/sheng.jpg",
    "会": "assets/illustrations/hui_can.jpg",
    "来": "assets/illustrations/lai_come.jpg",
    "去": "assets/illustrations/qu.jpg",
    "出": "assets/illustrations/chu_exit.jpg",
    "入": "assets/illustrations/ru.jpg",
    "见": "assets/illustrations/jian.jpg",
    "只": "assets/illustrations/zhi_measure.svg",
    "个": "assets/illustrations/ge_measure.svg",
    "马": "assets/illustrations/ma.jpg",
    "牛": "assets/illustrations/niu.svg",
    "羊": "assets/illustrations/yang.svg",
    "鱼": "assets/illustrations/yu_fish.svg",
    "虫": "assets/illustrations/chong.svg",
    "鸟": "assets/illustrations/niao.svg",
    "兔": "assets/illustrations/tu_rabbit.svg",
    "猫": "assets/illustrations/mao.svg",
    "狗": "assets/illustrations/gou.svg",
    "鸭": "assets/illustrations/ya.svg",
    "鹿": "assets/illustrations/lu.svg",
    "象": "assets/illustrations/xiang.svg",
    "鸡": "assets/illustrations/ji_chicken.svg",
    "鹅": "assets/illustrations/e.svg",
    "猪": "assets/illustrations/zhu.svg",
    "熊": "assets/illustrations/xiong.svg",
    "龙": "assets/illustrations/long.svg",
    "虎": "assets/illustrations/hu_tiger.svg",
    "猴": "assets/illustrations/hou.svg",
    "龟": "assets/illustrations/gui.svg",
    "蝶": "assets/illustrations/die.svg",
    "蜂": "assets/illustrations/feng_bee.svg",
    "蛙": "assets/illustrations/wa.svg",
    "狐": "assets/illustrations/hu_fox.svg",
    "狸": "assets/illustrations/li.svg",
    "豹": "assets/illustrations/bao.svg",
    "狼": "assets/illustrations/lang.svg",
    "狮": "assets/illustrations/shi_lion.svg",
    "鲸": "assets/illustrations/jing.svg",
    "雁": "assets/illustrations/yan_goose.svg",
    "燕": "assets/illustrations/yan_swallow.svg",
    "鹤": "assets/illustrations/he_crane.svg",
    "春": "assets/illustrations/chun.svg",
    "夏": "assets/illustrations/xia_summer.svg",
    "秋": "assets/illustrations/qiu.svg",
    "冬": "assets/illustrations/dong.svg",
    "花": "assets/illustrations/hua.svg",
    "草": "assets/illustrations/cao.svg",
    "海": "assets/illustrations/hai.svg",
    "星": "assets/illustrations/xing.svg",
    "雪": "assets/illustrations/xue.svg",
    "阳": "assets/illustrations/yang_sun.svg",
    "光": "assets/illustrations/guang.svg",
    "树": "assets/illustrations/shu_tree.svg",
    "林": "assets/illustrations/lin.svg",
    "叶": "assets/illustrations/ye.svg",
    "竹": "assets/illustrations/zhu_bamboo.svg",
    "江": "assets/illustrations/jiang.svg",
    "河": "assets/illustrations/he_river.svg",
    "湖": "assets/illustrations/hu.svg",
    "空": "assets/illustrations/kong_sky.svg",
    "地": "assets/illustrations/di_earth.svg",
    "泉": "assets/illustrations/quan.svg",
    "冰": "assets/illustrations/bing.svg",
    "露": "assets/illustrations/lu_dew.svg",
    "晴": "assets/illustrations/qing.svg",
    "阴": "assets/illustrations/yin.svg",
    "雾": "assets/illustrations/wu_fog.svg",
    "霜": "assets/illustrations/shuang.svg",
    "雷": "assets/illustrations/lei.svg",
    "电": "assets/illustrations/dian.svg",
    "虹": "assets/illustrations/hong_rainbow.svg",
    "泥": "assets/illustrations/ni.svg",
    "霞": "assets/illustrations/xia_sunset.svg",
    "目": "assets/illustrations/mu_eye.svg",
    "耳": "assets/illustrations/er_ear.svg",
    "手": "assets/illustrations/shou.svg",
    "足": "assets/illustrations/zu_feet.svg",
    "心": "assets/illustrations/xin.svg",
    "牙": "assets/illustrations/ya_tooth.svg",
    "爸": "assets/illustrations/ba.svg",
    "妈": "assets/illustrations/ma_mom.svg",
    "家": "assets/illustrations/jia.svg",
    "友": "assets/illustrations/you_friend.svg",
    "哥": "assets/illustrations/ge_brother.svg",
    "弟": "assets/illustrations/di_brother.svg",
    "姐": "assets/illustrations/jie_sister.svg",
    "妹": "assets/illustrations/mei_sister.svg",
    "头": "assets/illustrations/tou.svg",
    "鼻": "assets/illustrations/bi_nose.svg",
    "身": "assets/illustrations/shen.svg",
    "儿": "assets/illustrations/er_child.svg",
    "老": "assets/illustrations/lao.svg",
    "师": "assets/illustrations/shi_teacher.svg",
    "爷": "assets/illustrations/ye_grandpa.svg",
    "奶": "assets/illustrations/nai_grandma.svg",
    "脸": "assets/illustrations/lian.svg",
    "眉": "assets/illustrations/mei_eyebrow.svg",
    "骨": "assets/illustrations/gu_bone.svg",
    "腹": "assets/illustrations/fu_belly.svg",
    "亲": "assets/illustrations/qin.svg",
    "幼": "assets/illustrations/you_young.svg",
    "果": "assets/illustrations/guo.svg",
    "瓜": "assets/illustrations/gua.svg",
    "桃": "assets/illustrations/tao.svg",
    "李": "assets/illustrations/li_plum.svg",
    "梨": "assets/illustrations/li_pear.svg",
    "米": "assets/illustrations/mi.svg",
    "面": "assets/illustrations/mian.svg",
    "菜": "assets/illustrations/cai.svg",
    "豆": "assets/illustrations/dou.svg",
    "茶": "assets/illustrations/cha.svg",
    "甜": "assets/illustrations/tian.svg",
    "香": "assets/illustrations/xiang_aroma.svg",
    "肉": "assets/illustrations/rou.svg",
    "饭": "assets/illustrations/fan.svg",
    "橙": "assets/illustrations/cheng.svg",
    "桔": "assets/illustrations/ju.svg",
    "杏": "assets/illustrations/xing_apricot.svg",
    "莓": "assets/illustrations/mei.svg",
    "汤": "assets/illustrations/tang_soup.svg",
    "糖": "assets/illustrations/tang_sugar.svg",
    "麦": "assets/illustrations/mai.svg",
    "粮": "assets/illustrations/liang.svg",
    "房": "assets/illustrations/fang.svg",
    "屋": "assets/illustrations/wu_room.svg",
    "城": "assets/illustrations/cheng_castle.svg",
    "市": "assets/illustrations/shi_market.svg",
    "街": "assets/illustrations/jie_street.svg",
    "道": "assets/illustrations/dao_road.svg",
    "桥": "assets/illustrations/qiao.svg",
    "亭": "assets/illustrations/ting.svg",
    "舟": "assets/illustrations/zhou.svg",
    "船": "assets/illustrations/chuan.svg",
    "车": "assets/illustrations/che.svg",
    "站": "assets/illustrations/zhan.svg",
    "路": "assets/illustrations/lu_road.svg",
    "轨": "assets/illustrations/gui_track.svg",
    "港": "assets/illustrations/gang.svg",
    "塔": "assets/illustrations/ta.svg",
    "楼": "assets/illustrations/lou.svg",
    "院": "assets/illustrations/yuan.svg",
    "节": "assets/illustrations/jie_festival.svg",
    "年": "assets/illustrations/nian.svg",
    "喜": "assets/illustrations/xi_joy.svg",
    "庆": "assets/illustrations/qing_celebrate.svg",
    "贺": "assets/illustrations/he_congratulate.svg",
    "灯": "assets/illustrations/deng_lantern.svg",
    "谜": "assets/illustrations/mi_riddle.svg",
    "饼": "assets/illustrations/bing_mooncake.svg",
    "团": "assets/illustrations/tuan_reunion.svg",
    "圆": "assets/illustrations/yuan_tangyuan.svg",
    "粽": "assets/illustrations/zong_dumpling.svg",
    "鼓": "assets/illustrations/gu_drum.svg",
    "旗": "assets/illustrations/qi_flag.svg",
    "联": "assets/illustrations/lian_couplet.svg",
    "钟": "assets/illustrations/zhong_bell.svg",
    "戏": "assets/illustrations/xi_opera.svg",
    "福": "assets/illustrations/fu_blessing.svg",
    "愿": "assets/illustrations/yuan_wish.svg",
    "四": "assets/illustrations/si.svg",
    "五": "assets/illustrations/wu.svg",
    "六": "assets/illustrations/liu.svg",
    "七": "assets/illustrations/qi.svg",
    "八": "assets/illustrations/ba_num.svg",
    "九": "assets/illustrations/jiu_nine.svg",
    "百": "assets/illustrations/bai_hundred.svg",
    "千": "assets/illustrations/qian_thousand.svg",
    "万": "assets/illustrations/wan_tenthousand.svg",
    "东": "assets/illustrations/dong_east.svg",
    "西": "assets/illustrations/xi_west.svg",
    "南": "assets/illustrations/nan_south.svg",
    "北": "assets/illustrations/bei_north.svg",
    "左": "assets/illustrations/zuo.svg",
    "右": "assets/illustrations/you_right.svg",
    "书": "assets/illustrations/shu.svg",
    "笔": "assets/illustrations/bi.svg",
    "学": "assets/illustrations/xue_study.svg",
    "习": "assets/illustrations/xi_study.svg",
    "读": "assets/illustrations/du_read.svg",
    "画": "assets/illustrations/hua_draw.svg",
    "校": "assets/illustrations/xiao_school.svg",
    "早": "assets/illustrations/zao.svg",
    "红": "assets/illustrations/hong.jpg",
    "黄": "assets/illustrations/huang.svg",
    "蓝": "assets/illustrations/lan_blue.svg",
    "绿": "assets/illustrations/lv.svg",
    "黑": "assets/illustrations/hei_black.svg",
    "紫": "assets/illustrations/zi_color.svg",
    "爱": "assets/illustrations/ai_love.svg",
    "跑": "assets/illustrations/pao.svg",
    "飞": "assets/illustrations/fei.svg",
    "游": "assets/illustrations/you_swim.svg",
    "亿": "assets/illustrations/yi_hundredmillion.svg",
    "前": "assets/illustrations/qian_front.svg",
    "后": "assets/illustrations/hou_back.svg",
    "边": "assets/illustrations/bian_edge.svg",
    "间": "assets/illustrations/jian_room.svg",
    "里": "assets/illustrations/li_inside.svg",
    "外": "assets/illustrations/wai_outside.svg",
    "半": "assets/illustrations/ban_cookie.svg",
    "零": "assets/illustrations/ling_zero.svg",
    "初": "assets/illustrations/chu_beginning.svg",
    "末": "assets/illustrations/mo_end.svg",
    "高": "assets/illustrations/gao_high.svg",
    "低": "assets/illustrations/di_low.svg",
    "远": "assets/illustrations/yuan_far.svg",
    "近": "assets/illustrations/jin_near.svg",
    "写": "assets/illustrations/xie_write.svg",
    "正": "assets/illustrations/zheng_straight.svg",
    "永": "assets/illustrations/yong_eternal.svg",
    "课": "assets/illustrations/ke_lesson.svg",
    "本": "assets/illustrations/ben_book.svg",
    "问": "assets/illustrations/wen_ask.svg",
    "歌": "assets/illustrations/ge_song.svg",
    "诗": "assets/illustrations/shi_poem.svg",
    "听": "assets/illustrations/ting_listen.svg",
    "说": "assets/illustrations/shuo_speak.svg",
    "答": "assets/illustrations/da_answer.svg",
    "乐": "assets/illustrations/le_music.svg",
    "思": "assets/illustrations/si_think.svg",
    "知": "assets/illustrations/zhi_knowledge.svg",
    "识": "assets/illustrations/shi_recognize.svg",
    "记": "assets/illustrations/ji_note.svg",
    "算": "assets/illustrations/suan_calc.svg",
    "题": "assets/illustrations/ti_quiz.svg",
    "册": "assets/illustrations/ce_booklet.svg",
    "奖": "assets/illustrations/jiang_award.svg",
    "善": "assets/illustrations/shan_kind.svg",
    "美": "assets/illustrations/mei_beautiful.svg",
    "诚": "assets/illustrations/cheng_honest.svg",
    "礼": "assets/illustrations/li_polite.svg",
    "信": "assets/illustrations/xin_trust.svg",
    "仁": "assets/illustrations/ren_benevolent.svg",
    "德": "assets/illustrations/de_virtue.svg",
    "和": "assets/illustrations/he_peace.svg",
    "青": "assets/illustrations/qing_cyan.svg",
    "敬": "assets/illustrations/jing_respect.svg",
    "勤": "assets/illustrations/qin_diligent.svg",
    "俭": "assets/illustrations/jian_jar.svg",
    "宽": "assets/illustrations/kuan_wide.svg",
    "勇": "assets/illustrations/yong_brave.svg",
    "恒": "assets/illustrations/heng_constant.svg",
    "立": "assets/illustrations/li_stand.svg",
    "坐": "assets/illustrations/zuo_sit.svg",
    "走": "assets/illustrations/zou_walk.svg",
    "跳": "assets/illustrations/tiao_jump.svg",
    "看": "assets/illustrations/kan_look.svg",
    "开": "assets/illustrations/kai_open.svg",
    "关": "assets/illustrations/guan_close.svg",
    "唱": "assets/illustrations/chang_sing.svg",
    "玩": "assets/illustrations/wan_play.svg",
    "动": "assets/illustrations/dong_move.svg",
    "想": "assets/illustrations/xiang_think.svg",
    "抱": "assets/illustrations/bao_hug.svg",
    "握": "assets/illustrations/wo_grasp.svg",
    "招": "assets/illustrations/zhao_wave.svg",
    "抬": "assets/illustrations/tai_lift.svg",
    "迈": "assets/illustrations/mai_stride.svg",
    "望": "assets/illustrations/wang_gaze.svg",
    "追": "assets/illustrations/zhui_chase.svg",
    "登": "assets/illustrations/deng_climb.svg",
    "快": "assets/illustrations/kuai_fast.svg"
};



