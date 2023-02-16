/*jslint browser*/
/*global DOMParser, fileIO*/
const fileName = document.getElementById("file-name");
const openButton = document.getElementById("open-button");
const saveButton = document.getElementById("save-button");
const html = document.getElementById("html");
function buildDocType(doctype) {
    let text = "<!doctype " + doctype.name;
    if (doctype.publicId !== "") {
        text += " public \"" + doctype.publicId + "\"";
    }
    if (doctype.systemId !== "") {
        text += " \"" + doctype.systemId + "\"";
    }
    return text + ">\n";
}
function buildElement(element, level) {
    const space = "  ".repeat(level);
    return space + element.outerHTML;
}
function format(document) {
    let text = buildDocType(document.doctype);
    let level = 0;
    text += buildElement(document.documentElement, level);
    return text;
}
openButton.addEventListener("click", async function () {
    const type = "text/html";
    const file = await fileIO.open(type);
    const parser = new DOMParser();
    fileName.value = file.name;
    const htmlDocument = parser.parseFromString(await file.text(), type);
    let text = format(htmlDocument);
    html.value = text;
    console.log(htmlDocument.documentElement.firstChild.nodeName);
});

