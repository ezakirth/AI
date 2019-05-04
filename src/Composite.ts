import BehaviourTreeInstance from "./simpleBehaviourTreeModel";
import TreeNode from "./TreeNode";

export default abstract class Composite implements TreeNode {
    type: string;
    name: string;
    children: TreeNode[];
    parent: TreeNode;
    constructor(name: string, type: string, children: TreeNode[]) {
        this.name = name;
        this.type = type;
        for (let child of children) {
            child.parent = this;
        }
        this.children = children;
    }
    execute(behaviourTreeInstance: BehaviourTreeInstance) { }

}
