import Task from './types/Task';
/**
* `Background` runs a task in the background.
* It acts like `PassThrough`, but also schedules the backround task to be called.
*
* NOTE: any error a background task throws is caught and ignored.  If you need
* error handling in a background task, catch the error using `CatchError`
*
* @param {CallbackTask} backgroundTask - a task function to be run in the background.
* @returns {CallbackTask} a wrapper task that schedules backgroundTask to be run when called.
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
declare function Background(_1: any): Task;
export = Background;
