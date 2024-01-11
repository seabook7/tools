/*jslint bitwise*/
const CRC = (function () {
    const call = (acc, fn) => fn(acc);
    const pipe = (...args) => args.reduce(call);
    const reducer = (result) => (
        (result & 1) === 1
        ? result >>> 1 ^ 0xEDB88320
        : result >>> 1
    );
    const makeToTable = (array) => (ignore, i) => array.reduce(reducer, i);
    const toTable = pipe(new Array(8).fill(0), makeToTable);
    const mapToTable = (uint32array) => uint32array.map(toTable);
    const makeUpdateByte = (table) => (v, b) => v >>> 8 ^ table[v & 0xFF ^ b];
    const updateByte = pipe(new Uint32Array(256), mapToTable, makeUpdateByte);
    const update = (data) => data.reduce(updateByte, 0xFFFFFFFF);
    const getDigest = (value) => ~value;
    const toUint32 = (value) => (
        value < 0
        ? value + 0x100000000
        : value
    );
    /**
     * @param {Uint8Array|Uint8ClampedArray|number[]} data
     * @returns {number}
     */
    const calculateDigest = (data) => pipe(
        data,
        update,
        getDigest,
        toUint32
    );
    const is = (result) => (value) => value === result;
    /**
     * @param {number} digest
     * @param {Uint8Array|Uint8ClampedArray|number[]} data
     * @returns {boolean}
     */
    const verifyDigest = (digest, data) => pipe(
        data,
        calculateDigest,
        is(digest)
    );
    return {
        calculateDigest,
        verifyDigest
    };
}());
