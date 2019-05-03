"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.shuffle = shuffle;
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
exports.chooseByRandom = chooseByRandom;
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
exports.chooseByProbability = chooseByProbability;
