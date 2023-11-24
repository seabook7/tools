/*jslint this, devel*/
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
