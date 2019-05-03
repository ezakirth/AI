"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var simpleBehaviourTreeModel_1 = require("./simpleBehaviourTreeModel");
// Sequencer model and implementation - BEGIN
/**
 * This is a selector that executes all actions in sequence.
 */
var SequencerNode = /** @class */ (function () {
    function SequencerNode(actionArray) {
        this.actionArray = actionArray;
    }
    SequencerNode.prototype.execute = function (behaviourTreeInstanceState) {
        behaviourTreeInstanceState.setState(simpleBehaviourTreeModel_1.default.STATE_WAITING);
        behaviourTreeInstanceState.setState(simpleBehaviourTreeModel_1.default.STATE_TO_BE_STARTED, this.actionArray[0]);
    };
    SequencerNode.prototype.children = function () {
        return this.actionArray;
    };
    SequencerNode.prototype.isConditional = function () {
        return false;
    };
    return SequencerNode;
}());
exports.default = SequencerNode;
;
// Sequencer model and implementation - END
