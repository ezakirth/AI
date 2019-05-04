"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var simpleBehaviourTreeModel_1 = require("./simpleBehaviourTreeModel");
var Composite_1 = require("./Composite");
// Action model and implementation - BEGIN
/**
 * This simply creates a wrapper node for any specific action.
 * The wrapper is necessary in order to have a uniform "execute"
 * method to be called by the engine.
 */
var Task = /** @class */ (function (_super) {
    __extends(Task, _super);
    function Task(task, decorator) {
        var _this = this;
        _this.task = task;
        _this.decorator = decorator;
        return _this;
    }
    Task.prototype.execute = function (behaviourTreeInstanceState) {
        behaviourTreeInstanceState.setState(simpleBehaviourTreeModel_1.default.STATE_RUNNING);
        var result = this.task(behaviourTreeInstanceState);
        switch (this.decorator) {
            case simpleBehaviourTreeModel_1.default.DECORATOR.INVERTER:
                return !result;
            case simpleBehaviourTreeModel_1.default.DECORATOR.SUCCEEDER:
                return true;
            default:
                return result;
        }
    };
    Task.prototype.children = function () {
        return null;
    };
    return Task;
}(Composite_1.default));
exports.default = Task;
// Action model and implementation - END
