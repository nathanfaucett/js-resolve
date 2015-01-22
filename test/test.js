var assert = require("assert"),
    resolve = require("../src/index");


describe("resolve(path : FilePath String, parentDirname : FilePath String, options : Object)", function() {
    it("should return info about path to be able to read the file", function() {
        var options = {
            exts: ["js", "json"],
            throwError: false
        };

        assert.equal(resolve("is_string", __dirname, options).moduleName, "is_string");
        assert.equal(resolve("noop", __dirname, options), null);

        assert.equal(!!resolve("../src/index", __dirname, options), true);
        assert.equal(resolve("../test", __dirname, options), null);
    });
});
