var fs = require("fs"),
    filePath = require("file_path"),
    helpers = require("./helpers");


var reModuleSpliter = /([^/]*)(\/.*)?/,
    reSpliter = /[\/]+/;


module.exports = resolveModule;


function resolveModule(path, parentDirname, options) {
    var result = {},

        pathParts = path.split(reModuleSpliter),
        moduleName = pathParts[1],
        relativePath = pathParts[2],

        moduleDirectory = options.moduleDirectory,
        builtin = options.builtin,
        exts = options.exts,

        id, root, depth, builtinInfo, tmp1, tmp2, tmp3, tmp4, stat, error, found;

    if (relativePath && relativePath[0] === "/") {
        relativePath = relativePath.slice(1);
    }

    if (builtin[moduleName]) {
        builtinInfo = resolveBuiltinPackage(moduleName, builtin[moduleName]);

        if (builtinInfo === false) {
            found = false;
        } else if (builtinInfo.fullPath) {
            result.fullPath = builtinInfo.fullPath;
            return result;
        } else {
            tmp1 = builtinInfo;
            found = true;
        }
    } else {
        id = moduleDirectory + "/" + moduleName + "/package.json";
        root = parentDirname;
        depth = root.split(reSpliter).length;
        tmp1 = filePath.join(root, id);
        error = false;
        found = false;

        if (fs.existsSync(tmp1)) {
            found = true;
        }

        while (!found && depth-- > 0) {
            tmp1 = filePath.join(root, id);
            root = root + "/../";

            if (fs.existsSync(tmp1)) {
                found = true;
            }
        }
    }

    if (found) {
        try {
            pkg = helpers.readJSONFile(tmp1);
        } catch (err) {
            pkg = null;
        }

        if (pkg !== null) {
            result.pkg = pkg;
            result.version = pkg.version;

            tmp2 = helpers.findExt(filePath.join(filePath.dir(tmp1), helpers.packagePath(pkg, options.packageType)), exts);
            if (tmp2) {
                if (relativePath) {
                    tmp3 = filePath.join(filePath.dir(tmp2), relativePath);

                    try {
                        stat = fs.statSync(tmp3);
                    } catch (e) {}

                    if (stat && stat.isDirectory()) {
                        tmp4 = helpers.findExt(filePath.join(tmp3, "index"), exts);

                        if (tmp4) {
                            result.fullPath = tmp4;
                        } else {
                            tmp4 = helpers.findExt(tmp3, exts);

                            if (tmp4) {
                                result.fullPath = tmp4;
                            } else {
                                error = true;
                            }
                        }
                    } else {
                        tmp4 = helpers.findExt(tmp3, exts);

                        if (tmp4) {
                            result.fullPath = tmp4;
                        } else {
                            error = true;
                        }
                    }
                } else {
                    result.moduleName = moduleName;
                    result.fullPath = tmp2;
                }
            } else {
                error = true;
            }
        } else {
            error = true;
        }
    } else {
        error = true;
    }

    if (error) {
        if (options.throwError) {
            throw new Error("failed to find module " + path + " required from " + parentDirname);
        } else {
            return null;
        }
    }

    return result;
}

function resolveBuiltinPackage(moduleName, modulePath) {
    var id = "package.json",
        root = filePath.dir(modulePath),
        depth = root.split(reSpliter).length,
        tmp1 = filePath.join(root, id),
        found = false,
        pkg;

    while (!found && depth-- > 0) {
        tmp1 = filePath.join(root, id);
        root = root + "/../";

        try {
            pkg = helpers.readJSONFile(tmp1);
        } catch (err) {
            pkg = null;
        }

        if (pkg && pkg.name === moduleName) {
            return tmp1;
        }
    }

    if (!fs.existsSync(modulePath)) {
        return false;
    }

    return {
        fullPath: modulePath
    };
}
