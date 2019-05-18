
type validator = (...args : any[]) => boolean;

type message = ((...args : any[]) => string) | string;

type callback = (err ?: Error, ...res: any[]) => void;

type task = (next ?: callback, ...args: any[]) => void;

/**
* TraceError is an experimental wrapper that attempts to make errors more informative.
* It does this by appending extra information to the stack of any error thrown in the task.
*
* NOTE: TraceError is marked as 'unstable' as stack traces in JS are not standardized,
* so it may not always provide useful information.
*
* @param {taskFunction} task - a task function to wrap
* @returns {taskFunction} a wrapper function that modifies the stack trace of any errors thrown within
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
declare function TraceError(task : task) : task;

export default TraceError;
