/*jslint browser, this*/
const editableTree = (function () {
    // Non-public class, defined using simple method.
    function Element(value) {
        const type = typeof value;
        this.value = value;
        switch (type) {
        case "string":
        case "number":
            this.type = type;
            this.count = -1;
            this.isArray = false;
            break;
        case "boolean":
            this.type = (
                value
                ? "\"true\""
                : "\"false\""
            );
            this.count = -1;
            this.isArray = false;
            break;
        case "object":
            if (value === null) {
                this.type = "\"null\"";
                this.count = -1;
                this.isArray = false;
            } else if (Array.isArray(value)) {
                this.type = "array";
                this.count = value.length;
                this.isArray = true;
            } else {
                this.type = type;
                this.count = Object.keys(value).length;
                this.isArray = false;
            }
            break;
        }
    }
    Element.prototype.getValueText = function () {
        const count = this.count;
        if (count > 0) {
            if (this.isArray) {
                return "[" + count + (
                    count === 1
                    ? " element]"
                    : " elements]"
                );
            }
            return "{" + count + (
                count === 1
                ? " member}"
                : " members}"
            );
        }
        return JSON.stringify(this.value);
    };
    function getTreeIconSrc(isCollapsed) {
        return (
            isCollapsed
            ? "images/caret-right.svg"
            : "images/caret-down.svg"
        );
    }
    function getTreeIconAlt(isCollapsed) {
        return (
            isCollapsed
            ? "+"
            : "-"
        );
    }
    function getEditIcon() {
        const icon = document.createElement("img");
        icon.style.cursor = "pointer";
        icon.style.marginLeft = ".5em";
        icon.style.marginRight = ".5em";
        icon.alt = "Edit";
        icon.src = "images/pencil-square.svg";
        icon.title = "Edit";
        icon.addEventListener("click", function () {
            window.alert("Feature not implemented.");
        });
        return icon;
    }
    function getInsertIcon() {
        const icon = document.createElement("img");
        icon.style.cursor = "pointer";
        icon.alt = "Insert";
        icon.src = "images/plus-square.svg";
        icon.title = "Insert";
        icon.addEventListener("click", function () {
            window.alert("Feature not implemented.");
        });
        return icon;
    }
    function recalculateCountAndIndexes(parentNode) {
        let valueSpan = parentNode.previousSibling;
        while (valueSpan.nodeName !== "SPAN") {
            valueSpan = valueSpan.previousSibling;
        }
        const children = parentNode.childNodes;
        const length = children.length - 1;
        if (valueSpan.title === "array") {
            let index = 0;
            while (index < length) {
                children[index].childNodes[1].nodeValue = index + ": ";
                index += 1;
            }
            if (length === 0) {
                valueSpan.firstChild.nodeValue = "[]";
            }
            if (length === 1) {
                valueSpan.firstChild.nodeValue = "[1 element]";
            }
            if (length > 1) {
                valueSpan.firstChild.nodeValue = "[" + length + " elements]";
            }
        }
        if (valueSpan.title === "object") {
            if (length === 0) {
                valueSpan.firstChild.nodeValue = "{}";
            }
            if (length === 1) {
                valueSpan.firstChild.nodeValue = "{1 member}";
            }
            if (length > 1) {
                valueSpan.firstChild.nodeValue = "{" + length + " members}";
            }
        }
    }
    function getDeleteIcon() {
        const icon = document.createElement("img");
        icon.style.cursor = "pointer";
        icon.style.marginLeft = ".5em";
        icon.alt = "Delete";
        icon.src = "images/dash-square.svg";
        icon.title = "Delete";
        icon.addEventListener("click", function () {
            const row = icon.parentNode;
            const parentNode = row.parentNode;
            parentNode.removeChild(row);
            recalculateCountAndIndexes(parentNode);
        });
        return icon;
    }
    let level = 0;
    function from(value, key) {
        const span = document.createElement("span");
        const icon = document.createElement("img");
        const valueSpan = document.createElement("span");
        const element = new Element(value);
        if (level > 0) {
            icon.style.marginLeft = level + "em";
        }
        valueSpan.title = element.type;
        valueSpan.append(element.getValueText()); // value text
        if (element.count >= 0) {
            const children = document.createElement("span");
            const addSpan = document.createElement("span");
            const addIcon = document.createElement("img");
            if (level > 0) {
                children.hidden = true;
            }
            level += 1;
            if (element.isArray) {
                value.forEach(function (arrayElement, index) {
                    children.append(from(arrayElement, index));
                });
            } else {
                Object.entries(value).forEach(
                    function ([objectKey, objectValue]) {
                        children.append(from(objectValue, objectKey));
                    }
                );
            }
            addIcon.style.marginLeft = level + "em";
            addIcon.src = "images/blank.svg";
            addIcon.alt = " ";
            addSpan.append(addIcon, getInsertIcon(), "\n");
            children.append(addSpan);
            level -= 1;
            icon.style.cursor = "pointer";
            icon.alt = getTreeIconAlt(children.hidden);
            icon.src = getTreeIconSrc(children.hidden);
            icon.addEventListener("click", function () {
                children.hidden = !children.hidden;
                icon.alt = getTreeIconAlt(children.hidden);
                icon.src = getTreeIconSrc(children.hidden);
            });
            span.append(icon);
            if (key !== undefined) {
                span.append(JSON.stringify(key) + ": "); // key text
            }
            valueSpan.style.opacity = "0.75";
            span.append(valueSpan, getEditIcon());
            if (key !== undefined) {
                span.append(getInsertIcon(), getDeleteIcon());
            }
            span.append("\n", children);
        } else {
            icon.src = "images/blank.svg";
            icon.alt = " ";
            span.append(icon);
            if (key !== undefined) {
                span.append(JSON.stringify(key) + ": "); // key text
            }
            span.append(valueSpan, getEditIcon());
            if (key !== undefined) {
                span.append(getInsertIcon(), getDeleteIcon());
            }
            span.append("\n");
        }
        return span;
    }
    function toValue(span) {
        const nodeList = span.childNodes;
        const lastNode = nodeList[nodeList.length - 1];
        let valueSpan;
        let children;
        let key;
        let value;
        if (nodeList[1].nodeType === 3) {
            const keyText = nodeList[1].nodeValue;
            key = JSON.parse(keyText.substring(0, keyText.length - 2));
            valueSpan = nodeList[2];
        } else {
            valueSpan = nodeList[1];
        }
        if (lastNode.nodeType === 1) {
            children = lastNode.childNodes;
        }
        if (children === undefined) {
            value = JSON.parse(valueSpan.firstChild.nodeValue);
        } else {
            let index;
            const length = children.length - 1;
            if (valueSpan.title === "array") {
                index = 0;
                value = new Array(length);
                while (index < length) {
                    value[index] = toValue(children[index]).value;
                    index += 1;
                }
            } else {
                index = 0;
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
