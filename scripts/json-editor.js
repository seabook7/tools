/*jslint browser*/
/*global fileIO, editableTree*/
const fileName = document.getElementById("file-name");
const newButton = document.getElementById("new-button");
const openButton = document.getElementById("open-button");
const saveButton = document.getElementById("save-button");
const spacesCheckbox = document.getElementById("spaces-checkbox");
const spacesInput = document.getElementById("spaces-input");
const tree = document.querySelector("div.flex-fill");
const spinner = (function () {
    const div = document.createElement("div");
    const span = document.createElement("span");
    div.className = "spinner-border text-primary";
    span.className = "visually-hidden";
    span.append("loading...");
    div.append(span);
    return div;
}());
// set height of body to 100%
(function () {
    function resizeHeight() {
        document.body.style.height = window.innerHeight + "px";
    }
    resizeHeight();
    window.addEventListener("resize", resizeHeight);
}());
function getBlob(value) {
    let spaces = spacesInput.value;
    const int = (
        spaces === ""
        ? 4
        : parseInt(spaces)
    );
    return (
        spacesCheckbox.checked
        ? new Blob([JSON.stringify(value, null, (
            Number.isNaN(int)
            ? spaces
            : int
        ))])
        : new Blob([JSON.stringify(value)])
    );
}
newButton.addEventListener("click", async function (event) {
    event.stopPropagation();
    const {bottom, left} = newButton.getBoundingClientRect();
    const span = await editableTree.create({x: left, y: bottom + 1});
    if (span !== undefined) {
        tree.replaceChildren(span);
    }
});
openButton.addEventListener("click", async function () {
    const file = await fileIO.open("application/json");
    if (file) {
        fileName.value = file.name;
        tree.replaceChildren(spinner);
        try {
            const value = JSON.parse(await file.text());
            tree.replaceChildren(editableTree.from(value));
        } catch (error) {
            window.alert(error.message);
        }
    }
});
saveButton.addEventListener("click", function () {
    if (tree.firstChild !== null) {
        const [value] = editableTree.toValue(tree.firstChild);
        fileIO.download(getBlob(value), fileName.value);
    }
});
spacesCheckbox.addEventListener("click", function () {
    spacesInput.disabled = !spacesCheckbox.checked;
    spacesInput.value = (
        spacesCheckbox.checked
        ? ""
        : "disabled"
    );
});
spacesInput.disabled = !spacesCheckbox.checked;
