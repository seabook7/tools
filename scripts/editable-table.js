/*jslint browser*/
const editableTable = (function () {
    function e(tagName, attributes) {
        const element = document.createElement(tagName);
        if (typeof attributes === "object") {
            Object.entries(attributes).forEach(function ([key, value]) {
                if (typeof value === "function") {
                    element.addEventListener(key, value);
                } else {
                    element[key] = value;
                }
            });
        }
        return element;
    }
    const tableClass = [
        "table",
        "table-bordered",
        "table-success",
        "table-striped",
        "editable-table"
    ].join(" ");
    const headClass = "table-light";
    const headCellClass = "head-cell";
    const insertCellClass = "insert-cell";
    const fieldCellClass = "field-cell";
    const dropdownButtonClass = [
        "dropdown-toggle",
        "editable-table-dropdown-button"
    ].join(" ");
    const dropdownMenuClass = [
        "dropdown-menu",
        "shadow",
        "glass-background"
    ].join(" ");
    const dropdownItemClass = "dropdown-item";
    const dropendClass = "dropend";
    const table = e("table", {className: tableClass});
    const head = e("thead", {className: headClass});
    const headRow = e("tr");
    const headCell = e("th", {scope: "col"});
    const body = e("tbody");
    function getColumnName(number) {
        if (number < 1) {
            return "";
        }
        if (number < 27) {
            return String.fromCharCode(number + 64);
        }
        if (number % 26 < 1) {
            return getColumnName(number / 26 - 1) + getColumnName(26);
        }
        return getColumnName(number / 26) + getColumnName(number % 26);
    }
    function getField(data, x, y) {
        if (Array.isArray(data)) {
            x -= 1;
            if (Array.isArray(data[x])) {
                y -= 1;
                return data[x][y];
            }
        }
    }
    function createColumnHeadCell(dropdownButton, dropdownMenu) {
        const cell = e("th", {
            className: headCellClass,
            scope: "col"
        });
        cell.append(dropdownButton, dropdownMenu);
        return cell;
    }
    function createRowHeadCell(dropdownButton, dropdownMenu) {
        const cell = e("th", {
            className: [headClass, headCellClass, dropendClass].join(" "),
            scope: "row"
        });
        cell.append(dropdownButton, dropdownMenu);
        return cell;
    }
    function createFieldCell(field) {
        const cell = e("td", {
            className: fieldCellClass,
            contentEditable: "true"
        });
        cell.append(
            (field === undefined || field === "")
            ? e("br")
            : field
        );
        return cell;
    }
    function createInsertIcon() {
        return e("img", {
            alt: "+",
            height: 16,
            src: "images/plus-square.svg",
            width: 16
        });
    }
    function createDeleteIcon() {
        return e("img", {
            alt: "-",
            height: 16,
            src: "images/dash-square.svg",
            width: 16
        });
    }
    function createDropdownButton(text) {
        const button = e("button", {className: dropdownButtonClass});
        button.dataset.bsToggle = "dropdown";
        button.append(text);
        return button;
    }
    function createColumnDropdownMenu() {
        const ul = e("ul", {className: dropdownMenuClass});
        let li = e("li");
        let button = e("button", {
            className: dropdownItemClass,
            click() {
                insertColumn(ul.parentElement.cellIndex);
            }
        });
        button.append(createInsertIcon(), " Insert column");
        li.append(button);
        ul.append(li);
        li = e("li");
        button = e("button", {
            className: dropdownItemClass,
            click() {
                deleteColumn(ul.parentElement.cellIndex);
            }
        });
        button.append(createDeleteIcon(), " Delete column");
        li.append(button);
        ul.append(li);
        return ul;
    }
    function createRowDropendMenu() {
        const ul = e("ul", {className: dropdownMenuClass});
        let li = e("li");
        let button = e("button", {
            className: dropdownItemClass,
            click() {
                insertRow(ul.parentElement.parentElement.rowIndex);
            }
        });
        button.append(createInsertIcon(), " Insert row");
        li.append(button);
        ul.append(li);
        li = e("li");
        button = e("button", {
            className: dropdownItemClass,
            click() {
                deleteRow(ul.parentElement.parentElement.rowIndex);
            }
        });
        button.append(createDeleteIcon(), " Delete row");
        li.append(button);
        ul.append(li);
        return ul;
    }
    function createInsertColumnCell() {
        const cell = e("th", {
            className: insertCellClass,
            click() {
                insertColumn(cell.cellIndex);
            },
            scope: "col",
            title: "Insert column"
        });
        cell.append(createInsertIcon());
        return cell;
    }
    function createInsertRow() {
        const row = e("tr");
        const cell = e("th", {
            className: [headClass, insertCellClass].join(" "),
            click() {
                insertRow(row.rowIndex);
            },
            scope: "row",
            title: "Insert row"
        });
        cell.append(createInsertIcon());
        row.append(cell);
        return row;
    }
    function insertColumn(index) {
        const rows = body.rows;
        let i = rows.length - 1;
        headRow.insertBefore(createColumnHeadCell(
            createDropdownButton(getColumnName(headRow.lastChild.cellIndex)),
            createColumnDropdownMenu()
        ), headRow.lastChild);
        while (i > 0) {
            i -= 1;
            rows[i].insertBefore(createFieldCell(), rows[i].cells[index]);
        }
    }
    function deleteColumn(index) {
        const rows = body.rows;
        let i = rows.length - 1;
        headRow.removeChild(
            headRow.childNodes[headRow.lastChild.cellIndex - 1]
        );
        while (i > 0) {
            i -= 1;
            rows[i].removeChild(rows[i].childNodes[index]);
        }
    }
    function insertRow(index) {
        const row = e("tr");
        let i = headRow.cells.length - 2;
        const rows = table.rows;
        row.append(createRowHeadCell(
            createDropdownButton(index),
            createRowDropendMenu()
        ));
        while (i > 0) {
            i -= 1;
            row.append(createFieldCell());
        }
        body.insertBefore(row, rows[index]);
        index += 1;
        i = rows.length - 1;
        while (i > index) {
            i -= 1;
            rows[i].replaceChild(createRowHeadCell(
                createDropdownButton(i),
                createRowDropendMenu()
            ), rows[i].firstChild);
        }
    }
    function deleteRow(index) {
        const rows = table.rows;
        let i = rows.length - 2;
        body.removeChild(rows[index]);
        while (i > index) {
            i -= 1;
            rows[i].replaceChild(createRowHeadCell(
                createDropdownButton(i),
                createRowDropendMenu()
            ), rows[i].firstChild);
        }
    }
    function build(rowsCount, columnsCount, data) {
        let i = 0;
        let j = 0;
        headRow.replaceChildren(headCell);
        body.replaceChildren();
        while (i < columnsCount) {
            i += 1;
            headRow.append(createColumnHeadCell(
                createDropdownButton(getColumnName(i)),
                createColumnDropdownMenu()
            ));
        }
        headRow.append(createInsertColumnCell());
        while (j < rowsCount) {
            const row = e("tr");
            j += 1;
            row.append(createRowHeadCell(
                createDropdownButton(j),
                createRowDropendMenu()
            ));
            i = 0;
            while (i < columnsCount) {
                i += 1;
                row.append(createFieldCell(getField(data, j, i)));
            }
            body.append(row);
        }
        body.append(createInsertRow());
    }
    head.append(headRow);
    table.append(head, body);
    return {
        create(rowsCount, columnsCount) {
            build(rowsCount, columnsCount);
            return table;
        },
        from(data) {
            build(
                data.length,
                Math.max(...data.map((record) => record.length)),
                data
            );
            return table;
        },
        toData() {
            const rows = body.rows;
            let i = 0;
            const data = [];
            while (i < rows.length - 1) {
                const cells = rows[i].cells;
                let j = 1;
                data.push([]);
                while (j < cells.length) {
                    data[i].push(cells[j].innerText.replace(/\n$/, ""));
                    j += 1;
                }
                i += 1;
            }
            return data;
        }
    };
}());
