// reference:
// https://datatracker.ietf.org/doc/html/rfc4648
const Base64DataEncoding = (function () {
    const base64Alphabet = [
        "A", "B", "C", "D", "E", "F", "G", "H",
        "I", "J", "K", "L", "M", "N", "O", "P",
        "Q", "R", "S", "T", "U", "V", "W", "X",
        "Y", "Z", "a", "b", "c", "d", "e", "f",
        "g", "h", "i", "j", "k", "l", "m", "n",
        "o", "p", "q", "r", "s", "t", "u", "v",
        "w", "x", "y", "z", "0", "1", "2", "3",
        "4", "5", "6", "7", "8", "9", "+", "/"
    ];
    const base64URLAlphabet = base64Alphabet.slice(0, 62);
    base64URLAlphabet.push("-", "_");
    const pad = "=";
    const isUint8 = (code) => (
        Number.isInteger(code)
        && code >= 0
        && code < 256
    );
    function stringify(alphabet, uint8_0, uint8_1, uint8_2) {
        let string = "";
        let uint6_1 = uint8_0 % 4;
        const uint6_0 = (uint8_0 - uint6_1) / 4;
        string += alphabet[uint6_0];
        uint6_1 *= 0x10;
        if (uint8_1 !== undefined) {
            let uint6_2 = uint8_1 % 0x10;
            uint6_1 += (uint8_1 - uint6_2) / 0x10;
            string += alphabet[uint6_1];
            uint6_2 *= 4;
            if (uint8_2 !== undefined) {
                const uint6_3 = uint8_2 % 0x40;
                uint6_2 += (uint8_2 - uint6_3) / 0x40;
                string += alphabet[uint6_2];
                string += alphabet[uint6_3];
                return string;
            }
            string += alphabet[uint6_2];
            string += pad;
            return string;
        }
        string += alphabet[uint6_1];
        string += pad;
        string += pad;
        return string;
    }
    function toString(data, isBase64URL = false) {
        const alphabet = (
            isBase64URL
            ? base64URLAlphabet
            : base64Alphabet
        );
        let string = "";
        const uint8Array = data.filter(isUint8);
        let index = 0;
        const length = uint8Array.length;
        while (index < length) {
            string += stringify(
                alphabet,
                uint8Array[index],
                uint8Array[index + 1],
                uint8Array[index + 2]
            );
            index += 3;
        }
        return string;
    }
    /**
     * @param {number[]} data
     * @returns {string}
     */
    const toBase64String = (data) => toString(data);
    /**
     * @param {number[]} data
     * @returns {string}
     */
    const toBase64URLString = (data) => toString(data, true);
    /**
     * @param {string} string
     * @param {number} lineLength
     * @returns {string}
     */
    function insertLineBreaks(string, lineLength = 76) {
        const lines = [];
        let start = 0;
        const length = string.length;
        while (start < length) {
            let end = start + lineLength;
            if (end >= length) {
                end = length;
            }
            lines.push(string.substring(start, end));
            start = end;
        }
        return lines.join("\n");
    }
    function reducerForMapping(mapping, value, index) {
        mapping[value] = index;
        return mapping;
    }
    const base64Mapping = base64Alphabet.reduce(reducerForMapping, {});
    const base64URLMapping = base64URLAlphabet.reduce(reducerForMapping, {});
    function reducerForBase64Uint6Array(uint6Array, char) {
        const uint6 = base64Mapping[char];
        if (uint6 !== undefined) {
            uint6Array.push(uint6);
        }
        return uint6Array;
    }
    function reducerForBase64URLUint6Array(uint6Array, char) {
        const uint6 = base64URLMapping[char];
        if (uint6 !== undefined) {
            uint6Array.push(uint6);
        }
        return uint6Array;
    }
    function parse(uint6_0, uint6_1, uint6_2, uint6_3) {
        const data = [];
        let uint8_0 = uint6_0 * 4;
        if (uint6_1 !== undefined) {
            let uint8_1 = uint6_1 % 0x10;
            uint8_0 += (uint6_1 - uint8_1) / 0x10;
            data.push(uint8_0);
            uint8_1 *= 0x10;
            if (uint6_2 !== undefined) {
                let uint8_2 = uint6_2 % 4;
                uint8_1 += (uint6_2 - uint8_2) / 4;
                data.push(uint8_1);
                uint8_2 *= 0x40;
                if (uint6_3 !== undefined) {
                    uint8_2 += uint6_3;
                    data.push(uint8_2);
                }
            }
        }
        return data;
    }
    function fromString(string, isBase64URL = false) {
        const data = [];
        const reduce = Array.prototype.reduce;
        const uint6Array = reduce.call(string, (
            isBase64URL
            ? reducerForBase64URLUint6Array
            : reducerForBase64Uint6Array
        ), []);
        let index = 0;
        const length = uint6Array.length;
        while (index < length) {
            data.push(...parse(
                uint6Array[index],
                uint6Array[index + 1],
                uint6Array[index + 2],
                uint6Array[index + 3]
            ));
            index += 4;
        }
        return data;
    }
    /**
     * @param {string} string
     * @returns {number[]}
     */
    const fromBase64String = (string) => fromString(string);
    /**
     * @param {string} string
     * @returns {number[]}
     */
    const fromBase64URLString = (string) => fromString(string, true);
    return {
        fromBase64String,
        fromBase64URLString,
        insertLineBreaks,
        toBase64String,
        toBase64URLString
    };
}());
