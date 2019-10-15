import Task from './types/Task';
/**
* TimeIn wraps a single task function, and returns a function that only returns after X ms.
*
* @param {CallbackTask} task - the task to wrap in a timeout.
* @param {number} ms - the timein in ms.
* @returns {CallbackTask} a task
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
declare function TimeIn(_1?: Task, _2?: number): Task;
export = TimeIn;
