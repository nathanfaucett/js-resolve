var fs = require("fs"),
    filePath = require("file_path"),
    findExt = require("./utils/findExt"),
    getPackagePath = require("./utils/getPackagePath"),
    findPackageJSON = require("./utils/findPackageJSON"),
    createError = require("./utils/createError"),
    readJSONFile = require("./utils/readJSONFile"),
    Dependency = require("./Dependency");


module.exports = resolveModule;


function resolveModule(path, requiredFromFullPath, options) {
    var exts = options.extensions,
        fullPath = filePath.isAbsolute(path) ? path : filePath.join(filePath.dirname(requiredFromFullPath), path),
        tmpFullPath, pkgFullPath, pkg, stat;

    try {
        stat = fs.statSync(fullPath);
    } catch (e) {}

    if (stat && stat.isDirectory()) {
        tmpFullPath = findExt(filePath.join(fullPath, "index"), exts);

        if (tmpFullPath) {
            return new Dependency(tmpFullPath, null, null);
        } else if ((tmpFullPath = findExt(fullPath, exts))) {
            return new Dependency(tmpFullPath, null, null);
        } else {
            pkgFullPath = findPackageJSON(fullPath);

            if (pkgFullPath) {
                try {
                    pkg = readJSONFile(pkgFullPath);
                } catch (e) {}
            }

            if (pkg) {
                tmpFullPath = findExt(filePath.join(fullPath, getPackagePath(pkg, options.packageType)), exts);

                if (tmpFullPath) {
                    return new Dependency(tmpFullPath, pkgFullPath, pkg);
                } else {
                    if (options.throwError) {
                        throw createError(path, requiredFromFullPath, false);
                    } else {
                        return null;
                    }
                }
            } else {
                if (options.throwError) {
                    throw createError(path, requiredFromFullPath, false);
                } else {
                    return null;
                }
            }
        }
    } else {
        fullPath = findExt(fullPath, exts);

        if (fullPath) {
            return new Dependency(fullPath, null, null);
        } else {
            if (options.throwError) {
                throw createError(path, requiredFromFullPath, false);
            } else {
                return null;
            }
        }
    }
}
