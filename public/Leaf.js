"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var simpleBehaviourTreeModel_1 = require("./simpleBehaviourTreeModel");
/**
 * This simply creates a wrapper node for any specific action.
 * The wrapper is necessary in order to have a uniform "execute"
 * method to be called by the engine.
 */
var Leaf = /** @class */ (function () {
    function Leaf(task, decorator) {
        this.name = "Leaf";
        this.type = "Leaf";
        this.task = task;
    }
    Leaf.prototype.execute = function (behaviourTreeInstance) {
        behaviourTreeInstance.setNodeState(this, simpleBehaviourTreeModel_1.default.STATE_RUNNING);
        return this.task(behaviourTreeInstance);
    };
    return Leaf;
}());
exports.default = Leaf;
