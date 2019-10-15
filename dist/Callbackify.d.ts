import Task from './types/Task';
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
declare function Callbackify(promiseGenerator: any): Task;
export = Callbackify;
