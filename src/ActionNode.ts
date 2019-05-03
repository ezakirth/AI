import BehaviourTreeInstance from './simpleBehaviourTreeModel';
import TreeNode from './TreeNode';
// Action model and implementation - BEGIN
/**
 * This simply creates a wrapper node for any specific action.
 * The wrapper is necessary in order to have a uniform "execute"
 * method to be called by the engine.
 */
export default class ActionNode implements TreeNode {
    action: Function;
    constructor(action: Function) {
        this.action = action;
    }

    execute(behaviourTreeInstanceState: BehaviourTreeInstance) {
        return this.action(behaviourTreeInstanceState);
    }

    children() {
        return null;
    }

    isConditional() {
        return false;
    }

}
// Action model and implementation - END
