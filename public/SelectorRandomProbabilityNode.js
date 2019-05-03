"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var simpleBehaviourTreeModel_1 = require("./simpleBehaviourTreeModel");
var Utils_1 = require("./Utils");
// SelectorRandomProbability model and implementation - BEGIN
/**
 * This node executes randomly one of the nodes on the base of the probability assigned to the node,
 * but to make it easier to write and modify the probability is assigned as an integer value.
 * The node will normalize the values in a [0,1] interval.
 * Example:
 * [
 * [100 Lazy around]
 * [22 Pretend to work]
 * [1 Actually work]
 * ]
 *
 */
var SelectorRandomProbabilityNode = /** @class */ (function () {
    function SelectorRandomProbabilityNode(probabilityActionMap) {
        this.weightsActionMap = probabilityActionMap;
    }
    SelectorRandomProbabilityNode.prototype.execute = function (behaviourTreeInstanceState) {
        var state = behaviourTreeInstanceState.findStateForNode(this);
        if (state == simpleBehaviourTreeModel_1.default.STATE_EXECUTING)
            return;
        var action = Utils_1.chooseByProbability(this.weightsActionMap);
        behaviourTreeInstanceState.setState(simpleBehaviourTreeModel_1.default.STATE_WAITING, this);
        for (var j = 0; j < this.weightsActionMap.length; j++) {
            if (this.weightsActionMap[j][1] == action)
                behaviourTreeInstanceState.setState(simpleBehaviourTreeModel_1.default.STATE_TO_BE_STARTED, action);
            else
                behaviourTreeInstanceState.setState(simpleBehaviourTreeModel_1.default.STATE_DISCARDED, this.weightsActionMap[j][1]);
        }
    };
    SelectorRandomProbabilityNode.prototype.children = function () {
        var actionArray = [];
        for (var j = 0; j < this.weightsActionMap.length; j++) {
            actionArray.push(this.weightsActionMap[j][1]);
        }
        return actionArray;
    };
    SelectorRandomProbabilityNode.prototype.isConditional = function () {
        return false;
    };
    return SelectorRandomProbabilityNode;
}());
exports.default = SelectorRandomProbabilityNode;
;
