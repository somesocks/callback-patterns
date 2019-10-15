"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _catchWrapper_1 = __importDefault(require("./_catchWrapper"));
var _onceWrapper_1 = __importDefault(require("./_onceWrapper"));
var _delay_1 = __importDefault(require("./_delay"));
var EMPTY_TASK = function (next) { next(); };
/**
* Wraps a task and attempts to retry if it throws an error, with an exponential backoff.
* @param {CallbackTask} task - the task to wrap.
* @param {object} options - an optional set of retry options.
* @param {object} options.timeout - maximum time to attempt retries.
* @param {object} options.retries - maximum number of retries to attempt.
* @returns {CallbackTask} a task
* @memberof callback-patterns
*/
function Retry(task, options) {
    task = _catchWrapper_1.default(task || EMPTY_TASK);
    options = options || {};
    var timeout = options.timeout || 8192;
    var retries = options.retries || 8;
    return function _retryInstance(_1) {
        var next = _onceWrapper_1.default(_1);
        var args = arguments;
        var timeStarted = Date.now();
        var retries = 0;
        var onDone = function (err) {
            var elapsedTime = Date.now() - timeStarted;
            var res = arguments;
            if ((err != null) &&
                (retries < retries) &&
                (elapsedTime < timeout)) {
                var delay = (1 << retries);
                retries++;
                _delay_1.default
                    .bind(null, task, delay)
                    .apply(null, args);
            }
            else {
                next.apply(null, res);
            }
        };
        args[0] = onDone;
        task.apply(null, args);
    };
}
module.exports = Retry;
