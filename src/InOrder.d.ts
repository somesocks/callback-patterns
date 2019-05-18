
type validator = (...args : any[]) => boolean;

type message = ((...args : any[]) => string) | string;

type callback = (err ?: Error, ...res: any[]) => void;

type task = (next ?: callback, ...args: any[]) => void;

/**
* ```javascript
*   let InOrder = require('callback-patterns/InOrder');
*
*   let task = InOrder(
*     function(next, ...args) {},
*     function(next, ...args) {},
*     ...
*   );
*
*   task(next, ...args);
* ```
* Runs several asynchronous tasks one after another.
* Each task gets the arguments that were originally passed into the wrapper.
* This is different from InSeries, where the output of each is task is passed as the input to the next.
* ```javascript
*   const InOrder = require('callback-patterns/InOrder');
*
*   const task = InOrder(
*     (next, a) => { a.val = 1; console.log(a.val); next();}
*     (next, a) => { a.val = 2; console.log(a.val); next();}
*     (next, a) => { a.val = 3; console.log(a.val); next();}
*   )(null, {}); // prints out 1 2 3, eventually
```
* @param {...taskFunction} tasks - any number of tasks to run in order.
* @returns {taskFunction} a wrapper function that runs the tasks in order
* @memberof callback-patterns
*/
declare function InOrder(...tasks: task[]) : task;

export default InOrder;
