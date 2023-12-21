/*jslint unordered*/
/*global rsg3Encoding*/
function rsg3Text(rsg3Rom) {
    return {
        /* unknown table
        table: rsg3Rom.getTable(0x3C0000, 0x3C0800),
        */
        // not fully parsed
        dialogue: rsg3Encoding.decode(
            rsg3Rom.buffer.subarray(0x3C0800, 0x3D0000)
        ).split("\f"),
        formation: rsg3Rom.getBuffers(0x3D0000, 10, 64).map(
            rsg3Encoding.decode
        ),
        item: rsg3Rom.getBuffers(0x3D0280, 8, 256).map(
            rsg3Encoding.decode
        ),
        monster: rsg3Rom.getBuffers(0x3D0A80, 8, 320).map(
            rsg3Encoding.decode
        ),
        character: rsg3Rom.getBuffers(0x3D1480, 8, 256).map(
            rsg3Encoding.decode
        ),
        identify: rsg3Rom.getBuffers(0x3D1C80, 10, 32).map(
            rsg3Encoding.decode
        ),
        submap: rsg3Rom.getBuffers(0x3D1DC0, 10, 256).map(
            rsg3Encoding.decode
        ),
        characterSkill: rsg3Rom.getBuffers(0x3D27C0, 10, 256).map(
            rsg3Encoding.decode
        ),
        monsterSkill: rsg3Rom.getBuffers(0x3D31C0, 10, 256).map(
            rsg3Encoding.decode
        ),
        formationSkill: rsg3Rom.getBuffers(0x3D3BC0, 10, 64).map(
            rsg3Encoding.decode
        ),
        property: rsg3Rom.getBuffers(0x3D3E40, 14, 256).map(
            rsg3Encoding.decode
        ),
        event: rsg3Rom.getBuffers(0x3D4C40, 26, 64).map(
            rsg3Encoding.decode
        ),
        massCombat: rsg3Rom.getBuffers(0x3D52C0, 12, 128).map(
            rsg3Encoding.decode
        ),
        command: rsg3Rom.getBuffers(0x3D58C0, 10, 16).map(
            rsg3Encoding.decode
        ),
        tournamentTeam: rsg3Rom.getBuffers(0x3D5960, 8, 16).map(
            rsg3Encoding.decode
        ),
        description: rsg3Rom.getBuffersFromTable(
            0x3D6200,
            rsg3Rom.getTable(0x3D6000, 0x3D6174)
        ).map(
            rsg3Encoding.decode
        ),
        trade: rsg3Rom.getBuffersFromTable(
            0x3D7D00,
            rsg3Rom.getTable(0x3D7800, 0x3D7C32)
        ).map(
            rsg3Encoding.decode
        ),
        battle: rsg3Rom.getBuffersFromTable(
            0x3D9A00,
            rsg3Rom.getTable(0x3D9800, 0x3D988E)
        ).map(
            rsg3Encoding.decode
        ),
        /* ???
        unknown: rsg3Rom.getBuffersFromTable(
            0x3DA900,
            rsg3Rom.getTable(0x3DA800, 0x3DA88C)
        ).map(
            rsg3Encoding.decode
        ),
        */
        massCombatDescription: rsg3Rom.getBuffersFromTable(
            0x3DB094,
            rsg3Rom.getTable(0x3DB000, 0x3DB094)
        ).map(
            rsg3Encoding.decode
        ),
        /* unknown format
        massCombatInfomation: rsg3Rom.getBuffersFromTable(
            0x3DC200,
            rsg3Rom.getTable(0x3DC000, 0x3DC200)
        ).map(
            rsg3Encoding.decode
        ),
        */
        // 0x3DE000-0x3DF800 ???
        // 0x3DF800-0x3DF976 unknown format
        menu: rsg3Rom.getBuffersFromTable(
            0x3DFA08,
            rsg3Rom.getTable(0x3DF976, 0x3DFA08)
        ).map(
            rsg3Encoding.decode
        ),
        // custom
        starType: ["歳星", "熒惑", "鎮星", "太白", "辰星"],
        favoriteType: ["剣", "大剣", "斧", "棍棒", "小剣", "槍", "弓", "素手", "なし"],
        earthMagicType: ["蒼龍", "朱鳥", "白虎", "玄武"],
        heavenMagicType: ["太陽", "月"],
        defaultMagicType: ["蒼龍", "朱鳥", "太陽", "白虎", "玄武"]
    };
}
