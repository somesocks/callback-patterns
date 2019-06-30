
type Callback = (err ?: Error | null | undefined, ...res : any[]) => void;

type CallbackTask = (next : Callback, ...args: any[]) => void;

/**
* Builds an assertion task.  When called,
* if the arguments do not match the validator functions,
* Assert passes an error to its callback.
* @param {function} validator - a function that checks the arguments.
* @param {string} message - an optional error message to throw if the assertion fails, or a message builder function.
* @returns {CallbackTask} an assertion task
* @memberof callback-patterns
* @example
* ```javascript
*   let Assert = require('callback-patterns/Assert');
*   let InSeries = require('callback-patterns/InSeries');
*
*   let task = InSeries(
*     (next, num) => next(null, num),
*     Assert(
*       (num) => (num >= 0),
*       (num) => `${num} is less than zero`
*     ),
*     (next, num) => next(null, num),
*   );
*
*   let onDone = (err, result) => console.log(err, result);
*
*   task(onDone, 1); // prints null 1, eventually
*   task(onDone, -1); // prints '-1 is less than zero', eventually
* ```
*/
declare function Background(task : CallbackTask) : CallbackTask;

export default Background;
