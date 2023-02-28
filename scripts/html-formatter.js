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
            alert("Please set language attribute of html element.", "warning");
        } else if (documentElement.getAttribute("lang") === "") {
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
    function getAlertMessage(number, name, element) {
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
                        getAlertMessage(number, name, element)
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
    function getAttributesText(attributes, attributeOrder) {
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
    let numberOfChanged;
    let elementsOfChanged;
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
    const allWhitespace = /^[\t\n\f\r ]*$/;
    const startAndEndWhitespace = /^[\t\n\f\r ]+|[\t\n\f\r ]+$/g;
    function toHTML(element, level = 0) {
        if (level === 0) {
            numberOfChanged = 0;
            elementsOfChanged = [];
        }
        const name = element.tagName.toLowerCase();
        const elementIndent = indent.repeat(level);
        const attributeOrder = {hasChanged: false};
        let htmlText = elementIndent + "<" + name + getAttributesText(
            element.attributes,
            attributeOrder
        ) + ">";
        if (attributeOrder.hasChanged) {
            numberOfChanged += 1;
            elementsOfChanged.push(
                getAlertMessage(numberOfChanged, name, element)
            );
        }
        if (voidElements.includes(name)) {
            htmlText += "\n";
        } else if (rawTextElements.includes(name)) {
            if (element.hasChildNodes()) {
                htmlText += element.firstChild.nodeValue;
            }
            htmlText += "</" + name + ">\n";
        } else if (escapableRawTextElements.includes(name)) {
            if (element.hasChildNodes()) {
                htmlText += escape(element.firstChild.nodeValue);
            }
            htmlText += "</" + name + ">\n";
        } else {
            const nodeList = element.childNodes;
            const length = nodeList.length;
            const firstChild = element.firstChild;
            if (length === 0) {
                htmlText += "</" + name + ">\n";
            } else if (length === 1 && firstChild.nodeType === 3) {
                htmlText += firstChild.nodeValue.replace(
                    startAndEndWhitespace,
                    ""
                );
                htmlText += "</" + name + ">\n";
            } else {
                htmlText += "\n";
                let index = 0;
                level += 1;
                const childIndent = indent.repeat(level);
                while (index < length) {
                    const node = nodeList[index];
                    const nodeValue = node.nodeValue;
                    switch (node.nodeType) {
                    case 1:
                        htmlText += toHTML(node, level);
                        break;
                    case 3:
                        if (!allWhitespace.test(nodeValue)) {
                            htmlText += childIndent + nodeValue.replace(
                                startAndEndWhitespace,
                                ""
                            ) + "\n";
                        }
                        break;
                    case 8:
                        htmlText += (
                            childIndent + "<!--" + nodeValue + "-->\n"
                        );
                        break;
                    }
                    index += 1;
                }
                level -= 1;
                htmlText += elementIndent + "</" + name + ">\n";
            }
        }
        if (level === 0) {
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
