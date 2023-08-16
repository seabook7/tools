/*jslint browser*/
/*global fileIO*/
function data() {
    let fileName = "New.txt";
    let optionsName = "Text Replacer Options.json";
    async function openFile(data) {
        const file = await fileIO.open("text/plain");
        if (file) {
            data.text = await file.text();
            fileName = file.name;
        }
    }
    function saveFile(text) {
        fileIO.download(new Blob([text]), fileName);
    }
    function getLineNumbers(text) {
        const count = text.split("\n").length;
        let number = 0;
        let lineNumbers = "";
        while (number < count) {
            number += 1;
            lineNumbers += number + "\n";
        }
        return lineNumbers;
    }
    function getDefaultBoolean(value) {
        return (
            typeof value === "boolean"
            ? value
            : true
        );
    }
    function getDefaultString(value) {
        return (
            typeof value === "string"
            ? value
            : ""
        );
    }
    function createListItem(item) {
        return (
            typeof item === "object"
            ? {
                enablePatternPrefixAndSuffix: getDefaultBoolean(
                    item.enablePatternPrefixAndSuffix
                ),
                enableReplacementPrefixAndSuffix: getDefaultBoolean(
                    item.enableReplacementPrefixAndSuffix
                ),
                pattern: getDefaultString(item.pattern),
                replacement: getDefaultString(item.replacement)
            }
            : {
                enablePatternPrefixAndSuffix: true,
                enableReplacementPrefixAndSuffix: true,
                pattern: "",
                replacement: ""
            }
        );
    }
    async function loadOptions(data) {
        const file = await fileIO.open("application/json");
        if (file) {
            try {
                const {
                    list,
                    patternPrefix,
                    patternSuffix,
                    replacementPrefix,
                    replacementSuffix
                } = JSON.parse(await file.text());
                optionsName = file.name;
                data.patternPrefix = getDefaultString(patternPrefix);
                data.patternSuffix = getDefaultString(patternSuffix);
                data.replacementPrefix = getDefaultString(replacementPrefix);
                data.replacementSuffix = getDefaultString(replacementSuffix);
                data.list = (
                    Array.isArray(list)
                    ? list.map(
                        (item) => createListItem(item)
                    ).filter(
                        (item) => item.pattern.length > 0
                        || !item.enablePatternPrefixAndSuffix
                        || item.replacement.length > 0
                        || !item.enableReplacementPrefixAndSuffix
                    )
                    : []
                );
            } catch (error) {
                window.alert(error.message);
            }
        }
    }
    function saveOptions(data) {
        fileIO.download(new Blob([JSON.stringify({
            list: data.list.filter(
                (item) => item.pattern.length > 0
                || !item.enablePatternPrefixAndSuffix
                || item.replacement.length > 0
                || !item.enableReplacementPrefixAndSuffix
            ),
            patternPrefix: data.patternPrefix,
            patternSuffix: data.patternSuffix,
            replacementPrefix: data.replacementPrefix,
            replacementSuffix: data.replacementSuffix
        }, undefined, 4)]), optionsName);
    }
    function resetOptions(data) {
        data.patternPrefix = "";
        data.patternSuffix = "";
        data.replacementPrefix = "";
        data.replacementSuffix = "";
        data.list = new Array(8).fill(true).map(createListItem);
    }
    function replace(data) {
        const {
            list,
            patternPrefix,
            patternSuffix,
            replacementPrefix,
            replacementSuffix,
            text
        } = data;
        let textIsChanged = false;
        data.text = list.filter(function ({pattern}) {
            return pattern.length > 0;
        }).reduce(function (result, {
            enablePatternPrefixAndSuffix,
            enableReplacementPrefixAndSuffix,
            pattern,
            replacement
        }) {
            if (enablePatternPrefixAndSuffix) {
                pattern = patternPrefix + pattern + patternSuffix;
            }
            if (enableReplacementPrefixAndSuffix) {
                replacement = replacementPrefix
                + replacement
                + replacementSuffix;
            }
            if (result.includes(pattern)) {
                textIsChanged = true;
                return result.replaceAll(pattern, replacement);
            }
            return result;
        }, text);
        if (textIsChanged) {
            data.originalText.push(text);
        }
    }
    return {
        createListItem,
        getLineNumbers,
        list: new Array(8).fill(true).map(createListItem),
        loadOptions,
        openFile,
        originalText: [],
        patternPrefix: "",
        patternSuffix: "",
        replace,
        replacementPrefix: "",
        replacementSuffix: "",
        resetOptions,
        saveFile,
        saveOptions,
        text: ""
    };
}
