var fs = require("fs"),
    filePath = require("file_path"),
    reSpliter = require("./reSpliter");


module.exports = findNodeModulePackageJSON;


function findNodeModulePackageJSON(moduleName, requiredFromDirname, modulesDirectoryName) {
    var id = modulesDirectoryName + "/" + moduleName + "/package.json",
        root = requiredFromDirname,
        depth = root.split(reSpliter).length,
        fullPath = filePath.join(root, id);

    if (fs.existsSync(fullPath)) {
        return fullPath;
    } else {
        while (depth--) {
            fullPath = filePath.join(root, id);
            root = root + "/../";

            if (fs.existsSync(fullPath)) {
                return fullPath;
            }
        }
        return null;
    }
}
