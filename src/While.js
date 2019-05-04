
var _nullCallback = require('./_nullCallback');
var _defer = require('./_defer');
var _catchWrapper = require('./_catchWrapper');
var _onceWrapper = require('./_onceWrapper');

var PassThrough = require('./PassThrough');

var _false = function _false(next) { return next(null, false); };

/**
* ```javascript
*   let While = require('callback-patterns/While');
*
*   let task = While(
*     (next, num) => next(null, num < 10),
*     (next, num) => next(null, num + 1),
*   );
*
*   let onDone = (err, result) => console.log(result);
*
*   task(onDone, 1); // prints 9, eventually
* ```
* While accepts two tasks and returns a task that conditionally executes some number of times.
* @param {function} conditionTask - a condition task.
* @param {function} loopTask - a task to run if the condition returns a truthy value.
* @returns {function}
* @memberof callback-patterns
*/
function While(_1, _2) {
	var conditionTask = _1 != null ? _catchWrapper(_1) : _false;
	var loopTask = _2 != null ? _catchWrapper(_2) : PassThrough;
	var deferredLoopTask = _defer.bind(null, loopTask);

	return function _whileInstance(_1) {
		var next = _onceWrapper(_1 || _nullCallback);
		var args = arguments;

		var onCondition;
		var onLoop;

		onCondition = function _onCondition(err, res) {
			if (err) {
				next(err, res);
			} else if (res) {
				args[0] = onLoop;
				args.length = args.length || 1;
				deferredLoopTask.apply(null, args);
			} else {
				args[0] = null;
				next.apply(null, args);
			}
		};

		onLoop = function _onLoop(err) {
			var args2 = arguments;
			if (err) {
				next.apply(null, args2);
			} else {
				args = args2;
				args[0] = onCondition;
				args.length = args.length || 1;
				conditionTask.apply(null, args);
			}
		};

		args[0] = onCondition;
		args.length = args.length || 1;
		conditionTask.apply(null, args);
	};
}


module.exports = While;
