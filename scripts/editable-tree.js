/*jslint browser*/
const editableTree = (function () {
    const elementType = (function () {
        function create(name, defaultValue, isCollection, editable) {
            return {defaultValue, editable, isCollection, name};
        }
        return [
            create("object", "{}", true, false),
            create("array", "[]", true, false),
            create("string", "\"\"", false, true),
            create("number", "0", false, true),
            create("\"true\"", "true", false, false),
            create("\"false\"", "false", false, false),
            create("\"null\"", "null", false, false)
        ];
    }());
    function getTypeIndex(value) {
        const type = typeof value;
        switch (type) {
        case "string":
            return 2;
        case "number":
            return 3;
        case "boolean":
            return (
                value
                ? 4
                : 5
            );
        case "object":
            if (value === null) {
                return 6;
            } else if (Array.isArray(value)) {
                return 1;
            } else {
                return 0;
            }
        }
    }
    let level = 0;
    function setObjectText(valueSpan, length) {
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
    function setArrayText(valueSpan, length) {
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
    }
    function createTreeIcon(valueSpan, parentNode) {
        const icon = document.createElement("img");
        const isObject = valueSpan.dataset.typeIndex === "0";
        if (level > 0) {
            const length = parentNode.childNodes.length - 2;
            icon.src = "images/caret-right.svg";
            icon.alt = "+";
            if (isObject) {
                setObjectText(valueSpan, length);
            } else {
                setArrayText(valueSpan, length);
            }
            parentNode.hidden = true;
        } else {
            icon.src = "images/caret-down.svg";
            icon.alt = "-";
            valueSpan.append(
                isObject
                ? "{"
                : "["
            );
        }
        icon.style.cursor = "pointer";
        if (level > 0) {
            icon.style.marginLeft = level + "em";
        }
        icon.addEventListener("click", function () {
            parentNode.hidden = !parentNode.hidden;
            if (parentNode.hidden) {
                const newLength = parentNode.childNodes.length - 2;
                icon.src = "images/caret-right.svg";
                icon.alt = "+";
                if (isObject) {
                    setObjectText(valueSpan, newLength);
                } else {
                    setArrayText(valueSpan, newLength);
                }
            } else {
                icon.src = "images/caret-down.svg";
                icon.alt = "-";
                valueSpan.firstChild.nodeValue = (
                    isObject
                    ? "{"
                    : "["
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
    const nameInput = (function () {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "form-control";
        input.title = "name";
        return input;
    }());
    const valueInput = (function () {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "form-control";
        input.title = "value";
        return input;
    }());
    const typeSelect = (function () {
        const select = document.createElement("select");
        select.className = "form-select";
        select.title = "type";
        elementType.forEach(function (type) {
            const option = document.createElement("option");
            option.append(type.name);
            select.append(option);
        });
        select.addEventListener("change", function () {
            const type = elementType[select.selectedIndex];
            valueInput.value = type.defaultValue;
            valueInput.disabled = !type.editable;
        });
        return select;
    }());
    const okButton = (function () {
        const button = document.createElement("button");
        button.className = "btn btn-outline-success p-0";
        button.type = "button";
        button.append("✔");
        return button;
    }());
    const editingDiv = (function () {
        const div = document.createElement("div");
        const inputGroup = document.createElement("div");
        div.className = "position-fixed";
        inputGroup.className = "input-group input-group-sm";
        inputGroup.append(nameInput, typeSelect, valueInput, okButton);
        div.addEventListener("click", function (event) {
            event.stopPropagation();
        });
        div.append(inputGroup);
        return div;
    }());
    function edit(name, typeIndex, value, x, y) {
        const type = elementType[typeIndex];
        // name input
        nameInput.disabled = typeof name !== "string";
        nameInput.value = (
            name === undefined
            ? ""
            : name
        );
        // type select
        typeSelect.selectedIndex = typeIndex;
        // value input
        valueInput.disabled = !type.editable;
        valueInput.value = (
            type.editable
            ? value
            : type.defaultValue
        );
        // editing div
        editingDiv.style.left = x + "px";
        editingDiv.style.top = y + "px";
        document.body.append(editingDiv);
    }
    function createEditIcon() {
        const icon = document.createElement("img");
        icon.src = "images/pencil-square.svg";
        icon.alt = "Edit";
        icon.title = "Edit";
        icon.style.cursor = "pointer";
        icon.style.marginLeft = ".5em";
        icon.style.marginRight = ".5em";
        icon.addEventListener("click", function (event) {
            const nodeList = icon.parentNode.childNodes;
            let valueSpan;
            let name;
            const node1 = nodeList[1];
            if (node1.nodeType === 3) {
                const keyText = node1.nodeValue;
                name = JSON.parse(keyText.substring(0, keyText.length - 2));
                valueSpan = nodeList[2];
            } else {
                valueSpan = node1;
            }
            edit(name, valueSpan.dataset.typeIndex, valueSpan.firstChild.nodeValue, event.x, event.y);
            event.stopPropagation();
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
    function createEndSpan(typeName, isObject) {
        const span = document.createElement("span");
        span.title = typeName;
        span.append(createBlankIcon(), (
            isObject
            ? "}"
            : "]"
        ) + "\n");
        return span;
    }
    function resetIndexes(parentNode) {
        let valueSpan = parentNode.previousSibling;
        while (valueSpan.nodeName !== "SPAN") {
            valueSpan = valueSpan.previousSibling;
        }
        if (valueSpan.dataset.typeIndex === "1") {
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
        const typeIndex = getTypeIndex(value);
        const type = elementType[typeIndex];
        const typeName = type.name;
        const isCollection = type.isCollection;
        const isObject = typeIndex === 0;
        let parentNode;
        valueSpan.title = typeName;
        valueSpan.dataset.typeIndex = typeIndex;
        if (isCollection) {
            parentNode = document.createElement("span");
            level += 1;
            if (isObject) {
                Object.entries(
                    value
                ).forEach(function ([objectKey, objectValue]) {
                    parentNode.append(from(objectValue, objectKey));
                });
            } else {
                value.forEach(function (element, index) {
                    parentNode.append(from(element, index));
                });
            }
            parentNode.append(createAddSpan());
            level -= 1;
            parentNode.append(createEndSpan(typeName, isObject));
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
        if (isCollection) {
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
            if (valueSpan.dataset.typeIndex === "0") {
                value = {};
                while (index < length) {
                    const result = toValue(children[index]);
                    value[result.key] = result.value;
                    index += 1;
                }
            } else {
                value = new Array(length);
                while (index < length) {
                    value[index] = toValue(children[index]).value;
                    index += 1;
                }
            }
        }
        return {key, value};
    }
    window.addEventListener("click", function () {
        editingDiv.remove();
    });
    return {
        from,
        toValue
    };
}());
