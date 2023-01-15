const jisx0201Encoding = {
    decode(buffer) {
        let string = "";
        buffer.forEach(function (code) {
            if (code === 0x5C) {
                string += "¥";
            } else if (code === 0x7E) {
                string += "‾";
            } else if (code >= 0xA1 && code <= 0xDF) {
                string += String.fromCharCode(code + 0xFEC0);
            } else {
                string += String.fromCharCode(code);
            }
        });
        return string;
    }
};
