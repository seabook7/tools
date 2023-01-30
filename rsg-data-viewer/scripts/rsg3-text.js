/*jslint unordered*/
/*global rsg3Encoding*/
function rsg3Text(rsg3Rom) {
    return {
        /* useless
        // unknown format
        dialogue: rsg3Encoding.decode(rsg3Rom.buffer.subarray(0x3C0000, 0x3D0000)),
        */
        formation: rsg3Rom.getBuffers(
            0x3D0000,
            10,
            64
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        item: rsg3Rom.getBuffers(
            0x3D0280,
            8,
            256
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        monster: rsg3Rom.getBuffers(
            0x3D0A80,
            8,
            320
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        character: rsg3Rom.getBuffers(
            0x3D1480,
            8,
            256
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        identify: rsg3Rom.getBuffers(
            0x3D1C80,
            10,
            32
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        /* useless
        submap: rsg3Rom.getBuffers(
            0x3D1DC0,
            10,
            256
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        */
        characterSkill: rsg3Rom.getBuffers(
            0x3D27C0,
            10,
            256
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        monsterSkill: rsg3Rom.getBuffers(
            0x3D31C0,
            10,
            256
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        formationSkill: rsg3Rom.getBuffers(
            0x3D3BC0,
            10,
            64
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        /* useless
        property: rsg3Rom.getBuffers(
            0x3D3E40,
            14,
            256
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        event: rsg3Rom.getBuffers(
            0x3D4C40,
            26,
            64
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        massCombat: rsg3Rom.getBuffers(
            0x3D52C0,
            12,
            128
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        command: rsg3Rom.getBuffers(
            0x3D58C0,
            10,
            16
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        tournamentTeam: rsg3Rom.getBuffers(
            0x3D5960,
            8,
            16
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        */
        description: rsg3Rom.getBuffersFromTable(
            0x3D6200,
            rsg3Rom.getTable(0x3D6000, 0x3D6174)
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        /* useless
        trade: rsg3Rom.getBuffersFromTable(
            0x3D7D00,
            rsg3Rom.getTable(0x3D7800, 0x3D7C32)
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        battle: rsg3Rom.getBuffersFromTable(
            0x3D9A00,
            rsg3Rom.getTable(0x3D9800, 0x3D988E)
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        unknown: rsg3Rom.getBuffersFromTable(
            0x3DA900,
            rsg3Rom.getTable(0x3DA800, 0x3DA88C)
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        massCombatDescription: rsg3Rom.getBuffersFromTable(
            0x3DB094,
            rsg3Rom.getTable(0x3DB000, 0x3DB094)
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        massCombatInfomation: rsg3Rom.getBuffersFromTable(
            0x3DC200,
            rsg3Rom.getTable(0x3DC000, 0x3DC200)
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        // 0x3DE000-0x3DF800 ???
        // 0x3DF800-0x3DFDB5 menu?
        menu: rsg3Rom.getBuffersFromTable(
            0x3DFA08,
            rsg3Rom.getTable(0x3DF976, 0x3DFA08)
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        */
        // custom
        starType: ["歳星", "熒惑", "鎮星", "太白", "辰星"],
        favoriteType: ["剣", "大剣", "斧", "棍棒", "小剣", "槍", "弓", "素手", "なし"],
        earthMagicType: ["蒼龍", "朱鳥", "白虎", "玄武"],
        heavenMagicType: ["太陽", "月"],
        defaultMagicType: ["蒼龍", "朱鳥", "太陽", "白虎", "玄武"]
    };
}
