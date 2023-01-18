/*jslint browser*/
/*global rsg3Encoding*/
function textToHex(text) {
    const buffer = rsg3Encoding.encode(text);
    let hex = new Array(buffer.length);
    buffer.forEach(function (byte, index) {
        hex[index] = byte.toString(16).toUpperCase().padStart(2, "0");
    });
    return hex.join(" ");
}
function hexToText(hex) {
    hex = hex.replace(/\n/g, " ");
    const buffer = new Uint8Array(hex.split(" ").map(
        (s) => parseInt(s, 16)
    ));
    return rsg3Encoding.decode(buffer);
}
const textControl = document.getElementById("text-control");
const hexControl = document.getElementById("hex-control");
const buttonClear = document.getElementById("button-clear");
textControl.addEventListener("input", function () {
    hexControl.value = textToHex(textControl.value);
});
hexControl.addEventListener("input", function () {
    textControl.value = hexToText(hexControl.value);
});
buttonClear.addEventListener("click", function () {
    textControl.value = "";
    hexControl.value = "";
})
