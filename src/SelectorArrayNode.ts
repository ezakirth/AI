import BehaviourTreeInstance from './simpleBehaviourTreeModel';
import TreeNode from './TreeNode';
import IfNode from './IfNode';

// SelectorArray model and implementation - BEGIN
/**
 * This is a cool extension of selector that takes a condition function returning the index of the action to be executed.
 * This allows to compact a set of nested conditions in a more readable one.
 */
export default class SelectorArrayNode implements TreeNode {
    actionArray: any[];
    conditionFunction: any;
    constructor(conditionFunction: any, actionArray: any[]) {

        this.conditionFunction = conditionFunction;
        this.actionArray = actionArray;
    }

    execute(behaviourTreeInstanceState: BehaviourTreeInstance) {

        let state: string = behaviourTreeInstanceState.findStateForNode(this);

        if (state == BehaviourTreeInstance.STATE_EXECUTING)
            return;

        //			In both cases Sync and Async
        var resultInt: number;
        if (this.conditionFunction instanceof IfNode) {
            resultInt = this.conditionFunction.execute(behaviourTreeInstanceState);
        } else {
            resultInt = this.conditionFunction(behaviourTreeInstanceState);
        }

        if (state == BehaviourTreeInstance.STATE_EXECUTING)
            return;

        for (var j = 0; j < this.actionArray.length; j++) {
            if (j == resultInt)
                behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_TO_BE_STARTED, this.actionArray[j]);
            else
                behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_DISCARDED, this.actionArray[j]);
        }

    }

    children() {
        return this.actionArray;
    }

    isConditional() {
        return true;
    }

}
// SelectorArray model and implementation - END