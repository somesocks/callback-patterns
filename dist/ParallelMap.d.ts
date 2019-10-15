import Task from './types/Task';
/**
* Builds a task wrapper that asynchronously maps each of its arguments to a result.
* Note: even though the mapping function can return any number of results, ParallelMap only uses the first result
* @param {CallbackTask} task - an asynchronous mapping function.
* @returns {CallbackTask} a parallel map task
* @memberof callback-patterns
* @example
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*   let Logging = require('callback-patterns/Logging');
*   let ParallelMap = require('callback-patterns/ParallelMap');
*
*   let addOne = (next, val) => next(null, val + 1);
*
*   let task = InSeries(
*     (next) => next(null, 1, 2, 3, 4, 5, 6),
*     Logging((...args) => args), // logs [1, 2, 3, 4, 5, 6]
*     ParallelMap(addOne),
*     Logging((...args) => args), // logs [2, 3, 4, 5, 6, 7]
*     ...
*   );
*
*   task(next, ...args);
* ```
*/
declare function ParallelMap(_1: Task): Task;
export = ParallelMap;
