/*jslint browser*/
/*global fileIO*/
const openButton = document.getElementById("open-button");
const spaceInput = document.getElementById("space-input");
openButton.addEventListener("click", async function () {
    const file = await fileIO.open("application/json");
    const value = JSON.parse(await file.text());
    const space = parseInt(spaceInput.value);
    fileIO.download(new Blob([JSON.stringify(value, null, (
        Number.isNaN(space)
        ? spaceInput.value
        : space
    ))]), file.name);
});
