/*jslint bitwise, browser*/
/*global fileIO, jisx0201Encoding, rsg3Character, rsg3Skill*/
function getRomInfo(rom) {
    window.console.log(`Rom Info
speed: ${rom[0xffd5] >>> 4}
rom type: ${rom[0xffd5] & 0xf}
title: ${jisx0201Encoding.decode(rom.subarray(0xffc0, 0xffd5))}
rom size: ${1 << rom[0xffd7]} KB
ram size: ${1 << rom[0xffd8]} KB
ROM version: ${rom[0xffdb]}
`);
}
const fileName = document.getElementById("file-name");
const openButton = document.getElementById("open-button");
openButton.addEventListener("click", async function () {
    const file = await fileIO.open();
    fileName.value = file.name;
    const buffer = await file.arrayBuffer();
    const headerLength = 0x200;
    const rsg3Rom = (
        buffer.byteLength % 0x400 === headerLength
        ? new Uint8Array(buffer, headerLength)
        : new Uint8Array(buffer)
    );
    getRomInfo(rsg3Rom);
    window.console.log(rsg3Text(rsg3Rom));
});
