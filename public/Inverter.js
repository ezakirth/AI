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
var InverterNode = /** @class */ (function (_super) {
    __extends(InverterNode, _super);
    function InverterNode(children) {
        return _super.call(this, "Inverter", "Decorator", children) || this;
    }
    InverterNode.prototype.execute = function (behaviourTreeInstance) {
        behaviourTreeInstance.setNodeState(this, simpleBehaviourTreeModel_1.default.STATE_WAITING);
        behaviourTreeInstance.setNodeState(this.children[0], simpleBehaviourTreeModel_1.default.STATE_TO_BE_STARTED);
        return null;
    };
    return InverterNode;
}(Composite_1.default));
exports.default = InverterNode;
