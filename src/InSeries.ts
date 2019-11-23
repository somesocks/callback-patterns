
// import Callback from './types/Callback';
import Task from './types/Task';

import defer from './_defer';
import onceWrapper from './_onceWrapper';
import nullCallback from './_nullCallback';

var EMPTY = function (next) { return (next || nullCallback)(); };

/**
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*
*   let task = InSeries(
*     function(next, ...args) {},
*     function(next, ...args) {},
*     ...
*   );
*
*   task(next, ...args);
* ```
* Runs several tasks in series, and passes the results from one down to the next.
* This works similarly to the 'waterfall' method in caolan's async.
* @param {...CallbackTask} tasks - any number of tasks to run in series.
* @returns {CallbackTask} a wrapper function that runs the tasks in series
* @memberof callback-patterns
* @example
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*
*   let chain = InSeries(
*     (next) => { console.log(1); next();}
*     InSeries(
*       (next) => { console.log(2); next();}
*       (next) => { console.log(3); next();}
*     ),
*     InSeries(
*       (next) => { console.log(4); next();}
*       (next) => { console.log(5); next();}
*     )
*   )(); // prints out 1 2 3 4 5, eventually
```
*/
var InSeries = function InSeries(...args : Task[]) : Task {
	var handlers = arguments;

	if (handlers.length === 0) {
		return EMPTY;
	}

	// for (var i = 0; i < handlers.length; i++) {
	// 	handlers[i] = catchWrapper(handlers[i]);
	// }

	return function _inSeriesInstance(next = nullCallback) {
		var index = 0;

		var args = arguments;

		var _execute = function () {
			// console.log('_pre', index, handlers.length);
			var _handler = handlers[index++];
			try {
				_handler.apply(undefined, args);
			} catch (err) {
				args[0](err);
			}
		};

		var _prepare = function (err ?: any) {
			if (err != null) {
				next.apply(undefined, arguments as any);
			} else if (index >= handlers.length) {
				next.apply(undefined, arguments as any);
			} else {
				var _next = onceWrapper(_prepare);
				// var _next = _prepare;

				arguments[0] = _next;
				arguments.length = arguments.length || 1;
				args = arguments;

				defer(_execute);
			}
		};

		arguments[0] = undefined;
		_prepare.apply(undefined, arguments as any);
	};

};

export = InSeries;
