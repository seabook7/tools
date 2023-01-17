/*jslint bitwise, this*/
/*global jisx0201Encoding*/
function SNESRom(arrayBuffer) {
    const headerLength = 512;
    Object.defineProperties(this, {
        buffer: {value: (
            arrayBuffer.byteLength % 1024 === headerLength
            ? new Uint8Array(arrayBuffer, headerLength)
            : new Uint8Array(arrayBuffer)
        )}
    });
    const length = this.buffer.length;
    let header;
    if (length >= 0x40FFE0 && (this.buffer[0x40FFD5] & 0x0F) === 5) {
        Object.defineProperty(this, "mapMode", {
            enumerable: true,
            value: "ExHiROM"
        });
        header = this.buffer.subarray(0x40FFC0, 0x40FFE0);
    } else if (length >= 0xFFE0 && (this.buffer[0xFFD5] & 0x0F) === 1) {
        Object.defineProperty(this, "mapMode", {
            enumerable: true,
            value: "HiROM"
        });
        header = this.buffer.subarray(0xFFC0, 0xFFE0);
    } else if (length >= 0x7FE0 && (this.buffer[0x7FD5] & 0x0F) === 0) {
        Object.defineProperty(this, "mapMode", {
            enumerable: true,
            value: "LoROM"
        });
        header = this.buffer.subarray(0x7FC0, 0x7FE0);
    }
    const regions = ["Japan", "USA", "Europe"];
    Object.defineProperties(this, {
        ramSize: {enumerable: true, get() {
            return 1 << header[24];
        }},
        region: {enumerable: true, get() {
            return regions[header[25]];
        }},
        romSize: {enumerable: true, get() {
            return 1 << header[23];
        }},
        speed: {enumerable: true, get() {
            return header[21] >>> 4;
        }},
        title: {enumerable: true, get() {
            return jisx0201Encoding.decode(header.subarray(0, 21));
        }},
        version: {enumerable: true, get() {
            return header[27];
        }}
    });
}
Object.defineProperties(SNESRom.prototype, {
    getFixedLengthBuffers(offset, length, number) {
        const buffer = this.buffer;
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
    getVariableLengthBuffers(offset, end, splitCode) {
        const buffer = this.buffer;
        const buffers = [];
        let inBuffer = false;
        let start;
        while (offset < end) {
            if (inBuffer) {
                if (buffer[offset] === splitCode) {
                    buffers.push(buffer.subarray(start, offset));
                    inBuffer = false;
                }
            } else {
                if (buffer[offset] !== splitCode) {
                    start = offset;
                    inBuffer = true;
                }
            }
            offset += 1;
        }
        if (inBuffer) {
            buffers.push(buffer.subarray(start, end));
        }
        return buffers;
    }
});
