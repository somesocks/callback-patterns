"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _onceWrapper_1 = __importDefault(require("./_onceWrapper"));
var _defer_1 = __importDefault(require("./_defer"));
var _queue_1 = __importDefault(require("./_queue"));
// import InSeries from './InSeries';
var PassThrough_1 = __importDefault(require("./PassThrough"));
/**
* Wraps a task and ensures that only X number of instances of the task can be run in parallel.
* Requests are queued up in an unbounded FIFO queue until they can be run.
* @param {CallbackTask} task - the task to throttle
* @param {number} limit - the number of instances that can run in parallel. default 1.
* @returns {CallbackTask} a task
* @memberof callback-patterns
*/
function Throttle(_1, _2) {
    var task = _1 || PassThrough_1.default;
    var limit = _2 || 1;
    var queue = Throttle.Queue();
    var running = 0;
    var _throttleInstance;
    var _deferredThrottleInstance;
    _throttleInstance = function _throttleInstance(_1) {
        var next = _onceWrapper_1.default(_1);
        var args = arguments;
        if (running < limit) {
            var after_1 = function after() {
                var results = arguments;
                running--;
                if (running < limit && queue.length() > 0) {
                    var oldArgs = queue.pop();
                    _deferredThrottleInstance.apply(null, oldArgs);
                }
                next.apply(null, results);
            };
            running++;
            args[0] = after_1;
            task.apply(null, args);
        }
        else {
            queue.push(args);
        }
    };
    _deferredThrottleInstance = _defer_1.default.bind(null, _throttleInstance);
    return _throttleInstance;
}
Throttle.Queue = _queue_1.default;
module.exports = Throttle;
