"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _catchWrapper_1 = __importDefault(require("./_catchWrapper"));
var _defer_1 = __importDefault(require("./_defer"));
var _onceWrapper_1 = __importDefault(require("./_onceWrapper"));
var PassThrough_1 = __importDefault(require("./PassThrough"));
var FILTER_SINGLETON = {}; // a singleton to choose which results to filter
var _callbackBuilder = function (context, index) {
    return function _ondone(err, res) {
        var args = arguments;
        if (err) {
            context.next.apply(undefined, args);
        }
        else {
            if (!res) {
                context.results[index + 1] = FILTER_SINGLETON;
            }
            context.done++;
            if (context.done === context.results.length - 1) {
                var results = [];
                results.push(null);
                for (var i = 1; i < context.results.length; i++) {
                    var val = context.results[i];
                    if (val !== FILTER_SINGLETON) {
                        results.push(val);
                    }
                }
                context.next.apply(undefined, results);
            }
        }
    };
};
/**
* Builds a task that filters all of its arguments in parallel, and returns the results
* @param {CallbackTask} filter - an asynchronous filter function that returns true or false through its callback.
* @returns {CallbackTask} a filtering task
* @memberof callback-patterns
* @example
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*   let Logging = require('callback-patterns/Logging');
*   let ParallelFilter = require('callback-patterns/ParallelFilter');
*
*   let isEven = (next, val) => next(null, val % 2 === 0);
*
*   let task = InSeries(
*     (next) => next(null, 1, 2, 3, 4, 5, 6),
*     Logging((...args) => args), // logs [1, 2, 3, 4, 5, 6]
*     ParallelFilter(isEven),
*     Logging((...args) => args), // logs [2, 4, 6]
*     ...
*   );
*
*   task(next, ...args);
* ```
*/
function ParallelFilter(_1) {
    var mapper = _1 != null ? (0, _catchWrapper_1.default)(_1) : PassThrough_1.default;
    return function _inParallelInstance(_1) {
        var args = arguments;
        var next = (0, _onceWrapper_1.default)(_1);
        var context = {
            next: (0, _onceWrapper_1.default)(next),
            results: args,
            done: 0,
        };
        // no arguments, just return
        if (arguments.length == 1) {
            (0, _defer_1.default)(next);
            return;
        }
        for (var i = 1; i < arguments.length; i++) {
            // eslint-disable-next-line no-loop-func
            var onDone = _callbackBuilder(context, i - 1);
            onDone = (0, _onceWrapper_1.default)(onDone);
            var handler = mapper.bind(null, onDone, arguments[i], i - 1);
            (0, _defer_1.default)(handler);
        }
    };
}
module.exports = ParallelFilter;
