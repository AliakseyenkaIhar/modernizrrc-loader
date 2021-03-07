"use strict";

var modernizr = require("modernizr");
var NativeModule = require("module");

function wrapOutput(output) {
    // Exposing Modernizr as a module.
    return ";(function(window){\n" +
           "var hadGlobal = 'Modernizr' in window;\n" +
           "var oldGlobal = window.Modernizr;\n" +
           output + "\n" +
           "module.exports = window.Modernizr;\n" +
           "if (hadGlobal) { window.Modernizr = oldGlobal; }\n" +
           "else { delete window.Modernizr; }\n" +
           "})(window);";
}

module.exports = function (config) {
    if (typeof this.cacheable === 'function') {
        this.cacheable();
    }

    var exec = function(code, filename) {
        var _module = new NativeModule(filename, this);
        _module.paths = NativeModule._nodeModulePaths(this.context);
        _module.filename = filename;
        _module._compile(code, filename);
        return _module.exports;
    }
    exec = exec.bind(this);

    var cb = this.async();

    modernizr.build(exec(config, this.resource), function (output) {
        cb(null, wrapOutput(output));
    });
};
