/*jslint bitwise, browser, unordered*/
/*global utility, rsg3CodeTable*/
const rsg3character = (function () {
    function readData(buffer) {
        return {
            /* 数値系データ */
            id: buffer[0],
            hitPoint: (buffer[4] & 0x7f) << 8 | buffer[3],
            lifePoint: buffer[5] & 0x7f,
            strength: buffer[6],
            dexterity: buffer[7],
            speed: buffer[8],
            stamina: buffer[9],
            magicPower: buffer[10],
            willPower: buffer[11],
            charm: buffer[12],
            levelSword: buffer[13] & 0x7f,
            levelAxe: buffer[14] & 0x7f,
            levelSpear: buffer[15] & 0x7f,
            levelBow: buffer[16] & 0x7f,
            levelPunch: buffer[17] & 0x7f,
            levelWind: (
                (buffer[18] >> 5 & 0x03) === 0x00
                ? buffer[18] & 0x1f
                : 0
            ),
            levelFire: (
                (buffer[18] >> 5 & 0x03) === 0x01
                ? buffer[18] & 0x1f
                : 0
            ),
            levelEarth: (
                (buffer[18] >> 5 & 0x03) === 0x02
                ? buffer[18] & 0x1f
                : 0
            ),
            levelWater: (
                (buffer[18] >> 5 & 0x03) === 0x03
                ? buffer[18] & 0x1f
                : 0
            ),
            levelSun: (
                (buffer[19] >> 5 & 0x03) === 0x00
                ? buffer[19] & 0x1f
                : 0
            ),
            levelMoon: (
                (buffer[19] >> 5 & 0x03) === 0x01
                ? buffer[19] & 0x1f
                : 0
            ),
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
            flagUnknown: (buffer[2] & 0x10) !== 0x00,
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
            techNo: [buffer[23], buffer[24], buffer[25], buffer[26]],
            /* 修得している術 */
            magNo: [buffer[27], buffer[28], buffer[29], buffer[30]],
            /* 装備アイテム */
            equipmentNo: [
                buffer[31], buffer[32], buffer[33], buffer[34],
                buffer[35], buffer[36], buffer[37], buffer[38]
            ]
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
        const names = utility.getBuffers(rsg3rom, 0x3d1480, 48, 8).map(
            (buffer) => utility.decode(rsg3CodeTable, buffer)
        );
        const data = utility.getBuffers(rsg3rom, 0x3e0600, 48, 48).map(
            (buffer) => readData(buffer)
        );
        const levelUp = utility.getBuffers(rsg3rom, 0x3e31bf, 48, 16).map(
            (buffer) => readLevelUp(buffer)
        );
        return {
            data,
            names/*,
            flag,
            levelUp,
            parameter*/
        };
    };
}());
