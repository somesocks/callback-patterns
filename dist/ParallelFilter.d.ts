
type Callback = (err ?: Error | null | undefined, ...res : any[]) => void;

type CallbackTask = (next : Callback, ...args: any[]) => void;

/**
* Builds a task that filters all of its arguments in parallel, and returns the results
* @param {CallbackTask} filter - an asynchronous filter function that returns true or false through its callback.
* @returns {CallbackTask} a filtering task
* @memberof callback-patterns
* @example
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*   let Logging = require('callback-patterns/Logging');
*   let ParallelFilter = require('callback-patterns/ParallelFilter');
*
*   let isEven = (next, val) => next(null, val % 2 === 0);
*
*   let task = InSeries(
*     (next) => next(null, 1, 2, 3, 4, 5, 6),
*     Logging((...args) => args), // logs [1, 2, 3, 4, 5, 6]
*     ParallelFilter(isEven),
*     Logging((...args) => args), // logs [2, 4, 6]
*     ...
*   );
*
*   task(next, ...args);
* ```
*/
declare function ParallelFilter(filter : CallbackTask) : CallbackTask;

export default ParallelFilter;
