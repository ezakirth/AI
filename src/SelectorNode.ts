import BehaviourTreeInstance from './simpleBehaviourTreeModel';
import TreeNode from './TreeNode';
import IfNode from './IfNode';

// selector model and implementation - BEGIN
/**
 * This models the "selector" behaviour on two alternative conditions
 * You use this function in configuring your actor behaviour.
 */
export default class SelectorNode implements TreeNode {
    conditionFunction: Function;
    actionIfTrue: Function;
    actionIfFalse: Function;
    constructor(conditionFunction: Function, actionIfTrue, actionIfFalse) {

        this.conditionFunction = conditionFunction;
        this.actionIfTrue = actionIfTrue;
        this.actionIfFalse = actionIfFalse;
    }

	/**
	 * This makes a given SelectorNode instance execute.
	 * This function is used by the engine executeBehaviourTree
	 * when a node of type SelectorNode is met
	 */
    execute(behaviourTreeInstanceState: BehaviourTreeInstance) {

        let state: string = behaviourTreeInstanceState.findStateForNode(this);

        if (state == BehaviourTreeInstance.STATE_EXECUTING)
            return;

        //			In both cases Sync and Async
        let result;
        if (this.conditionFunction instanceof IfNode) {
            result = this.conditionFunction.execute(behaviourTreeInstanceState);
        } else {
            result = this.conditionFunction(behaviourTreeInstanceState);
        }
        //		console.debug("SelectorNode result", result);

        if (state == BehaviourTreeInstance.STATE_EXECUTING)
            return;

        if (result) {
            behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_TO_BE_STARTED, this.actionIfTrue);
            behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_DISCARDED, this.actionIfFalse);
        } else {
            behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_TO_BE_STARTED, this.actionIfFalse);
            behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_DISCARDED, this.actionIfTrue);
        }

    }

    children() {
        return [this.actionIfTrue, this.actionIfFalse];
    }

    isConditional() {
        return true;
    }
}
// selector model and implementation - END

