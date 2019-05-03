export default interface Node {
    action?: Function;
    actionArray?: any;
    weightsActionMap?: any;

    execute: Function;

    children: Function;

    isConditional: Function;
}