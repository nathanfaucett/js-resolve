var fs = require("fs"),
    filePath = require("file_path");


module.exports = findNodeModulePackageJSON;


function findNodeModulePackageJSON(moduleName, requiredFromDirname, modulesDirectoryName) {
    var id = filePath.join(modulesDirectoryName, moduleName, "package.json"),
        root = requiredFromDirname,
        depth = filePath.normalize(root).split(filePath.separator).length,
        fullPath = filePath.join(root, id);

    if (fs.existsSync(fullPath)) {
        return fullPath;
    } else {
        while (depth--) {
            fullPath = filePath.join(root, id);
            root = filePath.join(root, "..");

            if (fs.existsSync(fullPath)) {
                return fullPath;
            }
        }
        return null;
    }
}
