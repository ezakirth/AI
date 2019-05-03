"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// IfNode model and implementation - BEGIN
/**
 * This node is required on Selector nodes that are ruled by a logic.
 * You may also omit it and pass directly the method, will work anyway.
 */
var IfNode = /** @class */ (function () {
    function IfNode(action) {
        this.action = action;
    }
    IfNode.prototype.execute = function (behaviourTreeInstanceState) {
        return this.action(behaviourTreeInstanceState);
    };
    IfNode.prototype.children = function () {
        return null;
    };
    IfNode.prototype.isConditional = function () {
        return false;
    };
    return IfNode;
}());
exports.default = IfNode;
// Action model and implementation - END
