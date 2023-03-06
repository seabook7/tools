/*jslint browser*/
const editableTable = (function () {
    const tableClass = (
        "table table-success table-striped table-bordered w-auto"
    );
    const headClass = "table-light";
    const headCellClass = "position-static min-inline-size-3rem p-0";
    const insertCellClass = "min-inline-size-3rem py-1 text-center";
    const fieldCellClass = "min-inline-size-3rem p-1 white-space-pre";
    const dropdownButtonClass = (
        "dropdown-toggle border-0 w-100 p-1 bg-transparent"
    );
    const dropdownMenuClass = "dropdown-menu glass-background shadow";
    const dropdownItemClass = "dropdown-item";
    const dropendClass = "dropend";
    const table = document.createElement("table");
    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    const headCell = document.createElement("th");
    const body = document.createElement("tbody");
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
        const cell = document.createElement("th");
        cell.className = headCellClass;
        cell.scope = "col";
        cell.append(dropdownButton, dropdownMenu);
        return cell;
    }
    function createRowHeadCell(dropdownButton, dropdownMenu) {
        const cell = document.createElement("th");
        cell.className = [headClass, headCellClass, dropendClass].join(" ");
        cell.scope = "row";
        cell.append(dropdownButton, dropdownMenu);
        return cell;
    }
    function createFieldCell(field) {
        const cell = document.createElement("td");
        cell.className = fieldCellClass;
        cell.contentEditable = "true";
        cell.append(
            (field === undefined || field === "")
            ? document.createElement("br")
            : field
        );
        return cell;
    }
    function createInsertIcon() {
        const i = document.createElement("i");
        i.className = "bi-plus-square text-primary";
        return i;
    }
    function createDeleteIcon() {
        const i = document.createElement("i");
        i.className = "bi-dash-square text-danger";
        return i;
    }
    function createDropdownButton(text) {
        const button = document.createElement("button");
        button.className = dropdownButtonClass;
        button.dataset.bsToggle = "dropdown";
        button.type = "button";
        button.append(text);
        return button;
    }
    function createColumnDropdownMenu() {
        const ul = document.createElement("ul");
        const insertLi = document.createElement("li");
        const insertButton = document.createElement("button");
        const deleteLi = document.createElement("li");
        const deleteButton = document.createElement("button");
        ul.className = dropdownMenuClass;
        insertButton.className = dropdownItemClass;
        insertButton.type = "button";
        insertButton.addEventListener("click", function () {
            insertColumn(ul.parentElement.cellIndex);
        });
        deleteButton.className = dropdownItemClass;
        deleteButton.type = "button";
        deleteButton.addEventListener("click", function () {
            deleteColumn(ul.parentElement.cellIndex);
        });
        insertButton.append(createInsertIcon(), " Insert column");
        insertLi.append(insertButton);
        deleteButton.append(createDeleteIcon(), " Delete column");
        deleteLi.append(deleteButton);
        ul.append(insertLi, deleteLi);
        return ul;
    }
    function createRowDropendMenu() {
        const ul = document.createElement("ul");
        const insertLi = document.createElement("li");
        const insertButton = document.createElement("button");
        const deleteLi = document.createElement("li");
        const deleteButton = document.createElement("button");
        ul.className = dropdownMenuClass;
        insertButton.className = dropdownItemClass;
        insertButton.type = "button";
        insertButton.addEventListener("click", function () {
            insertRow(ul.parentElement.parentElement.rowIndex);
        });
        deleteButton.className = dropdownItemClass;
        deleteButton.type = "button";
        deleteButton.addEventListener("click", function () {
            deleteRow(ul.parentElement.parentElement.rowIndex);
        });
        insertButton.append(createInsertIcon(), " Insert row");
        insertLi.append(insertButton);
        deleteButton.append(createDeleteIcon(), " Delete row");
        deleteLi.append(deleteButton);
        ul.append(insertLi, deleteLi);
        return ul;
    }
    function createInsertColumnCell() {
        const cell = document.createElement("th");
        cell.className = insertCellClass;
        cell.title = "Insert column";
        cell.setAttribute("role", "button");
        cell.scope = "col";
        cell.addEventListener("click", function () {
            insertColumn(cell.cellIndex);
        });
        cell.append(createInsertIcon());
        return cell;
    }
    function createInsertRow() {
        const row = document.createElement("tr");
        const cell = document.createElement("th");
        cell.className = [headClass, insertCellClass].join(" ");
        cell.title = "Insert row";
        cell.setAttribute("role", "button");
        cell.scope = "row";
        cell.addEventListener("click", function () {
            insertRow(row.rowIndex);
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
        const row = document.createElement("tr");
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
            const row = document.createElement("tr");
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
    table.className = tableClass;
    head.className = headClass;
    headCell.scope = "col";
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
