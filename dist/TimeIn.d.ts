
type validator = (...args : any[]) => boolean;

type message = ((...args : any[]) => string) | string;

type callback = (err ?: Error, ...res: any[]) => void;

type task = (next ?: callback, ...args: any[]) => void;

/**
* TimeIn wraps a single task function, and returns a function that only returns after X ms.
*
* @param {taskFunction} task - the task to wrap in a timeout.
* @param {number} ms - the timein in ms.
* @returns {taskFunction} a task
* @memberof callback-patterns
* @example
* ```javascript
*   let TimeIn = require('callback-patterns/TimeIn');
*
*   let task = TimeIn(
*     function(next, ...args) {},
*			1000
*   );
*
*   task(next, ...args);
* ```
*/
declare function TimeIn(task: task, ms ?: number) : task;

export default TimeIn;
