/*jslint browser*/
const editableTree = (function () {
    const elementType = [
        {defaultValue: "{}", editable: false, name: "object"},
        {defaultValue: "[]", editable: false, name: "array"},
        {defaultValue: "\"\"", editable: true, name: "string"},
        {defaultValue: "0", editable: true, name: "number"},
        {defaultValue: "true", editable: false, name: "\"true\""},
        {defaultValue: "false", editable: false, name: "\"false\""},
        {defaultValue: "null", editable: false, name: "\"null\""}
    ];
    let expandLevel = 1;
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
            }
            if (Array.isArray(value)) {
                return 1;
            }
            return 0;
        }
    }
    function createIcon(className) {
        const icon = document.createElement("i");
        icon.className = className;
        return icon;
    }
    function createUserSelectNoneSpan(text) {
        const span = document.createElement("span");
        span.className = "user-select-none";
        span.append(text);
        return span;
    }
    function addCollapseEvent(
        level,
        icon,
        elementsToHide,
        elementsToDisplay = []
    ) {
        if (level >= expandLevel) {
            icon.className = "bi-caret-right";
            elementsToHide.forEach(function (element) {
                element.hidden = true;
            });
            elementsToDisplay.forEach(function (element) {
                element.hidden = false;
            });
        }
        icon.setAttribute("role", "button");
        icon.addEventListener("click", function () {
            if (elementsToHide[0].hidden) {
                icon.className = "bi-caret-down";
                elementsToHide.forEach(function (element) {
                    element.hidden = false;
                });
                elementsToDisplay.forEach(function (element) {
                    element.hidden = true;
                });
            } else {
                icon.className = "bi-caret-right";
                elementsToHide.forEach(function (element) {
                    element.hidden = true;
                });
                elementsToDisplay.forEach(function (element) {
                    element.hidden = false;
                });
            }
        });
    }
    function from(value, keys = [], hasNextValue = false) {
        const typeIndex = getTypeIndex(value);
        const isObject = typeIndex === 0;
        const isArray = typeIndex === 1;
        const span = document.createElement("span");
        const level = keys.length;
        const startIcon = createIcon(
            (isObject || isArray)
            ? "bi-caret-down"
            : "i-blank"
        );
        const countSpan = document.createElement("span");
        const endIcon = createIcon("i-blank");
        let startText = "";
        let endText;
        span.append(startIcon);
        if (level === 0) {
            span.className = "font-monospace editable-tree";
        } else {
            const key = keys[level - 1];
            span.dataset.keys = JSON.stringify(keys);
            if (typeof key === "number") {
                span.append(createUserSelectNoneSpan(key + ": "));
            } else {
                startText = JSON.stringify(key) + ": ";
            }
        }
        if (isObject) {
            const ul = document.createElement("ul");
            const entries = Object.entries(value);
            const countOfMembers = entries.length;
            const indexOfLastMember = countOfMembers - 1;
            startText += "{";
            ul.append(...entries.map(function ([childKey, childValue], index) {
                const li = document.createElement("li");
                li.append(from(
                    childValue,
                    keys.concat(childKey),
                    index < indexOfLastMember
                ));
                return li;
            }));
            span.append(startText, ul);
            if (countOfMembers === 0) {
                addCollapseEvent(level, startIcon, [ul, endIcon]);
            } else {
                countSpan.hidden = true;
                countSpan.append(
                    countOfMembers === 1
                    ? "1 member"
                    : countOfMembers + " members"
                );
                addCollapseEvent(level, startIcon, [ul, endIcon], [countSpan]);
                span.append(countSpan);
            }
            span.append(endIcon);
            endText = "}";
        } else if (isArray) {
            const ol = document.createElement("ol");
            const countOfElements = value.length;
            const indexOfLastElement = countOfElements - 1;
            startText += "[";
            ol.append(...value.map(function (childValue, index) {
                const li = document.createElement("li");
                li.append(from(
                    childValue,
                    keys.concat(index),
                    index < indexOfLastElement
                ));
                return li;
            }));
            span.append(startText, ol);
            if (countOfElements === 0) {
                addCollapseEvent(level, startIcon, [ol, endIcon]);
            } else {
                countSpan.hidden = true;
                countSpan.append(
                    countOfElements === 1
                    ? "1 element"
                    : countOfElements + " elements"
                );
                addCollapseEvent(level, startIcon, [ol, endIcon], [countSpan]);
                span.append(countSpan);
            }
            span.append(endIcon);
            endText = "]";
        } else {
            const jsonOfValue = JSON.stringify(value);
            span.dataset.value = jsonOfValue;
            endText = startText + jsonOfValue;
        }
        if (hasNextValue) {
            endText += ",";
        }
        span.title = elementType[typeIndex].name;
        span.append(endText);
        return span;
    }
    /**
     * @param {HTMLSpanElement} span
     */
    function toValue(span) {
        const dataset = span.dataset;
        const keys = dataset.keys;
        const jsonOfValue = dataset.value;
        let key;
        let value;
        if (keys !== undefined) {
            key = JSON.parse(keys).pop();
        }
        if (jsonOfValue === undefined) {
            const children = Array.from(span.children);
            let collectionElement = children.find(
                (child) => child.tagName === "UL"
            );
            if (collectionElement !== undefined) {
                value = {};
            } else {
                collectionElement = children.find(
                    (child) => child.tagName === "OL"
                );
                value = [];
            }
            Array.from(collectionElement.children).forEach(function (li) {
                const {
                    key: childKey,
                    value: childValue
                } = toValue(li.firstChild);
                value[childKey] = childValue;
            });
        } else {
            value = JSON.parse(jsonOfValue);
        }
        return {key, value};
    }
    return {
        create() {
            throw new Error();
        },
        from,
        setExpandLevel(level) {
            expandLevel = level;
        },
        toValue
    };
}());
