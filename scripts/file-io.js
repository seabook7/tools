/*jslint browser*/
const FileIO = (function () {
    const isThenable = (object) => typeof object?.then === "function";
    const call = (acc, fn) => (
        isThenable(acc)
        ? acc.then(fn)
        : fn(acc)
    );
    const pipe = (...args) => args.reduce(call);
    const createBlob = (blobPart) => new Blob(
        Array.isArray(blobPart)
        ? blobPart
        : [blobPart]
    );
    const createObjectURL = (blob) => URL.createObjectURL(blob);
    const makeCreateElement = (doc) => (tagName) => doc.createElement(tagName);
    const createElement = makeCreateElement(document);
    function makeAnchor(name) {
        return function (url) {
            const anchor = createElement("a");
            anchor.href = url;
            anchor.download = name;
            return anchor;
        };
    }
    function clickAnchor(anchor) {
        anchor.click();
        URL.revokeObjectURL(anchor.href);
    }
    /**
     * @param {BlobPart|BlobPart[]} blobPart
     * @param {string} name
     */
    const download = (blobPart, name = "") => pipe(
        blobPart,
        createBlob,
        createObjectURL,
        makeAnchor(name),
        clickAnchor
    );
    function makeFileInput(multiple) {
        return function (accept) {
            const fileInput = createElement("input");
            fileInput.type = "file";
            if (accept !== undefined) {
                fileInput.accept = accept;
            }
            if (multiple !== undefined) {
                fileInput.multiple = multiple;
            }
            return fileInput;
        };
    }
    function makeFilePromise(multiple) {
        return function (fileInput) {
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
                fileInput.click();
            }
            return new Promise(executor);
        };
    }
    /**
     * @param {string} [accept]
     * @returns {Promise<File|undefined>}
     */
    const openFile = (accept) => pipe(
        accept,
        makeFileInput(),
        makeFilePromise()
    );
    /**
     * @param {string} [accept]
     * @returns {Promise<FileList|undefined>}
     */
    const openFiles = (accept) => pipe(
        accept,
        makeFileInput(true),
        makeFilePromise(true)
    );
    const toArrayBuffer = (blob) => blob.arrayBuffer();
    const createUint8Array = (arrayBuffer) => new Uint8Array(arrayBuffer);
    /**
     * @param {Blob} blob
     * @returns {Promise<Uint8Array>}
     */
    const readBytes = (blob) => pipe(
        blob,
        toArrayBuffer,
        createUint8Array
    );
    const toText = (blob) => blob.text();
    function makeReadAsText(encoding) {
        return function (blob) {
            function executor(resolve, reject) {
                const reader = new FileReader();
                const resolveResult = () => resolve(reader.result);
                const rejectError = () => reject(reader.error);
                reader.addEventListener("load", resolveResult);
                reader.addEventListener("error", rejectError);
                reader.readAsText(blob, encoding);
            }
            return new Promise(executor);
        };
    }
    /**
     * @param {Blob} blob
     * @param {string} [encoding]
     * @returns {Promise<string>}
     */
    const readText = (blob, encoding) => pipe(
        blob,
        (
            encoding === undefined
            ? toText
            : makeReadAsText(encoding)
        )
    );
    return {download, openFile, openFiles, readBytes, readText};
}());
