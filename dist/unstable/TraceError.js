"use strict";
/* eslint-env node */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _nullCallback_1 = __importDefault(require("../_nullCallback"));
var PassThrough_1 = __importDefault(require("../PassThrough"));
function _stackWrapper(_1, _2) {
    var callback = _1;
    var constructorStack = _2;
    // var callStack = new Error('called from');
    return function __stackWrapperInstance(_1) {
        var err = _1;
        if (err && err.stack) {
            // err.stack += '\n\n ';
            // err.stack += callStack.stack;
            err.stack += '\n\n ';
            err.stack += constructorStack.stack;
        }
        callback.apply(undefined, arguments);
    };
}
/**
* TraceError is an experimental wrapper that attempts to make errors more informative.
* It does this by appending extra information to the stack of any error thrown in the task.
*
* NOTE: TraceError is marked as 'unstable' as stack traces in JS are not standardized,
* so it may not always provide useful information.
*
* @param {CallbackTask} task - a task function to wrap
* @returns {CallbackTask} a wrapper function that modifies the stack trace of any errors thrown within
* @memberof callback-patterns.unstable
* @example
* ```javascript
*   let TraceError = require('callback-patterns/unstable/TraceError');
*   let InSeries = require('callback-patterns/InSeries');
*
*   let task = InSeries(
*     function(next, ...args) {},
*     function(next, ...args) {},
*     ...
*   );
*
*   task = TraceError(task);
*
*   task(next, ...args);
* ```
*/
var TraceError = function TraceError(_1) {
    var task = _1 || PassThrough_1.default;
    var constructorStack = new Error('constructed at');
    return function _TraceErrorInstance(_1) {
        var next = _1 || _nullCallback_1.default;
        next = _stackWrapper(next, constructorStack);
        arguments[0] = next;
        if (arguments.length < 1) {
            arguments.length = 1;
        }
        task.apply(undefined, arguments);
    };
};
module.exports = TraceError;
