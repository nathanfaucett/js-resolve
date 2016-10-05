module.exports = createError;


function createError(path, requiredFromFullPath, isNodeModule) {
    return new Error(
        "failed to find " + (isNodeModule ? "module" : "file") + " " + path + " required from " + requiredFromFullPath
    );
}
