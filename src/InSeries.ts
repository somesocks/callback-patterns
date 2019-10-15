
// import Callback from './types/Callback';
import Task from './types/Task';

import defer from './_defer';
import onceWrapper from './_onceWrapper';
import catchWrapper from './_catchWrapper';
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

	for (var i = 0; i < handlers.length; i++) {
		handlers[i] = catchWrapper(handlers[i]);
	}

	return function _inSeriesInstance(_1) {
		var next = onceWrapper(_1);
		var index = 0;

		var worker = function () {
			if (arguments[0] != null) {
				next.apply(undefined, arguments as any);
			} else if (index >= handlers.length) {
				next.apply(undefined, arguments as any);
			} else {
				var handler = handlers[index++]
					.bind(undefined, onceWrapper(worker));

				arguments[0] = handler;
				arguments.length = arguments.length || 1;
				defer.apply(undefined, arguments);
			}
		};

		arguments[0] = undefined;
		worker.apply(undefined, arguments as any);
	};

};

export = InSeries;