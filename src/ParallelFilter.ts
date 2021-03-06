
// import Callback from './types/Callback';
import Task from './types/Task';

import _catchWrapper from './_catchWrapper';
import _defer from './_defer';
import _nullCallback from './_nullCallback';
import _onceWrapper from './_onceWrapper';

import PassThrough from './PassThrough';

var FILTER_SINGLETON = {}; // a singleton to choose which results to filter

var _callbackBuilder = function (context, index) {
	return function _ondone(err, res) {
		var args = arguments;
		if (err) {
			context.next.apply(undefined, args);
		} else {
			if (!res) {
				context.results[index + 1] = FILTER_SINGLETON;
			}
			context.done++;
			if (context.done === context.results.length - 1) {
				var results : any[] = [];
				results.push(null);
				for (var i = 1; i < context.results.length; i++) {
					var val = context.results[i];
					if (val !== FILTER_SINGLETON) { results.push(val); }
				}
				context.next.apply(undefined, results);
			}
		}
	};
};

/**
* Builds a task that filters all of its arguments in parallel, and returns the results
* @param {CallbackTask} filter - an asynchronous filter function that returns true or false through its callback.
* @returns {CallbackTask} a filtering task
* @memberof callback-patterns
* @example
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*   let Logging = require('callback-patterns/Logging');
*   let ParallelFilter = require('callback-patterns/ParallelFilter');
*
*   let isEven = (next, val) => next(null, val % 2 === 0);
*
*   let task = InSeries(
*     (next) => next(null, 1, 2, 3, 4, 5, 6),
*     Logging((...args) => args), // logs [1, 2, 3, 4, 5, 6]
*     ParallelFilter(isEven),
*     Logging((...args) => args), // logs [2, 4, 6]
*     ...
*   );
*
*   task(next, ...args);
* ```
*/
function ParallelFilter(_1 : Task) : Task {
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
		if (arguments.length == 1) { _defer(next); return; }

		for (var i = 1; i < arguments.length; i++) {
			// eslint-disable-next-line no-loop-func
			var onDone = _callbackBuilder(context, i - 1);
			onDone = _onceWrapper(onDone);

			var handler = mapper.bind(null, onDone, arguments[i], i - 1);

			_defer(handler);
		}
	};
}

export = ParallelFilter;
