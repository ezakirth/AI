import BehaviourTreeInstance from './simpleBehaviourTreeModel';
import TreeNode from './TreeNode';


// SelectorRandom model and implementation - BEGIN
/**
 * This is a cool extension of selector that executes randomly one of the actions in the array.
 */
export default class SelectorRandomNode implements TreeNode {
    actionArray: any;

    constructor(actionArray) {

        this.actionArray = actionArray;
    }

    execute(behaviourTreeInstanceState) {

        var state = behaviourTreeInstanceState.findStateForNode(this);

        if (state == BehaviourTreeInstance.STATE_EXECUTING)
            return;


        var randomIndex = Math.floor(Math.random() * this.actionArray.length);

        behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_WAITING, this);

        for (var j = 0; j < this.actionArray.length; j++) {
            if (j == randomIndex)
                behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_TO_BE_STARTED, this.actionArray[j]);
            else
                behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_DISCARDED, this.actionArray[j]);
        }
    }

    children() {
        return this.actionArray;
    }

    isConditional() {
        return false;
    }

};
// SelectorRandom model and implementation - END
