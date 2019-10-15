
// import Callback from './types/Callback';
import Task from './types/Task';

import _catchWrapper from './_catchWrapper';
import _defer from './_defer';
import _nullCallback from './_nullCallback';
import _onceWrapper from './_onceWrapper';

import PassThrough from './PassThrough';


var _callbackBuilder = function (context, index) {
	return function _ondone(err, res) {
		var args = arguments;
		if (err) {
			context.next.apply(undefined, args);
		} else {
			context.results[index + 1] = res;
			context.done++;
			if (context.done === context.results.length - 1) {
				context.results[0] = null;
				context.next.apply(undefined, context.results);
			}
		}
	};
};

/**
* Builds a task wrapper that asynchronously maps each of its arguments to a result.
* Note: even though the mapping function can return any number of results, ParallelMap only uses the first result
* @param {CallbackTask} task - an asynchronous mapping function.
* @returns {CallbackTask} a parallel map task
* @memberof callback-patterns
* @example
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*   let Logging = require('callback-patterns/Logging');
*   let ParallelMap = require('callback-patterns/ParallelMap');
*
*   let addOne = (next, val) => next(null, val + 1);
*
*   let task = InSeries(
*     (next) => next(null, 1, 2, 3, 4, 5, 6),
*     Logging((...args) => args), // logs [1, 2, 3, 4, 5, 6]
*     ParallelMap(addOne),
*     Logging((...args) => args), // logs [2, 3, 4, 5, 6, 7]
*     ...
*   );
*
*   task(next, ...args);
* ```
*/
function ParallelMap(_1 : Task) : Task {
	var mapper = _1 != null ? _catchWrapper(_1) : PassThrough;

	return function _inParallelInstance(_1) {
		var args = arguments;
		var next = _onceWrapper(_1);

		var context = {
			next: _onceWrapper(next),
			results: args,
			done: 0,
		};

		// no arguments, just return
		if (args.length == 1) { _defer(next); return; }

		for (var i = 1; i < arguments.length; i++) {
			// eslint-disable-next-line no-loop-func
			var onDone = _callbackBuilder(context, i - 1);
			onDone = _onceWrapper(onDone);

			var handler = mapper.bind(null, onDone, arguments[i], i - 1);

			_defer(handler);
		}
	};
}

export = ParallelMap;
