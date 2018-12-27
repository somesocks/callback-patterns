
var _catchWrapper = require('../_private/catchWrapper');
var _onceWrapper = require('../_private/onceWrapper');
var _nullCallback = require('../_private/nullCallback');

var PassThrough = require('../PassThrough');

/**
* ```javascript
*   const If = require('callback-patterns/If');
*
*   let logIfEven = If(
*     (next, num) => next(null, num % 2 === 0)
*     (next, num) => { console.log('is even!'); next(null, num); },
*     (next, num) => { console.log('is not even!'); next(null, num); },
*   );
*
*   let onDone = (err, ...results) => console.log(results);
*
*   logIfEven(null, 1); // prints out 'is not even!' eventually
*   logIfEven(null, 2); // prints out 'is even!' eventually
* ```
* If accepts up to three tasks and returns a task that conditionally executes some.
* note: by default, the conditionTask, thenTask, and elseTask are all set to PassThrough
* note: the conditionTask can return multiple results, but only the first is checked for truthiness
* @param {taskFunction} conditionTask - a condition task.
* @param {taskFunction} thenTask - a task to run if the condition returns a truthy value.
* @param {taskFunction} elseTask - a task to run if the condition returns a falsy value.
* @returns {taskFunction}
* @memberof callback-patterns
*/
function If(_1, _2, _3) {
	var conditionTask = _1 != null ? _catchWrapper(_1) : PassThrough;
	var thenTask = _2 != null ? _catchWrapper(_2) : PassThrough;
	var elseTask = _3 != null ? _catchWrapper(_3) : PassThrough;

	return function _ifInstance(_1) {
		var next = _onceWrapper(_1 || _nullCallback);
		var args = arguments;

		var onCondition = function _onCondition(err, res) {
			if (err) {
				next(err, res);
			} else if (res) {
				args[0] = next;
				thenTask.apply(null, args);
			} else {
				args[0] = next;
				elseTask.apply(null, args);
			}
		};

		args[0] = onCondition;
		conditionTask.apply(null, args);
	};
}


If.default = If;

module.exports = If;
