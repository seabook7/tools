/*jslint browser*/
/*global fileIO*/
const fileName = document.getElementById("file-name");
const openButton = document.getElementById("open-button");
const saveButton = document.getElementById("save-button");
const spaceInput = document.getElementById("space-input");
const jsonText = document.getElementById("json-text");
let value;
function buildText(value, space) {
    const int = (
        space === ""
        ? 4
        : parseInt(space)
    );
    return JSON.stringify(value, null, (
        Number.isNaN(int)
        ? space
        : int
    ));
}
openButton.addEventListener("click", async function () {
    const file = await fileIO.open("application/json");
    fileName.value = file.name;
    value = JSON.parse(await file.text());
    jsonText.replaceChildren(buildText(value, spaceInput.value));
});
saveButton.addEventListener("click", function () {
    if (jsonText.firstChild) {
        fileIO.download(
            new Blob([jsonText.firstChild.nodeValue]),
            fileName.value
        );
    }
});
spaceInput.addEventListener("change", function () {
    jsonText.replaceChildren(
        buildText(value, spaceInput.value)
    );
});
