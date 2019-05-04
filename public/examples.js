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
        new SequencerNode_1.default([
            new DecoratorNode_1.default('Inverter', new Leaf_1.default(ActionManager.needSoldiers)),
            new Leaf_1.default(ActionManager.attack)
        ])
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
