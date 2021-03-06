/* eslint-env node */

// import Callback from './types/Callback';
import Task from './types/Task';

import _nullCallback from './_nullCallback';
import _stringWrapper from './_stringWrapper';

var DEFAULT = function () { return 'Logging [ ' + arguments + ' ]'; };


/**
* A logging utility.
* It passes the arguments received into all the statements, collects the results, and joins them together with newlines to build the final log statement
* @param {...function} statements - any number of logging values.  Functions are called with the calling arguments, everything else is passed directly to
* @returns {CallbackTask} a logging task
* @memberof callback-patterns
* @example
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*   let Logging = require('callback-patterns/Logging');
*
*   let task = InSeries(
*     (next, ...args) => next(null, ...args),
*     Logging(
*       'log statement here'
*       (...args) => `args are ${args}`
*     ),
*     (next, ...args) => next(null, ...args),
*     ...
*   );
*
*   task(next, ...args);
* ```
*/
function Logging(_1 ?: any, ...rest : any[]) : Task {
	if (arguments.length === 0) {
		arguments[0] = DEFAULT;
		arguments.length = 1;
	} else {
		for (var i = 0; i < arguments.length; i++) {
			arguments[i] = _stringWrapper(arguments[i]);
		}
	}

	var statements = arguments;

	return function _loggingInstance (_1) {
		var next = _1 || _nullCallback;
		var args = arguments;
		var i;

		for (i = 0; i < args.length; i++) {
			args[i] = args[i+1];
		}
		args.length = args.length > 0 ? args.length - 1 : 0;

		var log : any[] = [];
		for (i = 0; i < statements.length; i++) {
			log[i] = statements[i].apply(null, args);
		}

		console.log.apply(null, log as any);

		args.length++;
		for (i = args.length - 1; i > 0; i--) {
			args[i] = args[i - 1];
		}
		args[0] = null;

		next.apply(null, args as any);
	};
}

export = Logging;
