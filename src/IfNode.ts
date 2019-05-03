import BehaviourTreeInstance from './simpleBehaviourTreeModel';
import TreeNode from './TreeNode';

// IfNode model and implementation - BEGIN
/**
 * This node is required on Selector nodes that are ruled by a logic.
 * You may also omit it and pass directly the method, will work anyway.
 */
export default class IfNode implements TreeNode {
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
