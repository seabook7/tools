/*jslint bitwise*/
const CRC = (function () {
    const table = new Uint32Array(256);
    (function () {
        const kPoly = 0xEDB88320;
        let i = 0;
        while (i < 256) {
            let r = i;
            let j = 0;
            while (j < 8) {
                if ((r & 1) !== 0) {
                    r = (r >>> 1) ^ kPoly;
                } else {
                    r >>>= 1;
                }
                j += 1;
            }
            table[i] = r;
            i += 1;
        }
    }());
    const toUint32 = (value) => (
        value < 0
        ? value + 0x100000000
        : value
    );
    const getDigest = (value) => ~value;
    const updateByte = (value, b) => table[value & 0xFF ^ b] ^ (value >>> 8);
    const update = (data) => data.reduce(updateByte, 0xFFFFFFFF);
    /**
     * @param {Uint8Array|Uint8ClampedArray|number[]} data
     * @returns {number}
     */
    const calculateDigest = (data) => toUint32(getDigest(update(data)));
    /**
     * @param {number} digest
     * @param {Uint8Array|Uint8ClampedArray|number[]} data
     * @returns {boolean}
     */
    const verifyDigest = (digest, data) => calculateDigest(data) === digest;
    return {calculateDigest, verifyDigest};
}());
