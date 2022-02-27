"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _nullCallback_1 = __importDefault(require("./_nullCallback"));
var _defer_1 = __importDefault(require("./_defer"));
var _catchWrapper_1 = __importDefault(require("./_catchWrapper"));
var _onceWrapper_1 = __importDefault(require("./_onceWrapper"));
var PassThrough_1 = __importDefault(require("./PassThrough"));
var _false = function _false(next) { return next(null, false); };
/**
* While accepts two tasks and returns a task that conditionally executes some number of times.
* @param {function} conditionTask - a condition task.
* @param {function} loopTask - a task to run if the condition returns a truthy value.
* @returns {function}
* @memberof callback-patterns
* @example
* ```javascript
*   let While = require('callback-patterns/While');
*
*   let task = While(
*     (next, num) => next(null, num < 10),
*     (next, num) => next(null, num + 1),
*   );
*
*   let onDone = (err, result) => console.log(result);
*
*   task(onDone, 1); // prints 9, eventually
* ```
*/
function While(_1, _2) {
    var conditionTask = _1 != null ? (0, _catchWrapper_1.default)(_1) : _false;
    var loopTask = _2 != null ? (0, _catchWrapper_1.default)(_2) : PassThrough_1.default;
    var deferredLoopTask = _defer_1.default.bind(null, loopTask);
    return function _whileInstance(_1) {
        var next = (0, _onceWrapper_1.default)(_1 || _nullCallback_1.default);
        var args = arguments;
        var onCondition;
        var onLoop;
        onCondition = function _onCondition(err, res) {
            if (err) {
                next(err, res);
            }
            else if (res) {
                args[0] = onLoop;
                args.length = args.length || 1;
                deferredLoopTask.apply(null, args);
            }
            else {
                args[0] = null;
                next.apply(null, args);
            }
        };
        onLoop = function _onLoop(err) {
            var args2 = arguments;
            if (err) {
                next.apply(null, args2);
            }
            else {
                args = args2;
                args[0] = onCondition;
                args.length = args.length || 1;
                conditionTask.apply(null, args);
            }
        };
        args[0] = onCondition;
        args.length = args.length || 1;
        conditionTask.apply(null, args);
    };
}
module.exports = While;
