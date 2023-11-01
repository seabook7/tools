const base64Encoding = (function () {
    const alphabet = [
        "A", "B", "C", "D", "E", "F", "G", "H",
        "I", "J", "K", "L", "M", "N", "O", "P",
        "Q", "R", "S", "T", "U", "V", "W", "X",
        "Y", "Z", "a", "b", "c", "d", "e", "f",
        "g", "h", "i", "j", "k", "l", "m", "n",
        "o", "p", "q", "r", "s", "t", "u", "v",
        "w", "x", "y", "z", "0", "1", "2", "3",
        "4", "5", "6", "7", "8", "9", "+", "/"
    ];
    const pad = "=";
    const alphabetIndex = alphabet.reduce(function (index, char, code) {
        index[char] = code;
        return index;
    }, {});
    /**
     * @param {ArrayBufferLike} buffer
     */
    function encode(buffer) {
        const uint8Array = new Uint8Array(buffer);
        let offset = 0;
        const length = uint8Array.length;
        let uint8;
        let mod;
        let uint6_0;
        let uint6_1;
        let uint6_2;
        let uint6_3;
        let text = "";
        while (offset < length) {
            uint8 = uint8Array[offset];
            mod = offset % 3;
            switch (mod) {
            case 0:
                uint6_1 = uint8 % 4;
                uint6_0 = (uint8 - uint6_1) / 4;
                text += alphabet[uint6_0];
                uint6_1 *= 0x10;
                break;
            case 1:
                uint6_2 = uint8 % 0x10;
                uint6_1 += (uint8 - uint6_2) / 0x10;
                text += alphabet[uint6_1];
                uint6_2 *= 4;
                break;
            case 2:
                uint6_3 = uint8 % 0x40;
                uint6_2 += (uint8 - uint6_3) / 0x40;
                text += alphabet[uint6_2];
                text += alphabet[uint6_3];
                break;
            }
            offset += 1;
        }
        switch (mod) {
        case 0:
            text += alphabet[uint6_1];
            text += pad;
            text += pad;
            break;
        case 1:
            text += alphabet[uint6_2];
            text += pad;
            break;
        }
        return text;
    }
    /**
     * @param {string} text
     */
    function decode(text) {
        let index = 0;
        const length = text.length;
        let offset = 0;
        let mod;
        let uint8_0;
        let uint8_1;
        let uint8_2;
        const uint8 = [];
        while (index < length) {
            const uint6 = alphabetIndex[text[index]];
            if (uint6 !== undefined) {
                mod = offset % 4;
                switch (mod) {
                case 0:
                    uint8_0 = uint6 * 4;
                    break;
                case 1:
                    uint8_1 = uint6 % 0x10;
                    uint8_0 += (uint6 - uint8_1) / 0x10;
                    uint8.push(uint8_0);
                    uint8_1 *= 0x10;
                    break;
                case 2:
                    uint8_2 = uint6 % 4;
                    uint8_1 += (uint6 - uint8_2) / 4;
                    uint8.push(uint8_1);
                    uint8_2 *= 0x40;
                    break;
                case 3:
                    uint8_2 += uint6;
                    uint8.push(uint8_2);
                    break;
                }
                offset += 1;
            }
            index += 1;
        }
        return (new Uint8Array(uint8)).buffer;
    }
    /**
     * @param {string} text
     * @param {number} lineLength
     */
    function insertLineBreaks(text, lineLength = 76) {
        let index = 0;
        const length = text.length;
        const lines = [];
        while (index < length) {
            let end = index + lineLength;
            if (end >= length) {
                end = length;
            }
            lines.push(text.substring(index, end));
            index = end;
        }
        return lines.join("\n");
    }
    return {
        decode,
        encode,
        insertLineBreaks
    };
}());
