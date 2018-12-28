
var _catchWrapper = require('./_catchWrapper');
var _defer = require('./_defer');
var _nullCallback = require('./_nullCallback');
var _onceWrapper = require('./_onceWrapper');

var PassThrough = require('./PassThrough');

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
				var results = [];
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
* @param {taskFunction} filter - an asynchronous filter function that returns true or false through its callback.
* @returns {taskFunction} a filtering task
* @memberof callback-patterns
*/
function ParallelFilter(_1) {
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


ParallelFilter.default = ParallelFilter;

module.exports = ParallelFilter;
