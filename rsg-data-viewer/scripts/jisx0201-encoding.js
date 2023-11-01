const jisx0201Encoding = {
    decode(buffer) {
        let text = "";
        buffer.forEach(function (code) {
            if (code === 0x5C) {
                text += "¥";
            } else if (code === 0x7E) {
                text += "‾";
            } else if (code >= 0xA1 && code <= 0xDF) {
                text += String.fromCharCode(code + 0xFEC0);
            } else {
                text += String.fromCharCode(code);
            }
        });
        return text;
    }
};
