var isArray = require("is_array");


module.exports = hasExt;


function hasExt(path, exts) {
    var str;

    if (isArray(exts)) {
        str = exts.join("|");
    } else {
        str = exts + "";
    }

    return (new RegExp("\\.(" + str + ")$")).test(path);
}
