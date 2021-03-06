/* eslint-env node */

// import Callback from './types/Callback';
import Task from './types/Task';

import _catchWrapper from './_catchWrapper';
import _onceWrapper  from './_onceWrapper';

var EMPTY_TASK = function (next) { next(); }

/**
* Wraps a task and logs how long it takes to finish, or fail.
* @param {CallbackTask} task - the task to wrap.
* @param {string} label - an optional label to log.
* @returns {CallbackTask} a task
* @memberof callback-patterns
*/
function Timer(task : Task, label ?: string) : Task {
	task = _catchWrapper(task || EMPTY_TASK);
	label = label || task.name || 'task';

	return function _timerInstance (_1) {
		var start = Date.now();
		var next = _onceWrapper(_1);
		var args = arguments;

		var done = function (err) {
			var end = Date.now();
			var args = arguments;
			console.log(
				err ?
					'Timer: ' + label +' failed in ' + (end - start) + 'ms' :
					'Timer: ' + label +' finished in ' + (end - start) + 'ms'
			);
			next.apply(null, args as any);
		};

		args[0] = done;

		task.apply(null, args as any);
	};
}

export = Timer;
