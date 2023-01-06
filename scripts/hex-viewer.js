/*global
    fileIO
*/
/*jslint
    browser
*/
const fileName = document.getElementById("file-name");
const fileSize = document.getElementById("file-size");
const openButton = document.getElementById("open-button");
const hexText = document.getElementById("hex-text");
function buildText(array) {
    let i = 0;
    let text = "         | 00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F\r\n";
    text += "---------+------------------------------------------------\r\n";
    while (i < array.length) {
        const remainder = i % 16;
        if (remainder === 0) {
            text += i.toString(16).toUpperCase().padStart(8, "0") + " | ";
        }
        text += array[i].toString(16).toUpperCase().padStart(2, "0");
        text += (
            remainder < 15
            ? " "
            : "\r\n"
        );
        i += 1;
    }
    return text;
}
openButton.addEventListener("click", async function () {
    const file = await fileIO.open();
    fileName.value = file.name;
    fileSize.replaceChildren(file.size + " bytes");
    const array = new Uint8Array(await file.arrayBuffer());
    hexText.replaceChildren(buildText(array));
});
