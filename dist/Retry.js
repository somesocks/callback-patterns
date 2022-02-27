"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _catchWrapper_1 = __importDefault(require("./_catchWrapper"));
var _onceWrapper_1 = __importDefault(require("./_onceWrapper"));
var _delay_1 = __importDefault(require("./_delay"));
var EMPTY_TASK = function (next) { next(); };
var DefaultDelayBuilder = function (options) {
    if (options === void 0) { options = {}; }
    var timeout = options.timeout || 8192;
    var retries = options.retries || 8;
    var delayFunc = function (args) {
        var elapsedTime = Date.now() - args.timeStarted;
        if (elapsedTime > timeout || args.retries > retries) {
            return -1;
        }
        else {
            var delay = (1 << args.retries);
            return delay;
        }
    };
    return delayFunc;
};
/**
*
* `Retry` eraps a task and attempts to retry if it throws an error, with different kinds of retry strategies (manual, linear or exponential backoff)
*
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
function Retry(task, retryStrategy) {
    task = (0, _catchWrapper_1.default)(task || EMPTY_TASK);
    var delayFunc = typeof retryStrategy === 'function' ?
        retryStrategy : DefaultDelayBuilder(retryStrategy);
    return function _retryInstance(_1) {
        var next = (0, _onceWrapper_1.default)(_1);
        var args = arguments;
        var retryState = {
            err: undefined,
            retries: -1,
            delay: 0,
            timeStarted: Date.now(),
        };
        var onDone = function (err) {
            var res = arguments;
            if (err != null) {
                retryState.err = err;
                retryState.retries++;
                retryState.delay = delayFunc(retryState);
                if (retryState.delay < 0) {
                    next.apply(null, res);
                }
                else {
                    _delay_1.default
                        .bind(null, task, retryState.delay)
                        .apply(null, args);
                }
            }
            else {
                next.apply(null, res);
            }
        };
        args[0] = onDone;
        args.length = args.length || 1;
        task.apply(null, args);
    };
}
Retry.LinearRetryStrategy = function (delay, retries, timeout) {
    if (delay === void 0) { delay = 100; }
    if (retries === void 0) { retries = 10; }
    if (timeout === void 0) { timeout = 10000; }
    var delayFunc = function (args) {
        var elapsedTime = Date.now() - args.timeStarted;
        if (elapsedTime > timeout || args.retries > retries) {
            return -1;
        }
        else {
            return delay;
        }
    };
    return delayFunc;
};
Retry.ExponentialRetryStrategy = function (delay, retries, timeout, decayFactor) {
    if (delay === void 0) { delay = 100; }
    if (retries === void 0) { retries = 10; }
    if (timeout === void 0) { timeout = 10000; }
    if (decayFactor === void 0) { decayFactor = 2; }
    var delayFunc = function (args) {
        var elapsedTime = Date.now() - args.timeStarted;
        if (elapsedTime > timeout || args.retries > retries) {
            return -1;
        }
        else {
            var currentDelay = delay;
            delay = delay * decayFactor;
            return currentDelay;
        }
    };
    return delayFunc;
};
Retry.ManualRetryStrategy = function () {
    var delays = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        delays[_i] = arguments[_i];
    }
    var delayFunc = function (args) {
        var elapsedTime = Date.now() - args.timeStarted;
        if (args.retries >= delays.length) {
            return -1;
        }
        else {
            var delay = delays[args.retries];
            return delay;
        }
    };
    return delayFunc;
};
module.exports = Retry;
