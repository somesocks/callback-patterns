"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _catchWrapper_1 = __importDefault(require("./_catchWrapper"));
var _onceWrapper_1 = __importDefault(require("./_onceWrapper"));
var PassThrough_1 = __importDefault(require("./PassThrough"));
/**
* Wraps around a promise generator function,
* to make it easier to integrate with task functions.
* @param {function} generator - a function that generates a promise from the args.
* @returns {CallbackTask} a task that wraps around the promise
* @memberof callback-patterns
* @example
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*   let Callbackify = require('callback-patterns/Callbackify');
*
*   let task = InSeries(
*     function(next, ...args) {...},
*     Callbackify(
*       (...args) => new Promise((resolve, reject) => resolve(...args))
*     ),
*     function(next, ...args) {},
*     ...
*   );
*
*   task(next, ...args);
* ```
*/
function Callbackify(promiseGenerator) {
    if (promiseGenerator == null) {
        return PassThrough_1.default;
    }
    var _callbackifyInstance = function _callbackifyInstance(_1) {
        var next = (0, _onceWrapper_1.default)(_1);
        var args = arguments;
        args.length--;
        for (var i = 0; i < args.length; i++) {
            args[i] = args[i + 1];
        }
        var promise = promiseGenerator.apply(null, args);
        promise = promise instanceof Promise ?
            promise : Promise.resolve(promise);
        var resolve = next.bind(null, null);
        var reject = next;
        return promise
            .then(resolve, reject);
    };
    return (0, _catchWrapper_1.default)(_callbackifyInstance);
}
module.exports = Callbackify;
