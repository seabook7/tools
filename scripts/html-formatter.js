/*jslint browser*/
/*global DOMParser, fileIO*/
const fileName = document.getElementById("file-name");
const openButton = document.getElementById("open-button");
const saveButton = document.getElementById("save-button");
const html = document.getElementById("html");
const doctype = "<!doctype html>\n";
const whitespace = /^[ \n\r\t]+|[ \n\r\t]+$/g;
const attributeOrderList = [
    "class",
    "id", "name",
    "data-",
    "src", "for", "type", "href", "value",
    "title", "alt",
    "role", "aria-",
    "tabindex",
    "style"
];
const lastIndex = attributeOrderList.length;
const attributeStartsWithList = ["data-", "aria-"];
function findAttributeOrder(attributeName) {
    const name = attributeStartsWithList.find(
        (searchString) => attributeName.startsWith(searchString)
    ) ?? attributeName;
    const index = attributeOrderList.indexOf(name);
    return (
        index === -1
        ? lastIndex
        : index
    );
}
function getAttributesText(attributes) {
    let index = 0;
    const length = attributes.length;
    const names = new Array(length);
    while (index < length) {
        names[index] = attributes[index].name;
        index += 1;
    }
    names.sort(function (a, b) {
        return findAttributeOrder(a) - findAttributeOrder(b);
    });
    return names.reduce(
        (text, name) => text + " " + name + "=\""
        + attributes.getNamedItem(name).value + "\"",
        ""
    );
}
function checkEmptyText(text) {
    return text.replace(whitespace, "") === "";
}
const voidElements = [
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "source", "track", "wbr"
];
function toHTML(element, level = 0) {
    const name = element.tagName.toLowerCase();
    let htmlText = "  ".repeat(level);
    htmlText += "<" + name + getAttributesText(element.attributes) + ">";
    if (voidElements.includes(name)) {
        htmlText += "\n";
    } else {
        const nodeList = element.childNodes;
        const length = nodeList.length;
        const onlyOneTextChild = length === 1 && nodeList[0].nodeType === 3;
        if (onlyOneTextChild) {
            htmlText += nodeList[0].nodeValue + "</" + name + ">\n";
        } else {
            let i = 0;
            htmlText += "\n";
            level += 1;
            while (i < length) {
                const node = nodeList[i];
                if (node.nodeType === 3) {
                    const text = node.nodeValue;
                    if (!checkEmptyText(text)) {
                        htmlText += text;
                    }
                } else {
                    htmlText += toHTML(node, level);
                }
                i += 1;
            }
            level -= 1;
            htmlText += "  ".repeat(level) + "</" + name + ">\n";
        }
    }
    return htmlText;
}
openButton.addEventListener("click", async function () {
    const file = await fileIO.open("text/html");
    fileName.value = file.name;
    const parser = new DOMParser();
    const {documentElement} = parser.parseFromString(
        await file.text(),
        "text/html"
    );
    html.value = doctype + toHTML(documentElement);
});
