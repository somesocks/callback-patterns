
var _nullCallback = require('./_nullCallback');
var _defer = require('./_defer');
var _catchWrapper = require('./_catchWrapper');
var _onceWrapper = require('./_onceWrapper');

var EMPTY = function (next) { return (next || _nullCallback)(); };

/**
*
* ```javascript
*   let Race = require('callback-patterns/Race');
*
*   let task = Race(
*     function(next, ...args) {},
*     function(next, ...args) {},
*     ...
*   );
*
*   task(next, ...args);
* ```
*
* Race accepts a number of functions, and returns a task function that executes all of its child tasks simultaneously.  The first result (or error) is returned, and the remaining results (or errors) are ignored.
*
* ```javascript
*   let Race = require('callback-patterns/Race');
*
*   let task = Race(
*     (next) => next(null, 1),
*     (next) => setTimeout(next, 100, null, 2),
*     (next) => { throw new Error(); } ,
*   );
*
*   let onDone = (err, ...results) => console.log(results);
*
*   task(onDone); // prints out [ 1 ], eventually
* ```
*
* @param {...taskFunction} tasks - any number of tasks to run in parallel.
* @returns {taskFunction} a task
* @memberof callback-patterns
*/
function Race() {
	var tasks = arguments;

	if (tasks.length === 0) {
		return EMPTY;
	}

	for (var i = 0; i < tasks.length; i++) {
		tasks[i] = _catchWrapper(tasks[i]);
		tasks[i] = _defer.bind(null, tasks[i]);
	}

	return function _raceInstance(_1) {
		var next = _onceWrapper(_1);
		var args = arguments;
		args[0] = next;

		for (var i = 0; i < tasks.length; i++) {
			tasks[i].apply(null, args);
		}
	};
}

module.exports = Race;
