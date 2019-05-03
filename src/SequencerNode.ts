import BehaviourTreeInstance from './simpleBehaviourTreeModel';
import TreeNode from './TreeNode';

// Sequencer model and implementation - BEGIN
/**
 * This is a selector that executes all actions in sequence.
 */
export default class SequencerNode implements TreeNode {
    actionArray: any;
    constructor(actionArray) {

        this.actionArray = actionArray;
    }
    execute(behaviourTreeInstanceState) {

        behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_WAITING);

        behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_TO_BE_STARTED, this.actionArray[0]);
    }

    children() {
        return this.actionArray;
    }

    isConditional() {
        return false;
    }

};
// Sequencer model and implementation - END
