/* eslint-env node */

var defer = require('./_defer');
var onceWrapper = require('./_onceWrapper');
var catchWrapper = require('./_catchWrapper');
var nullCallback = require('./_nullCallback');

var EMPTY = function (next) { return (next || nullCallback)(); };

/**
* ```javascript
*   let InOrder = require('callback-patterns/InOrder');
*
*   let task = InOrder(
*     function(next, ...args) {},
*     function(next, ...args) {},
*     ...
*   );
*
*   task(next, ...args);
* ```
* Runs several asynchronous tasks one after another.
* Each task gets the arguments that were originally passed into the wrapper.
* This is different from InSeries, where the output of each is task is passed as the input to the next.
* ```javascript
*   const InOrder = require('callback-patterns/InOrder');
*
*   const task = InOrder(
*     (next, a) => { a.val = 1; console.log(a.val); next();}
*     (next, a) => { a.val = 2; console.log(a.val); next();}
*     (next, a) => { a.val = 3; console.log(a.val); next();}
*   )(null, {}); // prints out 1 2 3, eventually
```
* @param {...taskFunction} tasks - any number of tasks to run in order.
* @returns {taskFunction} a wrapper function that runs the tasks in order
* @memberof callback-patterns
*/
var InOrder = function InOrder() {
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

		var worker = function (err) {
			if (err != null) {
				next.apply(undefined, arguments);
			} else if (index >= handlers.length) {
				args[0] = undefined;
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

InOrder.default = InOrder;

module.exports = InOrder;
