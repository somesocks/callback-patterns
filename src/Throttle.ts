
import Callback from './types/Callback';
import Task from './types/Task';

import _catchWrapper from './_catchWrapper';
import _onceWrapper from './_onceWrapper';
import _defer from './_defer';
import Queue from './_queue';


// import InSeries from './InSeries';
import PassThrough from './PassThrough';

/**
* Wraps a task and ensures that only X number of instances of the task can be run in parallel.
* Requests are queued up in an unbounded FIFO queue until they can be run.
* @param {CallbackTask} task - the task to throttle
* @param {number} limit - the number of instances that can run in parallel. default 1.
* @returns {CallbackTask} a task
* @memberof callback-patterns
*/
function Throttle(_1 ?: Task, _2 ?: number) : Task {
	const task = _1 || PassThrough;
	const limit = _2 || 1;

	const queue = Throttle.Queue();
	let running = 0;

	let _throttleInstance;
	let _deferredThrottleInstance;

	_throttleInstance = function _throttleInstance(_1) {
		const next = _onceWrapper(_1);
		const args = arguments;

		if (running < limit) {
			const after = function after() {
				var results = arguments;
				running--;
				if (running < limit && queue.length() > 0) {
					var oldArgs = queue.pop();
					_deferredThrottleInstance.apply(null, oldArgs);
				}

				next.apply(null, results as any);
			};

			running++;
			args[0] = after;
			task.apply(null, args as any);
		} else {
			queue.push(args);
		}
	};

	_deferredThrottleInstance = _defer.bind(null, _throttleInstance);

	return _throttleInstance;
}

Throttle.Queue = Queue;

export = Throttle;
