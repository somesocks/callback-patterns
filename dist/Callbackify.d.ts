
type validator = (...args : any[]) => boolean;

type message = ((...args : any[]) => string) | string;

type callback = (err ?: Error, ...res: any[]) => void;

type task = (next ?: callback, ...args: any[]) => void;

/**
* Wraps around a promise generating function,
* to make it easier to integrate with task functions.
* @param {function} generator - a function that generates a promise from the args.
* @returns {taskFunction} a task that wraps around the promise
* @memberof callback-patterns
* @example
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*   let Callbackify = require('callback-patterns/Callbackify');
*
*   let task = InSeries(
*     function(next, ...args) {...},
*     Callbackify(
*       (...args) => new Promise((resolve, reject) => resolve(...args))
*     ),
*     function(next, ...args) {},
*     ...
*   );
*
*   task(next, ...args);
* ```
*/
declare function Callbackify(task : Promise<any> | any) : task;

export default Callbackify;
