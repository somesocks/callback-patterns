
type Callback = (err ?: Error | null | undefined, ...res : any[]) => void;

type CallbackTask = (next : Callback, ...args: any[]) => void;

/**
* While accepts two tasks and returns a task that conditionally executes some number of times.
* @param {function} conditionTask - a condition task.
* @param {function} loopTask - a task to run if the condition returns a truthy value.
* @returns {function}
* @memberof callback-patterns
* @example
* ```javascript
*   let While = require('callback-patterns/While');
*
*   let task = While(
*     (next, num) => next(null, num < 10),
*     (next, num) => next(null, num + 1),
*   );
*
*   let onDone = (err, result) => console.log(result);
*
*   task(onDone, 1); // prints 9, eventually
* ```
*/
declare function While(_if : CallbackTask, _then : CallbackTask) : CallbackTask;

export default While;
