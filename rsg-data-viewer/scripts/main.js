/*jslint bitwise, browser*/
/*global fileIO, rsg3Text, SNESRom*/
const fileName = document.getElementById("file-name");
const openButton = document.getElementById("open-button");
openButton.addEventListener("click", async function () {
    const file = await fileIO.open();
    fileName.value = file.name;
    const arrayBuffer = await file.arrayBuffer();
    const rsg3Rom = new SNESRom(arrayBuffer);
    window.console.log(rsg3Text(rsg3Rom));
});
