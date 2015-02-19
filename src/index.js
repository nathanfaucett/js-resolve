var isArray = require("is_array"),
    isObject = require("is_object"),
    isString = require("is_string"),
    helpers = require("./helpers"),
    resolveFile = require("./resolve_file"),
    resolveModule = require("./resolve_module");


module.exports = resolve;


function resolve(path, parentDirname, options) {
    var exts, mappings;

    options = options || {};

    exts = options.extensions || options.exts;
    options.extensions = isArray(exts) ? exts : (isString(exts) ? [exts] : ["js", "json"]);

    mappings = isObject(options.mappings) ? options.mappings : {};
    options.mappings = mappings;

    options.builtin = isObject(options.builtin) ? options.builtin : {};
    options.packageType = isString(options.packageType) ? options.packageType : "browser";
    options.throwError = options.throwError != null ? !!options.throwError : true;
    options.moduleDirectory = isString(options.moduleDirectory) ? options.moduleDirectory : "node_modules";

    if (mappings[path]) {
        path = mappings[path];
    }

    if (helpers.isNotRelative(path)) {
        return resolveModule(path, parentDirname, options);
    } else {
        return resolveFile(path, parentDirname, options);
    }
}

resolve.helpers = helpers;
