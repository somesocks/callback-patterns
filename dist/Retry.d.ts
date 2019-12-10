import Task from './types/Task';
declare type RetryOptions = {
    timeout?: number;
    retries?: number;
};
declare type DelayArgs = {
    err?: any;
    retries: number;
    delay: number;
    timeStarted: number;
};
declare type DelayFunction = (args: DelayArgs) => number;
/**
* Wraps a task and attempts to retry if it throws an error, with an exponential backoff.
* @param {CallbackTask} task - the task to wrap.
* @param {function} retryStrategy - an optional retry strategy.
* @returns {CallbackTask} a task
* @example
* ```javascript
*   let Retry = require('callback-patterns/Retry');
*
*   let unstableTask = (next) => {
*     if (Math.random() > 0.9) { throw new Error(); }
*     else { next(); }
*   };
*
*   // attempt retries up to 10 times for up to 10000 ms ,
*   // with a constant retry delay of 100 ms between attempts
*   let stableTask = Retry(unstableTask, Retry.LinearRetryStrategy(100, 10, 10000));
*
*   // attempt retries up to 10 times for up to 10000 ms,
*   // with an exponential backoff retry delay of 100 ms, 200 ms, 400 ms, ...
*   let stableTask2 = Retry(unstableTask, Retry.ExponentialRetryStrategy(100, 10, 10000, 2));
*
*   // attempt retries up to 4 times,
*   // with retry delays of 100 ms, 100 ms, 100 ms, 1000ms
*   let stableTask3 = Retry(unstableTask, Retry.ManualRetryStrategy(100, 100, 100, 1000));
*
* ```
* @memberof callback-patterns
*/
declare function Retry(task: Task, retryStrategy?: RetryOptions | DelayFunction): Task;
declare namespace Retry {
    var LinearRetryStrategy: (delay?: number, retries?: number, timeout?: number) => DelayFunction;
    var ExponentialRetryStrategy: (delay?: number, retries?: number, timeout?: number, decayFactor?: number) => DelayFunction;
    var ManualRetryStrategy: (...delays: number[]) => DelayFunction;
}
export = Retry;
