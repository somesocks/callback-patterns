
var _nullCallback = require('./_nullCallback');
var _defer = require('./_defer');
var _catchWrapper = require('./_catchWrapper');

var EMPTY = function (next) { return (next || _nullCallback)(); };

/**
* `Background` runs a task in the background.
* It acts like `PassThrough`, but also schedules the backround task to be called.
*
* NOTE: any error a background task throws is caught and ignored.  If you need
* error handling in a background task, catch the error using `CatchError`
*
* @param {taskFunction} backgroundTask - a task function to be run in the background.
* @returns {taskFunction} a wrapper task that schedules backgroundTask to be run when called.
* @memberof callback-patterns
* @example
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*   let Background = require('callback-patterns/Background');
*
*   let logRequest = (next, ...args) => { ... }; // log a request in some logging service
*   let loadData = (next, ...args) => { ... }; // load some data for analysis
*   let buildReport = (next, ...args) => { ... }; // build aggregate statistics report on data
*   let saveReport = (next, ...args) => { ... }; // dump report into filesystem somewhere as a backup
*
*   let fetchReport = InSeries(
*      Background(logRequest), // don't wait for the request to finish logging
*      loadData,
*      buildReport,
*      Background(saveReport) // don't wait for the report to be saved before returning it
*   );
* ```
*/
function Background(_1) {
	var task = _1 ? _catchWrapper(_1) : EMPTY;
	task = _defer.bind(null, task);

	return function _backgroundInstance(_1) {
		var next = _1 || _nullCallback;

		arguments[0] = _nullCallback;
		task.apply(undefined, arguments);

		arguments[0] = undefined;
		next.apply(undefined, arguments);
	};
}


module.exports = Background;
