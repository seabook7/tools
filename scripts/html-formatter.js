/*jslint browser*/
/*global DOMParser, fileIO*/
// reference:
// https://codeguide.co/
(function () {
    const fileNameInput = document.getElementById("file-name-input");
    const openButton = document.getElementById("open-button");
    const formatButton = document.getElementById("format-button");
    const saveButton = document.getElementById("save-button");
    const lineNumbersTextarea = (
        document.getElementById("line-numbers-textarea")
    );
    const htmlTextarea = document.getElementById("html-textarea");
    const alertPlaceholder = document.getElementById("live-alert-placeholder");
    function resizeBodyHeight() {
        document.body.style.height = window.innerHeight + "px";
    }
    window.addEventListener("resize", resizeBodyHeight);
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
    openButton.addEventListener("click", async function () {
        const file = await fileIO.open("text/html");
        fileNameInput.value = file.name;
        alertPlaceholder.replaceChildren();
        htmlTextarea.value = await file.text();
        showLineNumbers();
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
        let index = 0;
        const length = attributes.length;
        const object = {};
        while (index < length) {
            const {name, value} = attributes[index];
            object[name] = value;
            index += 1;
        }
        return Object.entries(object).sort(function ([a], [b]) {
            const result = findAttributeOrder(a) - findAttributeOrder(b);
            if (result > 0) {
                attributeOrder.hasChanged = true;
            }
            return result;
        }).reduce(function (text, [name, value]) {
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
    function createCommentTags(comment) {
        return "<!--" + comment + "-->";
    }
    function createEndTags(name) {
        return "</" + name + ">";
    }
    function toHTML(element, spaces = "") {
        const name = element.tagName.toLowerCase();
        let htmlText = (
            checkTextNode(element.previousSibling)
            ? ""
            : spaces
        );
        htmlText += createStartTags(name, element);
        if (!voidElements.includes(name)) {
            if (element.hasChildNodes()) {
                if (rawTextElements.includes(name)) {
                    htmlText += element.firstChild.nodeValue;
                } else if (escapableRawTextElements.includes(name)) {
                    htmlText += escape(element.firstChild.nodeValue);
                } else {
                    let index = 0;
                    const childNodes = element.childNodes;
                    const length = childNodes.length;
                    const childSpaces = spaces + "  ";
                    if (!checkTextNode(element.firstChild)) {
                        htmlText += "\n";
                    }
                    while (index < length) {
                        const node = childNodes[index];
                        const nodeValue = node.nodeValue;
                        switch (node.nodeType) {
                        case 1:
                            htmlText += toHTML(node, childSpaces);
                            break;
                        case 3:
                            if (!whitespace.test(nodeValue)) {
                                htmlText += (
                                    (
                                        name === "body"
                                        && node === element.lastChild
                                    )
                                    /*
                                    If the last node of the body is a text
                                    node, the browser will add two line breaks
                                    at the end of the text node.
                                    */
                                    ? nodeValue.replace(/\n\n$/, "")
                                    : nodeValue
                                );
                            }
                            break;
                        case 8:
                            htmlText += childSpaces + createCommentTags(
                                nodeValue
                            );
                            break;
                        }
                        index += 1;
                    }
                    if (!checkTextNode(element.lastChild)) {
                        htmlText += spaces;
                    }
                }
            }
            htmlText += createEndTags(name);
        }
        if (!checkTextNode(element.nextSibling)) {
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
            htmlTextarea.value = doctype + toHTML(documentElement);
            showLineNumbers();
        } catch (error) {
            alert(error.message, "danger");
        }
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
