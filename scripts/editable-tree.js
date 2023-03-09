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
        if (text !== undefined) {
            span.append(text);
        }
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
        const countSpan = createUserSelectNoneSpan();
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
                    keys.concat([childKey]),
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
                    keys.concat([index]),
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
    function createDiv(className) {
        const div = document.createElement("div");
        div.className = className;
        return div;
    }
    function createButton(className, {title}, ...childNodes) {
        const button = document.createElement("button");
        button.className = className;
        button.type = "button";
        if (title) {
            button.title = title;
        }
        button.append(...childNodes);
        return button;
    }
    function createInput(id, {className, disabled}) {
        const input = document.createElement("input");
        input.className = (
            className
            ? "form-control " + className
            : "form-control"
        );
        input.id = id;
        if (disabled) {
            input.disabled = disabled;
        }
        return input;
    }
    function createLabel(className, htmlFor, text) {
        const label = document.createElement("label");
        label.className = className;
        label.htmlFor = htmlFor;
        label.append(text);
        return label;
    }
    function createRadio(id, name, text, {checked, className}) {
        const div = document.createElement("div");
        const input = document.createElement("input");
        div.className = (
            className
            ? "form-check " + className
            : "form-check"
        );
        input.className = "form-check-input";
        input.id = id;
        input.name = name;
        input.type = "radio";
        if (checked) {
            input.checked = checked;
        }
        div.append(input, createLabel("form-check-label", id, text));
        return div;
    }
    function createOption(text) {
        const option = document.createElement("option");
        option.append(text);
        return option;
    }
    function createSelect(id, ...options) {
        const select = document.createElement("select");
        select.className = "form-select";
        select.id = id;
        select.append(...options);
        return select;
    }
    const editingCard = (function () {
        const div = createDiv("card position-fixed shadow glass-background");
        const cardHeader = createDiv("card-header user-select-none");
        const cardBody = createDiv("card-body");
        const cardFooter = createDiv("card-footer text-end");
        const closeButton = createButton(
            "btn-close float-end",
            {title: "Close"}
        );
        const nameInput = createInput("name-input", {className: "mb-3"});
        const nameLabel = createLabel("form-label", nameInput.id, "Name:");
        const indexInput = createInput(
            "index-input",
            {className: "mb-3", disabled: true}
        );
        const indexLabel = createLabel("form-label", indexInput.id, "Index:");
        const selectRadio = createRadio(
            "select-radio",
            "value-radio",
            "Select",
            {className: "form-check-inline"}
        );
        const inputRadio = createRadio(
            "input-radio",
            "value-radio",
            "Input",
            {className: "form-check-inline"}
        );
        const valueSelect = createSelect("value-select", ...elementType.filter(
            (type) => !type.editable
        ).map(
            (type) => createOption(type.defaultValue)
        ));
        const valueSelectLabel = createLabel(
            "form-label d-block",
            valueSelect.id,
            "Value:"
        );
        const valueInput = createInput("value-input", {});
        const valueInputLabel = createLabel(
            "form-label d-block",
            valueInput.id,
            "Value:"
        );
        let offsetX;
        let offsetY;
        let isMousedown;
        let valueIsChanged = false;
        div.addEventListener("click", function (event) {
            event.stopPropagation();
        });
        cardHeader.addEventListener("mousedown", function (event) {
            if (event.button === 0) {
                isMousedown = true;
                offsetX = event.offsetX;
                offsetY = event.offsetY;
            }
        });
        cardHeader.addEventListener("mousemove", function (event) {
            if (isMousedown) {
                div.style.left = event.x - offsetX + "px";
                div.style.top = event.y - offsetY + "px";
            }
        });
        cardHeader.addEventListener("mouseup", function () {
            isMousedown = false;
        });
        cardHeader.addEventListener("mouseout", function () {
            isMousedown = false;
        });
        closeButton.addEventListener("mousedown", function (event) {
            event.stopPropagation();
        });
        selectRadio.firstChild.addEventListener("change", function () {
            cardBody.replaceChild(valueSelectLabel, valueInputLabel);
            cardBody.replaceChild(valueSelect, valueInput);
        });
        inputRadio.firstChild.addEventListener("change", function () {
            cardBody.replaceChild(valueInputLabel, valueSelectLabel);
            cardBody.replaceChild(valueInput, valueSelect);
        });
        valueSelect.addEventListener("change", function () {
            valueIsChanged = true;
        });
        valueInput.addEventListener("change", function () {
            valueIsChanged = true;
        });
        div.append(cardHeader, cardBody, cardFooter);
        return {
            show(title, {key, value}, {x, y}) {
                const body = document.body;
                const okButton = createButton(
                    "btn btn-outline-success px-0",
                    {},
                    createIcon("bi-check2-square"),
                    " OK"
                );
                const type = elementType[getTypeIndex(value)];
                cardHeader.replaceChildren(title, closeButton);
                if (key !== undefined) {
                    if (typeof key === "number") {
                        indexInput.value = key;
                        cardBody.append(indexLabel, indexInput);
                    } else {
                        nameInput.value = key;
                        cardBody.append(nameLabel, nameInput);
                    }
                }
                if (type.editable) {
                    inputRadio.firstChild.checked = true;
                    valueInput.value = JSON.stringify(value);
                    cardBody.append(
                        valueInputLabel,
                        selectRadio,
                        inputRadio,
                        valueInput
                    );
                } else {
                    selectRadio.firstChild.checked = true;
                    valueSelect.value = type.defaultValue;
                    cardBody.append(
                        valueSelectLabel,
                        selectRadio,
                        inputRadio,
                        valueSelect
                    );
                }
                cardFooter.replaceChildren(okButton);
                div.style.left = x + "px";
                div.style.top = y + "px";
                body.append(div);
                return new Promise(function (resolve) {
                    function shortcutKey(event) {
                        if (event.key === "Enter") {
                            okButton.click();
                            event.preventDefault();
                        }
                    }
                    function cancel() {
                        closeButton.removeEventListener("click", cancel);
                        body.removeEventListener("click", cancel);
                        body.removeEventListener("keypress", shortcutKey);
                        div.remove();
                        resolve();
                    }
                    closeButton.addEventListener("click", cancel);
                    body.addEventListener("click", cancel);
                    body.addEventListener("keypress", shortcutKey);
                    okButton.addEventListener("click", function () {
                        let resultKey;
                        let resultValue;
                        if (cardBody.contains(nameInput)) {
                            resultKey = nameInput.value;
                        }
                        if (cardBody.contains(indexInput)) {
                            resultKey = JSON.parse(indexInput.value);
                        }
                        if (valueIsChanged) {
                            if (cardBody.contains(valueSelect)) {
                                resultValue = JSON.parse(valueSelect.value);
                            }
                            if (cardBody.contains(valueInput)) {
                                resultValue = JSON.parse(valueInput.value);
                            }
                        }
                        closeButton.removeEventListener("click", cancel);
                        body.removeEventListener("click", cancel);
                        body.removeEventListener("keypress", shortcutKey);
                        div.remove();
                        resolve({key: resultKey, value: resultValue});
                    });
                });
            }
        };
    }());
    return {
        async create({x, y}) {
            console.log(
                await editingCard.show(
                    "New",
                    {key: "true", value: false},
                    {x, y}
                )
            );
        },
        from,
        setExpandLevel(level) {
            expandLevel = level;
        },
        toValue
    };
}());
