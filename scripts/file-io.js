/*jslint browser*/
const fileIO = {
    download(blob, name = "") {
        const anchor = document.createElement("a");
        anchor.href = URL.createObjectURL(blob);
        if (blob.name !== undefined) {
            anchor.download = blob.name;
        }
        if (name !== undefined) {
            anchor.download = name;
        }
        anchor.click();
        URL.revokeObjectURL(anchor.href);
    },
    open(accept, multiple) {
        return new Promise(function (resolve) {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            if (accept !== undefined) {
                fileInput.accept = accept;
            }
            if (multiple !== undefined) {
                fileInput.multiple = multiple;
            }
            fileInput.addEventListener("change", function () {
                resolve(
                    fileInput.multiple
                    ? fileInput.files
                    : fileInput.files[0]
                );
            });
            fileInput.addEventListener("cancel", function () {
                resolve();
            });
            fileInput.click();
        });
    }
};
