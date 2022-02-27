"use strict";
/* eslint-env node */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _catchWrapper_1 = __importDefault(require("./_catchWrapper"));
var _onceWrapper_1 = __importDefault(require("./_onceWrapper"));
var EMPTY_TASK = function (next) { next(); };
/**
* Wraps a task and logs how long it takes to finish, or fail.
* @param {CallbackTask} task - the task to wrap.
* @param {string} label - an optional label to log.
* @returns {CallbackTask} a task
* @memberof callback-patterns
*/
function Timer(task, label) {
    task = (0, _catchWrapper_1.default)(task || EMPTY_TASK);
    label = label || task.name || 'task';
    return function _timerInstance(_1) {
        var start = Date.now();
        var next = (0, _onceWrapper_1.default)(_1);
        var args = arguments;
        var done = function (err) {
            var end = Date.now();
            var args = arguments;
            console.log(err ?
                'Timer: ' + label + ' failed in ' + (end - start) + 'ms' :
                'Timer: ' + label + ' finished in ' + (end - start) + 'ms');
            next.apply(null, args);
        };
        args[0] = done;
        task.apply(null, args);
    };
}
module.exports = Timer;
