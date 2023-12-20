// reference:
// https://www.unicode.org/Public/MAPPINGS/OBSOLETE/EASTASIA/JIS/JIS0201.TXT
const JISX0201 = (function () {
    const canMapToUnicode = (code) => (
        (code >= 0x20 && code < 0x7F)
        || (code >= 0xA1 && code < 0xE0)
    );
    const getJISX0201 = (codes) => (
        Array.isArray(codes)
        ? codes.filter(canMapToUnicode)
        : Array.from(codes).filter(canMapToUnicode)
    );
    const toUnicode = (code) => (
        code === 0x5C
        ? 0xA5
        : code === 0x7E
        ? 0x203E
        : code >= 0xA1
        ? code + 0xFEC0
        : code
    );
    const mapToUnicode = (codes) => getJISX0201(codes).map(toUnicode);
    /**
     * @param {number[]} codes
     * @returns {string}
     */
    const decode = (codes) => String.fromCharCode(...mapToUnicode(codes));
    const map = Array.prototype.map;
    const toCharCode = (char) => char.charCodeAt(0);
    const getCharCode = (string) => (
        typeof string === "string"
        ? map.call(string, toCharCode)
        : map.call(String(string), toCharCode)
    );
    const canMapToJISX0201 = (code) => (
        (code >= 0x20 && code < 0x5C)
        || code === 0xA5
        || (code >= 0x5D && code < 0x7E)
        || code === 0x203E
        || (code >= 0xFF61 && code < 0xFFA0)
    );
    const getUnicode = (string) => getCharCode(string).filter(canMapToJISX0201);
    const toJISX0201 = (code) => (
        code === 0xA5
        ? 0x5C
        : code === 0x203E
        ? 0x7E
        : code >= 0xFF61
        ? code - 0xFEC0
        : code
    );
    /**
     * @param {string} string
     * @returns {number[]}
     */
    const encode = (string) => getUnicode(string).map(toJISX0201);
    return {decode, encode};
}());
