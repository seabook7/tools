/*jslint bitwise, browser, unordered*/
/*global utility, rsg3CodeTable*/
const rsg3character = (function () {
    function readData(buffer) {
        const earthMagicTable = ["souryu", "syuchoh", "byakko", "genbu"];
        const heavenMagicTable = ["sun", "moon"];
        return {
            looks: buffer[0],
            id: buffer[1],
            flagHP: buffer[4] >>> 7,
            hp: (buffer[4] & 0x7f) << 8 | buffer[3],
            flagLP: buffer[5] >>> 7,
            lp: buffer[5] & 0x7f,
            strength: buffer[6],
            dexterity: buffer[7],
            agility: buffer[8],
            endure: buffer[9],
            force: buffer[10],
            will: buffer[11],
            fascination: buffer[12],
            slash: buffer[13] & 0x7f,
            beat: buffer[14] & 0x7f,
            thrust: buffer[15] & 0x7f,
            shoot: buffer[16] & 0x7f,
            wrestle: buffer[17] & 0x7f,
            earthMagicType: earthMagicTable[buffer[18] >>> 5 & 0x03],
            earthMagicLevel: buffer[18] & 0x1f,
            heavenMagicType: heavenMagicTable[buffer[19] >>> 5 & 0x03],
            heavenMagicLevel: buffer[19] & 0x1f,
            levelUnknown: buffer[20] & 0x7f,
            typeStar: buffer[40],
            typeWeapon: buffer[42],
            typeMag: buffer[41],
            typeTechLearn: buffer[22],
            typeLevelUp: buffer[21],
            formationNo: buffer[39],
            /* フラグ系データ */
            flagMan: (buffer[2] & 0x80) !== 0x00,
            flagWoman: (buffer[2] & 0x40) !== 0x00,
            flagUndead: (buffer[2] & 0x20) !== 0x00,
            flagUnknown: (buffer[2] & 0x1f).toString(2).padStart(5, "0"),
            flagGrowHitPoint: (buffer[4] & 0x80) !== 0x00,
            flagGrowLevelSword: (buffer[13] & 0x80) !== 0x00,
            flagGrowLevelAxe: (buffer[14] & 0x80) !== 0x00,
            flagGrowLevelSpear: (buffer[15] & 0x80) !== 0x00,
            flagGrowLevelBow: (buffer[16] & 0x80) !== 0x00,
            flagGrowLevelPunch: (buffer[17] & 0x80) !== 0x00,
            flagGrowLevelEarth: (buffer[18] & 0x80) !== 0x00,
            flagGrowLevelHeaven: (buffer[19] & 0x80) !== 0x00,
            flagGrowLevelUnknown: (buffer[20] & 0x80) !== 0x00,
            /* 修得している技 */
            waza: [buffer[23], buffer[24], buffer[25], buffer[26]],
            /* 修得している術 */
            jyutu: [buffer[27], buffer[28], buffer[29], buffer[30]],
            /* 装備アイテム */
            weapon: [buffer[31], buffer[32], buffer[33], buffer[34]],
            armor: [buffer[35], buffer[36], buffer[37], buffer[38]]
        };
    }
    function readLevelUp(buffer) {
        return {
            lvup_hit_point  : buffer[15],
            lvup_tech_point : buffer[13],
            lvup_mag_point  : buffer[14],
            lvup_sword      : buffer[ 0],
            lvup_axe        : buffer[ 1],
            lvup_spear      : buffer[ 2],
            lvup_bow        : buffer[ 3],
            lvup_punch      : buffer[ 4],
            lvup_wind       : buffer[ 5],
            lvup_fire       : buffer[ 6],
            lvup_earth      : buffer[ 7],
            lvup_water      : buffer[ 8],
            lvup_sun        : buffer[ 9],
            lvup_moon       : buffer[10]
        };
    }
    return function (rsg3rom) {
        const names = utility.getBuffers(rsg3rom, 0x3d1480, 8, 48).map(
            (buffer) => utility.decode(rsg3CodeTable, buffer)
        );
        const data = utility.getBuffers(rsg3rom, 0x3e0600, 48, 48).map(
            (buffer) => readData(buffer)
        );
        const levelUp = utility.getBuffers(rsg3rom, 0x3e31bf, 16, 46).map(
            (buffer) => readLevelUp(buffer)
        );
        return {
            names,
            data,
            levelUp
        };
    };
}());
