import BehaviourTreeInstance from "./simpleBehaviourTreeModel";
import TreeNode from "./TreeNode";

export default abstract class Decorator implements TreeNode {
    type: string;
    name: string;
    children: TreeNode[];
    parent: TreeNode;
    constructor(name: string, type: string, child: TreeNode) {
        this.name = name;
        this.type = type;
        child.parent = this;
        this.children = [child];
    }
    execute(behaviourTreeInstance: BehaviourTreeInstance) { }

}
