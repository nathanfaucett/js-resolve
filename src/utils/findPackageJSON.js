var fs = require("fs"),
    filePath = require("@nathanfaucett/file_path");


module.exports = findPackageJSON;


function findPackageJSON(dirname) {
    var path = filePath.join(dirname, "package.json");

    if (fs.existsSync(path)) {
        return path;
    } else {
        return false;
    }
}
