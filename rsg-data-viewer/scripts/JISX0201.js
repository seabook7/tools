// reference:
// https://www.unicode.org/Public/MAPPINGS/OBSOLETE/EASTASIA/JIS/JIS0201.TXT
const JISX0201 = (function () {
    const reducer = (acc, fn) => fn(acc);
    const reduce = (...args) => args.reduce(reducer);
    const toArray = (codes) => (
        Array.isArray(codes)
        ? codes
        : Array.from(codes)
    );
    const isDecodable = (code) => (
        (code >= 0x20 && code < 0x7F)
        || (code >= 0xA1 && code < 0xE0)
    );
    const filterDecodable = (codes) => codes.filter(isDecodable);
    const toUnicode = (code) => (
        code === 0x5C
        ? 0xA5
        : code === 0x7E
        ? 0x203E
        : code >= 0xA1
        ? code + 0xFEC0
        : code
    );
    const mapToUnicode = (codes) => codes.map(toUnicode);
    const fromCharCode = (codes) => String.fromCharCode(...codes);
    /**
     * @param {number[]} codes
     * @returns {string}
     */
    const decode = (codes) => reduce(
        codes,
        toArray,
        filterDecodable,
        mapToUnicode,
        fromCharCode
    );
    const toString = (string) => (
        typeof string === "string"
        ? string
        : String(string)
    );
    const map = Array.prototype.map;
    const toCharCode = (char) => char.charCodeAt(0);
    const mapToCharCode = (string) => map.call(string, toCharCode);
    const isEncodable = (code) => (
        (code >= 0x20 && code < 0x5C)
        || code === 0xA5
        || (code >= 0x5D && code < 0x7E)
        || code === 0x203E
        || (code >= 0xFF61 && code < 0xFFA0)
    );
    const filterEncodable = (codes) => codes.filter(isEncodable);
    const toJISX0201 = (code) => (
        code === 0xA5
        ? 0x5C
        : code === 0x203E
        ? 0x7E
        : code >= 0xFF61
        ? code - 0xFEC0
        : code
    );
    const mapToJISX0201 = (codes) => codes.map(toJISX0201);
    /**
     * @param {string} string
     * @returns {number[]}
     */
    const encode = (string) => reduce(
        string,
        toString,
        mapToCharCode,
        filterEncodable,
        mapToJISX0201
    );
    return {
        decode,
        encode
    };
}());
