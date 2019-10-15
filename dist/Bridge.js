"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _catchWrapper_1 = __importDefault(require("./_catchWrapper"));
var PassThrough_1 = __importDefault(require("./PassThrough"));
var Promisify_1 = __importDefault(require("./Promisify"));
/**
* Wraps around a callback-driven function,
* and returns a function that can be called either with a callback,
* or as an async function that returns a promise.
* This makes it easier to bridge the gap between callback-driven code and promise-driven code
*
* NOTE: Bridge works by checking if the first argument is a function, and assuming its a callback if so.
* You should take care to not use the Bridge wrapper if your task expects the first argument to be a function.
*
* @param {function} task - a callback-driven task.
* @returns {function} a task that can either be passed a callback, or awaited
* @memberof callback-patterns
* @example
* ```javascript
*
*   let InSeries = require('callback-patterns/InSeries');
*   let Bridge = require('callback-patterns/Bridge');
*
*   let task = Bridge(
*     function(next, ...args) {...},
*   );
*
*   task(next, ...args); // this works
*
*   task(...args).then(...); // this works too
*
* ```
*/
function Bridge(task) {
    task = task || PassThrough_1.default;
    var callbackForm = _catchWrapper_1.default(task);
    var promiseForm = Promisify_1.default(callbackForm);
    var _bridgeInstance = function _bridgeInstance(_1) {
        if (typeof _1 === 'function') { // callback mode
            // eslint-disable-next-line no-invalid-this
            return callbackForm.apply(this, arguments);
        }
        else { // promise mode
            // eslint-disable-next-line no-invalid-this
            return promiseForm.apply(this, arguments);
        }
    };
    return _bridgeInstance;
}
module.exports = Bridge;
