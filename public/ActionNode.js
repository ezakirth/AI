"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Action model and implementation - BEGIN
/**
 * This simply creates a wrapper node for any specific action.
 * The wrapper is necessary in order to have a uniform "execute"
 * method to be called by the engine.
 */
var Task = /** @class */ (function () {
    function Task(action) {
        this.action = action;
    }
    Task.prototype.execute = function (behaviourTreeInstanceState) {
        return this.action(behaviourTreeInstanceState);
    };
    Task.prototype.children = function () {
        return null;
    };
    Task.prototype.isConditional = function () {
        return false;
    };
    return Task;
}());
exports.default = Task;
// Action model and implementation - END
