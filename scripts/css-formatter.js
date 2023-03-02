/*jslint browser, devel*/
/*global fileIO*/
// reference:
// https://codeguide.co/
(function () {
    const fileNameInput = document.getElementById("file-name-input");
    const newButton = document.getElementById("new-button");
    const openButton = document.getElementById("open-button");
    const formatButton = document.getElementById("format-button");
    const revertButton = document.getElementById("revert-button");
    const saveButton = document.getElementById("save-button");
    const lineNumbersTextarea = document.getElementById(
        "line-numbers-textarea"
    );
    const cssTextarea = document.getElementById("css-textarea");
    const alertPlaceholder = document.getElementById("live-alert-placeholder");
    function resizeBodyHeight() {
        document.body.style.height = window.innerHeight + "px";
    }
    function showLineNumbers() {
        const count = cssTextarea.value.split("\n").length;
        let number = 0;
        let lineNumbers = "";
        while (number < count) {
            number += 1;
            lineNumbers += number + "\n";
        }
        lineNumbersTextarea.value = lineNumbers;
    }
    // reference:
    // https://github.com/stormwarning/stylelint-config-recess-order
    const propertyOrderList = [
        "composes",
        "all",
        "position",
        "inset",
        "inset-block",
        "inset-inline",
        "top",
        "right",
        "bottom",
        "left",
        "z-index",
        "box-sizing",
        "display",
        "flex",
        "flex-basis",
        "flex-direction",
        "flex-flow",
        "flex-grow",
        "flex-shrink",
        "flex-wrap",
        "grid",
        "grid-area",
        "grid-template",
        "grid-template-areas",
        "grid-template-rows",
        "grid-template-columns",
        "grid-row",
        "grid-row-start",
        "grid-row-end",
        "grid-column",
        "grid-column-start",
        "grid-column-end",
        "grid-auto-rows",
        "grid-auto-columns",
        "grid-auto-flow",
        "grid-gap",
        "grid-row-gap",
        "grid-column-gap",
        "gap",
        "row-gap",
        "column-gap",
        "place-content",
        "place-items",
        "place-self",
        "align-content",
        "align-items",
        "align-self",
        "justify-content",
        "justify-items",
        "justify-self",
        "order",
        "float",
        "width",
        "min-width",
        "max-width",
        "height",
        "min-height",
        "max-height",
        "aspect-ratio",
        "padding",
        "padding-block",
        "padding-block-start",
        "padding-block-end",
        "padding-inline",
        "padding-inline-start",
        "padding-inline-end",
        "padding-top",
        "padding-right",
        "padding-bottom",
        "padding-left",
        "margin",
        "margin-block",
        "margin-block-start",
        "margin-block-end",
        "margin-inline",
        "margin-inline-start",
        "margin-inline-end",
        "margin-top",
        "margin-right",
        "margin-bottom",
        "margin-left",
        "overflow",
        "overflow-x",
        "overflow-y",
        "-webkit-overflow-scrolling",
        "-ms-overflow-x",
        "-ms-overflow-y",
        "-ms-overflow-style",
        "overscroll-behavior",
        "overscroll-behavior-x",
        "overscroll-behavior-y",
        "overscroll-behavior-inline",
        "overscroll-behavior-block",
        "clip",
        "clip-path",
        "clear",
        "font",
        "font-family",
        "font-size",
        "font-variation-settings",
        "font-style",
        "font-weight",
        "font-feature-settings",
        "font-optical-sizing",
        "font-kerning",
        "font-variant",
        "font-variant-ligatures",
        "font-variant-caps",
        "font-variant-alternates",
        "font-variant-numeric",
        "font-variant-east-asian",
        "font-variant-position",
        "font-size-adjust",
        "font-stretch",
        "font-effect",
        "font-emphasize",
        "font-emphasize-position",
        "font-emphasize-style",
        "-webkit-font-smoothing",
        "-moz-osx-font-smoothing",
        "font-smooth",
        "hyphens",
        "line-height",
        "color",
        "text-align",
        "text-align-last",
        "text-emphasis",
        "text-emphasis-color",
        "text-emphasis-style",
        "text-emphasis-position",
        "text-decoration",
        "text-decoration-line",
        "text-decoration-thickness",
        "text-decoration-style",
        "text-decoration-color",
        "text-underline-position",
        "text-underline-offset",
        "text-indent",
        "text-justify",
        "text-outline",
        "-ms-text-overflow",
        "text-overflow",
        "text-overflow-ellipsis",
        "text-overflow-mode",
        "text-shadow",
        "text-transform",
        "text-wrap",
        "-webkit-text-size-adjust",
        "-ms-text-size-adjust",
        "letter-spacing",
        "word-break",
        "word-spacing",
        "word-wrap",
        "overflow-wrap",
        "tab-size",
        "white-space",
        "vertical-align",
        "list-style",
        "list-style-position",
        "list-style-type",
        "list-style-image",
        "src",
        "font-display",
        "unicode-range",
        "size-adjust",
        "ascent-override",
        "descent-override",
        "line-gap-override",
        "pointer-events",
        "-ms-touch-action",
        "touch-action",
        "cursor",
        "visibility",
        "zoom",
        "table-layout",
        "empty-cells",
        "caption-side",
        "border-spacing",
        "border-collapse",
        "content",
        "quotes",
        "counter-reset",
        "counter-increment",
        "resize",
        "user-select",
        "nav-index",
        "nav-up",
        "nav-right",
        "nav-down",
        "nav-left",
        "background",
        "background-color",
        "background-image",
        "-ms-filter:\\'progid:DXImageTransform.Microsoft.gradient",
        "filter:progid:DXImageTransform.Microsoft.gradient",
        "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader",
        "filter",
        "background-repeat",
        "background-attachment",
        "background-position",
        "background-position-x",
        "background-position-y",
        "background-clip",
        "background-origin",
        "background-size",
        "background-blend-mode",
        "isolation",
        "border",
        "border-color",
        "border-style",
        "border-width",
        "border-block",
        "border-block-start",
        "border-block-start-color",
        "border-block-start-style",
        "border-block-start-width",
        "border-block-end",
        "border-block-end-color",
        "border-block-end-style",
        "border-block-end-width",
        "border-inline",
        "border-inline-start",
        "border-inline-start-color",
        "border-inline-start-style",
        "border-inline-start-width",
        "border-inline-end",
        "border-inline-end-color",
        "border-inline-end-style",
        "border-inline-end-width",
        "border-top",
        "border-top-color",
        "border-top-style",
        "border-top-width",
        "border-right",
        "border-right-color",
        "border-right-style",
        "border-right-width",
        "border-bottom",
        "border-bottom-color",
        "border-bottom-style",
        "border-bottom-width",
        "border-left",
        "border-left-color",
        "border-left-style",
        "border-left-width",
        "border-radius",
        "border-start-start-radius",
        "border-start-end-radius",
        "border-end-start-radius",
        "border-end-end-radius",
        "border-top-left-radius",
        "border-top-right-radius",
        "border-bottom-right-radius",
        "border-bottom-left-radius",
        "border-image",
        "border-image-source",
        "border-image-slice",
        "border-image-width",
        "border-image-outset",
        "border-image-repeat",
        "outline",
        "outline-width",
        "outline-style",
        "outline-color",
        "outline-offset",
        "box-shadow",
        "mix-blend-mode",
        "filter:progid:DXImageTransform.Microsoft.Alpha(Opacity",
        "-ms-filter:\\'progid:DXImageTransform.Microsoft.Alpha",
        "opacity",
        "-ms-interpolation-mode",
        "alignment-baseline",
        "baseline-shift",
        "dominant-baseline",
        "text-anchor",
        "word-spacing",
        "writing-mode",
        "fill",
        "fill-opacity",
        "fill-rule",
        "stroke",
        "stroke-dasharray",
        "stroke-dashoffset",
        "stroke-linecap",
        "stroke-linejoin",
        "stroke-miterlimit",
        "stroke-opacity",
        "stroke-width",
        "color-interpolation",
        "color-interpolation-filters",
        "color-profile",
        "color-rendering",
        "flood-color",
        "flood-opacity",
        "image-rendering",
        "lighting-color",
        "marker-start",
        "marker-mid",
        "marker-end",
        "mask",
        "shape-rendering",
        "stop-color",
        "stop-opacity",
        "transition",
        "transition-delay",
        "transition-timing-function",
        "transition-duration",
        "transition-property",
        "transform",
        "transform-origin",
        "animation",
        "animation-name",
        "animation-duration",
        "animation-play-state",
        "animation-timing-function",
        "animation-delay",
        "animation-iteration-count",
        "animation-direction"
    ];
    const lastOrder = propertyOrderList.length;
    function findPropertyOrder(propertyName) {
        const index = propertyOrderList.indexOf(propertyName);
        return (
            index >= 0
            ? index
            : lastOrder
        );
    }
    function splitSelectorText(selectorText) {
        let index = 0;
        const length = selectorText.length;
        let start = index;
        let quotesCharactor;
        let isQuoted = false;
        const selectors = [];
        while (index < length) {
            const character = selectorText[index];
            switch (character) {
            case "\"":
            case "'":
                if (!isQuoted) {
                    quotesCharactor = character;
                }
                if (character === quotesCharactor) {
                    isQuoted = !isQuoted;
                }
                break;
            case ",":
                if (!isQuoted) {
                    selectors.push(selectorText.substring(start, index));
                    start = index + 2;
                }
                break;
            }
            index += 1;
        }
        selectors.push(selectorText.substring(start));
        return selectors;
    }
    const messageList = {
        emptyRulesList: [],
        orderChangedRulesList: []
    };
    function createPropertiesText(stylesArray, selectorText, spaces) {
        let index = 0;
        const length = stylesArray.length - 1;
        let orderIsWrong = false;
        const childSpaces = spaces + "  ";
        while (index < length) {
            const next = index + 1;
            if (
                findPropertyOrder(stylesArray[index].name)
                > findPropertyOrder(stylesArray[next].name)
            ) {
                orderIsWrong = true;
            }
            index = next;
        }
        if (orderIsWrong) {
            stylesArray.sort(function ({name: a}, {name: b}) {
                return findPropertyOrder(a) - findPropertyOrder(b);
            });
            messageList.orderChangedRulesList.push(selectorText);
        }
        return stylesArray.reduce(function (text, {name, value}) {
            return text + childSpaces + name + ": " + value + ";\n";
        }, " {\n") + spaces + "}\n";
    }
    function toCSS(cssRuleList, spaces = "") {
        return Array.from(cssRuleList).reduce(function (cssText, cssRule) {
            const type = cssRule.constructor.name;
            if (type === "CSSStyleRule") {
                const selectorText = cssRule.selectorText;
                const selectors = splitSelectorText(selectorText);
                const style = cssRule.style;
                const styles = Array.from(style).map(
                    (name) => ({name, value: style[name]})
                );
                const length = styles.length;
                if (length === 0) {
                    messageList.emptyRulesList.push(selectorText);
                } else {
                    cssText += selectors.map(
                        (selector) => spaces + selector
                    ).join(",\n");
                    if (length === 1) {
                        const {name, value} = styles[0];
                        cssText += " { " + name + ": " + value + "; }\n";
                    } else {
                        cssText += createPropertiesText(
                            styles,
                            selectorText,
                            spaces
                        );
                    }
                }
            }
            return cssText;
        }, "");
    }
    function alert(message, type) {
        const wrapper = document.createElement("div");
        const messageDiv = document.createElement("div");
        const closeButton = document.createElement("button");
        messageDiv.append(message);
        closeButton.className = "btn-close";
        closeButton.type = "button";
        closeButton.dataset.bsDismiss = "alert";
        wrapper.className = "alert alert-" + type + " alert-dismissible me-4";
        wrapper.append(messageDiv, closeButton);
        alertPlaceholder.append(wrapper);
    }
    function report() {
        const emptyRulesList = messageList.emptyRulesList;
        const orderChangedRulesList = messageList.orderChangedRulesList;
        let count = emptyRulesList.length;
        let message;
        if (count > 0) {
            message = count + " empyt rules has been removed.\n";
            message += emptyRulesList.map(
                (selectorText, index) => index + 1 + ": " + selectorText
            ).join("\n");
            alert(message, "info");
        }
        messageList.emptyRulesList = [];
        count = orderChangedRulesList.length;
        if (count > 0) {
            message = "Property order of " + count
            + " rules has been changed.\n";
            message += orderChangedRulesList.map(
                (selectorText, index) => index + 1 + ": " + selectorText
            ).join("\n");
            alert(message, "info");
        }
        messageList.orderChangedRulesList = [];
    }
    let originalCSS;
    window.addEventListener("resize", resizeBodyHeight);
    newButton.addEventListener("click", function () {
        alertPlaceholder.replaceChildren();
        fileNameInput.value = "New.css";
        cssTextarea.value = "";
        showLineNumbers();
    });
    openButton.addEventListener("click", async function () {
        const file = await fileIO.open("text/css");
        if (file) {
            alertPlaceholder.replaceChildren();
            fileNameInput.value = file.name;
            cssTextarea.value = await file.text();
            showLineNumbers();
        }
    });
    formatButton.addEventListener("click", function () {
        const iframe = document.createElement("iframe");
        iframe.src = "css.html";
        iframe.title = "CSS";
        iframe.hidden = true;
        document.body.append(iframe);
        alertPlaceholder.replaceChildren();
        try {
            const cssDocument = iframe.contentDocument;
            const style = cssDocument.createElement("style");
            style.append(cssTextarea.value);
            cssDocument.head.append(style);
            const cssStyleSheet = cssDocument.styleSheets[0];
            console.log(cssStyleSheet);
            const css = toCSS(cssStyleSheet.cssRules);
            report();
            if (cssTextarea.value !== css) {
                originalCSS = cssTextarea.value;
                cssTextarea.value = css;
                showLineNumbers();
                revertButton.disabled = false;
            }
        } catch (error) {
            alert(error.message, "danger");
        }
        iframe.remove();
    });
    revertButton.disabled = true;
    revertButton.addEventListener("click", function () {
        alertPlaceholder.replaceChildren();
        cssTextarea.value = originalCSS;
        showLineNumbers();
        revertButton.disabled = true;
    });
    saveButton.addEventListener("click", function () {
        const blob = new Blob([cssTextarea.value], {endings: "native"});
        fileIO.download(blob, fileNameInput.value);
    });
    cssTextarea.addEventListener("input", showLineNumbers);
    cssTextarea.addEventListener("scroll", function () {
        lineNumbersTextarea.scrollTop = cssTextarea.scrollTop;
    });
    resizeBodyHeight();
    showLineNumbers();
    alert("Incomplete!", "danger");
}());
