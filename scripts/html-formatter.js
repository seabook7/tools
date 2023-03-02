/*jslint browser*/
/*global DOMParser, fileIO*/
// reference:
// https://codeguide.co/
(function () {
    const fileNameInput = document.getElementById("file-name-input");
    const newButton = document.getElementById("new-button");
    const openButton = document.getElementById("open-button");
    const formatButton = document.getElementById("format-button");
    const revertButton = document.getElementById("revert-button");
    const saveButton = document.getElementById("save-button");
    const lineNumbersTextarea = document.getElementById(
        "line-numbers-textarea"
    );
    const htmlTextarea = document.getElementById("html-textarea");
    const alertPlaceholder = document.getElementById("live-alert-placeholder");
    function resizeBodyHeight() {
        document.body.style.height = window.innerHeight + "px";
    }
    window.addEventListener("resize", resizeBodyHeight);
    const newHTML = `<!doctype html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title></title>
  </head>
  <body>
  </body>
</html>
`;
    function showLineNumbers() {
        const count = htmlTextarea.value.split("\n").length;
        let number = 0;
        let lineNumbers = "";
        while (number < count) {
            number += 1;
            lineNumbers += number + "\n";
        }
        lineNumbersTextarea.value = lineNumbers;
    }
    newButton.addEventListener("click", function () {
        alertPlaceholder.replaceChildren();
        fileNameInput.value = "New.html";
        htmlTextarea.value = newHTML;
        showLineNumbers();
    });
    openButton.addEventListener("click", async function () {
        const file = await fileIO.open("text/html");
        if (file) {
            alertPlaceholder.replaceChildren();
            fileNameInput.value = file.name;
            htmlTextarea.value = await file.text();
            showLineNumbers();
        }
    });
    const doctype = "<!doctype html>\n";
    function alert(message, type) {
        const wrapper = document.createElement("div");
        const messageDiv = document.createElement("div");
        const closeButton = document.createElement("button");
        messageDiv.append(message);
        closeButton.className = "btn-close";
        closeButton.dataset.bsDismiss = "alert";
        closeButton.type = "button";
        wrapper.className = "alert alert-" + type + " alert-dismissible me-4";
        wrapper.append(messageDiv, closeButton);
        alertPlaceholder.append(wrapper);
    }
    function setLanguageAttribute(documentElement) {
        if (!documentElement.hasAttribute("lang")) {
            documentElement.setAttribute("lang", "");
        }
        if (documentElement.getAttribute("lang") === "") {
            alert("Please set language attribute of html element.", "warning");
        }
    }
    function removeIECompatibilityMode(metaArray) {
        metaArray.forEach(function (meta) {
            if (meta.getAttribute("http-equiv") === "X-UA-Compatible") {
                meta.remove();
                alert(
                    "Meta element of IE compatibility mode has been removed.",
                    "info"
                );
            }
        });
    }
    function setCharacterEncoding(metaArray, head) {
        const hasCharset = metaArray.some(function (meta) {
            const result = meta.hasAttribute("charset");
            if (result && meta.getAttribute("charset") !== "utf-8") {
                meta.setAttribute("charset", "utf-8");
                alert(
                    "Character encoding has been changed to \"utf-8\".",
                    "info"
                );
            }
            return result;
        });
        if (!hasCharset) {
            const meta = document.createElement("meta");
            meta.setAttribute("charset", "utf-8");
            head.insertBefore(meta, head.firstChild);
            alert("Character encoding has been set to \"utf-8\".", "info");
        }
    }
    const typeAttributeElements = ["link", "style", "script"];
    function createAlertMessage(number, name, element) {
        let message = number + ": " + name;
        if (element.hasAttribute("id")) {
            const id = element.getAttribute("id");
            if (id !== "") {
                return message + "#" + id;
            }
        }
        return message;
    }
    function removeTypeAttribute(documentElement) {
        const elementsOfRemoved = [];
        let number = 0;
        typeAttributeElements.forEach(function (name) {
            Array.from(
                documentElement.getElementsByTagName(name)
            ).forEach(function (element) {
                if (element.hasAttribute("type")) {
                    element.removeAttribute("type");
                    number += 1;
                    elementsOfRemoved.push(
                        createAlertMessage(number, name, element)
                    );
                }
            });
        });
        const count = elementsOfRemoved.length;
        if (count > 0) {
            let message = "Type attribute of " + count + " element";
            if (count > 1) {
                message += "s";
            }
            message += " has been removed.\n";
            message += elementsOfRemoved.join("\n");
            alert(message, "info");
        }
    }
    let originalHTML;
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
    const lastOrder = attributeOrderList.length;
    const attributeStartsWithList = ["data-", "aria-"];
    function findAttributeOrder(attributeName) {
        const name = attributeStartsWithList.find(
            (searchString) => attributeName.startsWith(searchString)
        ) ?? attributeName;
        const index = attributeOrderList.indexOf(name);
        return (
            index >= 0
            ? index
            : lastOrder
        );
    }
    // reference:
    // https://html.spec.whatwg.org/multipage/indices.html#attributes-3
    const booleanAttributes = [
        "allowfullscreen", "async", "autofocus", "autoplay",
        "checked", "controls", "default", "defer",
        "disabled", "formnovalidate", "inert", "ismap",
        "itemscope", "loop", "multiple", "muted",
        "nomodule", "novalidate", "open", "playsinline",
        "readonly", "required", "reversed", "selected"
    ];
    const specialCharacters = /[<>"'&]/g;
    function escape(string, unescapeCharacters = "") {
        return string.replace(specialCharacters, function (match) {
            if (unescapeCharacters.includes(match)) {
                return match;
            }
            switch (match) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "\"":
                return "&quot;";
            case "'":
                return "&apos;";
            case "&":
                return "&amp;";
            }
        });
    }
    function createAttributesText(attributes, attributeOrder) {
        const array = Array.from(attributes);
        let orderIsWrong = false;
        let index = 0;
        const length = array.length - 1;
        while (index < length) {
            const next = index + 1;
            if (
                findAttributeOrder(array[index].name)
                > findAttributeOrder(array[next].name)
            ) {
                orderIsWrong = true;
            }
            index = next;
        }
        if (orderIsWrong) {
            array.sort(function ({name: a}, {name: b}) {
                return findAttributeOrder(a) - findAttributeOrder(b);
            });
            attributeOrder.hasChanged = true;
        }
        return array.reduce(function (text, {name, value}) {
            text += " " + name;
            if (
                !(name.startsWith("data-") && value === "")
                && !booleanAttributes.includes(name)
            ) {
                text += "=\"" + escape(value, "'") + "\"";
            }
            return text;
        }, "");
    }
    let numberOfChanged = 0;
    let elementsOfChanged = [];
    function createStartTags(name, element) {
        const attributeOrder = {hasChanged: false};
        const startTags = "<" + name + createAttributesText(
            element.attributes,
            attributeOrder
        ) + ">";
        if (attributeOrder.hasChanged) {
            numberOfChanged += 1;
            elementsOfChanged.push(
                createAlertMessage(numberOfChanged, name, element)
            );
        }
        return startTags;
    }
    // reference:
    // https://html.spec.whatwg.org/multipage/syntax.html#elements-2
    const voidElements = [
        "area", "base", "br", "col", "embed", "hr", "img", "input",
        "link", "meta", "source", "track", "wbr"
    ];
    const rawTextElements = ["script", "style"];
    const escapableRawTextElements = ["textarea", "title"];
    // reference:
    // https://infra.spec.whatwg.org/#ascii-whitespace
    const whitespace = /^[\t\n\f\r ]*$/;
    /**
     * Determines whether the node is a text node and is not whitespace,
     * returning true or false as appropriate.
     * @param {Node?} node The node to determines.
     */
    function checkTextNode(node) {
        return (
            node?.nodeType === 3
            ? !whitespace.test(node.nodeValue)
            : false
        );
    }
    function createComment(comment) {
        return "<!--" + comment + "-->";
    }
    function createEndTags(name) {
        return "</" + name + ">";
    }
    function toHTML(node, spaces = "") {
        const isElement = node.nodeType === 1;
        const name = (
            isElement
            ? node.tagName.toLowerCase()
            : ""
        );
        let htmlText = "";
        if (!checkTextNode(node.previousSibling)) {
            htmlText += spaces;
        }
        htmlText += (
            isElement
            ? createStartTags(name, node)
            : createComment(node.nodeValue)
        );
        if (isElement && !voidElements.includes(name)) {
            if (node.hasChildNodes()) {
                if (rawTextElements.includes(name)) {
                    htmlText += node.firstChild.nodeValue;
                } else if (escapableRawTextElements.includes(name)) {
                    htmlText += escape(node.firstChild.nodeValue);
                } else {
                    if (!checkTextNode(node.firstChild)) {
                        htmlText += "\n";
                    }
                    Array.from(node.childNodes).forEach(function (child) {
                        const nodeValue = child.nodeValue;
                        switch (child.nodeType) {
                        case 1:
                        case 8:
                            htmlText += toHTML(child, spaces + "  ");
                            break;
                        case 3:
                            if (!whitespace.test(nodeValue)) {
                                htmlText += (
                                    (
                                        name === "body"
                                        && child === node.lastChild
                                    )
                                    /*If the last node of the body is a text
                                    node, the browser will add two line breaks
                                    at the end of the text node.*/
                                    ? nodeValue.replace(/\n\n$/, "")
                                    : nodeValue
                                );
                            }
                            break;
                        }
                    });
                    if (!checkTextNode(node.lastChild)) {
                        htmlText += spaces;
                    }
                }
            }
            htmlText += createEndTags(name);
        }
        if (!checkTextNode(node.nextSibling)) {
            htmlText += "\n";
        }
        if (name === "html") {
            const count = elementsOfChanged.length;
            if (count > 0) {
                let message = "Attribute order of " + count + " element";
                if (count > 1) {
                    message += "s";
                }
                message += " has been changed.\n";
                message += elementsOfChanged.join("\n");
                alert(message, "info");
            }
            if (!alertPlaceholder.hasChildNodes()) {
                alert("Formatting completed.", "success");
            }
            numberOfChanged = 0;
            elementsOfChanged = [];
        }
        return htmlText;
    }
    formatButton.addEventListener("click", function () {
        alertPlaceholder.replaceChildren();
        try {
            const parser = new DOMParser();
            const {documentElement, head} = parser.parseFromString(
                htmlTextarea.value,
                "text/html"
            );
            const metaArray = Array.from(head.getElementsByTagName("meta"));
            setLanguageAttribute(documentElement);
            removeIECompatibilityMode(metaArray);
            setCharacterEncoding(metaArray, head);
            removeTypeAttribute(documentElement);
            const html = doctype + toHTML(documentElement);
            if (htmlTextarea.value !== html) {
                originalHTML = htmlTextarea.value;
                htmlTextarea.value = html;
                showLineNumbers();
                revertButton.disabled = false;
            }
        } catch (error) {
            alert(error.message, "danger");
        }
    });
    revertButton.disabled = true;
    revertButton.addEventListener("click", function () {
        alertPlaceholder.replaceChildren();
        htmlTextarea.value = originalHTML;
        showLineNumbers();
        revertButton.disabled = true;
    });
    saveButton.addEventListener("click", function () {
        const blob = new Blob([htmlTextarea.value], {endings: "native"});
        fileIO.download(blob, fileNameInput.value);
    });
    htmlTextarea.addEventListener("input", showLineNumbers);
    htmlTextarea.addEventListener("scroll", function () {
        lineNumbersTextarea.scrollTop = htmlTextarea.scrollTop;
    });
    resizeBodyHeight();
    showLineNumbers();
}());
