/*jslint long*/
const rsg3Encoding = (function () {
    function toHex(code) {
        return code.toString(16).toUpperCase().padStart(2, "0");
    }
    const charCodeTable = [
        /* 0x20 */
        "", "あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ",
        "た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "ほ", "ま", "み",
        "む", "め", "も", "や", "ゆ", "よ", "ら", "り", "る", "れ", "ろ", "わ", "を", "ん", "ゃ", "ゅ",
        "ょ", "っ", "ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ", "サ", "シ", "ス", "セ",
        "ソ", "タ", "チ", "ツ", "テ", "ト", "ナ", "ニ", "ヌ", "ネ", "ノ", "ハ", "ヒ", "フ", "ヘ", "ホ",
        "マ", "ミ", "ム", "メ", "モ", "ヤ", "ユ", "ヨ", "ラ", "リ", "ル", "レ", "ロ", "ワ", "ン", "ァ",
        "ィ", "ゥ", "ェ", "ォ", "ャ", "ュ", "ョ", "ッ", "が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず",
        "ぜ", "ぞ", "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "ぼ", "ガ", "ギ", "グ", "ゲ", "ゴ",
        "ザ", "ジ", "ズ", "ゼ", "ゾ", "ダ", "ヂ", "ヅ", "デ", "ド", "バ", "ビ", "ブ", "ベ", "ボ", "パ",
        "ピ", "プ", "ペ", "ポ", "ヴ", "ー", "　", "。", "、", "‥", "！", "？", "・", "様", "行", "私",
        "人", "出", "何", "王", "～", "来", "間", "大", "前", "戦", "力", "見", "中", "者", "聖", "言",
        "魔", "無", "方", "手", "話", "事", "今", "達", "気", "開", "町", "世", "会", "入", "物", "子",
        "死", "知", "乗", "術", "君", "教", "族", "所", "発", "上", "殿", "家", "軍", "別", "待", "商",
        "仲", "海", "金", "城", "助", "分", "動", "持", "後", "地", "取", "神", "本", "思", "変", "緒",
        "連", "敵", "団", "報", "当", "残", "合", "情", "命", "心", "下", "部", "聞", "勝", "界", "頼",
        "作", "体", "休", "戻", "西", "生", "船", "場", "良", "最", "備", "度", "帰", "立", "近", "丈",
        /* 0x21 */
        "万", "兵", "逃", "夫", "侯", "元", "名", "破", "売", "食", "怪", "少", "々", "年", "公", "配",
        "奴", "明", "姫", "屋", "成", "自", "男", "士", "時", "武", "止", "貴", "宿", "新", "住", "長",
        "着", "礼", "必", "通", "捕", "仕", "以", "夢", "北", "兄", "日", "宝", "使", "始", "好", "父",
        "引", "外", "二", "準", "呼", "願", "要", "倒", "先", "突", "宮", "強", "天", "説", "山", "険",
        "小", "衛", "決", "欲", "足", "定", "係", "高", "玄", "協", "将", "構", "美", "村", "隠", "集",
        "妹", "有", "姉", "安", "遊", "関", "閉", "国", "市", "闘", "竜", "女", "娘", "不", "東", "探",
        "指", "目", "殺", "工", "房", "黄", "爵", "我", "判", "護", "結", "親", "現", "悪", "得", "理",
        "赤", "賊", "客", "壊", "寝", "特", "陣", "京", "内", "老", "守", "旅", "彼", "念", "用", "進",
        "難", "街", "代", "味", "参", "意", "危", "受", "幸", "許", "活", "多", "品", "槍", "盗", "消",
        "徒", "加", "島", "実", "置", "身", "付", "伝", "回", "支", "覚", "空", "原", "撃", "申", "財",
        "攻", "全", "防", "列", "隊", "技", "剣", "産", "復", "石", "御", "社", "形", "退", "水", "件",
        "器", "龍", "運", "投", "道", "果", "打", "薬", "業", "低", "法", "状", "資", "弓", "早", "星",
        "織", "切", "光", "況", "効", "同", "揮", "弱", "精", "三", "鎧", "重", "流", "乱", "矢", "妖",
        "翼", "農", "直", "失", "書", "買", "毒", "化", "毛", "月", "陽", "速", "影", "落", "告", "木",
        "却", "奪", "終", "具", "腕", "白", "草", "盾", "太", "馬", "段", "斬", "血", "相", "主", "花",
        "性", "抜", "酒", "造", "門", "官", "絶", "減", "令", "次", "数", "続", "位", "収", "信", "砂",
        /* 0x22 */
        "封", "野", "波", "盟", "素", "向", "巣", "正", "風", "料", "与", "面", "文", "滅", "土", "在",
        "操", "氷", "壁", "射", "放", "火", "眠", "鳥", "敗", "皮", "起", "遠", "恐", "存", "口", "断",
        "装", "窟", "番", "葉", "調", "混", "返", "交", "喜", "込", "漠", "飛", "完", "製", "底", "夜",
        "炎", "鉄", "威", "騎", "斧", "十", "惑", "平", "率", "的", "員", "店", "職", "陸", "増", "予",
        "能", "邪", "負", "選", "送", "才", "熱", "雪", "紙", "初", "感", "苦", "供", "触", "玉", "座",
        "楽", "吸", "鬼", "洞", "息", "輪", "挑", "追", "襲", "練", "祈", "侵", "傷", "粉", "杯", "考",
        "冷", "違", "南", "昔", "急", "態", "臣", "ぱ", "嫁", "望", "働", "記", "頭", "移", "井", "戸",
        "争", "森", "針", "払", "蒼", "義", "普", "押", "傭", "都", "沼", "易", "機", "反", "魚", "超",
        "視", "鉱", "牧", "材", "差", "勇", "祖", "霧", "色", "誘", "嫌", "期", "演", "真", "四", "詩",
        "共", "舞", "確", "散", "館", "学", "越", "統", "然", "棒", "民", "％", "走", "虎", "獣", "異",
        "叩", "政", "央", "策", "想", "塔", "巻", "刀", "害", "幻", "衝", "了", "総", "頂", "岩", "骨",
        "派", "泊", "預", "役", "寄", "降", "習", "読", "暗", "声", "顔", "奥", "旧", "深", "営", "談",
        "秘", "飲", "制", "狩", "試", "魅", "群", "震", "師", "税", "雷", "拓", "銀", "鱗", "棍", "割",
        "脳", "転", "功", "塩", "穴", "冒", "頃", "肉", "港", "格", "恋", "霊", "労", "噂", "皆", "婚",
        "掛", "音", "救", "印", "久", "朱", "優", "像", "古", "値", "妻", "研", "究", "晶", "猛", "嵐",
        "河", "静", "激", "利", "稲", "砕", "温", "革", "環", "蛇", "雨", "電", "爆", "両", "羊", "陶",
        /* 0x23 */
        "０", "１", "２", "３", "４", "５", "６", "７", "８", "９", "Ｈ", "Ｌ", "Ｐ", "／", "←", "：",
        "芸", "対", "永", "遅", "若", "迷", "張", "援", "伯", "離", "表", "母", "展", "背", "独", "握",
        "闇", "髪", "禁", "遣", "傑", "由", "帯", "渡", "授", "瞳", "限", "浮", "湖", "観", "廃", "倉",
        "庫", "巨", "側", "曲", "満", "腐", "旗", "勢", "常", "瞬", "杖", "眼", "字", "牙", "奇", "尾",
        "振", "凝", "催", "線", "境", "綿", "貿", "注", "治", "跡", "答", "建", "逆", "閣", "恩", "飾",
        "沈", "忘", "罪", "継", "解", "麻", "笑", "弟", "週", "扉", "画", "洋", "墟", "姿", "溶", "七",
        "黒", "栄", "億", "点", "蹴", "鏡", "角", "香", "削", "千", "避", "妨", "絹", "茶", "額", "求",
        "廟", "牢", "討", "任", "賞", "亡", "興", "問", "没", "右", "識", "末", "鎖", "腹", "五", "縦",
        "再", "築", "友", "和", "志", "坊", "乾", "兆", "警", "戒", "陰", "福", "偽", "歩", "朝", "鳴",
        "算", "級", "爪", "狼", "浪", "疾", "拳", "液", "裂", "貫", "極", "熟", "損", "号", "林", "敢",
        "犠", "牲", "短", "勉", "験", "墓", "疲", "悟", "屈", "式", "責", "暮", "留", "左", "冗", "病",
        "未", "驚", "幅", "測", "窓", "青", "塞", "寺", "院", "語", "泣", "謀", "創", "充", "軽", "煙",
        "滝", "到", "峠", "抗", "征", "誉", "届", "謝", "片", "計", "領", "局", "鳳", "辰", "宵", "甲",
        "羅", "刹", "屍", "閃", "双", "車", "勁", "烈", "臨", "熒", "縛", "順", "歳", "殊", "設", "各",
        "糸", "丘", "誓", "案", "敬", "慮", "縁", "伏", "密", "兼", "孫", "景", "呪", "倍", "阻", "占",
        "伐", "幕", "清", "仁", "覆", "嬢", "諸", "亜", "居", "酸", "津", "智", "鎮", "略", "根", "汗"
    ];
    const charIndexTable = charCodeTable.reduce(function (table, char, code) {
        table[char] = code;
        return table;
    }, {});
    return {
        decode(buffer) {
            let text = "";
            let offset = 0;
            const length = buffer.length;
            while (offset < length) {
                const code = buffer[offset];
                const next = offset + 1;
                if (code >= 0x50) { // single byte
                    text += charCodeTable[code - 0x50];
                } else if (code === 0x4A && next < length) { // character
                    text += "[character " + buffer[next] + "]";
                    offset = next;
                } else if (code === 0x3B && next < length) { // submap
                    text += "[submap " + buffer[next] + "]";
                    offset = next;
                } else if (code === 0x2C) { // button
                    text += "[button]\n";
                } else if (code === 0x2B && next < length) { // wait ?
                    text += "[wait " + buffer[next] + "]";
                    offset = next;
                } else if (code === 0x24) { // new line
                    text += "\n";
                } else if (code >= 0x20 && code < 0x24 && next < length) { // double byte
                    text += charCodeTable[
                        (code - 0x20) * 0x100 + buffer[next]
                    ];
                    offset = next;
                } else if (code === 0x17 && next < length) { // unknown control character
                    text += "[17 " + toHex(buffer[next]) + "]";
                    offset = next;
                } else if (code === 0x48 && next < length && buffer[next] === 0) {
                    text += "\f";
                    offset = next;
                } else { // unknown
                    text += "[" + toHex(code) + "]";
                }
                offset += 1;
            }
            return text;
        },
        encode(text) {
            const length = text.length;
            const buffer = new Uint8Array(length * 2);
            let index = 0;
            let offset = 0;
            while (index < length) {
                const code = charIndexTable[text[index]];
                if (code > -1) {
                    if (code < 0xB0) {
                        buffer.set([code + 0x50], offset);
                        offset += 1;
                    } else {
                        const code1 = code % 0x100;
                        const code0 = (code - code1) / 0x100 + 0x20;
                        buffer.set([code0, code1], offset);
                        offset += 2;
                    }
                }
                index += 1;
            }
            return buffer.subarray(0, offset);
        }
    };
}());
