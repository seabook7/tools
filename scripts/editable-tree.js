/*jslint browser*/
const editableTree = (function () {
    function getType(value) {
        const type = typeof value;
        switch (type) {
        case "string":
        case "number":
            return type;
        case "boolean":
            return (
                value
                ? "\"true\""
                : "\"false\""
            );
        case "object":
            if (value === null) {
                return "\"null\"";
            } else if (Array.isArray(value)) {
                return "array";
            } else {
                return type;
            }
        }
    }
    let level = 0;
    function setCountText(valueSpan, length) {
        if (valueSpan.title === "array") {
            switch (length) {
            case 0:
                valueSpan.replaceChildren("[]");
                break;
            case 1:
                valueSpan.replaceChildren("[1 element]");
                break;
            default:
                valueSpan.replaceChildren("[" + length + " elements]");
            }
        } else {
            switch (length) {
            case 0:
                valueSpan.replaceChildren("{}");
                break;
            case 1:
                valueSpan.replaceChildren("{1 member}");
                break;
            default:
                valueSpan.replaceChildren("{" + length + " members}");
            }
        }
    }
    function createTreeIcon(valueSpan, parentNode) {
        const icon = document.createElement("img");
        if (level > 0) {
            icon.src = "images/caret-right.svg";
            icon.alt = "+";
            setCountText(valueSpan, parentNode.childNodes.length - 2);
            parentNode.hidden = true;
        } else {
            icon.src = "images/caret-down.svg";
            icon.alt = "-";
            valueSpan.append(
                valueSpan.title === "array"
                ? "["
                : "{"
            );
        }
        icon.style.cursor = "pointer";
        if (level > 0) {
            icon.style.marginLeft = level + "em";
        }
        icon.addEventListener("click", function () {
            parentNode.hidden = !parentNode.hidden;
            if (parentNode.hidden) {
                icon.src = "images/caret-right.svg";
                icon.alt = "+";
                setCountText(valueSpan, parentNode.childNodes.length - 2);
            } else {
                icon.src = "images/caret-down.svg";
                icon.alt = "-";
                valueSpan.firstChild.nodeValue = (
                    valueSpan.title === "array"
                    ? "["
                    : "{"
                );
            }
        });
        return icon;
    }
    function createBlankIcon() {
        const icon = document.createElement("img");
        icon.src = "images/blank.svg";
        icon.alt = " ";
        if (level > 0) {
            icon.style.marginLeft = level + "em";
        }
        return icon;
    }
    function createEditIcon() {
        const icon = document.createElement("img");
        icon.src = "images/pencil-square.svg";
        icon.alt = "Edit";
        icon.title = "Edit";
        icon.style.cursor = "pointer";
        icon.style.marginLeft = ".5em";
        icon.style.marginRight = ".5em";
        icon.addEventListener("click", function () {
            window.alert("Feature not implemented.");
        });
        return icon;
    }
    function createInsertIcon() {
        const icon = document.createElement("img");
        icon.src = "images/plus-square.svg";
        icon.alt = "Insert";
        icon.title = "Insert";
        icon.style.cursor = "pointer";
        icon.addEventListener("click", function () {
            window.alert("Feature not implemented.");
        });
        return icon;
    }
    function createAddSpan() {
        const span = document.createElement("span");
        span.append(createBlankIcon(), createInsertIcon(), "\n");
        return span;
    }
    function createEndSpan(type, isArray) {
        const span = document.createElement("span");
        span.title = type;
        span.append(createBlankIcon(), (
            isArray
            ? "]"
            : "}"
        ) + "\n");
        return span;
    }
    function resetIndexes(parentNode) {
        let valueSpan = parentNode.previousSibling;
        while (valueSpan.nodeName !== "SPAN") {
            valueSpan = valueSpan.previousSibling;
        }
        if (valueSpan.title === "array") {
            const children = parentNode.childNodes;
            let index = 0;
            const length = children.length - 2;
            while (index < length) {
                children[index].childNodes[1].nodeValue = index + ": ";
                index += 1;
            }
        }
    }
    function createDeleteIcon() {
        const icon = document.createElement("img");
        icon.src = "images/dash-square.svg";
        icon.alt = "Delete";
        icon.title = "Delete";
        icon.style.cursor = "pointer";
        icon.style.marginLeft = ".5em";
        icon.addEventListener("click", function () {
            const child = icon.parentNode;
            const parentNode = child.parentNode;
            parentNode.removeChild(child);
            resetIndexes(parentNode);
        });
        return icon;
    }
    function from(value, key) {
        const span = document.createElement("span");
        const valueSpan = document.createElement("span");
        const type = getType(value);
        const isArray = type === "array";
        const isObject = isArray || type === "object";
        let parentNode;
        valueSpan.title = type;
        if (isObject) {
            parentNode = document.createElement("span");
            level += 1;
            if (isArray) {
                value.forEach(function (element, index) {
                    parentNode.append(from(element, index));
                });
            } else {
                Object.entries(
                    value
                ).forEach(function ([objectKey, objectValue]) {
                    parentNode.append(from(objectValue, objectKey));
                });
            }
            parentNode.append(createAddSpan());
            level -= 1;
            parentNode.append(createEndSpan(type, isArray));
            // createTreeIcon also set value's text
            span.append(createTreeIcon(valueSpan, parentNode));
        } else {
            span.append(createBlankIcon());
            // set value's text
            valueSpan.append(JSON.stringify(value));
        }
        if (key !== undefined) {
            span.append(
                // set key's text
                JSON.stringify(key) + ": ",
                valueSpan,
                createEditIcon(),
                createInsertIcon(),
                createDeleteIcon()
            );
        } else {
            span.append(
                valueSpan,
                createEditIcon()
            );
        }
        span.append("\n");
        if (isObject) {
            span.append(parentNode);
        }
        return span;
    }
    function toValue(span) {
        const nodeList = span.childNodes;
        let valueSpan;
        let children;
        let key;
        let value;
        const node1 = nodeList[1];
        const lastNode = nodeList[nodeList.length - 1];
        if (node1.nodeType === 3) {
            const keyText = node1.nodeValue;
            key = JSON.parse(keyText.substring(0, keyText.length - 2));
            valueSpan = nodeList[2];
        } else {
            valueSpan = node1;
        }
        if (lastNode.nodeType === 1) {
            children = lastNode.childNodes;
        }
        if (children === undefined) {
            value = JSON.parse(valueSpan.firstChild.nodeValue);
        } else {
            let index = 0;
            const length = children.length - 2;
            if (valueSpan.title === "array") {
                value = new Array(length);
                while (index < length) {
                    value[index] = toValue(children[index]).value;
                    index += 1;
                }
            } else {
                value = {};
                while (index < length) {
                    const result = toValue(children[index]);
                    value[result.key] = result.value;
                    index += 1;
                }
            }
        }
        return {key, value};
    }
    return {
        from,
        toValue
    };
}());
