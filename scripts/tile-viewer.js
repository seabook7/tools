/*global ImageData*/
/**
 * @param {Uint8Array} bytes 1 bit per pixel
 * @param {number[]} [color] [red, green, blue, alpha]
 * @returns {Uint8ClampedArray} ImageData.data
 */
function bpp1ToData(bytes, color = [255, 255, 255, 255]) {
    const bitList = [128, 64, 32, 16, 8, 4, 2, 1];
    const data = new Uint8ClampedArray(bytes.length * 32);
    let offset = 0;
    bytes.forEach(function (byte) {
        bitList.forEach(function (bit) {
            if (byte >= bit) {
                data.set(color, offset);
                byte -= bit;
            }
            offset += 4;
        });
    });
    return data;
}
/**
 * @param {Uint8ClampedArray} data ImageData.data
 * @param {number} [width] tile width
 * @param {number} [height] tile height
 * @returns {ImageData[]}
 */
function createTiles(data, width = 8, height = 8) {
    let begin = 0;
    let end = 0;
    const length = data.length;
    const size = width * height * 4;
    const tiles = new Array(length / size);
    let index = 0;
    while (begin < length) {
        end = begin + size;
        tiles[index] = new ImageData(
            data.subarray(begin, end),
            width,
            height
        );
        index += 1;
        begin = end;
    }
    return tiles;
}
/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {ImageData[]} tiles
 * @param {number} [width] tile width
 * @param {number} [height] tile height
 * @param {number} numberOfColumns number of columns
 */
function arrangeTiles(ctx, tiles, width = 8, height = 8, numberOfColumns = 16) {
    let column = 0;
    let row = 0;
    tiles.forEach(function (tile) {
        ctx.putImageData(tile, column * width, row * height);
        column += 1;
        if (column === numberOfColumns) {
            column = 0;
            row += 1;
        }
    });
}
