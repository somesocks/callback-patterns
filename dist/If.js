"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _catchWrapper_1 = __importDefault(require("./_catchWrapper"));
var _onceWrapper_1 = __importDefault(require("./_onceWrapper"));
var _nullCallback_1 = __importDefault(require("./_nullCallback"));
var PassThrough_1 = __importDefault(require("./PassThrough"));
/**
* `If` accepts up to three tasks,
* an 'if' task, a 'then' task, and lastly an 'else' task
* note: by default, the ifTask, thenTask, and elseTask are PassThrough
* note: the ifTask can return multiple results,
* but only the first is checked for truthiness
* @param {CallbackTask} ifTask - a condition task.
* @param {CallbackTask} thenTask - a task to run when ifTask returns a truthy value.
* @param {CallbackTask} elseTask - a task to run when ifTask returns a falsy value.
* @returns {CallbackTask}
* @memberof callback-patterns
* @example
* ```javascript
*   let If = require('callback-patterns/If');
*
*   let logIfEven = If(
*     (next, num) => next(null, num % 2 === 0)
*     (next, num) => { console.log('is even!'); next(null, num); },
*     (next, num) => { console.log('is not even!'); next(null, num); },
*   );
*
*   let onDone = (err, ...results) => console.log(results);
*
*   logIfEven(null, 1); // prints out 'is not even!' eventually
*   logIfEven(null, 2); // prints out 'is even!' eventually
* ```
*/
function If(_1, _2, _3) {
    var conditionTask = _1 != null ? _catchWrapper_1.default(_1) : PassThrough_1.default;
    var thenTask = _2 != null ? _catchWrapper_1.default(_2) : PassThrough_1.default;
    var elseTask = _3 != null ? _catchWrapper_1.default(_3) : PassThrough_1.default;
    return function _ifInstance(_1) {
        var next = _onceWrapper_1.default(_1 || _nullCallback_1.default);
        var args = arguments;
        var onCondition = function _onCondition(err, res) {
            if (err) {
                next(err, res);
            }
            else if (res) {
                args[0] = next;
                thenTask.apply(null, args);
            }
            else {
                args[0] = next;
                elseTask.apply(null, args);
            }
        };
        args[0] = onCondition;
        conditionTask.apply(null, args);
    };
}
module.exports = If;
