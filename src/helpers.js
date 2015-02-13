var fs = require("fs"),
    isArray = require("is_array"),
    isString = require("is_string"),
    filePath = require("file_path");


var helpers = exports;


helpers.readFile = function(path) {
    return fs.readFileSync(path).toString("utf-8");
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

function findExt(path, exts) {
    var i = -1,
        il = exts.length - 1,
        tmp;

    while (i++ < il) {
        tmp = path + "." + exts[i];

        if (fs.existsSync(tmp)) {
            return tmp;
        }
    }
    return false;
}

helpers.findExt = function(path, exts) {
    return helpers.hasExt(path, exts) ? path : findExt(path, exts);
};

helpers.packagePath = function(pkg, type) {
    return (
        isString(pkg[type]) ? pkg[type] : (
            isString(pkg.main) ? pkg.main : "index"
        )
    );
};

helpers.isNotRelative = function(path) {
    var ch = path[0];
    return ch !== "." && ch !== "/";
};
