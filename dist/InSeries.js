"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _defer_1 = __importDefault(require("./_defer"));
var _onceWrapper_1 = __importDefault(require("./_onceWrapper"));
var _nullCallback_1 = __importDefault(require("./_nullCallback"));
var EMPTY = function (next) { return (next || _nullCallback_1.default)(); };
/**
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*
*   let task = InSeries(
*     function(next, ...args) {},
*     function(next, ...args) {},
*     ...
*   );
*
*   task(next, ...args);
* ```
* Runs several tasks in series, and passes the results from one down to the next.
* This works similarly to the 'waterfall' method in caolan's async.
* @param {...CallbackTask} tasks - any number of tasks to run in series.
* @returns {CallbackTask} a wrapper function that runs the tasks in series
* @memberof callback-patterns
* @example
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*
*   let chain = InSeries(
*     (next) => { console.log(1); next();}
*     InSeries(
*       (next) => { console.log(2); next();}
*       (next) => { console.log(3); next();}
*     ),
*     InSeries(
*       (next) => { console.log(4); next();}
*       (next) => { console.log(5); next();}
*     )
*   )(); // prints out 1 2 3 4 5, eventually
```
*/
var InSeries = function InSeries() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var handlers = arguments;
    if (handlers.length === 0) {
        return EMPTY;
    }
    // for (var i = 0; i < handlers.length; i++) {
    // 	handlers[i] = catchWrapper(handlers[i]);
    // }
    return function _inSeriesInstance(next) {
        if (next === void 0) { next = _nullCallback_1.default; }
        var index = 0;
        var args = arguments;
        var _execute = function () {
            // console.log('_pre', index, handlers.length);
            var _handler = handlers[index++];
            try {
                _handler.apply(undefined, args);
            }
            catch (err) {
                args[0](err);
            }
        };
        var _prepare = function (err) {
            if (err != null) {
                next.apply(undefined, arguments);
            }
            else if (index >= handlers.length) {
                next.apply(undefined, arguments);
            }
            else {
                var _next = (0, _onceWrapper_1.default)(_prepare);
                // var _next = _prepare;
                arguments[0] = _next;
                arguments.length = arguments.length || 1;
                args = arguments;
                (0, _defer_1.default)(_execute);
            }
        };
        arguments[0] = undefined;
        _prepare.apply(undefined, arguments);
    };
};
module.exports = InSeries;
