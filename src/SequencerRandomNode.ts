import BehaviourTreeInstance from './simpleBehaviourTreeModel';
import TreeNode from './TreeNode';
import { shuffle } from './Utils';

/**
 * This is a cool extension of selector that executes all actions in random sequence.
 */
// SequencerRandom model and implementation - BEGIN
export default class SequencerRandomNode implements TreeNode {
    actionArray: any;

    constructor(actionArray) {
        this.actionArray = actionArray;
    }

    execute(behaviourTreeInstanceState) {
        shuffle(this.actionArray);

        behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_WAITING);

        behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_TO_BE_STARTED, this.actionArray[0]);

    }

    children = function () {
        return this.actionArray;
    }

    isConditional = function () {
        return false;
    }

};


// SelectorRandomProbability model and implementation - END
