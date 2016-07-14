var fs = require("fs"),
    isNull = require("@nathanfaucett/is_null"),
    filePath = require("@nathanfaucett/file_path"),
    findExt = require("./utils/findExt"),
    getPackagePath = require("./utils/getPackagePath"),
    readJSONFile = require("./utils/readJSONFile"),
    createError = require("./utils/createError"),
    reModuleSpliter = require("./utils/reModuleSpliter"),
    findNodeModulePackageJSON = require("./utils/findNodeModulePackageJSON"),
    Dependency = require("./Dependency");


module.exports = resolveNodeModuleAsync;


function resolveNodeModuleAsync(path, requiredFromFullPath, options, callback) {
    var nodeModuleParts = path.match(reModuleSpliter),
        scopeName = nodeModuleParts[1],
        moduleName = (scopeName ? scopeName + "/" : "") + nodeModuleParts[3],
        relativePath = nodeModuleParts[4],

        modulesDirectoryName = options.modulesDirectoryName,
        builtin = options.builtin,
        exts = options.extensions,
        pkgFullPath = null,
        pkg = null,
        isEmpty = false,
        builtinInfo, builtinName, builtinPath, tmpFullPath;


    if (relativePath && relativePath[0] === "/") {
        relativePath = relativePath.slice(1);
    }

    builtinInfo = builtin[moduleName];
    if (builtinInfo) {
        if (isString(builtinInfo)) {
            builtinName = moduleName;
            builtinPath = builtinInfo;
        } else {
            builtinName = builtinInfo.name || moduleName;
            builtinPath = builtinInfo.path;
            isEmpty = builtinInfo.empty;
        }
        pkgFullPath = findNodeModulePackageJSON(builtinName, filePath.dirname(builtinPath), modulesDirectoryName);
    } else {
        pkgFullPath = findNodeModulePackageJSON(moduleName, filePath.dirname(requiredFromFullPath), modulesDirectoryName);
    }

    if (isNull(pkgFullPath)) {
        callback(createError(path, requiredFromFullPath, true));
    } else {
        try {
            pkg = readJSONFile(pkgFullPath);
        } catch (e) {
            pkg = null;
        }

        if (isNull(pkg)) {
            callback(createError(path, requiredFromFullPath, true));
        } else {
            if (relativePath) {
                tmpFullPath = filePath.join(filePath.dirname(pkgFullPath), relativePath);

                fs.stat(tmpFullPath, function(error, stat) {
                    var tmpFullPath2;

                    if (stat && stat.isDirectory()) {
                        tmpFullPath2 = findExt(filePath.join(tmpFullPath, "index"), exts);

                        if (tmpFullPath2) {
                            callback(undefined, new Dependency(tmpFullPath2, pkgFullPath, pkg));
                        } else {
                            tmpFullPath2 = findExt(tmpFullPath, exts);

                            if (tmpFullPath2) {
                                callback(undefined, new Dependency(tmpFullPath2, pkgFullPath, pkg));
                            } else {
                                callback(createError(path, requiredFromFullPath, true));
                            }
                        }
                    } else {
                        tmpFullPath2 = findExt(tmpFullPath, exts);

                        if (tmpFullPath2) {
                            callback(undefined, new Dependency(tmpFullPath2, pkg));
                        } else {
                            callback(createError(path, requiredFromFullPath, true));
                        }
                    }
                });
            } else {
                tmpFullPath = findExt(filePath.join(filePath.dirname(pkgFullPath), getPackagePath(pkg, options.packageType)), exts);

                if (tmpFullPath) {
                    callback(undefined, new Dependency(tmpFullPath, pkgFullPath, pkg));
                } else {
                    callback(createError(path, requiredFromFullPath, true));
                }
            }
        }
    }
}
