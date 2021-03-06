import Task from './types/Task';
/**
* Errors bypass the normal flow of execution.
* They always return immediately up the "stack",
* even if they occur inside nested InSeries or InParallel chains.
*
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*   let CatchError = require('callback-patterns/CatchError');
*
*   let task = InSeries(
*     (next) => { console.log(1); next(); }
*     InSeries(
*       (next) => { console.log(2); next(); }
*       (next) => { console.log(3); next('Error'); }
*     ),
*     InSeries(
*       (next) => { console.log(4); next();}
*       (next) => { console.log(5); next();}
*     )
*   )(console.log); // prints out 1 2 3 Error, eventually
* ```
*
* If you need to catch an error explicitly at some point,
* wrap a task in CatchError, which will return the error as the first argument
* to the next function.
*
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*   let CatchError = require('callback-patterns/CatchError');

*   let task = InSeries(
*     (next) => { console.log(1); next();}
*     CatchError(
*       InSeries(
*         (next) => { console.log(2); next();}
*         (next) => { console.log(3); next('Error');}
*       ),
*     ),
*     (next, error) => error != null ? console.log('Error Caught') : null,
*     InSeries(
*       (next) => { console.log(4); next();}
*       (next) => { console.log(5); next();}
*     )
*   )(console.log); // prints out 1 2 3 Error Caught 4 5, eventually
* ```
*
* @param {CallbackTask} task - a function that checks the arguments.
* @returns {CallbackTask} a wrapper function around the task
* @memberof callback-patterns
*/
declare var CatchError: (_1: any) => Task;
export = CatchError;
