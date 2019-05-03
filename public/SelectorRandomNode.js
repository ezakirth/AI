"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var simpleBehaviourTreeModel_1 = require("./simpleBehaviourTreeModel");
// SelectorRandom model and implementation - BEGIN
/**
 * This is a cool extension of selector that executes randomly one of the actions in the array.
 */
var SelectorRandomNode = /** @class */ (function () {
    function SelectorRandomNode(actionArray) {
        this.actionArray = actionArray;
    }
    SelectorRandomNode.prototype.execute = function (behaviourTreeInstanceState) {
        var state = behaviourTreeInstanceState.findStateForNode(this);
        if (state == simpleBehaviourTreeModel_1.default.STATE_EXECUTING)
            return;
        var randomIndex = Math.floor(Math.random() * this.actionArray.length);
        behaviourTreeInstanceState.setState(simpleBehaviourTreeModel_1.default.STATE_WAITING, this);
        for (var j = 0; j < this.actionArray.length; j++) {
            if (j == randomIndex)
                behaviourTreeInstanceState.setState(simpleBehaviourTreeModel_1.default.STATE_TO_BE_STARTED, this.actionArray[j]);
            else
                behaviourTreeInstanceState.setState(simpleBehaviourTreeModel_1.default.STATE_DISCARDED, this.actionArray[j]);
        }
    };
    SelectorRandomNode.prototype.children = function () {
        return this.actionArray;
    };
    SelectorRandomNode.prototype.isConditional = function () {
        return false;
    };
    return SelectorRandomNode;
}());
exports.default = SelectorRandomNode;
;
// SelectorRandom model and implementation - END
