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
 * Utility functions
 */


import BehaviourTreeInstance from './simpleBehaviourTreeModel';
import SelectorNode from './SelectorNode';
import SequencerNode from './SequencerNode';
import Leaf from './Leaf';
import DecoratorNode from './DecoratorNode';



function writeOnConsole(instance: BehaviourTreeInstance, text) {
    var node = document.createElement("LI");                 // Create a <li> node
    var textnode = document.createTextNode(text);         // Create a text node
    node.appendChild(textnode);                              // Append the text to <li>
    document.getElementById("console").appendChild(node);     // Append <li> to <ul> with id="myList"
    // console.log(instance.currentNode.parent.constructor.name)
}

declare var window: any;
declare var gold: number;
declare var workers: number;
declare var soldiers: number;

window.gold = 0;
window.workers = 0;
window.soldiers = 0;


window.example = function () {
	/**
	 *  ActionManager is like a static instance that processes actions on a given actor
	 *  through a behaviour tree instance.
	 */
    let ActionManager: any = {};

    ActionManager.attack = function (behaviourTreeInstance: BehaviourTreeInstance) {
        writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + ": " + "Attacking !");
        return true;
    };

    ActionManager.needWorker = function (behaviourTreeInstance: BehaviourTreeInstance) {
        if (workers < 5) {
            writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + ": " + "we need workers !");
            return true;
        }
        else {
            return false;
        }
    };


    ActionManager.buildWorker = function (behaviourTreeInstance: BehaviourTreeInstance) {
        writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + ": " + "hiring worker ...");
        setTimeout(function () {
            writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + ": " + " - worker ready (" + ++workers + " total)");
            behaviourTreeInstance.updateTaskState(true);
        }, 1000);

        return null;
    };


    ActionManager.gatherGold = function (behaviourTreeInstance: BehaviourTreeInstance) {
        writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + ": " + "gathering gold ...");

        setTimeout(function () {
            let gatheredGold = 5 * workers;
            gold += gatheredGold;
            writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + ": " + " - gathered " + gatheredGold + " gold ! (" + gold + "g total)");
            behaviourTreeInstance.updateTaskState(true);
        }, 1000);

        return null;
    };


    ActionManager.needSoldiers = function (behaviourTreeInstance: BehaviourTreeInstance) {
        if (soldiers < 5) {
            writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + ": " + "we need soldiers !");
            return true;
        }
        else {
            return false;
        }
    };


    ActionManager.canBuySoldier = function (behaviourTreeInstance: BehaviourTreeInstance) {
        if (gold >= 15) {
            writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + ": " + "we can buy a soldier");
            return true;
        }
        else {
            writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + ": " + "we need more gold to buy a soldier");
            return false;
        }
    };


    ActionManager.buildSoldiers = function (behaviourTreeInstance: BehaviourTreeInstance) {
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

    let selector = new SelectorNode([
        new Leaf(ActionManager.needSoldiers),
        new Leaf(ActionManager.canBuySoldier),
        new Leaf(ActionManager.buildSoldiers)
    ]);

    let gatherGold: any = new Leaf(ActionManager.gatherGold);



    let RTS = new SequencerNode([
        new SequencerNode([
            new Leaf(ActionManager.needWorker),
            new Leaf(ActionManager.buildWorker)
        ]),
        new SequencerNode([
            new Leaf(ActionManager.needSoldiers),
            new Leaf(ActionManager.canBuySoldier),
            new Leaf(ActionManager.buildSoldiers)
        ]),
        new Leaf(ActionManager.attack)
    ]);


    let decorator = new SequencerNode([
        new Leaf(ActionManager.amIHungry),
        new Leaf(ActionManager.doIHaveFood),
        new DecoratorNode('Inverter', new Leaf(ActionManager.enemiesAround)),
        new Leaf(ActionManager.EatFood)
    ]);



    // Behaviour Tree Instance END

	/**
	 * Now that we have a couple of behaviour trees, all it takes is to create characters (NPCs)
	 * and get them acting on a certain behaviour tree instance.
	 */
    let AI: any = {};
    AI.name = "AI";

    let bti1 = new BehaviourTreeInstance(gatherGold, AI, 0);
    tick(bti1);


    let bti2 = new BehaviourTreeInstance(RTS, AI, 0);
    tick(bti2);

}


/**
 * This is what makes all your behaviour trees instances run. (implement your own tick)
 */
function tick(behaviourTreeInstance: BehaviourTreeInstance) {
    let tick = setInterval(function () {
        behaviourTreeInstance.executeBehaviourTree();

        if (behaviourTreeInstance.finished) {
            writeOnConsole(behaviourTreeInstance, behaviourTreeInstance.actor.name + " has finished.");
            clearTimeout(tick);
        }
    }, 100);
}
