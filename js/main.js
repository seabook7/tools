/*global
    PetiteVue
*/
/*jslint
    browser, this
*/
(function () {
    const div = document.querySelector(".flex-fill");
    const table = document.querySelector("table");
    const delimiters = {
        Comma: ",",
        Semicolon: ";",
        Space: " ",
        Tab: "\t",
        "Vertical Line": "|"
    };
    const quotes = {
        Apostrophe: "'",
        None: "",
        Quote: "\""
    };
    function getColumnString(number) {
        if (number < 1) {
            return "";
        }
        if (number < 27) {
            return String.fromCharCode(number + 64);
        }
        if (number % 26 < 1) {
            return getColumnString(number / 26 - 1) + getColumnString(26);
        }
        return getColumnString(number / 26) + getColumnString(number % 26);
    }
    function readTextFile() {
        return new Promise(function (resolve) {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "text/csv,text/plain";
            fileInput.addEventListener("change", function () {
                const reader = new FileReader();
                reader.addEventListener("load", function () {
                    resolve({
                        name: fileInput.files[0].name,
                        text: reader.result.replace(/\r\n?/g, "\n")
                    });
                });
                reader.readAsText(fileInput.files[0]);
            });
            fileInput.click();
        });
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
            if (start < text.length) {
                array.push(text.substring(start));
            }
            return array;
        }
        return text.split(delimiter);
    }
    function getNumberOfRows() {
        return Math.trunc(div.clientHeight / 32.8) - 2;
    }
    function getNumberOfColumns() {
        return Math.trunc(div.clientWidth / 48) - 2;
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
    function create(numberOfRows, numberOfColumns) {
        const records = new Array(numberOfRows);
        let i = 0;
        while (i < records.length) {
            records[i] = new Array(numberOfColumns);
            records[i].fill("");
            i += 1;
        }
        return records;
    }
    function fromText(text, quote, delimiter) {
        const records = split(text, quote, "\n").map(
            (record) => split(record, quote, delimiter).map(
                (field) => decode(field, quote)
            )
        );
        const max = Math.max(...records.map((record) => record.length));
        records.forEach(function (record) {
            const start = record.length;
            record.length = max;
            record.fill("", start);
        });
        return records;
    }
    function getText(header, quote, delimiter) {
        let text = "";
        const rows = table.rows;
        let i = (
            header
            ? 0
            : 1
        );
        const rowsLength = rows.length - 1;
        while (i < rowsLength) {
            const record = [];
            const cells = rows[i].cells;
            let j = 1;
            const cellsLength = (
                i === 0
                ? cells.length - 1
                : cells.length
            );
            while (j < cellsLength) {
                record.push(
                    encode(cells[j].childNodes[0].innerText, quote, delimiter)
                );
                j += 1;
            }
            text += record.join(delimiter);
            text += "\n";
            i += 1;
        }
        return text;
    }
    const data = {
        addColumn() {
            this.records.forEach(function (record) {
                record.push("");
            });
        },
        addRow() {
            const record = new Array(this.records[0].length);
            record.fill("");
            this.records.push(record);
        },
        clickNewButton() {
            this.file = {name: "New.txt", text: ""};
            this.records = create(getNumberOfRows(), getNumberOfColumns());
        },
        clickOpenButton: async function () {
            this.file = await readTextFile();
            this.records = fromText(
                this.file.text,
                this.options.quote,
                this.options.delimiter
            );
        },
        clickSaveButton() {
            const blob = new Blob([getText(
                this.options.header,
                this.options.quote,
                this.options.delimiter
            )], {endings: "native"});
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = this.file.name;
            a.click();
            URL.revokeObjectURL(a.href);
        },
        delimiters,
        file: {name: "New.txt", text: ""},
        getColumnString,
        options: {
            delimiter: ",",
            header: false,
            quote: "\""
        },
        quotes,
        trim() {
            const rows = table.rows;
            let i = (
                this.options.header
                ? 0
                : 1
            );
            const rowsLength = rows.length - 1;
            while (i < rowsLength) {
                const cells = rows[i].cells;
                let j = 1;
                const cellsLength = (
                    i === 0
                    ? cells.length - 1
                    : cells.length
                );
                while (j < cellsLength) {
                    const pre = cells[j].childNodes[0];
                    pre.innerText = pre.innerText.trim();
                    j += 1;
                }
                i += 1;
            }
        }
    };
    document.body.style.height = window.innerHeight + "px";
    window.addEventListener("resize", function () {
        document.body.style.height = window.innerHeight + "px";
    });
    data.records = create(getNumberOfRows(), getNumberOfColumns());
    PetiteVue.createApp(data).mount();
}());
