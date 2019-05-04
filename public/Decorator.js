"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Decorator = /** @class */ (function () {
    function Decorator(name, type, child) {
        this.name = name;
        this.type = type;
        child.parent = this;
        this.children = [child];
    }
    Decorator.prototype.execute = function (behaviourTreeInstance) { };
    return Decorator;
}());
exports.default = Decorator;
