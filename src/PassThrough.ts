
// import Callback from './types/Callback';
import Task from './types/Task';

import _nullCallback from './_nullCallback';

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
const PassThrough : Task = function PassThrough(_1) {
	var next = _1 || _nullCallback;
	arguments[0] = undefined;
	next.apply(undefined, arguments as any);
}

export = PassThrough;
