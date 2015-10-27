var fs = require("fs"),
    filePath = require("file_path"),
    readJSONFile = require("./readJSONFile");


module.exports = findPackageJSON;


function findPackageJSON(dirname) {
    var path = filePath.join(dirname, "package.json"),
        pkg;

    if (fs.existsSync(path)) {
        try {
            pkg = readJSONFile(path);
        } catch (e) {
            return null;
        }

        return pkg;
    } else {
        return null;
    }
}
