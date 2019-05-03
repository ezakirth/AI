export default interface TreeNode {
    action?: Function;
    actionArray?: any;
    weightsActionMap?: any;

    execute: Function;

    children: Function;

    isConditional: Function;
}