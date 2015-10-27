var readFile = require("./readFile");


module.exports = readJSONFile;


function readJSONFile(path) {
    return JSON.parse(readFile(path));
}
