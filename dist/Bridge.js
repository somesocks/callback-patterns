
var _catchWrapper = require('./_catchWrapper');
var _onceWrapper = require('./_onceWrapper');
var PassThrough = require('./PassThrough');
var Promisify = require('./Promisify');

/**
* Wraps around a callback-driven function,
* and returns a function that can be called either with a callback,
* or as an async function that returns a promise.
* This makes it easier to bridge the gap between callback-driven code and promise-driven code
*
* @param {function} task - a callback-driven task.
* @returns {function} a task that can either be passed a callback, or awaited
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
function Bridge(task) {
	task = task || PassThrough;
	var callbackForm = _catchWrapper(task);
	var promiseForm = Promisify(callbackForm);

	var _bridgeInstance = function _bridgeInstance(_1) {
		if (typeof _1 === 'function') { // callback mode
			// eslint-disable-next-line no-invalid-this
			return callbackForm.apply(this, arguments);
		} else { // promise mode
			// eslint-disable-next-line no-invalid-this
			return promiseForm.apply(this, arguments);
		}
	};

	return _bridgeInstance;
}

module.exports = Bridge;
