"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var simpleBehaviourTreeModel_1 = require("./simpleBehaviourTreeModel");
var IfNode_1 = require("./IfNode");
// SelectorArray model and implementation - BEGIN
/**
 * This is a cool extension of selector that takes a condition function returning the index of the action to be executed.
 * This allows to compact a set of nested conditions in a more readable one.
 */
var SelectorArrayNode = /** @class */ (function () {
    function SelectorArrayNode(conditionFunction, actionArray) {
        this.conditionFunction = conditionFunction;
        this.actionArray = actionArray;
    }
    SelectorArrayNode.prototype.execute = function (behaviourTreeInstanceState) {
        var state = behaviourTreeInstanceState.findStateForNode(this);
        if (state == simpleBehaviourTreeModel_1.default.STATE_EXECUTING)
            return;
        //			In both cases Sync and Async
        var resultInt;
        if (this.conditionFunction instanceof IfNode_1.default) {
            resultInt = this.conditionFunction.execute(behaviourTreeInstanceState);
        }
        else {
            resultInt = this.conditionFunction(behaviourTreeInstanceState);
        }
        if (state == simpleBehaviourTreeModel_1.default.STATE_EXECUTING)
            return;
        for (var j = 0; j < this.actionArray.length; j++) {
            if (j == resultInt)
                behaviourTreeInstanceState.setState(simpleBehaviourTreeModel_1.default.STATE_TO_BE_STARTED, this.actionArray[j]);
            else
                behaviourTreeInstanceState.setState(simpleBehaviourTreeModel_1.default.STATE_DISCARDED, this.actionArray[j]);
        }
    };
    SelectorArrayNode.prototype.children = function () {
        return this.actionArray;
    };
    SelectorArrayNode.prototype.isConditional = function () {
        return true;
    };
    return SelectorArrayNode;
}());
exports.default = SelectorArrayNode;
// SelectorArray model and implementation - END
