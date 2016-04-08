var tape = require("tape"),
    resolve = require("..");


tape("resolve(path : String, requiredFromFullPath : String[, options : Object][, callback: Function])", function(assert) {
    var options = {
        exts: ["js", "json"],
        throwError: false
    };

    assert.equal(resolve("is_string", __filename, options).pkg.name, "is_string", "should find node module is_string");
    assert.equal(resolve("noop", __filename, options), null), "should not find node module noop";

    assert.equal(!!resolve("../src/index", __filename, options), true, "should find index.js file");
    assert.equal(resolve("./test", __filename, options), null, "should not find folder test");

    assert.equal(!!resolve("./empty", __filename, options), true, "should find empty file");

    assert.equal(!!resolve(__dirname + "/empty", __filename, options), true, "should find absolute empty file");

    options.mappings = {
        "is_string": "./empty"
    };
    assert.equal(!!resolve("is_string", __filename, options), true, "should map is_string to empty");

    assert.equal(!!resolve("is_string", __filename, {
            exts: ["js", "json"],
            throwError: false,
            builtin: {
                "is_string": __filename + "/empty.js"
            }
        }),
        true,
        "should use empty as builtin and find it"
    );

    resolve("is_string", __filename, function(error, dependency) {
        assert.equal(dependency.pkg.name, "is_string");
        assert.end();
    });
});
