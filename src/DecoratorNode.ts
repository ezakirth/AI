import BehaviourTreeInstance from './simpleBehaviourTreeModel';
import TreeNode from './TreeNode';
import { shuffle } from './Utils';
import Decorator from './Decorator';


export default class DecoratorNode extends Decorator implements TreeNode {
    /**
     * Creates a decorator
     * @param name Inverter, Succeeder
     * @param children
     */
    constructor(name: string, child: TreeNode) {
        super(name, "Decorator", child)
    }

    execute(behaviourTreeInstance: BehaviourTreeInstance) {
        behaviourTreeInstance.setNodeState(this, BehaviourTreeInstance.STATE_WAITING);
        behaviourTreeInstance.setNodeState(this.children[0], BehaviourTreeInstance.STATE_TO_BE_STARTED);
        return null;
    }
}
