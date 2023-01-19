/*jslint bitwise, this*/
/*global jisx0201Encoding*/
function SNESRom(arrayBuffer) {
    const headerLength = arrayBuffer.byteLength % 1024;
    Object.defineProperties(this, {
        arrayBuffer: {value: arrayBuffer},
        buffer: {value: new Uint8Array(arrayBuffer, headerLength)},
        headerLength: {value: headerLength}
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
    getBuffers: {
        value(offset, length, number) {
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
        }
    },
    getBuffersFromList: {
        value(offset, list) {
            const buffer = this.buffer;
            const length = list.length;
            const buffers = new Array(length);
            let i = 0;
            while (i < length) {
                const end = offset + list[i];
                buffers[i] = buffer.subarray(offset, end);
                offset = end;
                i += 1;
            }
            return buffers;
        }
    },
    getBuffersFromTable: {
        value(offset, table) {
            const buffer = this.buffer;
            const length = table.length - 1;
            const buffers = new Array(length);
            let i = 0;
            while (i < length) {
                const next = i + 1;
                buffers[i] = buffer.subarray(
                    offset + table[i],
                    offset + table[next]
                );
                i = next;
            }
            return buffers;
        }
    },
    getTable: {
        value(offset, endOffset) {
            return new Uint16Array(
                this.arrayBuffer,
                offset + this.headerLength,
                (endOffset - offset) / 2
            );
        }
    }
});
