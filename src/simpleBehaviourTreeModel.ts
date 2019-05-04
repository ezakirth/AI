import Composite from "./Composite";
import TreeNode from "./TreeNode";
import SequencerNode from "./SequencerNode";
import SelectorNode from "./SelectorNode";

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
    static STATE_RUNNING = "STATE_RUNNING"; // task in progress
    static STATE_FAILURE = "STATE_FAILURE";
    static STATE_SUCCESS = "STATE_SUCCESS";
    static STATE_WAITING = "STATE_WAITING"; // composite node waiting on its children
    static STATE_DONE = "STATE_DONE"; // composite node waiting on its children

    static DECORATOR = {
        INVERTER: "DECORATOR_INVERTER",
        SUCCEEDER: "DECORATOR_SUCCEEDER"
    }

    behaviourTree: Composite;
    actor: any;
    activeNodes: any[];
    currentNode: TreeNode;
    numberOfLoops: number;
    numberOfRuns: number;
    finished: boolean;

    constructor(behaviourTree: Composite, actor: any, numberOfLoops?: number) {
        if (typeof numberOfLoops == "undefined")
            numberOfLoops = 1;

        this.behaviourTree = behaviourTree;
        this.actor = actor;
        this.activeNodes = [];
        this.currentNode = null;
        this.numberOfLoops = numberOfLoops;

        this.numberOfRuns = 0;
        this.finished = false;
    }

    /**
     * Returns the state of a given node
     * @param node
     */
    getNodeState(node: TreeNode) {
        for (let activeNode of this.activeNodes) {
            if (activeNode.node == node)
                return activeNode.state;
        }
    };

    /**
     * Sets the state of a node
     * @param state
     * @param node
     */
    setNodeState(node: TreeNode, state: string): string {
        let active = false;

        for (let activeNode of this.activeNodes) {
            if (activeNode.node == node) {
                activeNode.state = state;
                active = true;
                break;
            }
        }

        if (!active) {
            this.activeNodes.push({ node: node, state: state });
        }

        return state;
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

        // if the tree has been fully traversed
        if (this.currentNode == null) {
            this.numberOfRuns++;
            // reset all and restart
            if (this.numberOfLoops == 0 || this.numberOfRuns < this.numberOfLoops) {
                this.activeNodes = [];
                this.currentNode = this.findCurrentNode(this.behaviourTree);
            }
            // or stop here
            else {
                this.finished = true;
                return;
            }
        }

        // Run the current node and mark it as success or failure
        if (this.getNodeState(this.currentNode) == BehaviourTreeInstance.STATE_TO_BE_STARTED) {
            let nodeExecutionResult: boolean = this.currentNode.execute(this);
            this.updateTaskState(nodeExecutionResult);
        }
    }

    /**
     * updates the state of a leaf (task) node. If result is null, then it means we don't have a result yet (async)
     * @param nodeExecutionResult
     */
    updateTaskState(nodeExecutionResult: boolean) {
        if (nodeExecutionResult !== null) {

            let parentNode: any = this.currentNode.parent;

            if (parentNode && parentNode.type == "Decorator") {
                // if it's an inverter node, invert the result
                if (parentNode.name == "Inverter") nodeExecutionResult = !nodeExecutionResult;

                // if it's a succeeder node, set result to true
                if (parentNode.name == "Succeeder") nodeExecutionResult = true;

                this.setNodeState(parentNode, BehaviourTreeInstance.STATE_DONE);
                // make the parent of the leaf the parent of the decorator instead
                parentNode = parentNode.parent;
            }


            if (nodeExecutionResult === false) {
                this.setNodeState(this.currentNode, BehaviourTreeInstance.STATE_FAILURE);

                // if it's a sequencer node, stop as soon as a child fails
                if (parentNode && parentNode.name == "Sequencer") this.setNodeState(parentNode, BehaviourTreeInstance.STATE_DONE);
            }
            else {
                this.setNodeState(this.currentNode, BehaviourTreeInstance.STATE_SUCCESS);

                // if it's a selector node, stop it as soon as a child succeeds
                if (parentNode && parentNode.name == "Selector") this.setNodeState(parentNode, BehaviourTreeInstance.STATE_DONE);
            }
        }
    }

    /**
     * This is a recursive function, does a lot of work in few lines of code.
     * Finds in the behaviour tree instance the currend node that is either to be
     * executed or is executing (async). Also marks all parent nodes completed
     * when necessary.
     * @param node
     */
    findCurrentNode(node: TreeNode): TreeNode {

        // if node is not active, get it ready
        var state = this.getNodeState(node) || this.setNodeState(node, BehaviourTreeInstance.STATE_TO_BE_STARTED);

        if (state == BehaviourTreeInstance.STATE_DONE) return null;

        if (state == BehaviourTreeInstance.STATE_RUNNING ||
            state == BehaviourTreeInstance.STATE_TO_BE_STARTED
        )
            return node;



        if (node.children) {
            for (let child of node.children) {
                let currentNode = this.findCurrentNode(child);
                if (currentNode)
                    return currentNode;
            }

            // all children are traversed, mark node as done
            this.setNodeState(node, BehaviourTreeInstance.STATE_DONE);
        }

        return null;

    };
}
