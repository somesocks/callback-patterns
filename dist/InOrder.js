"use strict";
/* eslint-env node */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _defer_1 = __importDefault(require("./_defer"));
var _onceWrapper_1 = __importDefault(require("./_onceWrapper"));
var _nullCallback_1 = __importDefault(require("./_nullCallback"));
var EMPTY = function (next) { return (next || _nullCallback_1.default)(); };
/**
* ```javascript
*   let InOrder = require('callback-patterns/InOrder');
*
*   let task = InOrder(
*     function(next, ...args) {},
*     function(next, ...args) {},
*     ...
*   );
*
*   task(next, ...args);
* ```
* Runs several asynchronous tasks one after another.
* Each task gets the arguments that were originally passed into the wrapper.
* This is different from InSeries, where the output of each is task is passed as the input to the next.
* ```javascript
*   const InOrder = require('callback-patterns/InOrder');
*
*   const task = InOrder(
*     (next, a) => { a.val = 1; console.log(a.val); next();}
*     (next, a) => { a.val = 2; console.log(a.val); next();}
*     (next, a) => { a.val = 3; console.log(a.val); next();}
*   )(null, {}); // prints out 1 2 3, eventually
```
* @param {...CallbackTask} tasks - any number of tasks to run in order.
* @returns {CallbackTask} a wrapper function that runs the tasks in order
* @memberof callback-patterns
*/
var InOrder = function InOrder() {
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
    return function _inOrderInstance(next) {
        if (next === void 0) { next = _nullCallback_1.default; }
        var index = 0;
        var args = arguments;
        var _execute = function () {
            // console.log('_execute', index, handlers.length);
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
                args[0] = undefined;
                next.apply(undefined, args);
            }
            else {
                var _next = (0, _onceWrapper_1.default)(_prepare);
                // var _next = _prepare;
                args[0] = _next;
                args.length = args.length || 1;
                (0, _defer_1.default)(_execute);
            }
        };
        arguments[0] = undefined;
        _prepare.apply(undefined, arguments);
    };
};
module.exports = InOrder;
