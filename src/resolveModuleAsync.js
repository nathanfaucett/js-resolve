var fs = require("fs"),
    isNull = require("is_null"),
    filePath = require("file_path"),
    findExt = require("./utils/findExt"),
    getPackagePath = require("./utils/getPackagePath"),
    findPackageJSON = require("./utils/findPackageJSON"),
    createError = require("./utils/createError"),
    Dependency = require("./Dependency");


module.exports = resolveModuleAsync;


function resolveModuleAsync(path, requiredFromFullPath, options, callback) {
    var exts = options.extensions,
        fullPath = filePath.isAbsolute(path) ? path : filePath.join(filePath.dirname(requiredFromFullPath), path);

    fs.stat(fullPath, function(error, stat) {
        var tmpFullPath, pkg;

        if (stat && stat.isDirectory()) {
            tmpFullPath = findExt(filePath.join(fullPath, "index"), exts);

            if (tmpFullPath) {
                callback(undefined, new Dependency(tmpFullPath, null));
            } else if ((tmpFullPath = findExt(fullPath, exts))) {
                callback(undefined, new Dependency(tmpFullPath, null));
            } else {
                pkg = findPackageJSON(fullPath);

                if (isNull(pkg)) {
                    callback(createError(path, requiredFromFullPath, false));
                } else {
                    tmpFullPath = findExt(filePath.join(fullPath, getPackagePath(pkg, options.packageType)), exts);

                    if (tmpFullPath) {
                        callback(undefined, new Dependency(tmpFullPath, pkg));
                    } else {
                        callback(createError(path, requiredFromFullPath, false));
                    }
                }
            }
        } else {
            fullPath = findExt(fullPath, exts);

            if (fullPath) {
                callback(undefined, new Dependency(fullPath, null));
            } else {
                callback(createError(path, requiredFromFullPath, false));
            }
        }
    });
}
