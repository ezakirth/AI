(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Composite = /** @class */ (function () {
    function Composite(name, type, children) {
        this.name = name;
        this.type = type;
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            child.parent = this;
        }
        this.children = children;
    }
    Composite.prototype.execute = function (behaviourTreeInstance) { };
    return Composite;
}());
exports.default = Composite;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Decorator = /** @class */ (function () {
    function Decorator(name, type, child) {
        this.name = name;
        this.type = type;
        child.parent = this;
        this.children = [child];
    }
    Decorator.prototype.execute = function (behaviourTreeInstance) { };
    return Decorator;
}());
exports.default = Decorator;

},{}],3:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var simpleBehaviourTreeModel_1 = require("./simpleBehaviourTreeModel");
var Decorator_1 = require("./Decorator");
var DecoratorNode = /** @class */ (function (_super) {
    __extends(DecoratorNode, _super);
    /**
     * Creates a decorator
     * @param name Inverter, Succeeder
     * @param children
     */
    function DecoratorNode(name, child) {
        return _super.call(this, name, "Decorator", child) || this;
    }
    DecoratorNode.prototype.execute = function (behaviourTreeInstance) {
        behaviourTreeInstance.setNodeState(this, simpleBehaviourTreeModel_1.default.STATE_WAITING);
        behaviourTreeInstance.setNodeState(this.children[0], simpleBehaviourTreeModel_1.default.STATE_TO_BE_STARTED);
        return null;
    };
    return DecoratorNode;
}(Decorator_1.default));
exports.default = DecoratorNode;

},{"./Decorator":2,"./simpleBehaviourTreeModel":8}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var simpleBehaviourTreeModel_1 = require("./simpleBehaviourTreeModel");
/**
 * This simply creates a wrapper node for any specific action.
 * The wrapper is necessary in order to have a uniform "execute"
 * method to be called by the engine.
 */
var Leaf = /** @class */ (function () {
    function Leaf(task, decorator) {
        this.name = "Leaf";
        this.type = "Leaf";
        this.task = task;
    }
    Leaf.prototype.execute = function (behaviourTreeInstance) {
        behaviourTreeInstance.setNodeState(this, simpleBehaviourTreeModel_1.default.STATE_RUNNING);
        return this.task(behaviourTreeInstance);
    };
    return Leaf;
}());
exports.default = Leaf;

},{"./simpleBehaviourTreeModel":8}],5:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var simpleBehaviourTreeModel_1 = require("./simpleBehaviourTreeModel");
var Composite_1 = require("./Composite");
/**
 * This is a selector that executes all actions in sequence.
 */
var SelectorNode = /** @class */ (function (_super) {
    __extends(SelectorNode, _super);
    function SelectorNode(children) {
        return _super.call(this, "Selector", "Composite", children) || this;
    }
    SelectorNode.prototype.execute = function (behaviourTreeInstance) {
        //        shuffle(this.children);
        behaviourTreeInstance.setNodeState(this, simpleBehaviourTreeModel_1.default.STATE_WAITING);
        behaviourTreeInstance.setNodeState(this.children[0], simpleBehaviourTreeModel_1.default.STATE_TO_BE_STARTED);
        return null;
    };
    return SelectorNode;
}(Composite_1.default));
exports.default = SelectorNode;

},{"./Composite":1,"./simpleBehaviourTreeModel":8}],6:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var simpleBehaviourTreeModel_1 = require("./simpleBehaviourTreeModel");
var Composite_1 = require("./Composite");
/**
 * This is a selector that executes all actions in sequence.
 */
var SequencerNode = /** @class */ (function (_super) {
    __extends(SequencerNode, _super);
    function SequencerNode(children) {
        return _super.call(this, "Sequencer", "Composite", children) || this;
    }
    SequencerNode.prototype.execute = function (behaviourTreeInstance) {
        //        shuffle(this.children);
        behaviourTreeInstance.setNodeState(this, simpleBehaviourTreeModel_1.default.STATE_WAITING);
        behaviourTreeInstance.setNodeState(this.children[0], simpleBehaviourTreeModel_1.default.STATE_TO_BE_STARTED);
        return null;
    };
    return SequencerNode;
}(Composite_1.default));
exports.default = SequencerNode;

},{"./Composite":1,"./simpleBehaviourTreeModel":8}],7:[function(require,module,exports){
"use strict";
/**
 * Created by Pietro Polsinelli && Matteo Bicocchi on 15/05/2015.
 *
 * Fisrt inspired by the simplicity of
 * http://stackoverflow.com/questions/4241824/creating-an-ai-behavior-tree-in-c-sharp-how
 *
 * Follow us on Twitter @ppolsinelli @pupunzi where we post about game design, game development, Unity3d 2D, HTML5, CSS3, jquery, applied games.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Utility functions
 */
var simpleBehaviourTreeModel_1 = require("./simpleBehaviourTreeModel");
var SelectorNode_1 = require("./SelectorNode");
var SequencerNode_1 = require("./SequencerNode");
var Leaf_1 = require("./Leaf");
var DecoratorNode_1 = require("./DecoratorNode");
function writeOnConsole(instance, text) {
    var node = document.createElement("LI"); // Create a <li> node
    var textnode = document.createTextNode(text); // Create a text node
    node.appendChild(textnode); // Append the text to <li>
    document.getElementById("console").appendChild(node); // Append <li> to <ul> with id="myList"
    // console.log(instance.currentNode.parent.constructor.name)
}
window.gold = 0;
window.workers = 0;
window.soldiers = 0;
window.example = function () {
    /**
     *  ActionManager is like a static instance that processes actions on a given actor
     *  through a behaviour tree instance.
     */
    var ActionManager = {};
    ActionManager.attack = function (behaviourTreeInstance) {
        writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + ": " + "Attacking !");
        return true;
    };
    ActionManager.needWorker = function (behaviourTreeInstance) {
        if (workers < 5) {
            writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + ": " + "we need workers !");
            return true;
        }
        else {
            return false;
        }
    };
    ActionManager.buildWorker = function (behaviourTreeInstance) {
        writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + ": " + "hiring worker ...");
        setTimeout(function () {
            writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + ": " + " - worker ready (" + ++workers + " total)");
            behaviourTreeInstance.updateTaskState(true);
        }, 1000);
        return null;
    };
    ActionManager.gatherGold = function (behaviourTreeInstance) {
        writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + ": " + "gathering gold ...");
        setTimeout(function () {
            var gatheredGold = 5 * workers;
            gold += gatheredGold;
            writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + ": " + " - gathered " + gatheredGold + " gold ! (" + gold + "g total)");
            behaviourTreeInstance.updateTaskState(true);
        }, 1000);
        return null;
    };
    ActionManager.needSoldiers = function (behaviourTreeInstance) {
        if (soldiers < 5) {
            writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + ": " + "we need soldiers !");
            return true;
        }
        else {
            return false;
        }
    };
    ActionManager.canBuySoldier = function (behaviourTreeInstance) {
        if (gold >= 15) {
            writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + ": " + "we can buy a soldier");
            return true;
        }
        else {
            writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + ": " + "we need more gold to buy a soldier");
            return false;
        }
    };
    ActionManager.buildSoldiers = function (behaviourTreeInstance) {
        gold -= 15;
        writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + ": " + "hiring soldier ...");
        setTimeout(function () {
            writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + ": " + " - soldier ready (" + ++soldiers + " total)");
            behaviourTreeInstance.updateTaskState(true);
        }, 1000);
        return null;
    };
    // Behaviour Tree Instance BEGIN
    /**
     * Here are several examples of behaviour tree definitions. You can create your own.
     */
    var selector = new SelectorNode_1.default([
        new Leaf_1.default(ActionManager.needSoldiers),
        new Leaf_1.default(ActionManager.canBuySoldier),
        new Leaf_1.default(ActionManager.buildSoldiers)
    ]);
    var gatherGold = new Leaf_1.default(ActionManager.gatherGold);
    var RTS = new SequencerNode_1.default([
        new SequencerNode_1.default([
            new Leaf_1.default(ActionManager.needWorker),
            new Leaf_1.default(ActionManager.buildWorker)
        ]),
        new SequencerNode_1.default([
            new Leaf_1.default(ActionManager.needSoldiers),
            new Leaf_1.default(ActionManager.canBuySoldier),
            new Leaf_1.default(ActionManager.buildSoldiers)
        ]),
        new Leaf_1.default(ActionManager.attack)
    ]);
    var decorator = new SequencerNode_1.default([
        new Leaf_1.default(ActionManager.amIHungry),
        new Leaf_1.default(ActionManager.doIHaveFood),
        new DecoratorNode_1.default('Inverter', new Leaf_1.default(ActionManager.enemiesAround)),
        new Leaf_1.default(ActionManager.EatFood)
    ]);
    // Behaviour Tree Instance END
    /**
     * Now that we have a couple of behaviour trees, all it takes is to create characters (NPCs)
     * and get them acting on a certain behaviour tree instance.
     */
    var AI = {};
    AI.name = "AI";
    var bti1 = new simpleBehaviourTreeModel_1.default(gatherGold, AI, 0);
    tick(bti1);
    var bti2 = new simpleBehaviourTreeModel_1.default(RTS, AI, 0);
    tick(bti2);
};
/**
 * This is what makes all your behaviour trees instances run. (implement your own tick)
 */
function tick(behaviourTreeInstance) {
    var tick = setInterval(function () {
        behaviourTreeInstance.executeBehaviourTree();
        if (behaviourTreeInstance.finished) {
            writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + " has finished.");
            clearTimeout(tick);
        }
    }, 100);
}

},{"./DecoratorNode":3,"./Leaf":4,"./SelectorNode":5,"./SequencerNode":6,"./simpleBehaviourTreeModel":8}],8:[function(require,module,exports){
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
    BehaviourTreeInstance.prototype.getNodeState = function (node) {
        for (var _i = 0, _a = this.activeNodes; _i < _a.length; _i++) {
            var activeNode = _a[_i];
            if (activeNode.node == node)
                return activeNode.state;
        }
    };
    ;
    /**
     * Sets the state of a node
     * @param state
     * @param node
     */
    BehaviourTreeInstance.prototype.setNodeState = function (node, state) {
        var active = false;
        for (var _i = 0, _a = this.activeNodes; _i < _a.length; _i++) {
            var activeNode = _a[_i];
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
            var nodeExecutionResult = this.currentNode.execute(this);
            this.updateTaskState(nodeExecutionResult);
        }
    };
    /**
     * updates the state of a leaf (task) node. If result is null, then it means we don't have a result yet (async)
     * @param nodeExecutionResult
     */
    BehaviourTreeInstance.prototype.updateTaskState = function (nodeExecutionResult) {
        if (nodeExecutionResult !== null) {
            var parentNode = this.currentNode.parent;
            if (parentNode && parentNode.type == "Decorator") {
                // if it's an inverter node, invert the result
                if (parentNode.name == "Inverter")
                    nodeExecutionResult = !nodeExecutionResult;
                // if it's a succeeder node, set result to true
                if (parentNode.name == "Succeeder")
                    nodeExecutionResult = true;
                this.setNodeState(parentNode, BehaviourTreeInstance.STATE_DONE);
                // make the parent of the leaf the parent of the decorator instead
                parentNode = parentNode.parent;
            }
            if (nodeExecutionResult === false) {
                this.setNodeState(this.currentNode, BehaviourTreeInstance.STATE_FAILURE);
                // if it's a sequencer node, stop as soon as a child fails
                if (parentNode && parentNode.name == "Sequencer")
                    this.setNodeState(parentNode, BehaviourTreeInstance.STATE_DONE);
            }
            else {
                this.setNodeState(this.currentNode, BehaviourTreeInstance.STATE_SUCCESS);
                // if it's a selector node, stop it as soon as a child succeeds
                if (parentNode && parentNode.name == "Selector")
                    this.setNodeState(parentNode, BehaviourTreeInstance.STATE_DONE);
            }
        }
    };
    /**
     * This is a recursive function, does a lot of work in few lines of code.
     * Finds in the behaviour tree instance the currend node that is either to be
     * executed or is executing (async). Also marks all parent nodes completed
     * when necessary.
     * @param node
     */
    BehaviourTreeInstance.prototype.findCurrentNode = function (node) {
        // if node is not active, get it ready
        var state = this.getNodeState(node) || this.setNodeState(node, BehaviourTreeInstance.STATE_TO_BE_STARTED);
        if (state == BehaviourTreeInstance.STATE_DONE)
            return null;
        if (state == BehaviourTreeInstance.STATE_RUNNING ||
            state == BehaviourTreeInstance.STATE_TO_BE_STARTED)
            return node;
        if (node.children) {
            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                var child = _a[_i];
                var currentNode = this.findCurrentNode(child);
                if (currentNode)
                    return currentNode;
            }
            // all children are traversed, mark node as done
            this.setNodeState(node, BehaviourTreeInstance.STATE_DONE);
        }
        return null;
    };
    ;
    BehaviourTreeInstance.STATE_TO_BE_STARTED = "STATE_TO_BE_STARTED";
    BehaviourTreeInstance.STATE_RUNNING = "STATE_RUNNING"; // task in progress
    BehaviourTreeInstance.STATE_FAILURE = "STATE_FAILURE";
    BehaviourTreeInstance.STATE_SUCCESS = "STATE_SUCCESS";
    BehaviourTreeInstance.STATE_WAITING = "STATE_WAITING"; // composite node waiting on its children
    BehaviourTreeInstance.STATE_DONE = "STATE_DONE"; // composite node waiting on its children
    BehaviourTreeInstance.DECORATOR = {
        INVERTER: "DECORATOR_INVERTER",
        SUCCEEDER: "DECORATOR_SUCCEEDER"
    };
    return BehaviourTreeInstance;
}());
exports.default = BehaviourTreeInstance;

},{}]},{},[7]);
