var fs = require("fs"),
    hasExt = require("./hasExt");


module.exports = findExt;


function findExt(path, exts) {
    return hasExt(path, exts) ? path : baseFindExt(path, exts);
}

function baseFindExt(path, exts) {
    var i = -1,
        il = exts.length - 1,
        tmpFilePath;

    while (i++ < il) {
        tmpFilePath = path + "." + exts[i];

        if (fs.existsSync(tmpFilePath)) {
            return tmpFilePath;
        }
    }
    return false;
}
