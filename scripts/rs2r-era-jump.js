const yearsPassed = [
    {
        battlesCount: 26,
        increasedYears: 50
    },
    {
        battlesCount: 16,
        increasedYears: 32
    },
    {
        battlesCount: 11,
        increasedYears: 48
    },
    {
        battlesCount: 0,
        increasedYears: 58
    }
];
const events = [
    {
        contents: "オープニング",
        eraJump: false,
        point: 1
    },
    {
        contents: "ウオッチマンを倒す",
        eraJump: false,
        point: 1
    },
    {
        contents: "レオンがオアイーブから伝承法を教えられる",
        eraJump: false,
        point: 0
    },
    {
        contents: "レオンが死亡する",
        eraJump: false,
        point: 1
    },
    {
        contents: "アバロン襲撃に来たゴブリンを倒す",
        eraJump: false,
        point: 1
    },
    {
        contents: "キングを倒す",
        eraJump: false,
        point: 1
    },
    {
        contents: "北バレンヌを勢力下に治める（クジンシーを倒す）",
        eraJump: true,
        point: 1
    },
    {
        contents: "術法研究所の建設を指示する（完成しなくてもいい）",
        eraJump: false,
        point: 0
    },
    {
        contents: "帝国大学の建設を指示する（完成しなくてもいい）",
        eraJump: false,
        point: 0
    },
    {
        contents: "ディープワンを倒す",
        eraJump: false,
        point: 1
    },
    {
        contents: "ゼラチナスマターを倒す",
        eraJump: false,
        point: 1
    },
    {
        contents: "モンスターの巣のボスを倒す（竜の穴と協力して倒した場合は取得できない）",
        eraJump: false,
        point: 1
    },
    {
        contents: "ザ・ドラゴンに勝利、敗北、退却をする",
        eraJump: false,
        point: 1
    },
    {
        contents: "南バレンヌを勢力下に治める（ヴァイカーを倒す）",
        eraJump: true,
        point: 8
    },
    {
        contents: "レオンブリッジの建設を指示する（完成しなくてもいい）",
        eraJump: false,
        point: 0
    },
    {
        contents: "ルドンを勢力下に治める（宝石鉱山を解放する）",
        eraJump: true,
        point: 4
    },
    {
        contents: "東のダンジョンを攻略する（ダンターグの場合も合算する）",
        eraJump: false,
        point: 1
    },
    {
        contents: "南のダンジョンを攻略する（ダンターグの場合も合算する）",
        eraJump: false,
        point: 4
    },
    {
        contents: "ナゼールを勢力下に治める（ムーの越冬地で報告する）",
        eraJump: true,
        point: 1
    },
    {
        contents: "ダンターグを東のダンジョンで倒す",
        eraJump: false,
        point: 8
    },
    {
        contents: "ダンターグを南のダンジョンで倒す",
        eraJump: false,
        point: 8
    },
    {
        contents: "ダンターグを詩人の洞窟で倒す",
        eraJump: false,
        point: 8
    },
    {
        contents: "ダンターグを子供と子ムーで倒す",
        eraJump: false,
        point: 8
    },
    {
        contents: "子供と子ムーを救出する",
        eraJump: true,
        point: 1
    },
    {
        contents: "詩人の洞窟を攻略する（ダンターグの場合も合算する）",
        eraJump: false,
        point: 1
    },
    {
        contents: "北ロンギットを勢力下に治める（武装商船団問題を解決する、またはギャロンを追放する）",
        eraJump: true,
        point: 4
    },
    {
        contents: "ギャロンの側近を倒す",
        eraJump: false,
        point: 4
    },
    {
        contents: "ギャロンを追い出す",
        eraJump: true,
        point: 1
    },
    {
        contents: "氷海でスービエを倒す",
        eraJump: true,
        point: 8
    },
    {
        contents: "人魚に3回会いに行く（強制で年代ジャンプが発生する）",
        eraJump: true,
        point: 15
    },
    {
        contents: "ギャロンの亡霊を倒す",
        eraJump: false,
        point: 4
    },
    {
        contents: "沈没船でスービエを倒す",
        eraJump: false,
        point: 8
    },
    {
        contents: "南ロンギットを勢力下に治める",
        eraJump: true,
        point: 1
    },
    {
        contents: "カンバーランドを勢力下に治める（滅亡前にサイフリートを倒す）",
        eraJump: true,
        point: 8
    },
    {
        contents: "カンバーランドを勢力下に治める（滅亡後にサイフリートを倒す）",
        eraJump: true,
        point: 8
    },
    {
        contents: "溶岩を固め",
        eraJump: false,
        point: 3
    },
    {
        contents: "コムルーン島を勢力下に治める（溶岩を固めて町長か魔導士に話しかける、または岩を破壊して話す）",
        eraJump: true,
        point: 1
    },
    {
        contents: "火山の凝固した岩を破壊する",
        eraJump: false,
        point: 3
    },
    {
        contents: "コムルーン火山の噴火が起きる",
        eraJump: false,
        point: 0
    },
    {
        contents: "ステップを勢力下に治める（ボクオーンを倒す）",
        eraJump: true,
        point: 8
    },
    {
        contents: "クィーンを倒す",
        eraJump: false,
        point: 3
    },
    {
        contents: "サバンナを勢力下に治める（クィーン撃破をハンターに報告する）",
        eraJump: true,
        point: 1
    },
    {
        contents: "リアルクィーンを倒す",
        eraJump: false,
        point: 0
    },
    {
        contents: "メルーを勢力下に治める（塔のモンスターを倒す、またはノエルと和解、または撃破後報告する）",
        eraJump: true,
        point: 4
    },
    {
        contents: "ノエルを倒す",
        eraJump: false,
        point: 4
    },
    {
        contents: "サラマットを勢力下に治める（ロックブーケを倒す）",
        eraJump: true,
        point: 8
    },
    {
        contents: "ヤウダを勢力下に治める（ワグナスを倒す）",
        eraJump: true,
        point: 8
    },
    {
        contents: "ヒラガの世代経過が開始される",
        eraJump: false,
        point: 0
    },
    {
        contents: "トーマの世代経過が開始される",
        eraJump: false,
        point: 0
    }
];
