
type validator = (...args : any[]) => boolean;

type message = ((...args : any[]) => string) | string;

type callback = (err ?: Error, ...res: any[]) => void;

type task = (next ?: callback, ...args: any[]) => void;

/**
* `If` accepts up to three tasks,
* an 'if' task, a 'then' task, and lastly an 'else' task
* note: by default, the ifTask, thenTask, and elseTask are PassThrough
* note: the ifTask can return multiple results,
* but only the first is checked for truthiness
* @param {taskFunction} ifTask - a condition task.
* @param {taskFunction} thenTask - a task to run when ifTask returns a truthy value.
* @param {taskFunction} elseTask - a task to run when ifTask returns a falsy value.
* @returns {taskFunction}
* @memberof callback-patterns
* @example
* ```javascript
*   let If = require('callback-patterns/If');
*
*   let logIfEven = If(
*     (next, num) => next(null, num % 2 === 0)
*     (next, num) => { console.log('is even!'); next(null, num); },
*     (next, num) => { console.log('is not even!'); next(null, num); },
*   );
*
*   let onDone = (err, ...results) => console.log(results);
*
*   logIfEven(null, 1); // prints out 'is not even!' eventually
*   logIfEven(null, 2); // prints out 'is even!' eventually
* ```
*/
declare function If(_if : task, _then : task, _else ?: task) : task;

export default If;
