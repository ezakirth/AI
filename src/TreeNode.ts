export default interface TreeNode {
    name: string;
    type: string;
    children?: TreeNode[];
    parent?: TreeNode;
    execute: Function;
}
