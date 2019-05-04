import BehaviourTreeInstance from './simpleBehaviourTreeModel';
import TreeNode from './TreeNode';
/**
 * This simply creates a wrapper node for any specific action.
 * The wrapper is necessary in order to have a uniform "execute"
 * method to be called by the engine.
 */
export default class Leaf implements TreeNode {
    name: string;
    type: string;
    task: Function;

    constructor(task: Function, decorator?: string) {
        this.name = "Leaf";
        this.type = "Leaf";
        this.task = task;
    }

    execute(behaviourTreeInstance: BehaviourTreeInstance) {
        behaviourTreeInstance.setNodeState(this, BehaviourTreeInstance.STATE_RUNNING);
        return this.task(behaviourTreeInstance);
    }
}
