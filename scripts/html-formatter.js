/*jslint browser*/
/*global DOMParser, fileIO*/
// reference:
// https://codeguide.co/
(function () {
    const fileNameInput = document.getElementById("file-name-input");
    const openButton = document.getElementById("open-button");
    const formatButton = document.getElementById("format-button");
    const saveButton = document.getElementById("save-button");
    const lineNumbersTextarea = document.getElementById("line-numbers-textarea");
    const htmlTextarea = document.getElementById("html-textarea");
    const alertPlaceholder = document.getElementById("live-alert-placeholder");
    const doctype = "<!doctype html>\n";
    function alert(message, type) {
        const wrapper = document.createElement("div");
        const messageDiv = document.createElement("div");
        const closeButton = document.createElement("button");
        messageDiv.append(message);
        closeButton.className = "btn-close";
        closeButton.type = "button";
        closeButton.dataset.bsDismiss = "alert";
        wrapper.className = "alert alert-" + type + " alert-dismissible me-4";
        wrapper.append(messageDiv, closeButton);
        alertPlaceholder.append(wrapper);
    }
    function setLanguageAttribute(documentElement) {
        if (!documentElement.hasAttribute("lang")) {
            documentElement.setAttribute("lang", "");
            alert("Please set language attribute of html element.", "warning");
        } else if (documentElement.getAttribute("lang") === "") {
            alert("Please set language attribute of html element.", "warning");
        }
    }
    function removeIECompatibilityMode(metaArray) {
        metaArray.forEach(function (meta) {
            if (meta.getAttribute("http-equiv") === "X-UA-Compatible") {
                meta.remove();
                alert("IE compatibility mode has been removed.", "info");
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
            alert("Added \"utf-8\" character encoding to head.", "info");
        }
    }
    const typeAttributeElements = ["link", "style", "script"];
    function removeTypeAttribute(documentElement) {
        const elementsOfRemoved = [];
        let index = 0;
        typeAttributeElements.forEach(function (name) {
            const array = Array.from(
                documentElement.getElementsByTagName(name)
            );
            array.forEach(function (element) {
                if (element.hasAttribute("type")) {
                    element.removeAttribute("type");
                    index += 1;
                    let elementOfRemoved = index + ": " + name;
                    if (element.hasAttribute("id")) {
                        const id = element.getAttribute("id");
                        if (id !== "") {
                            elementOfRemoved += "#" + id;
                        }
                    }
                    elementsOfRemoved.push(elementOfRemoved);
                }
            });
        });
        const length = elementsOfRemoved.length;
        if (length > 0) {
            let message = "Type attribute of " + length + " element";
            if (length > 1) {
                message += "s";
            }
            message += " has been removed.\n";
            message += elementsOfRemoved.join("\n");
            alert(message, "info");
        }
    }
    const indent = "  ";
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
    const specialCharacters = /[<>"&]/g;
    function escapeAttributeValue(attributeValue) {
        return attributeValue.replace(specialCharacters, function (match) {
            switch (match) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "\"":
                return "&quot;";
            case "&":
                return "&amp;";
            }
        });
    }
    function getAttributesText(attributes, attributeOrder) {
        let index = 0;
        const length = attributes.length;
        const object = {};
        while (index < length) {
            const attribute = attributes[index];
            object[attribute.name] = attribute.value;
            index += 1;
        }
        const names = Object.keys(object);
        names.sort(function (a, b) {
            const result = findAttributeOrder(a) - findAttributeOrder(b);
            if (result > 0) {
                attributeOrder.hasChanged = true;
            }
            return result;
        });
        return names.reduce(function (text, name) {
            const value = object[name];
            text += " " + name;
            if (
                !(name.startsWith("data-") && (value === ""))
                && !booleanAttributes.includes(name)
            ) {
                text += "=\"" + escapeAttributeValue(value) + "\"";
            }
            return text;
        }, "");
    }
    let indexOfChanged;
    let elementsOfChanged;
    // reference:
    // https://html.spec.whatwg.org/multipage/syntax.html#void-elements
    const voidElements = [
        "area", "base", "br", "col", "embed", "hr", "img", "input",
        "link", "meta", "source", "track", "wbr"
    ];
    // reference:
    // https://infra.spec.whatwg.org/#ascii-whitespace
    const whitespace = /^[\t\n\f\r ]*$/;
    function toHTML(element, level = 0) {
        const name = element.tagName.toLowerCase();
        let htmlText = indent.repeat(level);
        const attributeOrder = {hasChanged: false};
        if (level === 0) {
            indexOfChanged = 0;
            elementsOfChanged = [];
        }
        htmlText += "<" + name + getAttributesText(
            element.attributes,
            attributeOrder
        ) + ">";
        if (attributeOrder.hasChanged) {
            indexOfChanged += 1;
            let elementOfChanged = indexOfChanged + ": " + name;
            if (element.hasAttribute("id")) {
                const id = element.getAttribute("id");
                if (id !== "") {
                    elementOfChanged += "#" + id;
                }
            }
            elementsOfChanged.push(elementOfChanged);
        }
        if (voidElements.includes(name)) {
            htmlText += "\n";
        } else {
            const nodeList = element.childNodes;
            const length = nodeList.length;
            if (length === 0) {
                htmlText += "</" + name + ">\n";
            } else if (length === 1 && nodeList[0].nodeType === 3) {
                htmlText += nodeList[0].nodeValue + "</" + name + ">\n";
            } else {
                let index = 0;
                htmlText += "\n";
                level += 1;
                while (index < length) {
                    const node = nodeList[index];
                    if (node.nodeType === 3) {
                        const text = node.nodeValue;
                        if (!whitespace.test(text)) {
                            htmlText += text;
                        }
                    } else {
                        htmlText += toHTML(node, level);
                    }
                    index += 1;
                }
                level -= 1;
                htmlText += indent.repeat(level) + "</" + name + ">\n";
            }
        }
        if (level === 0) {
            const lengthOfChanged = elementsOfChanged.length;
            if (lengthOfChanged > 0) {
                let message = "Attribute order of " + lengthOfChanged
                + " element";
                if (lengthOfChanged > 1) {
                    message += "s";
                }
                message += " has been changed.\n";
                message += elementsOfChanged.join("\n");
                alert(message, "info");
            }
            if (!alertPlaceholder.hasChildNodes()) {
                alert("Formatting completed.", "success");
            }
        }
        return htmlText;
    }
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
    showLineNumbers();
}());
document.body.style.height = window.innerHeight + "px";
window.addEventListener("resize", function () {
    document.body.style.height = window.innerHeight + "px";
});
