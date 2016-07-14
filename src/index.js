var isFunction = require("@nathanfaucett/is_function"),
    filePath = require("@nathanfaucett/file_path"),

    isNodeModule = require("./utils/isNodeModule"),

    resolveNodeModule = require("./resolveNodeModule"),
    resolveNodeModuleAsync = require("./resolveNodeModuleAsync"),

    resolveModule = require("./resolveModule"),
    resolveModuleAsync = require("./resolveModuleAsync");


module.exports = resolve;


function resolve(path, requiredFromFullPath, options, callback) {
    var mapping;

    path = filePath.slash(path);

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

    mapping = options.mappings[path];
    if (mapping) {
        path = mapping;
    }

    if (isNodeModule(path)) {
        if (isFunction(callback)) {
            return resolveNodeModuleAsync(path, requiredFromFullPath, options, callback);
        } else {
            return resolveNodeModule(path, requiredFromFullPath, options);
        }
    } else {
        if (isFunction(callback)) {
            return resolveModuleAsync(path, requiredFromFullPath, options, callback);
        } else {
            return resolveModule(path, requiredFromFullPath, options);
        }
    }
}
