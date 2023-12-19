// reference:
// https://www.unicode.org/Public/MAPPINGS/OBSOLETE/EASTASIA/JIS/JIS0201.TXT
const JISX0201 = {
    /**
     * @param {number[]} codes
     * @returns {string}
     */
    decode(codes) {
        const filter = (code) => (
            (code >= 0x20 && code < 0x7F)
            || (code >= 0xA1 && code < 0xE0)
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
        if (Array.isArray(codes)) {
            const unicodes = codes.filter(filter).map(toUnicode);
            return String.fromCharCode(...unicodes);
        }
        return "";
    },
    /**
     * @param {string} string
     * @returns {number[]}
     */
    encode(string) {
        const getCharCode = (char) => char.charCodeAt(0);
        const filter = (code) => (
            (code >= 0x20 && code < 0x5C)
            || code === 0xA5
            || (code >= 0x5D && code < 0x7E)
            || code === 0x203E
            || (code >= 0xFF61 && code < 0xFFA0)
        );
        const toJISX0201 = (code) => (
            code === 0xA5
            ? 0x5C
            : code === 0x203E
            ? 0x7E
            : code >= 0xFF61
            ? code - 0xFEC0
            : code
        );
        if (typeof string === "string") {
            const unicodes = Array.prototype.map.call(string, getCharCode);
            return unicodes.filter(filter).map(toJISX0201);
        }
        return [];
    }
};
