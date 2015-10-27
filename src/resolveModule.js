var fs = require("fs"),
    isNull = require("is_null"),
    filePath = require("file_path"),
    findExt = require("./utils/findExt"),
    getPackagePath = require("./utils/getPackagePath"),
    findPackageJSON = require("./utils/findPackageJSON"),
    createError = require("./utils/createError"),
    Dependency = require("./Dependency");


module.exports = resolveModule;


function resolveModule(path, requiredFromFullPath, options) {
    var exts = options.extensions,
        fullPath = filePath.isAbsolute(path) ? path : filePath.join(filePath.dirname(requiredFromFullPath), path),
        tmpFullPath, pkg, stat;

    try {
        stat = fs.statSync(fullPath);
    } catch (e) {}

    if (stat && stat.isDirectory()) {
        tmpFullPath = findExt(filePath.join(fullPath, "index"), exts);

        if (tmpFullPath) {
            return new Dependency(tmpFullPath, null);
        } else if ((tmpFullPath = findExt(fullPath, exts))) {
            return new Dependency(tmpFullPath, null);
        } else {
            pkg = findPackageJSON(fullPath);

            if (isNull(pkg)) {
                if (options.throwError) {
                    throw createError(path, requiredFromFullPath, false);
                } else {
                    return null;
                }
            } else {
                tmpFullPath = findExt(filePath.join(fullPath, getPackagePath(pkg, options.packageType)), exts);

                if (tmpFullPath) {
                    return new Dependency(tmpFullPath, pkg);
                } else {
                    if (options.throwError) {
                        throw createError(path, requiredFromFullPath, false);
                    } else {
                        return null;
                    }
                }
            }
        }
    } else {
        fullPath = findExt(fullPath, exts);

        if (fullPath) {
            return new Dependency(fullPath, null);
        } else {
            if (options.throwError) {
                throw createError(path, requiredFromFullPath, false);
            } else {
                return null;
            }
        }
    }
}
