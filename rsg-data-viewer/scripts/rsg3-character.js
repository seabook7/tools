/*jslint bitwise, unordered*/
/*global utility, rsg3Encoding*/
const rsg3Character = function (rsg3Rom) {
    function readData0(buffer) {
        const earthMagicTable = ["souryu", "syuchoh", "byakko", "genbu"];
        const heavenMagicTable = ["sun", "moon"];
        return {
            looks: buffer[0],
            id: buffer[1],
            manFlag: buffer[2] >>> 7,
            womanFlag: (buffer[2] & 0x40) >>> 6,
            undeadFlag: (buffer[2] & 0x20) >>> 5,
            unknownFlags: [
                (buffer[2] & 0x10) >>> 4,
                (buffer[2] & 0x08) >>> 3,
                (buffer[2] & 0x04) >>> 2,
                (buffer[2] & 0x02) >>> 1,
                buffer[2] & 0x01
            ],
            hpFlag: buffer[4] >>> 7,
            hp: (buffer[4] & 0x7F) << 8 | buffer[3],
            flagLP: buffer[5] >>> 7,
            lp: buffer[5] & 0x7F,
            strength: buffer[6],
            dexterity: buffer[7],
            agility: buffer[8],
            endure: buffer[9],
            force: buffer[10],
            will: buffer[11],
            fascination: buffer[12],
            slashFlag: buffer[13] >>> 7,
            slash: buffer[13] & 0x7F,
            beatFlag: buffer[14] >>> 7,
            beat: buffer[14] & 0x7F,
            thrustFlag: buffer[15] >>> 7,
            thrust: buffer[15] & 0x7F,
            shootFlag: buffer[16] >>> 7,
            shoot: buffer[16] & 0x7F,
            wrestleFlag: buffer[17] >>> 7,
            wrestle: buffer[17] & 0x7F,
            earthMagicType: earthMagicTable[buffer[18] >>> 5 & 0x03],
            earthMagicLevel: buffer[18] & 0x1F,
            heavenMagicType: heavenMagicTable[buffer[19] >>> 5 & 0x03],
            heavenMagicLevel: buffer[19] & 0x1F,
            generalLevelFlag: buffer[20] >>> 7,
            generalLevel: buffer[20] & 0x7F,
            levelUpType: buffer[21],
            skillGetting: buffer[22],
            skill: [buffer[23], buffer[24], buffer[25], buffer[26]],
            magic: [buffer[27], buffer[28], buffer[29], buffer[30]],
            weapon: [buffer[31], buffer[32], buffer[33], buffer[34]],
            armor: [buffer[35], buffer[36], buffer[37], buffer[38]],
            formationOwn: buffer[39],
            star: buffer[40],
            defaultMagicType: buffer[41],
            favorite: buffer[42],
            unknown: [
                buffer[43],
                buffer[44],
                buffer[45],
                buffer[46],
                buffer[47]
            ]
        };
    }
    function readData1(buffer) {
        return {
            slash: buffer[0],
            beat: buffer[1],
            thrust: buffer[2],
            shoot: buffer[3],
            wrestle: buffer[4],
            souryu: buffer[5],
            syuchoh: buffer[6],
            byakko: buffer[7],
            genbu: buffer[8],
            sun: buffer[9],
            moon: buffer[10],
            generalLevel: buffer[11],
            unknown: buffer[12],
            sp: buffer[13],
            mp: buffer[14],
            hp: buffer[15]
        };
    }
    return {
        data: [
            utility.getFixedLengthBuffers(rsg3Rom, 0x3E0600, 48, 48).map(
                (buffer) => readData0(buffer)
            ),
            utility.getFixedLengthBuffers(rsg3Rom, 0x3E31BF, 16, 48).map(
                (buffer) => readData1(buffer)
            )
        ]
    };
};
