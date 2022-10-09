/*jslint
    browser
*/
const dataTable = (function () {
    const tableClass = [
        "table",
        "table-bordered",
        "table-success",
        "table-striped",
        "data-table"
    ];
    const headClass = "table-light";
    const headCellClass = "head-cell";
    const insertCellClass = "insert-cell";
    const fieldCellClass = "field-cell";
    const dropdownButtonClass = [
        "dropdown-toggle",
        "data-table-dropdown-button"
    ];
    const dropdownMenuClass = [
        "dropdown-menu",
        "transparent-dropdown-menu"
    ];
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
        cell.classList.add(headCellClass);
        cell.scope = "col";
        cell.append(dropdownButton, dropdownMenu);
        setDropdownStyle(dropdownButton, dropdownMenu);
        return cell;
    }
    function createRowHeadCell(dropdownButton, dropdownMenu) {
        const cell = document.createElement("th");
        cell.classList.add(headClass, headCellClass, dropendClass);
        cell.scope = "row";
        cell.append(dropdownButton, dropdownMenu);
        setDropdownStyle(dropdownButton, dropdownMenu);
        return cell;
    }
    function createFieldCell(field) {
        const cell = document.createElement("td");
        cell.classList.add(fieldCellClass);
        cell.contentEditable = "true";
        if (field !== undefined && field !== "") {
            cell.append(field);
        }
        return cell;
    }
    function createInsertIcon() {
        const img = document.createElement("img");
        img.src = "images/plus-square.svg";
        img.width = 16;
        img.height = 16;
        img.alt = "+";
        return img;
    }
    function createDeleteIcon() {
        const img = document.createElement("img");
        img.src = "images/dash-square.svg";
        img.width = 16;
        img.height = 16;
        img.alt = "-";
        return img;
    }
    function createDropdownButton(text) {
        const button = document.createElement("button");
        button.dataset.bsToggle = "dropdown";
        button.append(text);
        return button;
    }
    function createColumnDropdownMenu() {
        const ul = document.createElement("ul");
        let li = document.createElement("li");
        let button = document.createElement("button");
        button.append(createInsertIcon(), " Insert column");
        button.addEventListener("click", function () {
            insertColumn(ul.parentElement.cellIndex);
        });
        li.append(button);
        ul.append(li);
        li = document.createElement("li");
        button = document.createElement("button");
        button.append(createDeleteIcon(), " Delete column");
        button.addEventListener("click", function () {
            deleteColumn(ul.parentElement.cellIndex);
        });
        li.append(button);
        ul.append(li);
        return ul;
    }
    function createRowDropendMenu() {
        const ul = document.createElement("ul");
        let li = document.createElement("li");
        let button = document.createElement("button");
        button.append(createInsertIcon(), " Insert row");
        button.addEventListener("click", function () {
            insertRow(ul.parentElement.parentElement.rowIndex);
        });
        li.append(button);
        ul.append(li);
        li = document.createElement("li");
        button = document.createElement("button");
        button.append(createDeleteIcon(), " Delete row");
        button.addEventListener("click", function () {
            deleteRow(ul.parentElement.parentElement.rowIndex);
        });
        li.append(button);
        ul.append(li);
        return ul;
    }
    function createInsertColumnCell() {
        const cell = document.createElement("th");
        cell.classList.add(insertCellClass);
        cell.scope = "col";
        cell.title = "Insert column";
        cell.append(createInsertIcon());
        cell.addEventListener("click", function () {
            insertColumn(cell.cellIndex);
        });
        return cell;
    }
    function createInsertRow() {
        const row = document.createElement("tr");
        const cell = document.createElement("th");
        cell.classList.add(headClass, insertCellClass);
        cell.scope = "row";
        cell.title = "Insert row";
        cell.append(createInsertIcon());
        cell.addEventListener("click", function () {
            insertRow(row.rowIndex);
        });
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
    function setTableStyle() {
        table.classList.add(...tableClass);
        head.classList.add(headClass);
    }
    function setDropdownStyle(dropdownButton, dropdownMenu) {
        const items = dropdownMenu.querySelectorAll("button");
        dropdownButton.classList.add(...dropdownButtonClass);
        dropdownMenu.classList.add(...dropdownMenuClass);
        let i = items.length;
        while (i > 0) {
            i -= 1;
            items[i].classList.add(dropdownItemClass);
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
        setTableStyle();
    }
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
        getCellSize() {
            let rect;
            build(0, 0);
            document.body.appendChild(table);
            rect = headCell.getBoundingClientRect();
            document.body.removeChild(table);
            return {height: rect.height, width: rect.width};
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
                    data[i].push(cells[j].innerText);
                    j += 1;
                }
                i += 1;
            }
            return data;
        }
    };
}());
