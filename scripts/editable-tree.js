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
    let level = 0;
    function toSpan(value, key) {
        const span = document.createElement("span");
        const icon = document.createElement("img");
        const valueSpan = document.createElement("span");
        const element = new Element(value);
        if (level > 0) {
            span.append("  ".repeat(level)); // space
        }
        valueSpan.title = element.type;
        valueSpan.append(element.getValueText() + "\n"); // value text
        if (element.count > 0) {
            const children = document.createElement("span");
            valueSpan.dataset.hasChildren = "true";
            if (level > 0) {
                children.hidden = true;
            }
            level += 1;
            if (element.isArray) {
                value.forEach(function (arrayElement, index) {
                    children.append(toSpan(arrayElement, index));
                });
            } else {
                Object.entries(value).forEach(
                    function ([objectKey, objectValue]) {
                        children.append(toSpan(objectValue, objectKey));
                    }
                );
            }
            level -= 1;
            icon.style.cursor = "pointer";
            icon.src = getTreeIconSrc(children.hidden);
            icon.alt = getTreeIconAlt(children.hidden);
            icon.addEventListener("click", function () {
                children.hidden = !children.hidden;
                icon.src = getTreeIconSrc(children.hidden);
                icon.alt = getTreeIconAlt(children.hidden);
            });
            span.append(icon);
            if (key !== undefined) {
                span.append(JSON.stringify(key) + ": "); // key text
            }
            valueSpan.style.opacity = "0.75";
            span.append(valueSpan, children);
        } else {
            icon.src = "images/blank.svg";
            icon.alt = " ";
            span.append(icon);
            if (key !== undefined) {
                span.append(JSON.stringify(key) + ": "); // key text
            }
            span.append(valueSpan);
        }
        return span;
    }
    function toValue() {
        throw new Error();
    }
    return {
        from(json) {
            const tree = document.createElement("pre");
            tree.append(toSpan(JSON.parse(json)));
            return tree;
        },
        to(tree) {
            return JSON.stringify(toValue(tree.firstChild));
        }
    };
}());
