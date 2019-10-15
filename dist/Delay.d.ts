import Task from './types/Task';
/**
* Delay acts like `PassThrough`, but inserts a delay in the call.
* @param {number} delay - The time to delay, in ms.
* @returns {CallbackTask} a delay task
* @memberof callback-patterns
* @example
* ```javascript
*   let Delay = require('callback-patterns/Delay');
*   let InSeries = require('callback-patterns/InSeries');
*
*   let task = InSeries(
*     (next, num) => next(null, num),
*     Delay(100),
*     (next, num) => next(null, num + 1),
*   );
*
*   let onDone = (err, result) => console.log(err, result);
*
*   task(onDone, 1); // prints null 1, after a 100 ms delay
* ```
*/
declare function Delay(_1?: number): Task;
export = Delay;
