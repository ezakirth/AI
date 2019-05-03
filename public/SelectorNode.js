"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var simpleBehaviourTreeModel_1 = require("./simpleBehaviourTreeModel");
var IfNode_1 = require("./IfNode");
// selector model and implementation - BEGIN
/**
 * This models the "selector" behaviour on two alternative conditions
 * You use this function in configuring your actor behaviour.
 */
var SelectorNode = /** @class */ (function () {
    function SelectorNode(conditionFunction, actionIfTrue, actionIfFalse) {
        this.conditionFunction = conditionFunction;
        this.actionIfTrue = actionIfTrue;
        this.actionIfFalse = actionIfFalse;
    }
    /**
     * This makes a given SelectorNode instance execute.
     * This function is used by the engine executeBehaviourTree
     * when a node of type SelectorNode is met
     */
    SelectorNode.prototype.execute = function (behaviourTreeInstanceState) {
        var state = behaviourTreeInstanceState.findStateForNode(this);
        if (state == simpleBehaviourTreeModel_1.default.STATE_EXECUTING)
            return;
        //			In both cases Sync and Async
        var result;
        if (this.conditionFunction instanceof IfNode_1.default) {
            result = this.conditionFunction.execute(behaviourTreeInstanceState);
        }
        else {
            result = this.conditionFunction(behaviourTreeInstanceState);
        }
        //		console.debug("SelectorNode result", result);
        if (state == simpleBehaviourTreeModel_1.default.STATE_EXECUTING)
            return;
        if (result) {
            behaviourTreeInstanceState.setState(simpleBehaviourTreeModel_1.default.STATE_TO_BE_STARTED, this.actionIfTrue);
            behaviourTreeInstanceState.setState(simpleBehaviourTreeModel_1.default.STATE_DISCARDED, this.actionIfFalse);
        }
        else {
            behaviourTreeInstanceState.setState(simpleBehaviourTreeModel_1.default.STATE_TO_BE_STARTED, this.actionIfFalse);
            behaviourTreeInstanceState.setState(simpleBehaviourTreeModel_1.default.STATE_DISCARDED, this.actionIfTrue);
        }
    };
    SelectorNode.prototype.children = function () {
        return [this.actionIfTrue, this.actionIfFalse];
    };
    SelectorNode.prototype.isConditional = function () {
        return true;
    };
    return SelectorNode;
}());
exports.default = SelectorNode;
// selector model and implementation - END
