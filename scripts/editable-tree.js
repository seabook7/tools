/*jslint browser*/
const editableTree = (function () {
    let expandLevel = 1;
    function getDefault(value) {
        switch (typeof value) {
        case "string":
            return "";
        case "number":
            return 0;
        case "boolean":
            return value;
        case "object":
            if (value === null) {
                return value;
            }
            if (Array.isArray(value)) {
                return [];
            }
            return {};
        }
    }
    /**
     * @param {HTMLElement} elementToDrag
     * @param {HTMLElement} elementToMove
     */
    function draggable(elementToDrag, elementToMove = elementToDrag) {
        let isMousedown = false;
        let offsetX;
        let offsetY;
        elementToDrag.addEventListener("mousedown", function (event) {
            if (event.button === 0) {
                const {x, y} = elementToMove.getBoundingClientRect();
                isMousedown = true;
                offsetX = event.clientX - Math.floor(x);
                offsetY = event.clientY - Math.floor(y);
            }
        });
        document.body.addEventListener("mousemove", function (event) {
            if (isMousedown) {
                elementToMove.style.left = event.clientX - offsetX + "px";
                elementToMove.style.top = event.clientY - offsetY + "px";
            }
        });
        window.addEventListener("mouseup", function () {
            isMousedown = false;
        });
    }
    function createEditingCard() {
        function createDiv(className) {
            const div = document.createElement("div");
            div.className = className;
            return div;
        }
        const card = createDiv(
            "card shadow position-absolute bg-transparent editing-card"
        );
        const cardHeader = createDiv("card-header user-select-none");
        const cardBody = createDiv("card-body");
        const cardFooter = createDiv("card-footer text-end");
        card.append(cardHeader, cardBody, cardFooter);
        draggable(cardHeader, card);
        return [card, cardHeader, cardBody, cardFooter];
    }
    function createCloseButton() {
        const button = document.createElement("button");
        button.className = "btn-close float-end";
        button.type = "button";
        button.title = "Close";
        return button;
    }
    function createNameInput() {
        const row = document.createElement("div");
        const col = document.createElement("div");
        const input = document.createElement("input");
        const label = document.createElement("label");
        row.className = "row g-0 mb-3";
        col.className = "col-9";
        input.className = "form-control";
        input.id = "name-input";
        label.className = "col-3 col-form-label";
        label.htmlFor = input.id;
        label.append("Name:");
        col.append(input);
        row.append(label, col);
        return [row, input];
    }
    function createIndexInput() {
        const row = document.createElement("div");
        const col = document.createElement("div");
        const input = document.createElement("input");
        const label = document.createElement("label");
        row.className = "row g-0 mb-3";
        col.className = "col-9";
        input.className = "form-control-plaintext";
        input.id = "index-input";
        input.readOnly = true;
        label.className = "col-3 col-form-label";
        label.htmlFor = input.id;
        label.append("Index:");
        col.append(input);
        row.append(label, col);
        return [row, input];
    }
    function createValueSelect() {
        const select = document.createElement("select");
        const label = document.createElement("label");
        function createOption(childNode) {
            const option = document.createElement("option");
            option.append(childNode);
            return option;
        }
        select.className = "form-select";
        select.id = "value-select";
        label.className = "form-label me-3";
        label.htmlFor = select.id;
        select.append(...["{}", "[]", "true", "false", "null"].map(
            createOption
        ));
        label.append("Value: ");
        return [select, label];
    }
    function createValueInput() {
        const input = document.createElement("input");
        const label = document.createElement("label");
        input.className = "form-control";
        input.id = "value-input";
        label.className = "form-label me-3";
        label.htmlFor = input.id;
        label.append("Value: ");
        return [input, label];
    }
    function createSelectRadio() {
        const div = document.createElement("div");
        const input = document.createElement("input");
        const label = document.createElement("label");
        div.className = "form-check form-check-inline";
        input.className = "form-check-input";
        input.id = "select-radio";
        input.name = "value-radio";
        input.type = "radio";
        label.className = "form-check-label";
        label.htmlFor = input.id;
        label.append("Select");
        div.append(input, label);
        return [div, input];
    }
    function createInputRadio() {
        const div = document.createElement("div");
        const input = document.createElement("input");
        const label = document.createElement("label");
        div.className = "form-check form-check-inline";
        input.className = "form-check-input";
        input.id = "input-radio";
        input.name = "value-radio";
        input.type = "radio";
        label.className = "form-check-label";
        label.htmlFor = input.id;
        label.append("Input");
        div.append(input, label);
        return [div, input];
    }
    function createIcon(className) {
        const icon = document.createElement("i");
        icon.className = className;
        return icon;
    }
    function createOKButton() {
        const button = document.createElement("button");
        button.className = "btn btn-outline-success ok-btn";
        button.type = "button";
        button.append(createIcon("bi-check2-square"), " OK");
        return button;
    }
    function createNotSelectableSpan(childNode) {
        const span = document.createElement("span");
        span.className = "user-select-none";
        span.append(childNode);
        return span;
    }
    function createItem(childNode) {
        const item = document.createElement("li");
        item.append(childNode);
        return item;
    }
    function createList(isOrdered, ...childNodeOfItems) {
        const list = document.createElement(
            isOrdered
            ? "ol"
            : "ul"
        );
        list.append(...childNodeOfItems.map(createItem));
        return list;
    }
    function createAddIcon(span) {
        const title = "Add";
        const icon = createIcon("bi-plus-square ms-3 text-primary");
        icon.title = title;
        icon.setAttribute("role", "button");
        icon.addEventListener("click", async function (event) {
            event.stopPropagation();
            const {
                clientX: x,
                clientY: y
            } = event;
            const [value, keys] = toValue(span);
            let result = "";
            if (Array.isArray(value)) {
                const length = value.length;
                if (length > 0) {
                    result = getDefault(value[length - 1]);
                }
                keys.push(length);
            } else {
                const values = Object.values(value);
                const count = values.length;
                if (count > 0) {
                    result = getDefault(values[count - 1]);
                }
                keys.push("");
            }
            result = await editingCard.show({x, y}, title, result, keys);
            if (result !== undefined) {
                const li = icon.parentNode;
                const previous = li.previousSibling;
                if (previous !== null) {
                    const endTextNode = Array.from(
                        previous.firstChild.childNodes
                    ).findLast(
                        (node) => node.nodeType === 3
                    );
                    endTextNode.nodeValue += ",";
                }
                li.parentNode.insertBefore(
                    createItem(from(result, keys)),
                    li
                );
            }
        });
        return icon;
    }
    function createEditIcon(span) {
        const title = "Edit";
        const icon = createIcon("bi-pencil-square ms-2 text-success");
        icon.title = title;
        icon.setAttribute("role", "button");
        icon.addEventListener("click", async function (event) {
            event.stopPropagation();
            const {
                clientX: x,
                clientY: y
            } = event;
            const [value, keys, notLast] = toValue(span);
            const result = await editingCard.show({x, y}, title, value, keys);
            if (result !== undefined) {
                span.parentNode.replaceChild(from(result, keys, notLast), span);
            }
        });
        return icon;
    }
    function resetIndexes(li, initial) {
        let firstChild = li.firstChild;
        if (firstChild.tagName === "SPAN") {
            const keys = JSON.parse(firstChild.dataset.keys);
            const last = keys.length - 1;
            keys[last] += initial;
            do {
                const indexSpan = Array.from(firstChild.children).find(
                    (child) => child.tagName === "SPAN"
                );
                firstChild.dataset.keys = JSON.stringify(keys);
                indexSpan.replaceChildren(keys[last] + ": ");
                li = li.nextSibling;
                firstChild = li.firstChild;
                keys[last] += 1;
            } while (firstChild.tagName === "SPAN");
        }
    }
    function createInsertIcon(span) {
        const title = "Insert";
        const icon = createIcon("bi-plus-square ms-2 text-primary");
        icon.title = title;
        icon.setAttribute("role", "button");
        icon.addEventListener("click", async function (event) {
            event.stopPropagation();
            const {
                clientX: x,
                clientY: y
            } = event;
            const [value, keys] = toValue(span);
            const last = keys.length - 1;
            let result = getDefault(value);
            if (last > -1 && typeof keys[last] === "string") {
                keys[last] = "";
            }
            result = await editingCard.show({x, y}, title, result, keys);
            if (result !== undefined) {
                const li = span.parentNode;
                li.parentNode.insertBefore(
                    createItem(from(result, keys, true)),
                    li
                );
                resetIndexes(li, 1);
            }
        });
        return icon;
    }
    function createDeleteIcon(span) {
        const icon = createIcon("bi-dash-square ms-2 text-danger");
        icon.title = "Delete";
        icon.setAttribute("role", "button");
        icon.addEventListener("click", function () {
            const li = span.parentNode;
            const next = li.nextSibling;
            li.remove();
            resetIndexes(next, -1);
        });
        return icon;
    }
    const editingCard = (function () {
        const [card, cardHeader, cardBody, cardFooter] = createEditingCard();
        const closeButton = createCloseButton();
        const [nameInputDiv, nameInput] = createNameInput();
        const [indexInputDiv, indexInput] = createIndexInput();
        const [valueSelect, valueSelectLabel] = createValueSelect();
        const [valueInput, valueInputLabel] = createValueInput();
        const [selectRadioDiv, selectRadio] = createSelectRadio();
        const [inputRadioDiv, inputRadio] = createInputRadio();
        let valueIsChanged;
        card.addEventListener("click", function (event) {
            event.stopPropagation();
        });
        valueSelect.addEventListener("change", function () {
            valueIsChanged = true;
        });
        valueInput.addEventListener("input", function () {
            valueIsChanged = true;
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
        return {
            show({x, y}, title, value, keys = []) {
                const okButton = createOKButton();
                const type = typeof value;
                const last = keys.length - 1;
                valueIsChanged = false;
                card.style.left = Math.floor(x) + "px";
                card.style.top = Math.floor(y) + "px";
                cardHeader.replaceChildren(title, closeButton);
                cardBody.replaceChildren();
                if (last > -1) {
                    const key = keys[last];
                    if (typeof key === "string") {
                        nameInput.value = key;
                        cardBody.append(nameInputDiv);
                    } else {
                        indexInput.value = key;
                        cardBody.append(indexInputDiv);
                    }
                }
                if (type === "boolean" || type === "object") {
                    inputRadio.checked = false;
                    selectRadio.checked = true;
                    valueSelect.value = JSON.stringify(getDefault(value));
                    cardBody.append(
                        valueSelectLabel,
                        selectRadioDiv,
                        inputRadioDiv,
                        valueSelect
                    );
                } else {
                    selectRadio.checked = false;
                    inputRadio.checked = true;
                    valueInput.value = JSON.stringify(value);
                    cardBody.append(
                        valueInputLabel,
                        selectRadioDiv,
                        inputRadioDiv,
                        valueInput
                    );
                }
                cardFooter.replaceChildren(okButton);
                return new Promise(function (resolve) {
                    const body = document.body;
                    function shortcutKeys(event) {
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
                        body.removeEventListener("keydown", shortcutKeys);
                        card.remove();
                        resolve();
                    }
                    if (body.contains(card)) {
                        closeButton.click();
                    }
                    closeButton.addEventListener("click", cancel);
                    body.addEventListener("click", cancel);
                    body.addEventListener("keydown", shortcutKeys);
                    okButton.addEventListener("click", function () {
                        try {
                            if (cardBody.contains(nameInput)) {
                                keys[last] = nameInput.value;
                            }
                            if (valueIsChanged) {
                                value = JSON.parse(
                                    cardBody.contains(valueSelect)
                                    ? valueSelect.value
                                    : valueInput.value
                                );
                            }
                            closeButton.removeEventListener("click", cancel);
                            body.removeEventListener("click", cancel);
                            body.removeEventListener("keydown", shortcutKeys);
                            card.remove();
                            resolve(value);
                        } catch (error) {
                            window.alert(error.message);
                        }
                    });
                    body.append(card);
                });
            }
        };
    }());
    /**
     * @param {*} value
     * @param {Array<string | number>} keys
     * @param {Boolean} notLast
     * @returns {HTMLSpanElement} span
     */
    function from(value, keys = [], notLast = false) {
        const level = keys.length;
        const isRoot = level === 0;
        const span = document.createElement("span");
        const startIcon = createIcon("i-blank");
        const endIcon = createIcon("i-blank");
        let startText = "";
        let endText;
        function addCollapseEvent(list, text) {
            let count;
            let hasCountSpan;
            let countSpan;
            function collapse() {
                startIcon.className = "bi-caret-right";
                list.hidden = true;
                count = list.childNodes.length - 1;
                hasCountSpan = count > 0;
                if (hasCountSpan) {
                    let countText = count + " " + text;
                    if (count > 1) {
                        countText += "s";
                    }
                    countSpan = createNotSelectableSpan(countText);
                    span.insertBefore(countSpan, list);
                }
                endIcon.hidden = true;
            }
            function expand() {
                startIcon.className = "bi-caret-down";
                list.hidden = false;
                if (hasCountSpan) {
                    countSpan.remove();
                }
                endIcon.hidden = false;
            }
            if (level >= expandLevel) {
                collapse();
            } else {
                startIcon.className = "bi-caret-down";
            }
            startIcon.setAttribute("role", "button");
            startIcon.addEventListener("click", function () {
                if (list.hidden) {
                    expand();
                } else {
                    collapse();
                }
            });
        }
        span.append(startIcon);
        if (isRoot) {
            span.className = "font-monospace editable-tree";
        } else {
            const key = keys[level - 1];
            span.dataset.keys = JSON.stringify(keys);
            if (typeof key === "number") {
                span.append(createNotSelectableSpan(key + ": "));
            } else {
                startText = JSON.stringify(key) + ": ";
            }
        }
        if (value === null || typeof value !== "object") {
            const jsonOfValue = JSON.stringify(value);
            span.dataset.value = jsonOfValue;
            endText = startText + jsonOfValue;
        } else {
            if (Array.isArray(value)) {
                const indexOfLastElement = value.length - 1;
                const ol = createList(true, ...value.map(
                    (childValue, index) => from(
                        childValue,
                        keys.concat([index]),
                        index < indexOfLastElement
                    )
                ), createAddIcon(span));
                span.append(startText + "[", ol, endIcon);
                addCollapseEvent(ol, "element");
                endText = "]";
            } else {
                const entries = Object.entries(value);
                const indexOfLastMember = entries.length - 1;
                const ul = createList(false, ...entries.map(
                    function ([childKey, childValue], index) {
                        return from(
                            childValue,
                            keys.concat([childKey]),
                            index < indexOfLastMember
                        );
                    }
                ), createAddIcon(span));
                span.append(startText + "{", ul, endIcon);
                addCollapseEvent(ul, "member");
                endText = "}";
            }
        }
        if (notLast) {
            span.dataset.notLast = "";
            endText += ",";
        }
        span.append(endText, createEditIcon(span));
        if (!isRoot) {
            span.append(createInsertIcon(span), createDeleteIcon(span));
        }
        return span;
    }
    /**
     * @param {HTMLSpanElement} span
     * @returns {[*, Array<string | number>, boolean]} [value, keys, notLast]
     */
    function toValue(span) {
        const {
            keys: jsonOfKeys,
            value: jsonOfValue,
            notLast
        } = span.dataset;
        let keys = [];
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
                Array.from(ul.children).filter(
                    (li) => li.firstChild.tagName === "SPAN"
                ).map(
                    (li) => toValue(li.firstChild)
                ).forEach(function ([childValue, childKeys]) {
                    value[childKeys.pop()] = childValue;
                });
            } else {
                const ol = children.find(
                    (child) => child.tagName === "OL"
                );
                value = [];
                value.push(...Array.from(ol.children).filter(
                    (li) => li.firstChild.tagName === "SPAN"
                ).map(
                    (li) => toValue(li.firstChild)[0]
                ));
            }
        } else {
            value = JSON.parse(jsonOfValue);
        }
        return [value, keys, notLast === ""];
    }
    async function create({x, y}, defaultValue = {}) {
        const result = await editingCard.show({x, y}, "New", defaultValue);
        if (result !== undefined) {
            return from(result);
        }
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
