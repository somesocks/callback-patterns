/* eslint-env node */

var _nullCallback = require('./_nullCallback');
var _stringWrapper = require('./_stringWrapper');

var DEFAULT = function () { return 'Logging [ ' + arguments + ' ]'; };


/**
* A logging utility.
* It passes the arguments received into all the statements, collects the results, and joins them together with newlines to build the final log statement
* @param {...function} statements - any number of logging values.  Functions are called with the calling arguments, everything else is passed directly to
* @returns {taskFunction} a logging task
* @memberof callback-patterns
*/
function Logging(_1) {
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

		var log = [];
		for (i = 0; i < statements.length; i++) {
			log[i] = statements[i].apply(null, args);
		}

		console.log.apply(null, log);

		args.length++;
		for (i = args.length - 1; i > 0; i--) {
			args[i] = args[i - 1];
		}
		args[0] = null;

		next.apply(null, args);
	};
}

module.exports = Logging;
