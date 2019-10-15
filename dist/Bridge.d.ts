import AsyncTask from './types/AsyncTask';
import Task from './types/Task';
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
declare function Bridge(task?: Task): Task | AsyncTask;
export = Bridge;
