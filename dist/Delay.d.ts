
type validator = (...args : any[]) => boolean;

type message = ((...args : any[]) => string) | string;

type callback = (err ?: Error, ...res: any[]) => void;

type task = (next ?: callback, ...args: any[]) => void;

/**
* Delay acts like `PassThrough`, but inserts a delay in the call.
* @param {number} delay - The time to delay, in ms.
* @returns {taskFunction} a delay task
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
declare function Delay(ms : number) : task;

export default Delay;
