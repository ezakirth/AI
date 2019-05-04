import BehaviourTreeInstance from './simpleBehaviourTreeModel';
import Composite from './Composite';
import TreeNode from './TreeNode';
import { shuffle } from './Utils';

/**
 * This is a selector that executes all actions in sequence.
 */
export default class SelectorNode extends Composite implements TreeNode {
    constructor(children: TreeNode[]) {
        super("Selector", "Composite", children)
    }

    execute(behaviourTreeInstance: BehaviourTreeInstance) {
        //        shuffle(this.children);
        behaviourTreeInstance.setNodeState(this, BehaviourTreeInstance.STATE_WAITING);
        behaviourTreeInstance.setNodeState(this.children[0], BehaviourTreeInstance.STATE_TO_BE_STARTED);

        return null;
    }
}
