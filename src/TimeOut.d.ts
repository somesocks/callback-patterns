
type validator = (...args : any[]) => boolean;

type message = ((...args : any[]) => string) | string;

type callback = (err ?: Error, ...res: any[]) => void;

type task = (next ?: callback, ...args: any[]) => void;

/**
* TimeOut wraps a single task function, and returns a function that returns early if the task fails to complete before the timeout triggers.
*
* NOTE: the timeout being triggered will not cancel the original task.
*
* @param {taskFunction} task - the task to wrap in a timeout.
* @param {number} ms - the timeout in ms.
* @returns {taskFunction} a task
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
declare function TimeOut(task: task, ms ?: number) : task;

export default TimeOut;
