var fs = require("fs"),
    filePath = require("file_path"),
    findExt = require("./utils/findExt"),
    getPackagePath = require("./utils/getPackagePath"),
    findPackageJSON = require("./utils/findPackageJSON"),
    readJSONFile = require("./utils/readJSONFile"),
    createError = require("./utils/createError"),
    Dependency = require("./Dependency");


module.exports = resolveModuleAsync;


function resolveModuleAsync(path, requiredFromFullPath, options, callback) {
    var exts = options.extensions,
        fullPath = filePath.isAbsolute(path) ? path : filePath.join(filePath.dirname(requiredFromFullPath), path);

    fs.stat(fullPath, function(error, stat) {
        var tmpFullPath, pkgFullPath, pkg;

        if (stat && stat.isDirectory()) {
            tmpFullPath = findExt(filePath.join(fullPath, "index"), exts);

            if (tmpFullPath) {
                callback(undefined, new Dependency(tmpFullPath, null, null));
            } else if ((tmpFullPath = findExt(fullPath, exts))) {
                callback(undefined, new Dependency(tmpFullPath, null, null));
            } else {
                pkgFullPath = findPackageJSON(fullPath);
                try {
                    pkg = readJSONFile(pkgFullPath);
                } catch (e) {}

                if (pkg) {
                    tmpFullPath = findExt(filePath.join(fullPath, getPackagePath(pkg, options.packageType)), exts);

                    if (tmpFullPath) {
                        callback(undefined, new Dependency(tmpFullPath, pkgFullPath, pkg));
                    } else {
                        callback(createError(path, requiredFromFullPath, false));
                    }
                } else {
                    callback(createError(path, requiredFromFullPath, false));
                }
            }
        } else {
            fullPath = findExt(fullPath, exts);

            if (fullPath) {
                callback(undefined, new Dependency(fullPath, null, null));
            } else {
                callback(createError(path, requiredFromFullPath, false));
            }
        }
    });
}
