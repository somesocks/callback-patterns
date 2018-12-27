
var _catchWrapper = require('./_catchWrapper');
var _defer = require('./_defer');
var _nullCallback = require('./_nullCallback');
var _onceWrapper = require('./_onceWrapper');


var EMPTY = function (next) { return (next || _nullCallback)(); };

var _callbackBuilder = function (context, index) {
	return function _ondone(err) {
		var args = arguments;
		if (err) {
			context.next.apply(undefined, args);
		} else {
			context.results[index + 1] = Array.prototype.slice.call(args, 1);
			context.done++;
			if (context.done === context.handlers.length) {
				context.next.apply(undefined, context.results);
			}
		}
	};
};

/**
* ```javascript
*   const InParallel = require('callback-patterns/InParallel');
*
*   let task = InParallel(
*     function(next, ...args) {},
*     function(next, ...args) {},
*     ...
*   );
*
*   task(next, ...args);
* ```
* InParallel accepts a number of functions, and returns a task function that executes all of its child tasks in parallel.
*
* ```javascript
*   const InParallel = require('callback-patterns/InParallel');
*
*   let task = InParallel(
*     (next) => next(null, 1),
*     (next) => next(null, 2),
*     (next) => next(null, 3, 4),
*   );
*
*   let onDone = (err, ...results) => console.log(results);
*
*   chain(onDone); // prints out [ 1 ] [ 2 ] [ 3, 4 ], eventually
* ```
* note: because the callbacks can return any number of results,
* the results from each task are autoboxed into an array.
* This includes an empty array for tasks that don't return results.
* @param {...taskFunction} tasks - any number of tasks to run in parallel.
* @returns {taskFunction} a wrapper function that runs the tasks in parallel
* @memberof callback-patterns
*/
function InParallel() {
	var handlers = arguments;

	if (handlers.length === 0) {
		return EMPTY;
	}

	return function _inParallelInstance(_1) {
		var args = arguments;
		var next = _onceWrapper(_1);

		var context = {
			next: _onceWrapper(next),
			handlers: handlers,
			results: Array(handlers.length + 1),
			done: 0,
		};

		for (var i = 0; i < handlers.length; i++) {
			// eslint-disable-next-line no-loop-func
			var onDone = _callbackBuilder(context, i);

			var handler = _catchWrapper(handlers[i])
				.bind(undefined, _onceWrapper(onDone));

			args[0] = handler;
			args.length = args.length > 1 ? args.length : 1;

			_defer.apply(undefined, args);
		}
	};
}


InParallel.default = InParallel;

module.exports = InParallel;
