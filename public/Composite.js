"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Composite = /** @class */ (function () {
    function Composite(name, type, children) {
        this.name = name;
        this.type = type;
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            child.parent = this;
        }
        this.children = children;
    }
    Composite.prototype.execute = function (behaviourTreeInstance) { };
    return Composite;
}());
exports.default = Composite;
