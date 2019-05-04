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
