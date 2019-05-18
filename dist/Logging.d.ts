
type validator = (...args : any[]) => boolean;

type message = ((...args : any[]) => string) | string;

type callback = (err ?: Error, ...res: any[]) => void;

type task = (next ?: callback, ...args: any[]) => void;

/**
* A logging utility.
* It passes the arguments received into all the statements, collects the results, and joins them together with newlines to build the final log statement
* @param {...function} statements - any number of logging values.  Functions are called with the calling arguments, everything else is passed directly to
* @returns {taskFunction} a logging task
* @memberof callback-patterns
* @example
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*   let Logging = require('callback-patterns/Logging');
*
*   let task = InSeries(
*     (next, ...args) => next(null, ...args),
*     Logging(
*       'log statement here'
*       (...args) => `args are ${args}`
*     ),
*     (next, ...args) => next(null, ...args),
*     ...
*   );
*
*   task(next, ...args);
* ```
*/
declare function Logging(...messages : message[]) : task;

export default Logging;
