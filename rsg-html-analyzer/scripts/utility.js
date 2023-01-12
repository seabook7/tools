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
    splitBuffer(buffer, code) {
        const buffers = [];
        let inBuffer = false;
        let start;
        let offset = 0;
        const length = buffer.length;
        while (offset < length) {
            if (inBuffer) {
                if (buffer[offset] === code) {
                    buffers.push(buffer.subarray(start, offset));
                    inBuffer = false;
                }
            } else {
                if (buffer[offset] !== code) {
                    start = offset;
                    inBuffer = true;
                }
            }
            offset += 1;
        }
        if (inBuffer) {
            buffers.push(buffer.subarray(start));
        }
        return buffers;
    },
    getHex(code) {
        return code.toString(16).toUpperCase().padStart(2, "0");
    },
    decode(codeTable, buffer) {
        let string = "";
        let offset = 0;
        const length = buffer.length;
        while (offset < length) {
            const code = buffer[offset];
            if (code === 0x50) {
                break;
            }
            if (code > 0x50) {
                string += codeTable[code - 0x50];
            } else {
                if (code >= 0x20 && code <= 0x23 && offset + 1 < length) {
                    string += codeTable[
                        (code - 0x20) * 0x100 + buffer[offset + 1]
                    ];
                    offset += 1;
                } else {
                    string += "[" + utility.getHex(code) + "]";
                }
            }
            offset += 1;
        }
        return string;
    },
    encode(codeTable, string, length) {
        const stringLength = string.length;
        const buffer = new Uint8Array(length ?? stringLength * 2);
        let i = 0;
        let offset = 0;
        buffer.fill(0x50);
        while (i < stringLength && offset < buffer.length) {
            let code = codeTable.indexOf(string.charAt(i));
            if (code > -1) {
                if (code < 0xb0) {
                    if (offset + 1 <= buffer.length) {
                        buffer.set([code + 0x50], offset);
                    }
                    offset += 1;
                } else {
                    if (offset + 2 <= buffer.length) {
                        const code1 = code % 0x100;
                        code = (code - code1) / 0x100 + 0x20;
                        buffer.set([code, code1], offset);
                    }
                    offset += 2;
                }
            }
            i += 1;
        }
        if (length === undefined) {
            return buffer.subarray(0, buffer.indexOf(0x50));
        }
        return buffer;
    }
};
