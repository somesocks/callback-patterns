
type Callback = (err : Error | null | undefined, ...res : any[]) => void;

type CallbackTask = (next : Callback, ...args: any[]) => void;

/**
* Sometimes, you need to pass previous arguments along with a new result.  The easiest way to do this is to use PassThrough, which is a convenience method for:
* ```javascript
*  (next, ...args) => next(null, ...args),
* ```
* @memberof callback-patterns
* @example
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*   let Logging = require('callback-patterns/Logging');
*   let PassThrough = require('callback-patterns/PassThrough');
*
*   let task = InSeries(
*     (next) => next(null, 1, 2, 3, 4, 5, 6),
*			Logging((...args) => args), // logs [1, 2, 3, 4, 5, 6]
*     PassThrough,
*			Logging((...args) => args), // logs [2, 3, 4, 5, 6, 7]
*     ...
*   );
*
*   task(next, ...args);
* ```
*/
declare function PassThrough(next ?: Callback, ...args: any[]) : void;

export default PassThrough;
