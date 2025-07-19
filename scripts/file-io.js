/*jslint browser*/
const FileIOFunctional = (function () {
    const isThenable = (object) => object !== null
    && typeof object === "object"
    && typeof object.then === "function";
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
    const createElement = (tagName) => document.createElement(tagName);
    function setAnchorHref(url) {
        return function (anchor) {
            anchor.href = url;
            return anchor;
        };
    }
    function setAnchorDownload(name = "") {
        return function (anchor) {
            anchor.download = name;
            return anchor;
        };
    }
    const makeAnchor = (name) => (url) => pipe(
        "a",
        createElement,
        setAnchorHref(url),
        setAnchorDownload(name)
    );
    function clickAnchor(anchor) {
        anchor.click();
        URL.revokeObjectURL(anchor.href);
    }
    /**
     * @param {BlobPart|BlobPart[]} blobPart
     * @param {string} [name]
     */
    const download = (blobPart, name) => pipe(
        blobPart,
        createBlob,
        createObjectURL,
        makeAnchor(name),
        clickAnchor
    );
    function setInputType(type) {
        return function (input) {
            input.type = type;
            return input;
        };
    }
    function setFileInputAccept(accept) {
        return function (fileInput) {
            if (accept !== undefined) {
                fileInput.accept = accept;
            }
            return fileInput;
        };
    }
    function setFileInputMultiple(multiple) {
        return function (fileInput) {
            if (multiple !== undefined) {
                fileInput.multiple = multiple;
            }
            return fileInput;
        };
    }
    const makeFileInput = (multiple) => (accept) => pipe(
        "input",
        createElement,
        setInputType("file"),
        setFileInputAccept(accept),
        setFileInputMultiple(multiple)
    );
    function makeFilePromise(fileInput) {
        function executor(resolve) {
            const resolveFiles = () => resolve(fileInput.files);
            const resolveFile = () => resolve(fileInput.files[0]);
            const cancel = () => resolve();
            fileInput.addEventListener("change", (
                fileInput.multiple
                ? resolveFiles
                : resolveFile
            ));
            fileInput.addEventListener("cancel", cancel);
            fileInput.click();
        }
        return new Promise(executor);
    }
    /**
     * @param {string} [accept]
     * @returns {Promise<File|undefined>}
     */
    const openFile = (accept) => pipe(
        accept,
        makeFileInput(),
        makeFilePromise
    );
    /**
     * @param {string} [accept]
     * @returns {Promise<FileList|undefined>}
     */
    const openFiles = (accept) => pipe(
        accept,
        makeFileInput(true),
        makeFilePromise
    );
    const getArrayBuffer = (blob) => blob.arrayBuffer();
    const createUint8Array = (arrayBuffer) => new Uint8Array(arrayBuffer);
    /**
     * @param {Blob} blob
     * @returns {Promise<Uint8Array>}
     */
    const readBytes = (blob) => (
        typeof blob.bytes === "function"
        ? blob.bytes()
        : pipe(
            blob,
            getArrayBuffer,
            createUint8Array
        )
    );
    function readAsText(encoding) {
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
    const readText = (blob, encoding) => (
        encoding === undefined
        ? blob.text()
        : pipe(
            blob,
            readAsText(encoding)
        )
    );
    return {download, openFile, openFiles, readBytes, readText};
}());
const FileIO = (function () {
    function makeAnchor(blobPart, name = "") {
        const blob = new Blob(
            Array.isArray(blobPart)
            ? blobPart
            : [blobPart]
        );
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = name;
        return anchor;
    }
    function clickAnchor(anchor) {
        anchor.click();
        URL.revokeObjectURL(anchor.href);
    }
    /**
     * @param {BlobPart|BlobPart[]} blobPart
     * @param {string} [name]
     */
    const download = (blobPart, name) => clickAnchor(
        makeAnchor(blobPart, name)
    );
    function makeFileInput(accept, multiple) {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        if (accept !== undefined) {
            fileInput.accept = accept;
        }
        if (multiple !== undefined) {
            fileInput.multiple = multiple;
        }
        return fileInput;
    }
    function makeFilePromise(fileInput) {
        function executor(resolve) {
            const resolveFiles = () => resolve(fileInput.files);
            const resolveFile = () => resolve(fileInput.files[0]);
            const cancel = () => resolve();
            fileInput.addEventListener("change", (
                fileInput.multiple
                ? resolveFiles
                : resolveFile
            ));
            fileInput.addEventListener("cancel", cancel);
            fileInput.click();
        }
        return new Promise(executor);
    }
    /**
     * @param {string} [accept]
     * @returns {Promise<File|undefined>}
     */
    const openFile = (accept) => makeFilePromise(makeFileInput(accept));
    /**
     * @param {string} [accept]
     * @returns {Promise<FileList|undefined>}
     */
    const openFiles = (accept) => makeFilePromise(makeFileInput(accept, true));
    const createUint8Array = (arrayBuffer) => new Uint8Array(arrayBuffer);
    /**
     * @param {Blob} blob
     * @returns {Promise<Uint8Array>}
     */
    const readBytes = (blob) => (
        typeof blob.bytes === "function"
        ? blob.bytes()
        : blob.arrayBuffer().then(createUint8Array)
    );
    function readAsText(blob, encoding) {
        function executor(resolve, reject) {
            const reader = new FileReader();
            const resolveResult = () => resolve(reader.result);
            const rejectError = () => reject(reader.error);
            reader.addEventListener("load", resolveResult);
            reader.addEventListener("error", rejectError);
            reader.readAsText(blob, encoding);
        }
        return new Promise(executor);
    }
    /**
     * @param {Blob} blob
     * @param {string} [encoding]
     * @returns {Promise<string>}
     */
    const readText = (blob, encoding) => (
        encoding === undefined
        ? blob.text()
        : readAsText(blob, encoding)
    );
    return {download, openFile, openFiles, readBytes, readText};
}());
