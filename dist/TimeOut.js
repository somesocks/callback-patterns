"use strict";
/* eslin-env node */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Race_1 = __importDefault(require("./Race"));
var PassThrough_1 = __importDefault(require("./PassThrough"));
var Delay_1 = __importDefault(require("./Delay"));
var InSeries_1 = __importDefault(require("./InSeries"));
function _error(next) {
    return next(new Error('callback-patterns.TimeOut triggered'));
}
/**
* TimeOut wraps a single task function, and returns a function that returns early if the task fails to complete before the timeout triggers.
*
* NOTE: the timeout being triggered will not cancel the original task.
*
* @param {CallbackTask} task - the task to wrap in a timeout.
* @param {number} ms - the timeout in ms.
* @returns {CallbackTask} a task
* @memberof callback-patterns
* @example
* ```javascript
*   let TimeOut = require('callback-patterns/TimeOut');
*
*   let chain = TimeOut(
*     function(next, ...args) {},
*			1000
*   );
*
*   chain(next, ...args);
* ```
*/
function TimeOut(_1, _2) {
    var task = _1 || PassThrough_1.default;
    var ms = _2 || 1000;
    var timeout = (0, InSeries_1.default)((0, Delay_1.default)(ms), _error);
    return (0, Race_1.default)(timeout, task);
}
module.exports = TimeOut;
