/*jslint browser*/
const FileIO = (function (create) {
    /**
     * @param {BlobPart|BlobPart[]} blobPart
     * @param {string} name
     */
    function download(blobPart, name = "") {
        const blob = new Blob(
            Array.isArray(blobPart)
            ? blobPart
            : [blobPart]
        );
        const anchor = create("a");
        anchor.href = URL.createObjectURL(blob);
        anchor.download = name;
        anchor.click();
        URL.revokeObjectURL(anchor.href);
    }
    function open(accept, multiple) {
        const fileInput = create("input");
        fileInput.type = "file";
        if (accept !== undefined) {
            fileInput.accept = accept;
        }
        if (multiple !== undefined) {
            fileInput.multiple = multiple;
        }
        function executor(resolve) {
            const resolveFiles = () => resolve(fileInput.files);
            const resolveFile = () => resolve(fileInput.files[0]);
            const cancel = () => resolve();
            fileInput.addEventListener("change", (
                multiple
                ? resolveFiles
                : resolveFile
            ));
            fileInput.addEventListener("cancel", cancel);
        }
        const promise = new Promise(executor);
        fileInput.click();
        return promise;
    }
    /**
     * @param {string} [accept]
     * @returns {Promise<File>}
     */
    const openFile = (accept) => open(accept);
    /**
     * @param {string} [accept]
     * @returns {Promise<FileList>}
     */
    const openFiles = (accept) => open(accept, true);
    /**
     * @param {File} file
     * @returns {Promise<Uint8Array>}
     */
    async function readBytes(file) {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        return uint8Array;
    }
    function readAsText(file, encoding) {
        const reader = new FileReader();
        function executor(resolve, reject) {
            const resolveResult = () => resolve(reader.result);
            const rejectError = () => reject(reader.error);
            reader.addEventListener("load", resolveResult);
            reader.addEventListener("error", rejectError);
        }
        const promise = new Promise(executor);
        reader.readAsText(file, encoding);
        return promise;
    }
    /**
     * @param {File} file
     * @param {string} [encoding]
     * @returns {Promise<string>}
     */
    const readText = (file, encoding) => (
        encoding === undefined
        ? file.text()
        : readAsText(file, encoding)
    );
    return {download, openFile, openFiles, readBytes, readText};
}((tagName) => document.createElement(tagName)));
