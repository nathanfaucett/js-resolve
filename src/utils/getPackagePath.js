var isString = require("is_string");


module.exports = getPackagePath;


function getPackagePath(pkg, type) {
    return (
        isString(pkg[type]) ? pkg[type] : (
            isString(pkg.main) ? pkg.main : "index"
        )
    );
}
