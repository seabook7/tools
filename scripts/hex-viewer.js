/*global fileIO*/
/*jslint browser*/
const fileName = document.getElementById("file-name");
const fileSize = document.getElementById("file-size");
const openButton = document.getElementById("open-button");
const header = document.getElementById("header");
const address = document.getElementById("address");
const hex = document.getElementById("hex");
function build(array) {
    let addressText = "";
    let hexText = "";
    array.forEach(function (uint8, index) {
        const remainder = index % 16;
        if (remainder === 0) {
            addressText += index.toString(16).toUpperCase().padStart(8, "0")
            + "\n";
        }
        hexText += uint8.toString(16).toUpperCase().padStart(2, "0");
        hexText += (
            remainder < 15
            ? " "
            : "\n"
        );
    });
    header.hidden = false;
    address.replaceChildren(addressText);
    hex.replaceChildren(hexText);
}
openButton.addEventListener("click", async function () {
    const file = await fileIO.open();
    fileName.value = file.name;
    fileSize.value = file.size + " bytes";
    const array = new Uint8Array(await file.arrayBuffer());
    build(array);
});
