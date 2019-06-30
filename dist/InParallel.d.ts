
type Callback = (err ?: Error | null | undefined, ...res : any[]) => void;

type CallbackTask = (next : Callback, ...args: any[]) => void;

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
declare function InParallel(...tasks: CallbackTask[]) : CallbackTask;

declare namespace InParallel {

	/**
	* ```javascript
	*   let InParallel = require('callback-patterns/InParallel');
	*
	*   let task = InParallel.Flatten(
	*     function(next, ...args) {},
	*     function(next, ...args) {},
	*     ...
	*   );
	*
	*   task(next, ...args);
	* ```
	* InParallel.Flatten is identical to InParallel, except tasks that return
	* single results do not get autoboxed in arrays
	*
	* note: because the callbacks can return any number of results,
	* the results from each task are autoboxed into an array.
	* This includes an empty array for tasks that don't return results.
	* @param {...CallbackTask} tasks - any number of tasks to run in parallel.
	* @returns {CallbackTask} a wrapper function that runs the tasks in parallel
	* @memberof callback-patterns.InParallel
	* @example
	* ```javascript
	*   let InParallel = require('callback-patterns/InParallel');
	*
	*   let task = InParallel.Flatten(
	*     (next) => next(),
	*     (next) => next(null, 1),
	*     (next) => next(null, 2, 3),
	*   );
	*
	*   let onDone = (err, ...results) => console.log(results);
	*
	*   chain(onDone); // prints [ undefined, 1, [ 2, 3 ] ]
	* ```
	*/
	function Flatten(...tasks: CallbackTask[]) : CallbackTask;

}

export default InParallel;
