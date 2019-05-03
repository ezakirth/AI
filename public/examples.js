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
var ActionNode_1 = require("./ActionNode");
var SequencerNode_1 = require("./SequencerNode");
var SelectorWeightedRandomNode_1 = require("./SelectorWeightedRandomNode");
var SelectorRandomProbabilityNode_1 = require("./SelectorRandomProbabilityNode");
var SelectorArrayNode_1 = require("./SelectorArrayNode");
var IfNode_1 = require("./IfNode");
var SelectorRandomNode_1 = require("./SelectorRandomNode");
var SequencerRandomNode_1 = require("./SequencerRandomNode");
function writeOnConsole(text) {
    var node = document.createElement("LI"); // Create a <li> node
    var textnode = document.createTextNode(text); // Create a text node
    node.appendChild(textnode); // Append the text to <li>
    document.getElementById("console").appendChild(node); // Append <li> to <ul> with id="myList"
    //	console.debug(text)
}
var totalKidsWandering = 20;
window.example = function () {
    /**
     *  PolicemanManager is like a static instance that processes actions on a given actor
     *  through a behaviour tree instance.
     */
    var PolicemanManager = {};
    PolicemanManager.ifKidInSight = function (behaviourTreeInstanceState) {
        behaviourTreeInstanceState.setState(simpleBehaviourTreeModel_1.default.STATE_COMPLETED);
        if (totalKidsWandering > 0) {
            writeOnConsole("total kids wandering: " + totalKidsWandering);
            var b = Math.random() > 0.3;
            writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + "see kid? " + (b ? "yes" : "no"));
            return b;
        }
        else {
            writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + "No more kids");
            return false;
        }
    };
    PolicemanManager.ifChaseGotKid = function (behaviourTreeInstanceState) {
        writeOnConsole("ifChaseGotKid 1 ->" + new Date());
        writeOnConsole("ifChaseGotKid state: " + behaviourTreeInstanceState.findStateForNode(behaviourTreeInstanceState.currentNode));
        if (behaviourTreeInstanceState.hasToStart()) {
            writeOnConsole("ifChaseGotKid 2 ->" + new Date());
            writeOnConsole("running after kid");
            behaviourTreeInstanceState.waitUntil(function () {
                setTimeout(function () {
                    writeOnConsole("ifChaseGotKid 2.5 ->" + new Date());
                    behaviourTreeInstanceState.completedAsync();
                }, 3000);
            });
        }
        else if (behaviourTreeInstanceState.hasToComplete()) {
            writeOnConsole("ifChaseGotKid 3 ->" + new Date());
            var b = Math.random() > 0.5;
            writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + " got child: " + b);
            return b;
        }
        else {
            writeOnConsole("ifChaseGotKid 4 ->" + new Date());
            writeOnConsole("running after kid doing nothing");
        }
        writeOnConsole("ifChaseGotKid 5 ->" + new Date());
    };
    PolicemanManager.ifChaseGotKidCases = function (behaviourTreeInstanceState) {
        if (behaviourTreeInstanceState.hasToStart()) {
            writeOnConsole("running after kid");
            console.debug("ifChaseGotKid currentNode ", behaviourTreeInstanceState.currentNode);
            behaviourTreeInstanceState.waitUntil(function () {
                setTimeout(function () {
                    behaviourTreeInstanceState.completedAsync();
                }, 3000);
            });
        }
        else if (behaviourTreeInstanceState.hasToComplete()) {
            var random = Math.random();
            var b = random > 0.6 ? 2 : (random > 0.3 ? 1 : 0);
            writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + " got child: " + b);
            return b;
        }
        else {
            writeOnConsole("running after kid doing nothing");
        }
    };
    PolicemanManager.actionBringChildToStation = function (behaviourTreeInstanceState) {
        if (behaviourTreeInstanceState.hasToStart()) {
            writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + "Bring child to station");
            behaviourTreeInstanceState.waitUntil(function () {
                setTimeout(function () {
                    writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + " child in station");
                    behaviourTreeInstanceState.completedAsync();
                }, 3000);
            });
            totalKidsWandering--;
        }
    };
    PolicemanManager.actionBringChildHome = function (behaviourTreeInstanceState) {
        totalKidsWandering--;
        writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + "Bring child home");
    };
    PolicemanManager.actionSmoke = function (behaviourTreeInstanceState) {
        writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + "Smoke");
    };
    PolicemanManager.actionImHurt = function (behaviourTreeInstanceState) {
        writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + "  I'm hurt!");
    };
    PolicemanManager.actionWanderAround = function (behaviourTreeInstanceState) {
        writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + "Wander around");
    };
    // Behaviour Tree Instance BEGIN
    /**
     * Here are several examples of behaviour tree definitions. You can create your own.
     */
    var patrollingPoliceBehaviourTreeTwoResults = new SelectorNode_1.default(PolicemanManager.ifKidInSight, new SelectorNode_1.default(PolicemanManager.ifChaseGotKid, new ActionNode_1.default(PolicemanManager.actionBringChildToStation), new SequencerNode_1.default([new ActionNode_1.default(PolicemanManager.actionWanderAround), new ActionNode_1.default(PolicemanManager.actionSmoke)])), new ActionNode_1.default(PolicemanManager.actionSmoke));
    var patrollingPoliceBehaviourSimpleTreeTwoResults = new SelectorNode_1.default(PolicemanManager.ifKidInSight, new ActionNode_1.default(PolicemanManager.actionWanderAround), new ActionNode_1.default(PolicemanManager.actionSmoke));
    var patrollingPoliceBehaviourTreeRandomWeightedResults = new SelectorWeightedRandomNode_1.default([
        [0.2, new ActionNode_1.default(PolicemanManager.actionSmoke)],
        [0.8, new ActionNode_1.default(PolicemanManager.actionWanderAround)]
    ]);
    var patrollingPoliceBehaviourTreeRandomProbabilityResults = new SelectorRandomProbabilityNode_1.default([
        [22, new ActionNode_1.default(PolicemanManager.actionSmoke)],
        [100, new ActionNode_1.default(PolicemanManager.actionWanderAround)]
    ]);
    var patrollingPoliceBehaviourTreeMultiResults = new SelectorArrayNode_1.default(new IfNode_1.default(PolicemanManager.ifChaseGotKidCases), [
        new ActionNode_1.default(PolicemanManager.actionBringChildToStation),
        new SequencerNode_1.default([new ActionNode_1.default(PolicemanManager.actionWanderAround), new ActionNode_1.default(PolicemanManager.actionSmoke)]),
        new ActionNode_1.default(PolicemanManager.actionImHurt)
    ]);
    var patrollingPoliceBehaviourTreeRandomResults = new SelectorRandomNode_1.default([
        new ActionNode_1.default(PolicemanManager.actionBringChildToStation),
        new SequencerRandomNode_1.default([new ActionNode_1.default(PolicemanManager.actionWanderAround), new ActionNode_1.default(PolicemanManager.actionSmoke)]),
        new ActionNode_1.default(PolicemanManager.actionImHurt)
    ]);
    var patrollingPoliceBehaviourTreeRandom = new SequencerRandomNode_1.default([
        new ActionNode_1.default(PolicemanManager.actionWanderAround),
        new ActionNode_1.default(PolicemanManager.actionSmoke)
    ]);
    // Behaviour Tree Instance END
    /**
     * Now that we have a couple of behaviour trees, all it takes is to create characters (NPCs)
     * and get them acting on a certain behaviour tree instance.
     */
    var policeman1 = {};
    policeman1.name = "Bobby";
    policeman1.haveBeenChasing = 0;
    var bti1 = new simpleBehaviourTreeModel_1.default(patrollingPoliceBehaviourTreeMultiResults, policeman1, 1);
    tick(bti1);
    //you can have several instances of course
    /*var policeman2 = {};
     policeman2.name = "Jimmy";
     var bti2 = new BehaviourTreeInstance(patrollingPoliceBehaviourTreeTwoResults,policeman2,1);
     tick(bti2);*/
};
/**
 * This is what makes all your behaviour trees instances run. (implement your own tick)
 */
function tick(behaviourTreeInstance) {
    var tick = setInterval(function () {
        behaviourTreeInstance.executeBehaviourTree();
        if (behaviourTreeInstance.finished) {
            writeOnConsole(behaviourTreeInstance.actor.name + " has finished.");
            clearTimeout(tick);
        }
    }, 100);
}
