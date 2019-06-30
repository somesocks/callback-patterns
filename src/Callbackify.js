
var _catchWrapper = require('./_catchWrapper');
var _onceWrapper = require('./_onceWrapper');
var PassThrough = require('./PassThrough');

/**
* Wraps around a promise generator function,
* to make it easier to integrate with task functions.
* @param {function} generator - a function that generates a promise from the args.
* @returns {CallbackTask} a task that wraps around the promise
* @memberof callback-patterns
* @example
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*   let Callbackify = require('callback-patterns/Callbackify');
*
*   let task = InSeries(
*     function(next, ...args) {...},
*     Callbackify(
*       (...args) => new Promise((resolve, reject) => resolve(...args))
*     ),
*     function(next, ...args) {},
*     ...
*   );
*
*   task(next, ...args);
* ```
*/
function Callbackify(promiseGenerator) {
	if (promiseGenerator == null) {
		return PassThrough;
	}

	var _callbackifyInstance = function _callbackifyInstance(_1) {
		var next = _onceWrapper(_1);
		var args = arguments;

		args.length--;
		for (var i = 0; i < args.length; i++) {
			args[i] = args[i+1];
		}

		var promise = promiseGenerator.apply(null, args);
		promise = promise instanceof Promise ?
			promise: Promise.resolve(promise);

		var resolve = next.bind(null, null);
		var reject = next;

		return promise
			.then(resolve, reject);
	};

	return _catchWrapper(_callbackifyInstance);
}

module.exports = Callbackify;
