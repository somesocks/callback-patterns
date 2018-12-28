
var _catchWrapper = require('./_catchWrapper');
var PassThrough = require('./PassThrough');

/**
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*   let Promisify = require('callback-patterns/Promisify');
*
*   let task = Promisify(
*     InSeries(
*       function(next, ...args) {...},
*       function(next, ...args) {...},
*       ...
*     )
*   );
*
*  task()
*    .then()
*    ...
*
* ```
*
* Wraps around a task function and greates a promise generator,
* to make it easier to integrate task functions and promises.
*
* NOTE: callback-patterns does not come bundled with a promise library,
* it expects Promise to already exists in the global namespace.
*
* NOTE: even though callback-patterns can 'return' multiple values through the next callback,
* Promisify always resolves to the first result returned.
*
* @param {function} task - a function that generates a promise from the args.
* @returns {function} a function that generates a Promise when called
* @memberof callback-patterns
*/
function Promisify(_1) {
	var task = _1 != null ? _catchWrapper(_1) : PassThrough;

	var _promisifyInstance = function _promisifyInstance() {
		var args = arguments;

		var handler = function (resolve, reject) {
			var callback = function (err, result) {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			};

			args[0] = callback;
			task.apply(null, args);
		};

		return new Promise(handler);
	};

	return _promisifyInstance;
}


Promisify.default = Promisify;

module.exports = Promisify;
