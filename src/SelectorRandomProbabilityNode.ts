import BehaviourTreeInstance from './simpleBehaviourTreeModel';
import TreeNode from './TreeNode';
import { chooseByProbability } from './Utils';

// SelectorRandomProbability model and implementation - BEGIN
/**
 * This node executes randomly one of the nodes on the base of the probability assigned to the node,
 * but to make it easier to write and modify the probability is assigned as an integer value.
 * The node will normalize the values in a [0,1] interval.
 * Example:
 * [
 * [100 Lazy around]
 * [22 Pretend to work]
 * [1 Actually work]
 * ]
 *
 */
export default class SelectorRandomProbabilityNode implements TreeNode {
    weightsActionMap: any;
    constructor(probabilityActionMap) {

        this.weightsActionMap = probabilityActionMap;
    }

    execute(behaviourTreeInstanceState) {

        var state = behaviourTreeInstanceState.findStateForNode(this);

        if (state == BehaviourTreeInstance.STATE_EXECUTING)
            return;


        var action = chooseByProbability(this.weightsActionMap);

        behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_WAITING, this);

        for (var j = 0; j < this.weightsActionMap.length; j++) {
            if (this.weightsActionMap[j][1] == action)
                behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_TO_BE_STARTED, action);
            else
                behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_DISCARDED, this.weightsActionMap[j][1]);
        }
    }

    children() {
        var actionArray = [];
        for (var j = 0; j < this.weightsActionMap.length; j++) {
            actionArray.push(this.weightsActionMap[j][1]);
        }
        return actionArray;
    }

    isConditional() {
        return false;
    }
};
