/*jslint bitwise*/
const CRC = (function () {
    const table = (function () {
        const array256 = new Uint32Array(256);
        const array8 = new Uint8Array(8);
        const kPoly = 0xEDB88320;
        const reducer = (result) => (
            (result & 1) === 1
            ? (result >>> 1) ^ kPoly
            : result >>> 1
        );
        const toResult = (ignore, index) => array8.reduce(reducer, index);
        return array256.map(toResult);
    }());
    const toUint32 = (value) => (
        value < 0
        ? value + 0x100000000
        : value
    );
    const updateByte = (value, b) => table[value & 0xFF ^ b] ^ (value >>> 8);
    const update = (data) => data.reduce(updateByte, 0xFFFFFFFF);
    /**
     * @param {Uint8Array|Uint8ClampedArray|number[]} data
     * @returns {number}
     */
    const calculateDigest = (data) => toUint32(~(update(data)));
    /**
     * @param {number} digest
     * @param {Uint8Array|Uint8ClampedArray|number[]} data
     * @returns {boolean}
     */
    const verifyDigest = (digest, data) => calculateDigest(data) === digest;
    return {calculateDigest, verifyDigest};
}());
