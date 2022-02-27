"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _catchWrapper_1 = __importDefault(require("./_catchWrapper"));
var _defer_1 = __importDefault(require("./_defer"));
var _nullCallback_1 = __importDefault(require("./_nullCallback"));
var _onceWrapper_1 = __importDefault(require("./_onceWrapper"));
var EMPTY = function (next) { return (next || _nullCallback_1.default)(); };
var _callback = function (context, index) {
    return function _ondone(err) {
        var args = arguments;
        if (err) {
            context.next.apply(undefined, args);
        }
        else {
            context.results[index + 1] = Array.prototype.slice.call(args, 1);
            context.finished++;
            if (context.finished === context.handlers.length) {
                context.next.apply(undefined, context.results);
            }
        }
    };
};
/**
* ```javascript
*   let InParallel = require('callback-patterns/InParallel');
*
*   let task = InParallel(
*     function(next, ...args) {},
*     function(next, ...args) {},
*     ...
*   );
*
*   task(next, ...args);
* ```
* InParallel accepts a number of functions, and returns a task function that executes all of its child tasks in parallel.
*
* note: because the callbacks can return any number of results,
* the results from each task are autoboxed into an array.
* This includes an empty array for tasks that don't return results.
* @param {...CallbackTask} tasks - any number of tasks to run in parallel.
* @returns {CallbackTask} a wrapper function that runs the tasks in parallel
* @memberof callback-patterns
* @example
* ```javascript
*   let InParallel = require('callback-patterns/InParallel');
*
*   let task = InParallel(
*     (next) => next(null, 1),
*     (next) => next(null, 2),
*     (next) => next(null, 3, 4),
*   );
*
*   let onDone = (err, ...results) => console.log(results);
*
*   chain(onDone); // prints [ [ 1 ], [ 2 ], [ 3, 4 ] ]
* ```
*/
function InParallel() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var handlers = arguments;
    if (handlers.length === 0) {
        return EMPTY;
    }
    for (var i = 0; i < handlers.length; i++) {
        handlers[i] = (0, _catchWrapper_1.default)(handlers[i]);
    }
    return function _inParallelInstance(_1) {
        var context = {
            next: (0, _onceWrapper_1.default)(_1),
            handlers: handlers,
            results: Array(handlers.length + 1),
            finished: 0,
        };
        for (var i = 0; i < handlers.length; i++) {
            // eslint-disable-next-line no-loop-func
            var onDone = _callback(context, i);
            var handler = handlers[i]
                .bind(undefined, (0, _onceWrapper_1.default)(onDone));
            arguments[0] = handler;
            arguments.length = arguments.length || 1;
            _defer_1.default.apply(undefined, arguments);
        }
    };
}
var _callbackWithFlatten = function (context, index) {
    return function _ondone(err) {
        var args = arguments;
        if (err) {
            context.next.apply(undefined, args);
        }
        else {
            context.results[index + 1] = args.length <= 2 ?
                args[1] : Array.prototype.slice.call(args, 1);
            context.finished++;
            if (context.finished === context.handlers.length) {
                context.next.apply(undefined, context.results);
            }
        }
    };
};
/**
* ```javascript
*   let InParallel = require('callback-patterns/InParallel');
*
*   let task = InParallel.Flatten(
*     function(next, ...args) {},
*     function(next, ...args) {},
*     ...
*   );
*
*   task(next, ...args);
* ```
* InParallel.Flatten is identical to InParallel, except tasks that return
* single results do not get autoboxed in arrays
*
* note: because the callbacks can return any number of results,
* the results from each task are autoboxed into an array.
* This includes an empty array for tasks that don't return results.
* @param {...CallbackTask} tasks - any number of tasks to run in parallel.
* @returns {CallbackTask} a wrapper function that runs the tasks in parallel
* @memberof callback-patterns.InParallel
* @example
* ```javascript
*   let InParallel = require('callback-patterns/InParallel');
*
*   let task = InParallel.Flatten(
*     (next) => next(),
*     (next) => next(null, 1),
*     (next) => next(null, 2, 3),
*   );
*
*   let onDone = (err, ...results) => console.log(results);
*
*   chain(onDone); // prints [ undefined, 1, [ 2, 3 ] ]
* ```
*/
function Flatten() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var handlers = arguments;
    if (handlers.length === 0) {
        return EMPTY;
    }
    for (var i = 0; i < handlers.length; i++) {
        handlers[i] = (0, _catchWrapper_1.default)(handlers[i]);
    }
    return function _inParallelFlattenInstance(_1) {
        var context = {
            next: (0, _onceWrapper_1.default)(_1),
            handlers: handlers,
            results: Array(handlers.length + 1),
            finished: 0,
        };
        for (var i = 0; i < handlers.length; i++) {
            // eslint-disable-next-line no-loop-func
            var onDone = _callbackWithFlatten(context, i);
            var handler = handlers[i]
                .bind(undefined, (0, _onceWrapper_1.default)(onDone));
            arguments[0] = handler;
            arguments.length = arguments.length || 1;
            _defer_1.default.apply(undefined, arguments);
        }
    };
}
InParallel.Flatten = Flatten;
module.exports = InParallel;
