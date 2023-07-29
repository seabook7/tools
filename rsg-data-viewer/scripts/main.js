/*jslint bitwise, browser*/
/*global fileIO, rsg3Text, rsg3Character, SNESRom*/
const fileName = document.getElementById("file-name");
const openButton = document.getElementById("open-button");
const data = {};
openButton.addEventListener("click", async function () {
    const file = await fileIO.open();
    fileName.value = file.name;
    const arrayBuffer = await file.arrayBuffer();
    const rsg3Rom = new SNESRom(arrayBuffer);
    data.text = rsg3Text(rsg3Rom);
    data.charactor = rsg3Character(rsg3Rom);
    console.log(data);
    //fileIO.download(new Blob([JSON.stringify(data, null, 4)]), "data.json");
});
