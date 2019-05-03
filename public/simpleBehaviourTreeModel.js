"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
var BehaviourTreeInstance = /** @class */ (function () {
    function BehaviourTreeInstance(behaviourTree, actor, numberOfLoops) {
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
    BehaviourTreeInstance.prototype.findStateForNode = function (node) {
        for (var i = 0; i < this.nodeAndState.length; i++) {
            if (this.nodeAndState[i][0] == node)
                return this.nodeAndState[i][1];
        }
    };
    ;
    BehaviourTreeInstance.prototype.setState = function (state, node) {
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
    ;
    //commodity methods
    BehaviourTreeInstance.prototype.hasToStart = function () {
        var state = this.findStateForNode(this.currentNode);
        return state != BehaviourTreeInstance.STATE_EXECUTING && state != BehaviourTreeInstance.STATE_COMPUTE_RESULT;
    };
    ;
    BehaviourTreeInstance.prototype.hasToComplete = function () {
        var state = this.findStateForNode(this.currentNode);
        return state == BehaviourTreeInstance.STATE_COMPUTE_RESULT;
    };
    ;
    BehaviourTreeInstance.prototype.completedAsync = function () {
        if (!this.currentNode)
            return false;
        if (this.currentNode.isConditional())
            this.setState(BehaviourTreeInstance.STATE_COMPUTE_RESULT);
        else
            this.setState(BehaviourTreeInstance.STATE_COMPLETED);
    };
    ;
    BehaviourTreeInstance.prototype.waitUntil = function (callback) {
        this.setState(BehaviourTreeInstance.STATE_EXECUTING);
        callback();
    };
    ;
    /**
     * This is the function that crawls the behaviour tree instance you pass to it
     * and calls the executors if the the argument is a node of some kind,
     * calls it as an action otherwise.
     *
     * The same node may be called to execute twice, once for starting it and on a subsequent tick for completion.
     */
    BehaviourTreeInstance.prototype.executeBehaviourTree = function () {
        if (this.finished)
            return;
        //find current node to be executed, or a running one, or root to launch, or root completed
        this.currentNode = this.findCurrentNode(this.behaviourTree);
        if (this.currentNode == null) {
            this.numberOfRuns++;
            if (this.numberOfLoops == 0 || this.numberOfRuns < this.numberOfLoops) {
                this.nodeAndState = [];
                this.currentNode = this.findCurrentNode(this.behaviourTree);
            }
            else {
                this.finished = true;
                return;
            }
        }
        var state = this.findStateForNode(this.currentNode);
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
    ;
    // This is a recursive function, does a lot of work in few lines of code.
    // Finds in the behaviour tree instance the currend node that is either to be
    // executed or is executing (async). Also marks all parent nodes completed
    // when necessary.
    BehaviourTreeInstance.prototype.findCurrentNode = function (node) {
        var state = this.findStateForNode(node);
        if (state == BehaviourTreeInstance.STATE_DISCARDED)
            return null;
        if (state == null) {
            state = this.setState(BehaviourTreeInstance.STATE_TO_BE_STARTED, node);
        }
        if (state == BehaviourTreeInstance.STATE_EXECUTING ||
            state == BehaviourTreeInstance.STATE_COMPUTE_RESULT ||
            state == BehaviourTreeInstance.STATE_TO_BE_STARTED)
            return node;
        var children = node.children();
        if (children == null) {
            return null;
        }
        else {
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
    ;
    BehaviourTreeInstance.STATE_TO_BE_STARTED = "STATE_TO_BE_STARTED";
    BehaviourTreeInstance.STATE_WAITING = "STATE_WAITING";
    BehaviourTreeInstance.STATE_DISCARDED = "STATE_DISCARDED";
    BehaviourTreeInstance.STATE_EXECUTING = "STATE_EXECUTING";
    BehaviourTreeInstance.STATE_COMPUTE_RESULT = "STATE_COMPUTE_RESULT";
    BehaviourTreeInstance.STATE_COMPLETED = "STATE_COMPLETED";
    return BehaviourTreeInstance;
}());
// Action model and implementation - BEGIN
/**
 * This simply creates a wrapper node for any specific action.
 * The wrapper is necessary in order to have a uniform "execute"
 * method to be called by the engine.
 */
var ActionNode = /** @class */ (function () {
    function ActionNode(action) {
        this.action = action;
    }
    ActionNode.prototype.execute = function (behaviourTreeInstanceState) {
        return this.action(behaviourTreeInstanceState);
    };
    ActionNode.prototype.children = function () {
        return null;
    };
    ActionNode.prototype.isConditional = function () {
        return false;
    };
    return ActionNode;
}());
// Action model and implementation - END
// IfNode model and implementation - BEGIN
/**
 * This node is required on Selector nodes that are ruled by a logic.
 * You may also omit it and pass directly the method, will work anyway.
 */
var IfNode = /** @class */ (function () {
    function IfNode(action) {
        this.action = action;
    }
    IfNode.prototype.execute = function (behaviourTreeInstanceState) {
        return this.action(behaviourTreeInstanceState);
    };
    IfNode.prototype.children = function () {
        return null;
    };
    IfNode.prototype.isConditional = function () {
        return false;
    };
    return IfNode;
}());
// Action model and implementation - END
// selector model and implementation - BEGIN
/**
 * This models the "selector" behaviour on two alternative conditions
 * You use this function in configuring your actor behaviour.
 */
var SelectorNode = /** @class */ (function () {
    function SelectorNode(conditionFunction, actionIfTrue, actionIfFalse) {
        this.conditionFunction = conditionFunction;
        this.actionIfTrue = actionIfTrue;
        this.actionIfFalse = actionIfFalse;
    }
    /**
     * This makes a given SelectorNode instance execute.
     * This function is used by the engine executeBehaviourTree
     * when a node of type SelectorNode is met
     */
    SelectorNode.prototype.execute = function (behaviourTreeInstanceState) {
        var state = behaviourTreeInstanceState.findStateForNode(this);
        if (state == BehaviourTreeInstance.STATE_EXECUTING)
            return;
        //			In both cases Sync and Async
        var result;
        if (this.conditionFunction instanceof IfNode) {
            result = this.conditionFunction.execute(behaviourTreeInstanceState);
        }
        else {
            result = this.conditionFunction(behaviourTreeInstanceState);
        }
        //		console.debug("SelectorNode result", result);
        if (state == BehaviourTreeInstance.STATE_EXECUTING)
            return;
        if (result) {
            behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_TO_BE_STARTED, this.actionIfTrue);
            behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_DISCARDED, this.actionIfFalse);
        }
        else {
            behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_TO_BE_STARTED, this.actionIfFalse);
            behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_DISCARDED, this.actionIfTrue);
        }
    };
    SelectorNode.prototype.children = function () {
        return [this.actionIfTrue, this.actionIfFalse];
    };
    SelectorNode.prototype.isConditional = function () {
        return true;
    };
    return SelectorNode;
}());
// selector model and implementation - END
// SelectorArray model and implementation - BEGIN
/**
 * This is a cool extension of selector that takes a condition function returning the index of the action to be executed.
 * This allows to compact a set of nested conditions in a more readable one.
 */
var SelectorArrayNode = /** @class */ (function () {
    function SelectorArrayNode(conditionFunction, actionArray) {
        this.conditionFunction = conditionFunction;
        this.actionArray = actionArray;
    }
    SelectorArrayNode.prototype.execute = function (behaviourTreeInstanceState) {
        var state = behaviourTreeInstanceState.findStateForNode(this);
        if (state == BehaviourTreeInstance.STATE_EXECUTING)
            return;
        //			In both cases Sync and Async
        var resultInt;
        if (this.conditionFunction instanceof IfNode) {
            resultInt = this.conditionFunction.execute(behaviourTreeInstanceState);
        }
        else {
            resultInt = this.conditionFunction(behaviourTreeInstanceState);
        }
        if (state == BehaviourTreeInstance.STATE_EXECUTING)
            return;
        for (var j = 0; j < this.actionArray.length; j++) {
            if (j == resultInt)
                behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_TO_BE_STARTED, this.actionArray[j]);
            else
                behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_DISCARDED, this.actionArray[j]);
        }
    };
    SelectorArrayNode.prototype.children = function () {
        return this.actionArray;
    };
    SelectorArrayNode.prototype.isConditional = function () {
        return true;
    };
    return SelectorArrayNode;
}());
// SelectorArray model and implementation - END
// Sequencer model and implementation - BEGIN
/**
 * This is a selector that executes all actions in sequence.
 */
var SequencerNode = /** @class */ (function () {
    function SequencerNode(actionArray) {
        this.actionArray = actionArray;
    }
    SequencerNode.prototype.execute = function (behaviourTreeInstanceState) {
        behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_WAITING);
        behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_TO_BE_STARTED, this.actionArray[0]);
    };
    SequencerNode.prototype.children = function () {
        return this.actionArray;
    };
    SequencerNode.prototype.isConditional = function () {
        return false;
    };
    return SequencerNode;
}());
;
// Sequencer model and implementation - END
// SelectorRandom model and implementation - BEGIN
/**
 * This is a cool extension of selector that executes randomly one of the actions in the array.
 */
var SelectorRandomNode = /** @class */ (function () {
    function SelectorRandomNode(actionArray) {
        this.actionArray = actionArray;
    }
    SelectorRandomNode.prototype.execute = function (behaviourTreeInstanceState) {
        var state = behaviourTreeInstanceState.findStateForNode(this);
        if (state == BehaviourTreeInstance.STATE_EXECUTING)
            return;
        var randomIndex = Math.floor(Math.random() * this.actionArray.length);
        behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_WAITING, this);
        for (var j = 0; j < this.actionArray.length; j++) {
            if (j == randomIndex)
                behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_TO_BE_STARTED, this.actionArray[j]);
            else
                behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_DISCARDED, this.actionArray[j]);
        }
    };
    SelectorRandomNode.prototype.children = function () {
        return this.actionArray;
    };
    SelectorRandomNode.prototype.isConditional = function () {
        return false;
    };
    return SelectorRandomNode;
}());
;
// SelectorRandom model and implementation - END
// SelectorWeightedRandomNode model and implementation - BEGIN
/**
 * Example:
 * [
 * [0.7 Lazy around]
 * [0.2 Pretend to work]
 * [0.1 Actually work]
 * ]
 */
var SelectorWeightedRandomNode = /** @class */ (function () {
    function SelectorWeightedRandomNode(weightsActionMap) {
        this.weightsActionMap = weightsActionMap;
    }
    SelectorWeightedRandomNode.prototype.execute = function (behaviourTreeInstanceState) {
        var state = behaviourTreeInstanceState.findStateForNode(this);
        if (state == BehaviourTreeInstance.STATE_EXECUTING)
            return;
        var action = chooseByRandom(this.weightsActionMap);
        //console.debug("randomIndex", this.weightsActionMap, action);
        behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_WAITING, this);
        for (var j = 0; j < this.weightsActionMap.length; j++) {
            if (this.weightsActionMap[j][1] == action)
                behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_TO_BE_STARTED, action);
            else
                behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_DISCARDED, this.weightsActionMap[j][1]);
        }
    };
    SelectorWeightedRandomNode.prototype.children = function () {
        var actionArray = [];
        for (var j = 0; j < this.weightsActionMap.length; j++) {
            actionArray.push(this.weightsActionMap[j][1]);
        }
        return actionArray;
    };
    SelectorWeightedRandomNode.prototype.isConditional = function () {
        return false;
    };
    ;
    return SelectorWeightedRandomNode;
}());
;
// SelectorWeightedRandomNode model and implementation - END
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
var SelectorRandomProbabilityNode = /** @class */ (function () {
    function SelectorRandomProbabilityNode(probabilityActionMap) {
        this.weightsActionMap = probabilityActionMap;
    }
    SelectorRandomProbabilityNode.prototype.execute = function (behaviourTreeInstanceState) {
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
    };
    SelectorRandomProbabilityNode.prototype.children = function () {
        var actionArray = [];
        for (var j = 0; j < this.weightsActionMap.length; j++) {
            actionArray.push(this.weightsActionMap[j][1]);
        }
        return actionArray;
    };
    SelectorRandomProbabilityNode.prototype.isConditional = function () {
        return false;
    };
    return SelectorRandomProbabilityNode;
}());
;
/**
 * This is a cool extension of selector that executes all actions in random sequence.
 */
// SequencerRandom model and implementation - BEGIN
var SequencerRandomNode = /** @class */ (function () {
    function SequencerRandomNode(actionArray) {
        this.children = function () {
            return this.actionArray;
        };
        this.isConditional = function () {
            return false;
        };
        this.actionArray = actionArray;
    }
    SequencerRandomNode.prototype.execute = function (behaviourTreeInstanceState) {
        shuffle(this.actionArray);
        behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_WAITING);
        behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_TO_BE_STARTED, this.actionArray[0]);
    };
    return SequencerRandomNode;
}());
;
// SelectorRandomProbability model and implementation - END
/**
 * Utility array shuffle function
 * From http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
function shuffle(array) {
    var currentIndex = array.length;
    var temporaryValue;
    var randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
function chooseByRandom(weightsActionMap) {
    var rnd = Math.random();
    for (var item in weightsActionMap) {
        var actionMap = weightsActionMap[item];
        if (rnd < actionMap[0])
            return actionMap[1];
        rnd -= actionMap[0];
    }
    throw new Error("The proportions in the collection do not add up to 1.");
}
function chooseByProbability(pointActionMap) {
    var weightsActionMap = [];
    var totalPoints = 0;
    for (var point in pointActionMap) {
        totalPoints += pointActionMap[point][0];
    }
    var unit = 1 / totalPoints;
    for (var point in pointActionMap) {
        weightsActionMap.push([pointActionMap[point][0] * unit, pointActionMap[point][1]]);
    }
    return chooseByRandom(weightsActionMap);
}
