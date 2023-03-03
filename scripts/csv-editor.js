/*global fileIO, editableTable*/
/*jslint browser*/
(function () {
    const delimiters = [
        {text: "[,]Comma", value: ","},
        {text: "[;]Semicolon", value: ";"},
        {text: "[\t]Tab", value: "\t"},
        {text: "[|]Vertical Line", value: "|"},
        {text: "[ ]Space", value: " "}
    ];
    const quotes = [
        {text: "[\"]Quote", value: "\""},
        {text: "[']Apostrophe", value: "'"},
        {text: "None", value: ""}
    ];
    let delimiter = ",";
    let quote = "\"";
    const fileNameInput = document.getElementById("file-name-input");
    const rowsCountInput = document.getElementById("rows-count");
    const columnsCountInput = document.getElementById("columns-count");
    const newButton = document.getElementById("new-button");
    const openButton = document.getElementById("open-button");
    const saveButton = document.getElementById("save-button");
    const delimiterSelect = document.getElementById("delimiter-select");
    const quoteSelect = document.getElementById("quote-select");
    const div = document.querySelector("div.flex-fill");
    function resizeBodyHeight() {
        document.body.style.height = window.innerHeight + "px";
    }
    function split(text, quote, delimiter) {
        if (quote.length === 1 && delimiter.length === 1) {
            const array = [];
            let start = 0;
            let i = start;
            let inQuote = false;
            while (i < text.length) {
                switch (text[i]) {
                case delimiter:
                    if (!inQuote) {
                        array.push(text.substring(start, i));
                        start = i + 1;
                    }
                    break;
                case quote:
                    if (inQuote && text[i + 1] === quote) {
                        i += 1;
                    } else {
                        inQuote = !inQuote;
                    }
                    break;
                }
                i += 1;
            }
            if (start <= text.length) {
                array.push(text.substring(start));
            }
            return array;
        }
        return text.split(delimiter);
    }
    function decode(field, quote) {
        if (quote.length === 1) {
            let string = "";
            let i = 0;
            let inQuote = false;
            while (i < field.length) {
                if (field[i] === quote) {
                    if (inQuote && field[i + 1] === quote) {
                        string += quote;
                        i += 1;
                    } else {
                        inQuote = !inQuote;
                    }
                } else {
                    string += field[i];
                }
                i += 1;
            }
            return string;
        }
        return field;
    }
    function encode(field, quote, delimiter) {
        if (quote.length === 1) {
            if (
                field.includes(quote)
                || field.includes(delimiter)
                || field.includes("\n")
            ) {
                field = field.replaceAll(quote, quote + quote);
                field = quote + field + quote;
            }
            return field;
        }
        return field.replaceAll(delimiter, "").replace(/\n/g, "");
    }
    function computeRange() {
        const {
            height: divHeight,
            width: divWidth
        } = div.getBoundingClientRect();
        const table = editableTable.create(0, 0);
        const cell = table.rows[0].cells[0];
        div.replaceChildren(table);
        const {
            height: cellHeight,
            width: cellWidth
        } = cell.getBoundingClientRect();
        table.remove();
        rowsCountInput.value = Math.trunc(divHeight / cellHeight) - 2;
        columnsCountInput.value = Math.trunc(divWidth / cellWidth) - 2;
    }
    function createNew() {
        div.replaceChildren(editableTable.create(
            parseInt(rowsCountInput.value),
            parseInt(columnsCountInput.value)
        ));
    }
    window.addEventListener("resize", resizeBodyHeight);
    newButton.addEventListener("click", createNew);
    openButton.addEventListener("click", async function () {
        const file = await fileIO.open("text/csv,text/plain");
        if (file) {
            const text = await file.text();
            const data = split(
                text.replace(/\r\n?/g, "\n").replace(/\n$/, ""),
                quote,
                "\n"
            ).map(
                (record) => split(record, quote, delimiter).map(
                    (field) => decode(field, quote)
                )
            );
            fileNameInput.value = file.name;
            rowsCountInput.value = data.length;
            columnsCountInput.value = Math.max(
                ...data.map((record) => record.length)
            );
            div.replaceChildren(editableTable.from(data));
        }
    });
    saveButton.addEventListener("click", function () {
        const data = editableTable.toData();
        const text = data.reduce(
            (string, record) => string + record.map(
                (field) => encode(field, quote, delimiter)
            ).join(delimiter) + "\n",
            ""
        );
        fileIO.download(
            new Blob([text], {endings: "native"}),
            fileNameInput.value
        );
    });
    delimiterSelect.append(...delimiters.map(function (delimiter) {
        const option = document.createElement("option");
        option.value = delimiter.value;
        option.append(delimiter.text);
        return option;
    }));
    // delimiterSelect.value = delimiter;
    delimiterSelect.addEventListener("change", function () {
        delimiter = delimiterSelect.value;
    });
    quoteSelect.append(...quotes.map(function (quote) {
        const option = document.createElement("option");
        option.value = quote.value;
        option.append(quote.text);
        return option;
    }));
    // quoteSelect.value = quote;
    quoteSelect.addEventListener("change", function () {
        quote = quoteSelect.value;
    });
    resizeBodyHeight();
    computeRange();
    createNew();
}());
