
type validator = (...args : any[]) => boolean;

type message = ((...args : any[]) => string) | string;

type callback = (err ?: Error, ...res: any[]) => void;

type task = (next ?: callback, ...args: any[]) => void;

/**
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*
*   let task = InSeries(
*     function(next, ...args) {},
*     function(next, ...args) {},
*     ...
*   );
*
*   task(next, ...args);
* ```
* Runs several tasks in series, and passes the results from one down to the next.
* This works similarly to the 'waterfall' method in caolan's async.
* @param {...taskFunction} tasks - any number of tasks to run in series.
* @returns {taskFunction} a wrapper function that runs the tasks in series
* @memberof callback-patterns
* @example
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*
*   let chain = InSeries(
*     (next) => { console.log(1); next();}
*     InSeries(
*       (next) => { console.log(2); next();}
*       (next) => { console.log(3); next();}
*     ),
*     InSeries(
*       (next) => { console.log(4); next();}
*       (next) => { console.log(5); next();}
*     )
*   )(); // prints out 1 2 3 4 5, eventually
```
*/
declare function InSeries(...tasks: task[]) : task;

export default InSeries;
