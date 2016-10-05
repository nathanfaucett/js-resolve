var fs = require("fs"),
    isNull = require("@nathanfaucett/is_null"),
    isString = require("@nathanfaucett/is_string"),
    filePath = require("@nathanfaucett/file_path"),
    findExt = require("./utils/findExt"),
    getPackagePath = require("./utils/getPackagePath"),
    readJSONFile = require("./utils/readJSONFile"),
    createError = require("./utils/createError"),
    reModuleSpliter = require("./utils/reModuleSpliter"),
    findNodeModulePackageJSON = require("./utils/findNodeModulePackageJSON"),
    Dependency = require("./Dependency");


module.exports = resolveNodeModule;


function resolveNodeModule(path, requiredFromFullPath, options) {
    var nodeModuleParts = path.match(reModuleSpliter),
        scopeName = nodeModuleParts[1],
        moduleName = (scopeName ? scopeName + filePath.separator : "") + nodeModuleParts[3],
        relativePath = nodeModuleParts[4],

        modulesDirectoryName = options.modulesDirectoryName,
        builtin = options.builtin,
        exts = options.extensions,
        pkgFullPath = null,
        pkg = null,
        isEmpty = false,
        builtinInfo, builtinName, builtinPath, tmpFullPath, tmpFullPath2, stat;

    if (relativePath && filePath.isAbsolute(relativePath)) {
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

    if (isNull(pkgFullPath) && isEmpty === false) {
        if (options.throwError) {
            throw createError(path, requiredFromFullPath, true);
        } else {
            return null;
        }
    } else {
        try {
            pkg = readJSONFile(pkgFullPath);
        } catch (e) {
            pkg = null;
        }

        if (isNull(pkg) && isEmpty === false) {
            if (options.throwError) {
                throw createError(path, requiredFromFullPath, true);
            } else {
                return null;
            }
        } else {
            if (isEmpty) {
                return new Dependency(builtinPath, builtinPath, {});
            } else if (relativePath) {
                tmpFullPath = filePath.join(filePath.dirname(pkgFullPath), relativePath);

                try {
                    stat = fs.statSync(tmpFullPath);
                } catch (e) {}

                if (stat && stat.isDirectory()) {
                    tmpFullPath2 = findExt(filePath.join(tmpFullPath, "index"), exts);

                    if (tmpFullPath2) {
                        return new Dependency(tmpFullPath2, pkgFullPath, pkg);
                    } else {
                        tmpFullPath2 = findExt(tmpFullPath, exts);

                        if (tmpFullPath2) {
                            return new Dependency(tmpFullPath2, pkgFullPath, pkg);
                        } else {
                            if (options.throwError) {
                                throw createError(path, requiredFromFullPath, true);
                            } else {
                                return null;
                            }
                        }
                    }
                } else {
                    tmpFullPath2 = findExt(tmpFullPath, exts);

                    if (tmpFullPath2) {
                        return new Dependency(tmpFullPath2, pkgFullPath, pkg);
                    } else {
                        if (options.throwError) {
                            throw createError(path, requiredFromFullPath, true);
                        } else {
                            return null;
                        }
                    }
                }
            } else {
                tmpFullPath = findExt(filePath.join(filePath.dirname(pkgFullPath), getPackagePath(pkg, options.packageType)), exts);

                if (tmpFullPath) {
                    return new Dependency(tmpFullPath, pkgFullPath, pkg);
                } else {
                    if (options.throwError) {
                        throw createError(path, requiredFromFullPath, true);
                    } else {
                        return null;
                    }
                }
            }
        }
    }
}
