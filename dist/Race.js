"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _nullCallback_1 = __importDefault(require("./_nullCallback"));
var _defer_1 = __importDefault(require("./_defer"));
var _catchWrapper_1 = __importDefault(require("./_catchWrapper"));
var _onceWrapper_1 = __importDefault(require("./_onceWrapper"));
var EMPTY = function (next) { return (next || _nullCallback_1.default)(); };
/**
* Race accepts a number of functions, and returns a task function that executes all of its child tasks simultaneously.  The first result (or error) is returned, and the remaining results (or errors) are ignored.
*
* @param {...CallbackTask} tasks - any number of tasks to run in parallel.
* @returns {CallbackTask} a task
* @memberof callback-patterns
* @example
* ```javascript
*   let Race = require('callback-patterns/Race');
*
*   let task = Race(
*     (next) => next(null, 1),
*     (next) => setTimeout(next, 100, null, 2),
*     (next) => { throw new Error(); } ,
*   );
*
*   let onDone = (err, ...results) => console.log(results);
*
*   task(onDone); // prints out [ 1 ], eventually
* ```
*/
function Race() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var tasks = arguments;
    if (tasks.length === 0) {
        return EMPTY;
    }
    for (var i = 0; i < tasks.length; i++) {
        tasks[i] = (0, _catchWrapper_1.default)(tasks[i]);
        tasks[i] = _defer_1.default.bind(null, tasks[i]);
    }
    return function _raceInstance(_1) {
        var next = (0, _onceWrapper_1.default)(_1);
        var args = arguments;
        args[0] = next;
        for (var i = 0; i < tasks.length; i++) {
            tasks[i].apply(null, args);
        }
    };
}
module.exports = Race;
