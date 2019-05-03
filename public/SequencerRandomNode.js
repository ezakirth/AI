"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var simpleBehaviourTreeModel_1 = require("./simpleBehaviourTreeModel");
var Utils_1 = require("./Utils");
/**
 * This is a cool extension of selector that executes all actions in random sequence.
 */
// SequencerRandom model and implementation - BEGIN
var SequencerRandomNode = /** @class */ (function () {
    function SequencerRandomNode(actionArray) {
        this.children = function () {
            return this.actionArray;
        };
        this.isConditional = function () {
            return false;
        };
        this.actionArray = actionArray;
    }
    SequencerRandomNode.prototype.execute = function (behaviourTreeInstanceState) {
        Utils_1.shuffle(this.actionArray);
        behaviourTreeInstanceState.setState(simpleBehaviourTreeModel_1.default.STATE_WAITING);
        behaviourTreeInstanceState.setState(simpleBehaviourTreeModel_1.default.STATE_TO_BE_STARTED, this.actionArray[0]);
    };
    return SequencerRandomNode;
}());
exports.default = SequencerRandomNode;
;
// SelectorRandomProbability model and implementation - END
