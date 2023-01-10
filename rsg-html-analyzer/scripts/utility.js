/*jslint unordered*/
const utility = {
    getBuffers(buffer, offset, length, number) {
        const buffers = new Array(number);
        let i = 0;
        while (i < number) {
            const end = offset + length;
            buffers[i] = buffer.subarray(offset, end);
            offset = end;
            i += 1;
        }
        return buffers;
    },
    getHex(code) {
        return "[" + code.toString(16).toUpperCase().padStart(2, "0") + "]";
    },
    decode(codeTable, buffer) {
        let string = "";
        let i = 0;
        const length = buffer.length;
        while (i < length) {
            const code = buffer[i];
            if (code === 0x50) {
                break;
            }
            if (code > 0x50) {
                string += codeTable[code - 0x50];
            } else {
                if (code >= 0x20 && code <= 0x23 && i + 1 < length) {
                    string += codeTable[(code - 0x20) * 0x100 + buffer[i + 1]];
                    i += 1;
                } else {
                    string += utility.getHex(code);
                }
            }
            i += 1;
        }
        return string;
    }
};
