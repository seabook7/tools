/*jslint bitwise, unordered*/
/*global utility, rsg3Encoding*/
const rsg3Skill = function (rsg3Rom) {
    function readData(buffer) {
        return {
            derivativeFlag: buffer[6] >>> 7,
            derivative: buffer[6] & 0x1F,
            pointFlag: buffer[13] >>> 7,
            point: buffer[13] & 0x1F
        }
    }
    return {
        names: utility.getFixedLengthBuffers(rsg3Rom, 0x3D27C0, 10, 512).map(
            (buffer) => rsg3Encoding.decode(buffer)
        ),
        data: utility.getFixedLengthBuffers(rsg3Rom, 0x3E0F00, 14, 256).map(
            (buffer) => readData(buffer)
        ),
        learn: utility.getFixedLengthBuffers(rsg3Rom, 0x3E353F, 2, 256).map(
            (buffer) => utility.getBitFlags(buffer)
        )
    };
};
