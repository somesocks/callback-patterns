import Task from './types/Task';
/**
* TimeOut wraps a single task function, and returns a function that returns early if the task fails to complete before the timeout triggers.
*
* NOTE: the timeout being triggered will not cancel the original task.
*
* @param {CallbackTask} task - the task to wrap in a timeout.
* @param {number} ms - the timeout in ms.
* @returns {CallbackTask} a task
* @memberof callback-patterns
* @example
* ```javascript
*   let TimeOut = require('callback-patterns/TimeOut');
*
*   let chain = TimeOut(
*     function(next, ...args) {},
*			1000
*   );
*
*   chain(next, ...args);
* ```
*/
declare function TimeOut(_1?: Task, _2?: number): Task;
export = TimeOut;
