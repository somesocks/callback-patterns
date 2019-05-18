
type validator = (...args : any[]) => boolean;

type message = ((...args : any[]) => string) | string;

type callback = (err ?: Error, ...res: any[]) => void;

type task = (next ?: callback, ...args: any[]) => void;

/**
* Race accepts a number of functions, and returns a task function that executes all of its child tasks simultaneously.  The first result (or error) is returned, and the remaining results (or errors) are ignored.
*
* @param {...taskFunction} tasks - any number of tasks to run in parallel.
* @returns {taskFunction} a task
* @memberof callback-patterns
* @example
* ```javascript
*   let Race = require('callback-patterns/Race');
*
*   let task = Race(
*     (next) => next(null, 1),
*     (next) => setTimeout(next, 100, null, 2),
*     (next) => { throw new Error(); } ,
*   );
*
*   let onDone = (err, ...results) => console.log(results);
*
*   task(onDone); // prints out [ 1 ], eventually
* ```
*/
declare function Race(...tasks: task[]) : task;

export default Race;
