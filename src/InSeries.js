/* eslint-env node */

var defer = require('./_defer');
var onceWrapper = require('./_onceWrapper');
var catchWrapper = require('./_catchWrapper');
var nullCallback = require('./_nullCallback');

var EMPTY = function (next) { return (next || nullCallback)(); };

/**
* ```javascript
*   const InSeries = require('callback-patterns/InSeries');
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
* ```javascript
*   const InSeries = require('callback-patterns/InSeries');
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
* @param {...taskFunction} tasks - any number of tasks to run in series.
* @returns {taskFunction} a wrapper function that runs the tasks in series
* @memberof callback-patterns
*/
var InSeries = function InSeries() {
	var handlers = arguments;

	if (handlers.length === 0) {
		return EMPTY;
	}

	for (var i = 0; i < handlers.length; i++) {
		handlers[i] = catchWrapper(handlers[i]);
	}

	return function _inSeriesInstance(_1) {
		var args = arguments;
		var next = onceWrapper(_1);
		var index = 0;

		var worker = function () {
			var args = arguments;
			if (args[0] != null) {
				next.apply(undefined, args);
			} else if (index >= handlers.length) {
				next.apply(undefined, args);
			} else {
				var handler = handlers[index++]
					.bind(undefined, onceWrapper(worker));

				args[0] = handler;
				args.length = args.length || 1;
				defer.apply(undefined, args);
			}
		};

		args[0] = undefined;
		worker.apply(undefined, args);
	};

};

InSeries.default = InSeries;

module.exports = InSeries;
