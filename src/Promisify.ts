
// import Callback from './types/Callback';
import Task from './types/Task';
import AsyncTask from './types/AsyncTask';

import _catchWrapper from './_catchWrapper';
import PassThrough from './PassThrough';

/**
* Wraps around a task function and greates a promise generator,
* to make it easier to integrate task functions and promises.
*
* NOTE: callback-patterns does not come bundled with a promise library,
* it expects Promise to already exists in the global namespace.
*
* NOTE: if a function 'returns' multiple values through the next callback,
* Promisify auto-boxes these into an array.
*
* @param {function} task - a function that generates a promise from the args.
* @returns {function} a function that generates a Promise when called
* @memberof callback-patterns
* @example
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
*/
function Promisify(_1 : Task) : AsyncTask {
	var task = _1 || PassThrough;

	var _promisifyInstance = function _promisifyInstance() {
		var args = arguments;

		var handler = function (resolve, reject) {
			var callback = function (err) {
				if (err) {
					reject(err);
				} else {
					var args = arguments;

					switch(args.length) {
					case 0:
					case 1:
						resolve();
						break;
					case 2:
						resolve(args[1]);
						break;
					default:
						args = Array.prototype.slice.call(args, 1) as any;
						resolve(args);
						break;
					}
				}
			};

			try {
				task.bind(undefined, callback).apply(undefined, args as any);
			} catch (err) {
				callback(err);
			}
		};

		return new Promise(handler);
	};

	return _promisifyInstance;
}

export = Promisify;
