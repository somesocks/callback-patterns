
var _catchWrapper = require('./_catchWrapper');
var _onceWrapper = require('./_onceWrapper');
var _nullCallback = require('./_nullCallback');
var _defer = require('./_defer');

var PassThrough = require('./PassThrough');

var DEFAULT_KEY_FUNCTION = function () {
	var args = Array.prototype.slice.call(arguments);
	return JSON.stringify(args);
};

/**
* ```javascript
*
*   let Delay = require('callback-patterns/Delay');
*   let InOrder = require('callback-patterns/InOrder');
*   let InSeries = require('callback-patterns/InSeries');
*   let Memoize = require('callback-patterns/Memoize');
*
*   let slowTask = InSeries(
*     (next, i) => {
*       console.log('task called with ', i);
*       next(null, i + 1);
*     },
*     Delay(1000)
*   );
*
*   let memoizedTask = Memoize(slowTask);
*
*   let test = InOrder(
*     memoizedTask,
*     memoizedTask,
*     memoizedTask
*   );
*
*
*   test(null, 1); // task is only called once, even though memoizedTask is called three times
*
* ```
*
* Memoize builds a wrapper function that caches results of previous executions.
* As a result, repeated calls to Memoize may be much faster, if the request hits the cache.
*
* NOTE: As of now, there are no cache eviction mechanisms.
*   You should try to use Memoized functions in a 'disposable' way as a result
*
* NOTE: Memoize is not 'thread-safe' currently.  If two calls are made for the same object currently,
*   two calls to the wrapped function will be made
*
* NOTE: Memoize will cache errors as well as results.
*
* @param {taskFunction} taskFunction - the task function to memoize.
* @param {function=} keyFunction - a function that synchronously generates a key for a request.
* @param {object=} cache - a pre-filled cache to use
* @returns {taskFunction}
* @memberof callback-patterns
*/
function Memoize(_1, _2, _3) {
	var task = _1 != null ? _catchWrapper(_1) : PassThrough;
	var keyFunction = _2 || DEFAULT_KEY_FUNCTION;
	var cache = _3 || {};

	return function _memoizeInstance(_1) {
		var next = _onceWrapper(_1 || _nullCallback);
		var args = arguments;

		args[0] = undefined;
		var key = keyFunction.call.apply(keyFunction, args);

		if (cache.hasOwnProperty(key)) {
			var results = cache[key];

			next.apply(undefined, results);
		} else {
			args[0] = function onResult() {
				cache[key] = arguments;
				next.apply(undefined, arguments);
			};

			task.apply(undefined, args);
		}
	};
}


Memoize.default = Memoize;

module.exports = Memoize;
