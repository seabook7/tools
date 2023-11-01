/*jslint browser*/
/*global base64Encoding, fileIO*/
(function (doc) {
    const fileRadio = doc.querySelector("#file-radio");
    const textRadio = doc.querySelector("#text-radio");
    const fileInputGroup = doc.querySelector("#file-input-group");
    const fileNameInput = doc.querySelector("#file-name-input");
    const encodeFileButton = doc.querySelector("#encode-file-button");
    const decodeFileButton = doc.querySelector("#decode-file-button");
    const textLabel = doc.querySelector("#text-label");
    const textArea = doc.querySelector("#text-area");
    const textTextarea = doc.querySelector("#text-textarea");
    const textButtons = doc.querySelector("#text-buttons");
    const encodeTextButton = doc.querySelector("#encode-text-button");
    const decodeTextButton = doc.querySelector("#decode-text-button");
    const base64Textarea = doc.querySelector("#base64-textarea");
    const lineBreaksCheckbox = doc.querySelector("#line-breaks-checkbox");
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
    encodeFileButton.addEventListener("click", async function () {
        const file = await fileIO.open();
        if (file !== undefined) {
            const base64 = base64Encoding.encode(await file.arrayBuffer());
            base64Textarea.value = (
                lineBreaksCheckbox.checked
                ? base64Encoding.insertLineBreaks(base64)
                : base64
            );
            fileNameInput.value = file.name;
        }
    });
    decodeFileButton.addEventListener("click", function () {
        const blob = new Blob([base64Encoding.decode(base64Textarea.value)]);
        fileIO.download(blob, fileNameInput.value);
    });
    lineBreaksCheckbox.addEventListener("change", function () {
        const base64 = base64Textarea.value.replaceAll("\n", "");
        base64Textarea.value = (
            lineBreaksCheckbox.checked
            ? base64Encoding.insertLineBreaks(base64)
            : base64
        );
    });
    encodeTextButton.addEventListener("click", async function () {
        const blob = new Blob([textTextarea.value]);
        const base64 = base64Encoding.encode(await blob.arrayBuffer());
        base64Textarea.value = (
            lineBreaksCheckbox.checked
            ? base64Encoding.insertLineBreaks(base64)
            : base64
        );
    });
    decodeTextButton.addEventListener("click", async function () {
        const blob = new Blob([base64Encoding.decode(base64Textarea.value)]);
        textTextarea.value = await blob.text();
    });
}(document));
