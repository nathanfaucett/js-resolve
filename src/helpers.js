var fs = require("fs"),
    isArray = require("is_array"),
    isString = require("is_string"),
    filePath = require("file_path");


var helpers = module.exports;


helpers.readFile = function(path, encoding) {
    return fs.readFileSync(path).toString(encoding || "utf-8");
};

helpers.readJSONFile = function(path) {
    return JSON.parse(helpers.readFile(path));
};

helpers.findPackageJSON = function(dirname) {
    var tmp = filePath.join(dirname, "package.json"),
        pkg;

    if (fs.existsSync(tmp)) {
        try {
            pkg = helpers.readJSONFile(tmp);
        } catch (e) {
            return null;
        }

        return pkg;
    } else {
        return null;
    }
};

helpers.hasExt = function(path, exts) {
    var str;

    if (isArray(exts)) {
        str = exts.join("|");
    } else {
        str = exts + "";
    }

    return (new RegExp("\\.(" + str + ")$")).test(path);
};

helpers.ensureExt = function(path, exts) {
    return helpers.hasExt(path, exts) ? path : path + "." + (isArray(exts) ? exts[0] : exts + "");
};

helpers.packagePath = function(pkg, browser) {
    if (browser === false) {
        return (
            isString(pkg.main) ? pkg.main : (
                isString(pkg.browser) ? pkg.browser : "index"
            )
        );
    } else {
        return (
            isString(pkg.browser) ? pkg.browser : (
                isString(pkg.main) ? pkg.main : "index"
            )
        );
    }
};

helpers.isNotRelative = function(path) {
    var ch = path[0];
    return ch !== "." && ch !== "/";
};

function ensureRelative(path) {
    return helpers.isNotRelative(path) ? "./" + path : path;
}

helpers.relative = function(dir, path, forceRelative) {
    return forceRelative !== false ? ensureRelative(filePath.relative(dir, path)) : filePath.relative(dir, path);
};
