var filePath = require("file_path"),
    isFunction = require("is_function"),

    isNodeModule = require("./utils/isNodeModule"),

    resolveNodeModule = require("./resolveNodeModule"),
    resolveNodeModuleAsync = require("./resolveNodeModuleAsync"),

    resolveModule = require("./resolveModule"),
    resolveModuleAsync = require("./resolveModuleAsync");


module.exports = resolve;


function resolve(path, requiredFromFullPath, options, callback) {
    var posixPath = filePath.posix(path),
        mapping;

    if (isFunction(options)) {
        callback = options;
        options = {};
    }

    options = options || {};

    options.mappings = options.mappings || {};
    options.builtin = options.builtin || {};
    options.mappings = options.mappings || {};
    options.extensions = options.extensions || ["js", "json"];
    options.packageType = options.packageType || "main";
    options.modulesDirectoryName = options.modulesDirectoryName || "node_modules";

    mapping = options.mappings[posixPath];
    if (mapping) {
        posixPath = mapping;
    }

    if (isNodeModule(posixPath)) {
        if (isFunction(callback)) {
            return resolveNodeModuleAsync(posixPath, requiredFromFullPath, options, callback);
        } else {
            return resolveNodeModule(posixPath, requiredFromFullPath, options);
        }
    } else {
        if (isFunction(callback)) {
            return resolveModuleAsync(posixPath, requiredFromFullPath, options, callback);
        } else {
            return resolveModule(posixPath, requiredFromFullPath, options);
        }
    }
}
