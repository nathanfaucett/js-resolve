var fs = require("fs"),
    isNull = require("is_null"),
    filePath = require("file_path"),
    findExt = require("./utils/findExt"),
    getPackagePath = require("./utils/getPackagePath"),
    readJSONFile = require("./utils/readJSONFile"),
    createError = require("./utils/createError"),
    reModuleSpliter = require("./utils/reModuleSpliter"),
    findNodeModulePackageJSON = require("./utils/findNodeModulePackageJSON"),
    Dependency = require("./Dependency");


module.exports = resolveNodeModule;


function resolveNodeModule(path, requiredFromFullPath, options) {
    var nodeModuleParts = path.split(reModuleSpliter),
        moduleName = nodeModuleParts[1],
        relativePath = nodeModuleParts[2],

        modulesDirectoryName = options.modulesDirectoryName,
        builtin = options.builtin,
        exts = options.extensions,
        fullPath = null,
        pkg = null,
        tmpFullPath, tmpFullPath2, stat;

    if (relativePath && relativePath[0] === "/") {
        relativePath = relativePath.slice(1);
    }

    if (builtin[moduleName]) {
        fullPath = findNodeModulePackageJSON(moduleName, filePath.dirname(builtin[moduleName]), modulesDirectoryName);
    } else {
        fullPath = findNodeModulePackageJSON(moduleName, filePath.dirname(requiredFromFullPath), modulesDirectoryName);
    }

    if (isNull(fullPath)) {
        if (options.throwError) {
            throw createError(path, requiredFromFullPath, true);
        } else {
            return null;
        }
    } else {
        try {
            pkg = readJSONFile(fullPath);
        } catch (e) {
            pkg = null;
        }

        if (isNull(pkg)) {
            if (options.throwError) {
                throw createError(path, requiredFromFullPath, true);
            } else {
                return null;
            }
        } else {
            if (relativePath) {
                tmpFullPath = filePath.join(filePath.dirname(fullPath), relativePath);

                try {
                    stat = fs.statSync(tmpFullPath);
                } catch (e) {}

                if (stat && stat.isDirectory()) {
                    tmpFullPath2 = findExt(filePath.join(tmpFullPath, "index"), exts);

                    if (tmpFullPath2) {
                        return new Dependency(tmpFullPath2, pkg);
                    } else {
                        tmpFullPath2 = findExt(tmpFullPath, exts);

                        if (tmpFullPath2) {
                            return new Dependency(tmpFullPath2, pkg);
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
                        return new Dependency(tmpFullPath2, pkg);
                    } else {
                        if (options.throwError) {
                            throw createError(path, requiredFromFullPath, true);
                        } else {
                            return null;
                        }
                    }
                }
            } else {
                tmpFullPath = findExt(filePath.join(filePath.dirname(fullPath), getPackagePath(pkg, options.packageType)), exts);

                if (tmpFullPath) {
                    return new Dependency(tmpFullPath, pkg);
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
