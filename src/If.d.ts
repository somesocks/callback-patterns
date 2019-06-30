
type Callback = (err : Error | null | undefined, ...res : any[]) => void;

type CallbackTask = (next : Callback, ...args: any[]) => void;

/**
* `If` accepts up to three tasks,
* an 'if' task, a 'then' task, and lastly an 'else' task
* note: by default, the ifTask, thenTask, and elseTask are PassThrough
* note: the ifTask can return multiple results,
* but only the first is checked for truthiness
* @param {CallbackTask} _if - a condition task.
* @param {CallbackTask} _then - a task to run when ifTask returns a truthy value.
* @param {CallbackTask} _else - a task to run when ifTask returns a falsy value.
* @returns {CallbackTask}
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
declare function If(_if : CallbackTask, _then ?: CallbackTask, _else ?: CallbackTask) : CallbackTask;

export default If;
