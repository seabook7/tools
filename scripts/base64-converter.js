/*jslint browser*/
/*global Base64DataEncoding, fileIO*/
(function (query) {
    const fileRadio = query("#file-radio");
    const textRadio = query("#text-radio");
    const fileInputGroup = query("#file-input-group");
    const fileNameInput = query("#file-name-input");
    const openButton = query("#open-button");
    const saveButton = query("#save-button");
    const textLabel = query("#text-label");
    const textArea = query("#text-area");
    const urlCheckbox = query("#url-checkbox");
    const textTextarea = query("#text-textarea");
    const textButtons = query("#text-buttons");
    const toButton = query("#to-button");
    const fromButton = query("#from-button");
    const saveBase64Button = query("#save-base64-button");
    const base64Textarea = query("#base64-textarea");
    const lineBreaksCheckbox = query("#line-breaks-checkbox");
    fileRadio.addEventListener("change", function () {
        fileInputGroup.hidden = false;
        textLabel.hidden = true;
        textArea.hidden = true;
        textButtons.hidden = true;
    });
    textRadio.addEventListener("change", function () {
        fileInputGroup.hidden = true;
        textLabel.hidden = false;
        textArea.hidden = false;
        textButtons.hidden = false;
    });
    openButton.addEventListener("click", async function () {
        const file = await fileIO.open();
        if (file !== undefined) {
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            const base64String = Base64DataEncoding.toBase64String(uint8Array);
            base64Textarea.value = (
                lineBreaksCheckbox.checked
                ? Base64DataEncoding.insertLineBreaks(base64String)
                : base64String
            );
            fileNameInput.value = file.name;
        }
    });
    saveButton.addEventListener("click", function () {
        const data = Base64DataEncoding.fromBase64String(base64Textarea.value);
        const uint8Array = new Uint8Array(data);
        const blob = new Blob([uint8Array]);
        fileIO.download(blob, fileNameInput.value);
    });
    lineBreaksCheckbox.addEventListener("change", function () {
        const base64String = base64Textarea.value.replaceAll("\n", "");
        base64Textarea.value = (
            lineBreaksCheckbox.checked
            ? Base64DataEncoding.insertLineBreaks(base64String)
            : base64String
        );
    });
    toButton.addEventListener("click", async function () {
        const blob = new Blob([textTextarea.value]);
        const arrayBuffer = await blob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const base64String = (
            urlCheckbox.checked
            ? Base64DataEncoding.toBase64URLString(uint8Array)
            : Base64DataEncoding.toBase64String(uint8Array)
        );
        base64Textarea.value = (
            lineBreaksCheckbox.checked
            ? Base64DataEncoding.insertLineBreaks(base64String)
            : base64String
        );
    });
    fromButton.addEventListener("click", async function () {
        const base64String = base64Textarea.value;
        const data = (
            urlCheckbox.checked
            ? Base64DataEncoding.fromBase64String(base64String)
            : Base64DataEncoding.fromBase64URLString(base64String)
        );
        const uint8Array = new Uint8Array(data);
        const blob = new Blob([uint8Array]);
        textTextarea.value = await blob.text();
    });
    saveBase64Button.addEventListener("click", function () {
        const base64String = base64Textarea.value;
        const blob = new Blob([base64String]);
        fileIO.download(blob, "base64.txt");
    });
}((selectors) => document.querySelector(selectors)));
