/*jslint unordered*/
/*global utility, rsg3Encoding*/
function rsg3Text(rsg3Rom) {
    return {
        formName: utility.getFixedLengthBuffers(
            rsg3Rom,
            0x3D0000,
            10,
            64
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        itemName: utility.getFixedLengthBuffers(
            rsg3Rom,
            0x3D0280,
            8,
            256
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        monsterName: utility.getFixedLengthBuffers(
            rsg3Rom,
            0x3D0A80,
            8,
            320
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        characterName: utility.getFixedLengthBuffers(
            rsg3Rom,
            0x3D1480,
            8,
            256
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        characterId: utility.getFixedLengthBuffers(
            rsg3Rom,
            0x3D1C80,
            10,
            32
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        submapName: utility.getFixedLengthBuffers(
            rsg3Rom,
            0x3D1DC0,
            10,
            256
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        characterSkillName: utility.getFixedLengthBuffers(
            rsg3Rom,
            0x3D27C0,
            10,
            256
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        monsterSkillName: utility.getFixedLengthBuffers(
            rsg3Rom,
            0x3D31C0,
            10,
            256
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        formSkillName: utility.getFixedLengthBuffers(
            rsg3Rom,
            0x3D3BC0,
            10,
            64
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        )/*,
        propertyName: utility.getFixedLengthBuffers(
            rsg3Rom,
            0x3D3E40,
            14,
            256
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        eventText: utility.getFixedLengthBuffers(
            rsg3Rom,
            0x3D4C40,
            26,
            64
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        command: utility.getVariableLengthBuffers(
            rsg3Rom,
            0x3D52C0,
            0x3D5960,
            0x50
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        tournamentTeamName: utility.getVariableLengthBuffers(
            rsg3Rom,
            0x3d5960,
            0x3d59E0,
            0x50
        ).map(
            (buffer) => rsg3Encoding.decode(buffer)
        )*/
    };
}
