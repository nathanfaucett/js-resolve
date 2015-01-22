var fs = require("fs"),
    filePath = require("file_path"),
    helpers = require("./helpers");


module.exports = resolveFile;


function resolveFile(path, parentDirname, options) {
    var result = {},
        error = false,
        exts = options.exts,
        tmp1 = filePath.join(parentDirname, path),
        stat, tmp2, pkg;

    try {
        stat = fs.statSync(tmp1);
    } catch (e) {}

    if (stat && stat.isDirectory()) {
        tmp2 = helpers.ensureExt(filePath.join(tmp1, "index"), exts);

        if (fs.existsSync(tmp2)) {
            result.fullPath = tmp2;
        } else if (fs.existsSync((tmp2 = helpers.ensureExt(tmp1, exts)))) {
            result.fullPath = tmp2;
        } else {
            pkg = helpers.findPackageJSON(tmp1);

            if (pkg !== null) {
                tmp2 = helpers.ensureExt(filePath.join(filePath.dir(tmp1), helpers.packagePath(pkg, options.browser)), exts);

                if (fs.existsSync(tmp2)) {
                    result.fullPath = tmp2;
                    result.pkg = pkg;
                } else {
                    error = true;
                }
            } else {
                error = true;
            }
        }
    } else {
        tmp2 = helpers.ensureExt(tmp1, exts);

        if (fs.existsSync(tmp2)) {
            result.fullPath = tmp2;
        } else {
            error = true;
        }
    }

    if (error) {
        if (options.throwError) {
            throw new Error("failed to find file " + path + " required from " + parentDirname);
        } else {
            return null;
        }
    }

    return result;
}
