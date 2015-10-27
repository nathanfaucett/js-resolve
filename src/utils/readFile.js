var fs = require("fs");


module.exports = readFile;


function readFile(path) {
    return fs.readFileSync(path).toString("utf-8");
}
