/**
 * Created by Pietro Polsinelli && Matteo Bicocchi on 15/05/2015.
 *
 * Fisrt inspired by the simplicity of
 * http://stackoverflow.com/questions/4241824/creating-an-ai-behavior-tree-in-c-sharp-how
 *
 * Follow us on Twitter @ppolsinelli @pupunzi where we post about game design, game development, Unity3d 2D, HTML5, CSS3, jquery, applied games.
 *
 */

/**
 *
 * @param behaviourTree
 * @param actor
 * @param numberOfLoops 0 forever
 * @constructor
 */


export default class BehaviourTreeInstance {
    static STATE_TO_BE_STARTED = "STATE_TO_BE_STARTED";
    static STATE_WAITING = "STATE_WAITING";
    static STATE_DISCARDED = "STATE_DISCARDED";
    static STATE_EXECUTING = "STATE_EXECUTING";
    static STATE_COMPUTE_RESULT = "STATE_COMPUTE_RESULT";
    static STATE_COMPLETED = "STATE_COMPLETED";

    behaviourTree: any;
    actor: any;
    nodeAndState: [any, string][];
    currentNode: any;
    numberOfLoops: any;
    numberOfRuns: any;
    finished: boolean;
    constructor(behaviourTree, actor, numberOfLoops?: number) {

        if (typeof numberOfLoops == "undefined")
            numberOfLoops = 1;

        this.behaviourTree = behaviourTree;
        this.actor = actor;
        this.nodeAndState = [];
        this.currentNode = null;
        this.numberOfLoops = numberOfLoops;

        this.numberOfRuns = 0;
        this.finished = false;
    }

    findStateForNode(node) {

        for (var i = 0; i < this.nodeAndState.length; i++) {
            if (this.nodeAndState[i][0] == node)
                return this.nodeAndState[i][1];
        }
    };

    /**
     * Sets the state of a node
     * @param state 
     * @param node 
     */
    setState(state: string, node?: any): string {

        if (!node)
            node = this.currentNode;

        for (var i = 0; i < this.nodeAndState.length; i++) {
            if (this.nodeAndState[i][0] == node) {
                this.nodeAndState.splice(i, 1);
                break;
            }
        }
        this.nodeAndState.push([node, state]);

        return state;
    };

    //commodity methods
    hasToStart() {
        var state = this.findStateForNode(this.currentNode);
        return state != BehaviourTreeInstance.STATE_EXECUTING && state != BehaviourTreeInstance.STATE_COMPUTE_RESULT;
    };

    hasToComplete() {
        var state = this.findStateForNode(this.currentNode);
        return state == BehaviourTreeInstance.STATE_COMPUTE_RESULT;
    };

    completedAsync() {

        if (!this.currentNode)
            return false;

        if (this.currentNode.isConditional())
            this.setState(BehaviourTreeInstance.STATE_COMPUTE_RESULT);
        else
            this.setState(BehaviourTreeInstance.STATE_COMPLETED);
    };

    waitUntil(callback) {
        this.setState(BehaviourTreeInstance.STATE_EXECUTING);
        callback();
    };

	/**
	 * This is the function that crawls the behaviour tree instance you pass to it
	 * and calls the executors if the the argument is a node of some kind,
	 * calls it as an action otherwise.
	 *
	 * The same node may be called to execute twice, once for starting it and on a subsequent tick for completion.
	 */
    executeBehaviourTree() {

        if (this.finished)
            return;

        //find current node to be executed, or a running one, or root to launch, or root completed
        this.currentNode = this.findCurrentNode(this.behaviourTree);

        if (this.currentNode == null) {
            this.numberOfRuns++;
            if (this.numberOfLoops == 0 || this.numberOfRuns < this.numberOfLoops) {
                this.nodeAndState = [];
                this.currentNode = this.findCurrentNode(this.behaviourTree);
            } else {
                this.finished = true;
                return;
            }
        }

        let state: string = this.findStateForNode(this.currentNode);

        if (state == null || state == BehaviourTreeInstance.STATE_TO_BE_STARTED) {

            //first call to execute
            //if the node is async, this will be the first of a two part call
            var result = this.currentNode.execute(this);

            var afterState = this.findStateForNode(this.currentNode);

            //if the node is async, it will set the state to STATE_EXECUTING
            if (afterState == null || afterState == BehaviourTreeInstance.STATE_TO_BE_STARTED) {
                this.setState(BehaviourTreeInstance.STATE_COMPLETED);
            }

            return result;
        }

        //this is the case we have to call the second execute
        //on the async node, which will bring it compute the final result and end
        if (state == BehaviourTreeInstance.STATE_COMPUTE_RESULT) {

            var result = this.currentNode.execute(this);
            this.setState(BehaviourTreeInstance.STATE_COMPLETED);
            return result;
        }
    };

    // This is a recursive function, does a lot of work in few lines of code.
    // Finds in the behaviour tree instance the currend node that is either to be
    // executed or is executing (async). Also marks all parent nodes completed
    // when necessary.
    findCurrentNode(node) {

        var state = this.findStateForNode(node);

        if (state == BehaviourTreeInstance.STATE_DISCARDED)
            return null;

        if (state == null) {
            state = this.setState(BehaviourTreeInstance.STATE_TO_BE_STARTED, node);
        }

        if (state == BehaviourTreeInstance.STATE_EXECUTING ||
            state == BehaviourTreeInstance.STATE_COMPUTE_RESULT ||
            state == BehaviourTreeInstance.STATE_TO_BE_STARTED
        )
            return node;


        var children = node.children();

        if (children == null) {
            return null;
        } else {

            for (var i = 0; i < children.length; i++) {
                var childNode = this.findCurrentNode(children[i]);
                if (childNode)
                    return childNode;
            }

            if (state == BehaviourTreeInstance.STATE_WAITING) {
                this.setState(BehaviourTreeInstance.STATE_COMPLETED, node);
            }
        }

        return null;
    };
}









