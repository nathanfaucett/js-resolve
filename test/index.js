var tape = require("tape"),
    resolve = require("..");


tape("resolve(path : String, requiredFromFullPath : String[, options : Object][, callback: Function])", function(assert) {
    var options = {
        exts: ["js", "json"],
        throwError: false
    };

    assert.equal(resolve("@nathanfaucett/is_string", __filename, options).pkg.name, "@nathanfaucett/is_string");
    assert.equal(resolve("@nathanfaucett/is_string/src/index.js", __filename, options).pkg.name, "@nathanfaucett/is_string");
    assert.equal(resolve("noop", __filename, options), null);

    assert.equal(!!resolve("../src/index", __filename, options), true);
    assert.equal(resolve("./test", __filename, options), null);

    assert.equal(!!resolve("./empty", __filename, options), true);

    options.mappings = {
        "is_string": "./empty"
    };
    assert.equal(!!resolve("@nathanfaucett/is_string", __filename, options), true);

    assert.equal(!!resolve("@nathanfaucett/is_string", __filename, {
            exts: ["js", "json"],
            throwError: false,
            builtin: {
                "@nathanfaucett/is_string": __filename + "/empty.js"
            }
        }),
        true
    );

    resolve("@nathanfaucett/is_string", __filename, function(error, dependency) {
        assert.equal(dependency.pkg.name, "@nathanfaucett/is_string");
        assert.end();
    });
});
