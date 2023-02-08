/*jslint browser*/
/*global fileIO, editableTree*/
const fileName = document.getElementById("file-name");
const openButton = document.getElementById("open-button");
const saveButton = document.getElementById("save-button");
const spaceCheckbox = document.getElementById("space-checkbox");
const spaceInput = document.getElementById("space-input");
const tree = document.getElementById("tree");
spaceInput.disabled = !spaceCheckbox.checked;
openButton.addEventListener("click", async function () {
    const file = await fileIO.open("application/json");
    fileName.value = file.name;
    try {
        tree.replaceChildren(editableTree.from(await file.text()));
    } catch (error) {
        window.alert(error.message);
    }
});
saveButton.addEventListener("click", function () {
    editableTree.to(tree.firstChild);
});
spaceCheckbox.addEventListener("click", function () {
    spaceInput.disabled = !spaceCheckbox.checked;
});
