resolve
=======

resolve node type file paths

```javascript
var resolve = require("@nathanfaucett/resolve");


var module = resolve("path/to/module");

module === {
    fullPath: "full/path/to/module",
    pkgFullPath: "full/path/to/package.json",
    pkg: {} // parsed json package if has one
};
```
