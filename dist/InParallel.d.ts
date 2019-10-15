import Task from './types/Task';
/**
* ```javascript
*   let InParallel = require('callback-patterns/InParallel');
*
*   let task = InParallel(
*     function(next, ...args) {},
*     function(next, ...args) {},
*     ...
*   );
*
*   task(next, ...args);
* ```
* InParallel accepts a number of functions, and returns a task function that executes all of its child tasks in parallel.
*
* note: because the callbacks can return any number of results,
* the results from each task are autoboxed into an array.
* This includes an empty array for tasks that don't return results.
* @param {...CallbackTask} tasks - any number of tasks to run in parallel.
* @returns {CallbackTask} a wrapper function that runs the tasks in parallel
* @memberof callback-patterns
* @example
* ```javascript
*   let InParallel = require('callback-patterns/InParallel');
*
*   let task = InParallel(
*     (next) => next(null, 1),
*     (next) => next(null, 2),
*     (next) => next(null, 3, 4),
*   );
*
*   let onDone = (err, ...results) => console.log(results);
*
*   chain(onDone); // prints [ [ 1 ], [ 2 ], [ 3, 4 ] ]
* ```
*/
declare function InParallel(...args: Task[]): Task;
declare namespace InParallel {
    var Flatten: (...args: Task[]) => Task;
}
export = InParallel;
