/*global fileIO, editableTable*/
/*jslint browser, this*/
const csv = (function () {
    const lineBreak = "\n";
    const lastLineBreak = /\n$/;
    function checkParameters(enclose, separator) {
        const encloseLength = enclose.length;
        const separatorLength = separator.length;
        const notEnclose = encloseLength === 0;
        if (
            encloseLength > 1
            || (encloseLength === 1 && separatorLength !== 1)
            || (notEnclose && separatorLength === 0)
        ) {
            throw new TypeError();
        }
        return notEnclose;
    }
    function decode(text, enclose = "\"", separator = ",") {
        if (typeof enclose !== "string") {
            enclose = String(enclose);
        }
        if (typeof separator !== "string") {
            separator = String(separator);
        }
        const notEnclose = checkParameters(enclose, separator);
        if (typeof text !== "string") {
            text = String(text);
        }
        text = text.replace(/\r\n?/g, lineBreak).replace(lastLineBreak, "");
        if (notEnclose) {
            return text.split(lineBreak).map(
                (record) => record.split(separator)
            );
        }
        const file = [];
        let record = [];
        let field = "";
        let index = 0;
        const length = text.length;
        let isEnclosed = false;
        let start = index;
        let next;
        function appendField() {
            field += text.substring(start, index);
            start = index + 1;
        }
        function buildField() {
            if (start < index) {
                field += text.substring(start, index);
            }
            start = index + 1;
        }
        function buildRecord() {
            record.push(field);
            field = "";
        }
        function buildFile() {
            file.push(record);
            record = [];
        }
        while (index < length) {
            if (isEnclosed) {
                if (text[index] === enclose) {
                    next = index + 1;
                    if (text[next] === enclose) {
                        index = next;
                        appendField();
                    } else {
                        isEnclosed = false;
                        buildField();
                    }
                }
            } else {
                switch (text[index]) {
                case enclose:
                    isEnclosed = true;
                    buildField();
                    break;
                case separator:
                    buildField();
                    buildRecord();
                    break;
                case lineBreak:
                    buildField();
                    buildRecord();
                    buildFile();
                    break;
                }
            }
            index += 1;
        }
        buildField();
        buildRecord();
        buildFile();
        return file;
    }
    function convert(array, hasRecordsName = false, hasFieldsName = true) {
        if (
            (!hasRecordsName && !hasFieldsName)
            || !Array.isArray(array)
            || array.some((record) => !Array.isArray(record))
        ) {
            throw new TypeError();
        }
        function shift(array) {
            if (array.length === 0) {
                throw new TypeError();
            }
            return array.shift();
        }
        let fieldsName = [];
        function reduce(record, field, index) {
            if (field !== undefined) {
                record[fieldsName[index]] = field;
            }
            return record;
        }
        if (hasFieldsName) {
            if (array.length === 0) {
                return {};
            }
            fieldsName = shift(array);
            if (hasRecordsName) {
                shift(fieldsName);
                return array.reduce(function (object, fields) {
                    object[shift(fields)] = fields.reduce(reduce, {});
                    return object;
                }, {});
            }
            return array.map(
                (fields) => fields.reduce(reduce, {})
            );
        }
        return array.reduce(function (result, fields) {
            const record = fields.slice();
            result[shift(record)] = record;
            return result;
        }, {});
    }
    function copyToObject(value, depth) {
        const object = (
            (value === null || typeof value !== "object")
            ? [value]
            : Array.isArray(value)
            ? value.slice()
            : Object.assign({}, value)
        );
        if (depth > 1) {
            const keys = Object.keys(object);
            if (keys.length === 0) {
                if (Array.isArray(object)) {
                    object[0] = [];
                } else {
                    object[""] = {};
                }
            } else {
                Object.keys(object).forEach(function (key) {
                    object[key] = copyToObject(object[key], depth - 1);
                });
            }
        }
        return object;
    }
    function encode(value, enclose = "\"", separator = ",") {
        if (typeof enclose !== "string") {
            enclose = String(enclose);
        }
        if (typeof separator !== "string") {
            separator = String(separator);
        }
        const notEnclose = checkParameters(enclose, separator);
        const object = copyToObject(value, 2);
        const recordsName = Object.keys(object);
        const records = Object.values(object);
        const fieldsName = records.map(
            (record) => Object.keys(record)
        ).reduce(function (result, keys) {
            keys.forEach(function (key) {
                if (!result.includes(key)) {
                    result.push(key);
                }
            });
            return result;
        });
        const file = records.map(function (fields) {
            return fieldsName.reduce(function (record, fieldName) {
                record.push(fields[fieldName]);
                return record;
            }, []);
        });
        if (!Array.isArray(object)) {
            fieldsName.unshift(undefined);
            file.forEach(function (record, index) {
                record.unshift(recordsName[index]);
            });
        }
        if (records.some((record) => !Array.isArray(record))) {
            file.unshift(fieldsName);
        }
        function check(field) {
            if (field === null) {
                field = "null";
            }
            if (
                typeof field === "string"
                && (field.includes(separator) || field.includes(lineBreak))
            ) {
                throw new SyntaxError();
            }
            return field;
        }
        function escape(field) {
            if (field === null) {
                field = "null";
            }
            if (
                typeof field === "string"
                && (
                    field.includes(enclose)
                    || field.includes(separator)
                    || field.includes(lineBreak)
                )
            ) {
                field = field.replaceAll(enclose, enclose + enclose);
                field = enclose + field + enclose;
            }
            return field;
        }
        return file.map(
            (record) => record.map(
                notEnclose
                ? check
                : escape
            ).join(separator)
        ).join(lineBreak);
    }
    return {convert, decode, encode};
}());
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
    newButton.addEventListener("click", createNew);
    openButton.addEventListener("click", async function () {
        const file = await fileIO.open("text/csv,text/plain");
        if (file) {
            const text = await file.text();
            const data = csv.decode(text, quote, delimiter);
            div.replaceChildren(editableTable.from(data));
            fileNameInput.value = file.name;
        }
    });
    saveButton.addEventListener("click", function () {
        const data = editableTable.toData();
        const text = csv.encode(data, quote, delimiter);
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
    computeRange();
    createNew();
}());
