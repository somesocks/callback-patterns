"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _queue_1 = __importDefault(require("./_queue"));
var chai_1 = require("chai");
describe('_queue', function () {
    it('queue works', function () {
        var queue = (0, _queue_1.default)();
        (0, chai_1.assert)(queue.length() === 0);
        queue.push(1);
        (0, chai_1.assert)(queue.length() === 1);
        queue.push(2);
        (0, chai_1.assert)(queue.length() === 2);
        queue.push(3);
        (0, chai_1.assert)(queue.length() === 3);
        (0, chai_1.assert)(queue.pop() === 1);
        (0, chai_1.assert)(queue.length() === 2);
        (0, chai_1.assert)(queue.pop() === 2);
        (0, chai_1.assert)(queue.length() === 1);
        (0, chai_1.assert)(queue.pop() === 3);
        (0, chai_1.assert)(queue.length() === 0);
        (0, chai_1.assert)(queue.pop() === undefined);
        (0, chai_1.assert)(queue.length() === 0);
    });
    it('queue performance', function () {
        var queue = (0, _queue_1.default)();
        var start = Date.now();
        var rounds = 0;
        while (Date.now() - start < 1000) {
            for (var i = 0; i < 1000; i++) {
                queue.push(1);
            }
            for (var i = 0; i < 1000; i++) {
                queue.pop(1);
            }
            rounds += 1000;
        }
        var end = Date.now();
        console.log("".concat(rounds, " in ").concat(end - start, "ms: ").concat((rounds * 1000.0) / (end - start), " rounds/sec"));
    });
});
