
type Callback = (err ?: Error | null | undefined, ...res : any[]) => void;

type CallbackTask = (next : Callback, ...args: any[]) => void;

type AsyncTask = (...args: any[]) => Promise<any>;

/**
* Wraps around a task function and greates a promise generator,
* to make it easier to integrate task functions and promises.
*
* NOTE: callback-patterns does not come bundled with a promise library,
* it expects Promise to already exists in the global namespace.
*
* NOTE: if a function 'returns' multiple values through the next callback,
* Promisify auto-boxes these into an array.
*
* @param {function} task - a function that generates a promise from the args.
* @returns {function} a function that generates a Promise when called
* @memberof callback-patterns
* @example
* ```javascript
*   let InSeries = require('callback-patterns/InSeries');
*   let Promisify = require('callback-patterns/Promisify');
*
*   let task = Promisify(
*     InSeries(
*       function(next, ...args) {...},
*       function(next, ...args) {...},
*       ...
*     )
*   );
*
*  task()
*    .then()
*    ...
*
* ```
*/
declare function Promisify(task : CallbackTask) : AsyncTask;

export default Promisify;
