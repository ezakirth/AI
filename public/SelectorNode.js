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
