var isFunction = require("is_function"),

    isNodeModule = require("./utils/isNodeModule"),

    resolveNodeModule = require("./resolveNodeModule"),
    resolveNodeModuleAsync = require("./resolveNodeModuleAsync"),

    resolveModule = require("./resolveModule"),
    resolveModuleAsync = require("./resolveModuleAsync");


module.exports = resolve;


function resolve(path, requiredFromFullPath, options, callback) {
    if (isFunction(options)) {
        callback = options;
        options = {};
    }

    options = options || {};

    options.mappings = options.mappings || {};
    options.builtin = options.builtin || {};
    options.mappings = options.mappings || {};
    options.extensions = options.extensions || ["js", "json"];
    options.modulesDirectoryName = options.modulesDirectoryName || "node_modules";

    if (options.mappings[path]) {
        path = options.mappings[path];
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
