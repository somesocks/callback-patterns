
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
* NOTE: Bridge works by checking if the first argument is a function, and assuming its a callback if so.
* You should take care to not use the Bridge wrapper if your task expects the first argument to be a function.
*
* @param {function} task - a callback-driven task.
* @returns {function} a task that can either be passed a callback, or awaited
* @memberof callback-patterns
* @example
* ```javascript
*
*   let InSeries = require('callback-patterns/InSeries');
*   let Bridge = require('callback-patterns/Bridge');
*
*   let task = Bridge(
*     function(next, ...args) {...},
*   );
*
*   task(next, ...args); // this works
*
*   task(...args).then(...); // this works too
*
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
