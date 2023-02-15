/*jslint browser*/
/*global fileIO, editableTree*/
const fileName = document.getElementById("file-name");
const newButton = document.getElementById("new-button");
const openButton = document.getElementById("open-button");
const saveButton = document.getElementById("save-button");
const spaceCheckbox = document.getElementById("space-checkbox");
const spaceInput = document.getElementById("space-input");
const tree = document.getElementById("tree");
const spinner = (function () {
    const div = document.createElement("div");
    const span = document.createElement("span");
    div.className = "spinner-border text-primary";
    span.className = "visually-hidden";
    span.append("loading...");
    div.append(span);
    return div;
}());
function getBlob(value) {
    let space = spaceInput.value;
    const int = (
        space === ""
        ? 4
        : parseInt(space)
    );
    return (
        spaceCheckbox.checked
        ? new Blob([JSON.stringify(value, null, (
            Number.isNaN(int)
            ? space
            : int
        ))])
        : new Blob([JSON.stringify(value)])
    );
}
spaceInput.disabled = !spaceCheckbox.checked;
newButton.addEventListener("click", async function (event) {
    const {bottom, left} = newButton.getBoundingClientRect();
    event.stopPropagation();
    const span = await editableTree.create({x: left, y: bottom + 1});
    if (span !== undefined) {
        tree.replaceChildren(span);
    }
});
openButton.addEventListener("click", async function () {
    const file = await fileIO.open("application/json");
    fileName.value = file.name;
    tree.replaceChildren();
    tree.parentNode.append(spinner);
    try {
        const value = JSON.parse(await file.text());
        spinner.remove();
        tree.replaceChildren(editableTree.from(value));
    } catch (error) {
        window.alert(error.message);
    }
});
saveButton.addEventListener("click", function () {
    const {value} = editableTree.toValue(tree.firstChild);
    fileIO.download(getBlob(value), fileName.value);
});
spaceCheckbox.addEventListener("click", function () {
    spaceInput.disabled = !spaceCheckbox.checked;
    spaceInput.value = (
        spaceCheckbox.checked
        ? ""
        : "disabled"
    );
});
