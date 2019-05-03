"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Action model and implementation - BEGIN
/**
 * This simply creates a wrapper node for any specific action.
 * The wrapper is necessary in order to have a uniform "execute"
 * method to be called by the engine.
 */
var ActionNode = /** @class */ (function () {
    function ActionNode(action) {
        this.action = action;
    }
    ActionNode.prototype.execute = function (behaviourTreeInstanceState) {
        return this.action(behaviourTreeInstanceState);
    };
    ActionNode.prototype.children = function () {
        return null;
    };
    ActionNode.prototype.isConditional = function () {
        return false;
    };
    return ActionNode;
}());
exports.default = ActionNode;
// Action model and implementation - END
