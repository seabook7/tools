/*jslint unordered*/
/*global rsg3Encoding*/
function rsg3Text(rsg3Rom) {
    return {
        formation: rsg3Rom.getFixedLengthBuffers(
            0x3D0000,
            10,
            64
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        item: rsg3Rom.getFixedLengthBuffers(
            0x3D0280,
            8,
            256
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        monster: rsg3Rom.getFixedLengthBuffers(
            0x3D0A80,
            8,
            320
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        character: rsg3Rom.getFixedLengthBuffers(
            0x3D1480,
            8,
            256
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        identify: rsg3Rom.getFixedLengthBuffers(
            0x3D1C80,
            10,
            32
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        submap: rsg3Rom.getFixedLengthBuffers(
            0x3D1DC0,
            10,
            256
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        characterSkill: rsg3Rom.getFixedLengthBuffers(
            0x3D27C0,
            10,
            256
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        monsterSkill: rsg3Rom.getFixedLengthBuffers(
            0x3D31C0,
            10,
            256
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        formationSkill: rsg3Rom.getFixedLengthBuffers(
            0x3D3BC0,
            10,
            64
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        )/*,
        property: rsg3Rom.getFixedLengthBuffers(
            0x3D3E40,
            14,
            256
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        event: rsg3Rom.getFixedLengthBuffers(
            0x3D4C40,
            26,
            64
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        massCombat: rsg3Rom.getVariableLengthBuffers(
            0x3D52C0,
            0x3D5960,
            0x50
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        tournamentTeam: rsg3Rom.getVariableLengthBuffers(
            0x3d5960,
            0x3d59E0,
            0x50
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        )*/
    };
}
