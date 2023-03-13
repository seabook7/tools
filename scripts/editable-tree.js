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
        return [div, input];
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
        const body = document.body;
        const card = createDiv("card position-fixed shadow editing-card");
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
        const [selectRadioDiv, selectRadio] = createRadio(
            "select-radio",
            "value-radio",
            "Select",
            {className: "form-check-inline"}
        );
        const [inputRadioDiv, inputRadio] = createRadio(
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
        let isMousedown = false;
        let offsetX;
        let offsetY;
        let valueIsChanged;
        card.addEventListener("click", function (event) {
            event.stopPropagation();
        });
        cardHeader.addEventListener("mousedown", function (event) {
            // Card and card header are in the same position, so there is
            // no need to calculate the distance between the two elements.
            if (event.button === 0) {
                isMousedown = true;
                offsetX = event.offsetX;
                offsetY = event.offsetY;
            }
        });
        body.addEventListener("mousemove", function (event) {
            if (isMousedown) {
                card.style.left = event.x - offsetX + "px";
                card.style.top = event.y - offsetY + "px";
            }
        });
        window.addEventListener("mouseup", function () {
            isMousedown = false;
        });
        closeButton.addEventListener("mousedown", function (event) {
            event.stopPropagation();
        });
        selectRadio.addEventListener("change", function () {
            cardBody.replaceChild(valueSelectLabel, valueInputLabel);
            cardBody.replaceChild(valueSelect, valueInput);
            valueIsChanged = true;
        });
        inputRadio.addEventListener("change", function () {
            valueInput.value = valueSelect.value;
            cardBody.replaceChild(valueInputLabel, valueSelectLabel);
            cardBody.replaceChild(valueInput, valueSelect);
            valueIsChanged = true;
        });
        valueSelect.addEventListener("change", function () {
            valueIsChanged = true;
        });
        valueInput.addEventListener("change", function () {
            valueIsChanged = true;
        });
        card.append(cardHeader, cardBody, cardFooter);
        return {
            show(title, {keys, value}, {x, y}) {
                const okButton = createButton(
                    "btn btn-outline-success px-0 ok-btn",
                    {},
                    createIcon("bi-check2-square"),
                    " OK"
                );
                const type = elementType[getTypeIndex(value)];
                let key;
                if (keys !== undefined && keys.length > 0) {
                    key = keys[keys.length - 1];
                }
                valueIsChanged = false;
                cardHeader.replaceChildren(title, closeButton);
                cardBody.replaceChildren();
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
                    selectRadio.checked = false;
                    inputRadio.checked = true;
                    valueInput.value = JSON.stringify(value);
                    cardBody.append(
                        valueInputLabel,
                        selectRadioDiv,
                        inputRadioDiv,
                        valueInput
                    );
                } else {
                    inputRadio.checked = false;
                    selectRadio.checked = true;
                    valueSelect.value = type.defaultValue;
                    cardBody.append(
                        valueSelectLabel,
                        selectRadioDiv,
                        inputRadioDiv,
                        valueSelect
                    );
                }
                cardFooter.replaceChildren(okButton);
                card.style.left = x + "px";
                card.style.top = y + "px";
                body.append(card);
                return new Promise(function (resolve) {
                    function shortcutKey(event) {
                        switch (event.key) {
                        case "Escape":
                            event.preventDefault();
                            closeButton.click();
                            break;
                        case "Enter":
                            event.preventDefault();
                            okButton.click();
                            break;
                        }
                    }
                    function cancel() {
                        closeButton.removeEventListener("click", cancel);
                        body.removeEventListener("click", cancel);
                        body.removeEventListener("keydown", shortcutKey);
                        card.remove();
                        resolve();
                    }
                    closeButton.addEventListener("click", cancel);
                    body.addEventListener("click", cancel);
                    body.addEventListener("keydown", shortcutKey);
                    okButton.addEventListener("click", function () {
                        try {
                            if (cardBody.contains(nameInput)) {
                                key = nameInput.value;
                            }
                            if (cardBody.contains(indexInput)) {
                                key = JSON.parse(indexInput.value);
                            }
                            if (key !== undefined) {
                                keys.pop();
                                keys.push(key);
                            }
                            value = (
                                valueIsChanged
                                ? JSON.parse(
                                    cardBody.contains(valueSelect)
                                    ? valueSelect.value
                                    : valueInput.value
                                )
                                : undefined
                            );
                            closeButton.removeEventListener("click", cancel);
                            body.removeEventListener("click", cancel);
                            body.removeEventListener("keydown", shortcutKey);
                            card.remove();
                            resolve({keys, value});
                        } catch (error) {
                            window.alert(error.message);
                        }
                    });
                });
            }
        };
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
    function createCountSpan(count, isObject) {
        return createUserSelectNoneSpan(
            isObject
            ? (
                count === 1
                ? "1 member"
                : count + " members"
            )
            : (
                count === 1
                ? "1 element"
                : count + " elements"
            )
        );
    }
    function addCollapseEvent(level, span, icon, elementsToCollapse) {
        const collectionElement = elementsToCollapse[0];
        const isObject = collectionElement.tagName === "UL";
        let count;
        let countSpan;
        if (level >= expandLevel) {
            icon.className = "bi-caret-right";
            elementsToCollapse.forEach(function (element) {
                element.hidden = true;
            });
            count = collectionElement.children.length - 1;
            if (count > 0) {
                countSpan = createCountSpan(count, isObject);
                span.insertBefore(countSpan, collectionElement);
            }
        }
        icon.setAttribute("role", "button");
        icon.addEventListener("click", function () {
            if (collectionElement.hidden) {
                icon.className = "bi-caret-down";
                elementsToCollapse.forEach(function (element) {
                    element.hidden = false;
                });
                if (countSpan !== undefined) {
                    countSpan.remove();
                }
            } else {
                icon.className = "bi-caret-right";
                elementsToCollapse.forEach(function (element) {
                    element.hidden = true;
                });
                count = collectionElement.children.length - 1;
                if (count > 0) {
                    countSpan = createCountSpan(count, isObject);
                    span.insertBefore(countSpan, collectionElement);
                }
            }
        });
    }
    async function create(title, {hasNextValue, keys, value}, {x, y}) {
        const result = await editingCard.show(title, {keys, value}, {x, y});
        if (result !== undefined) {
            const resultValue = result.value;
            if (resultValue !== undefined) {
                value = resultValue;
            }
            return from(value, keys, hasNextValue);
        }
    }
    function createEditIcon(span) {
        const title = "Edit";
        const icon = createIcon("bi-pencil-square text-success ps-2");
        icon.title = title;
        icon.setAttribute("role", "button");
        icon.addEventListener("click", async function (event) {
            event.stopPropagation();
            const node = await create(
                title,
                {hasNextValue, keys, value},
                event
            );
            if (node !== undefined) {
                const span = icon.parentNode;
                span.parentNode.replaceChild(node, span);
            }
        });
        return icon;
    }
    function setIndexes(span, index) {
        return;
        let hasNextValue;
        do {
            const keys = JSON.parse(span.dataset.keys);
            const indexSpan = Array.from(span.children).find(
                (child) => child.tagName === "SPAN"
            );
            const next = span.parentNode.nextSibling;
            hasNextValue = next !== null;
            keys.pop();
            keys.push(index);
            span.dataset.keys = JSON.stringify(keys);
            indexSpan.replaceChildren(index + ": ");
            if (hasNextValue) {
                span = next.firstChild;
                index += 1;
            }
        } while (hasNextValue);
    }
    function createListItemForAdd(keys) {
        const title = "Add";
        const liForAdd = document.createElement("li");
        const icon = createIcon("bi-plus-square text-primary");
        icon.title = title;
        icon.setAttribute("role", "button");
        icon.addEventListener("click", async function (event) {
            event.stopPropagation();
            const node = await create(
                title,
                {keys, value: {}},
                event
            );
            if (node !== undefined) {
                const last = keys.length - 1;
                const li = document.createElement("li");
                li.append(node);
                liForAdd.parentNode.insertBefore(li, liForAdd);
                if (typeof keys[last] === "number") {
                    keys[last] += 1;
                }
            }
        });
        liForAdd.append(createIcon("i-blank"), icon);
        return liForAdd;
    }
    function createInsertIcon(span) {
        const icon = createIcon("bi-plus-square text-primary ps-2");
    }
    function createDeleteIcon(hasNextValue) {
        const icon = createIcon("bi-dash-square text-danger ps-2");
        icon.title = "Delete";
        icon.setAttribute("role", "button");
        icon.addEventListener("click", function () {
            const span = icon.parentNode;
            if (hasNextValue) {
                const next = span.parentNode.nextSibling.firstChild;
                const key = JSON.parse(next.dataset.keys).pop();
                if (typeof key === "number") {
                    setIndexes(next, key - 1);
                }
            }
            span.parentNode.remove();
        });
        return icon;
    }
    /**
     * 
     * @param {*} value
     * @param {Array<string | number>} keys
     * @param {Boolean} hasNextValue
     * @returns {HTMLSpanElement}
     */
    function from(value, keys = [], hasNextValue = false) {
        const span = document.createElement("span");
        const typeIndex = getTypeIndex(value);
        const isObject = typeIndex === 0;
        const isArray = typeIndex === 1;
        const level = keys.length;
        const isRoot = level === 0;
        const startIcon = createIcon(
            (isObject || isArray)
            ? "bi-caret-down"
            : "i-blank"
        );
        const endIcon = createIcon("i-blank");
        let startText = "";
        let endText;
        if (isRoot) {
            span.className = "font-monospace editable-tree";
        }
        span.append(startIcon);
        if (!isRoot) {
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
            const count = entries.length;
            const indexOfLastMember = count - 1;
            startText += "{";
            ul.append(...entries.map(function ([childKey, childValue], index) {
                const li = document.createElement("li");
                li.append(from(
                    childValue,
                    keys.concat([childKey]),
                    index < indexOfLastMember
                ));
                return li;
            }), createListItemForAdd(keys.concat([""])));
            span.append(startText, ul, endIcon);
            addCollapseEvent(span, startIcon, ul, endIcon, level, count);
            endText = "}";
        } else if (isArray) {
            const ol = document.createElement("ol");
            const length = value.length;
            const indexOfLastElement = length - 1;
            startText += "[";
            ol.append(...value.map(function (childValue, index) {
                const li = document.createElement("li");
                li.append(from(
                    childValue,
                    keys.concat([index]),
                    index < indexOfLastElement
                ));
                return li;
            }), createListItemForAdd(keys.concat([length])));
            span.append(startText, ol, endIcon);
            addCollapseEvent(span, startIcon, ol, endIcon, level, length);
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
        span.append(createEditIcon(span));
        if (!isRoot) {
            span.append(createInsertIcon(span), createDeleteIcon(span));
        }
        return span;
    }
    /**
     * @param {HTMLSpanElement} span
     * @returns {[*, Array<string | number>]} [value, keys]
     */
    function toValue(span) {
        const {jsonOfKeys, jsonOfValue} = span.dataset;
        let keys;
        let value;
        if (jsonOfKeys !== undefined) {
            keys = JSON.parse(jsonOfKeys);
        }
        if (jsonOfValue === undefined) {
            const children = Array.from(span.children);
            const ul = children.find(
                (child) => child.tagName === "UL"
            );
            if (ul !== undefined) {
                value = {};
                Array.from(ul.children).map(
                    (li) => toValue(li.firstChild)
                ).forEach(function ([childValue, childKeys]) {
                    value[childKeys.pop()] = childValue;
                });
            } else {
                const ol = children.find(
                    (child) => child.tagName === "OL"
                );
                value = [];
                value.push(...Array.from(ol.children).map(
                    (li) => toValue(li.firstChild)[0]
                ));
            }
        } else {
            value = JSON.parse(jsonOfValue);
        }
        return [value, keys];
    }
    return {
        create,
        from,
        setExpandLevel(level) {
            expandLevel = level;
        },
        toValue
    };
}());
