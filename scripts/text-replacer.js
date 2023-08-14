/*jslint browser*/
/*global fileIO, PetiteVue*/
// set height of body to 100%
(function (win) {
    function resizeHeight() {
        document.body.style.height = win.innerHeight + "px";
    }
    resizeHeight();
    win.addEventListener("resize", resizeHeight);
}(window));
function data() {
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
    function getDefaultBoolean(boolean) {
        return (
            typeof boolean === "boolean"
            ? boolean
            : true
        );
    }
    function getDefaultString(string) {
        return (
            typeof string === "string"
            ? string
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
                        && item.replacement.length > 0
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
                (item) => item.pattern.length > 0 && item.replacement.length > 0
            ),
            patternPrefix: data.patternPrefix,
            patternSuffix: data.patternSuffix,
            replacementPrefix: data.replacementPrefix,
            replacementSuffix: data.replacementSuffix
        }, undefined, 4)]), "options.json");
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
        data.text = list.filter(
            (item) => item.pattern.length > 0 && item.replacement.length > 0
        ).reduce(
            (result, item) => result.replaceAll(
                (
                    item.enablePatternPrefixAndSuffix
                    ? patternPrefix + item.pattern + patternSuffix
                    : item.pattern
                ),
                (
                    item.enableReplacementPrefixAndSuffix
                    ? replacementPrefix + item.replacement + replacementSuffix
                    : item.replacement
                )
            ),
            text
        );
    }
    return {
        createListItem,
        getLineNumbers,
        list: new Array(8).fill(true).map(createListItem),
        loadOptions,
        patternPrefix: "",
        patternSuffix: "",
        replace,
        replacementPrefix: "",
        replacementSuffix: "",
        resetOptions,
        saveOptions,
        text: ""
    };
}
PetiteVue.createApp(data()).mount();
