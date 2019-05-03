"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var simpleBehaviourTreeModel_1 = require("./simpleBehaviourTreeModel");
var Utils_1 = require("./Utils");
// SelectorWeightedRandomNode model and implementation - BEGIN
/**
 * Example:
 * [
 * [0.7 Lazy around]
 * [0.2 Pretend to work]
 * [0.1 Actually work]
 * ]
 */
var SelectorWeightedRandomNode = /** @class */ (function () {
    function SelectorWeightedRandomNode(weightsActionMap) {
        this.weightsActionMap = weightsActionMap;
    }
    SelectorWeightedRandomNode.prototype.execute = function (behaviourTreeInstanceState) {
        var state = behaviourTreeInstanceState.findStateForNode(this);
        if (state == simpleBehaviourTreeModel_1.default.STATE_EXECUTING)
            return;
        var action = Utils_1.chooseByRandom(this.weightsActionMap);
        //console.debug("randomIndex", this.weightsActionMap, action);
        behaviourTreeInstanceState.setState(simpleBehaviourTreeModel_1.default.STATE_WAITING, this);
        for (var j = 0; j < this.weightsActionMap.length; j++) {
            if (this.weightsActionMap[j][1] == action)
                behaviourTreeInstanceState.setState(simpleBehaviourTreeModel_1.default.STATE_TO_BE_STARTED, action);
            else
                behaviourTreeInstanceState.setState(simpleBehaviourTreeModel_1.default.STATE_DISCARDED, this.weightsActionMap[j][1]);
        }
    };
    SelectorWeightedRandomNode.prototype.children = function () {
        var actionArray = [];
        for (var j = 0; j < this.weightsActionMap.length; j++) {
            actionArray.push(this.weightsActionMap[j][1]);
        }
        return actionArray;
    };
    SelectorWeightedRandomNode.prototype.isConditional = function () {
        return false;
    };
    ;
    return SelectorWeightedRandomNode;
}());
exports.default = SelectorWeightedRandomNode;
;
// SelectorWeightedRandomNode model and implementation - END
