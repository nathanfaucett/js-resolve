var filePath = require("file_path");


module.exports = isNodeModule;


function isNodeModule(path) {
    return path[0] !== "." && !filePath.isAbsolute(path);
}
