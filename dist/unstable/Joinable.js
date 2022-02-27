"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _defer_1 = __importDefault(require("../_defer"));
var _onceWrapper_1 = __importDefault(require("../_onceWrapper"));
var PassThrough_1 = __importDefault(require("../PassThrough"));
function _Joinable(task) {
    this._next = null;
    this._task = task;
    this._results = undefined;
}
_Joinable.prototype.join = function join(_then) {
    // console.log('_Joinable.prototype.join', _then);
    if (this._results != null) {
        _then.apply(undefined, this._results);
    }
    else {
        var self_1 = this;
        var _source_1 = this._next;
        this._next = function () {
            if (_source_1) {
                (0, _defer_1.default)(_source_1);
            }
            _then.apply(undefined, self_1._results);
        };
    }
    return this;
};
_Joinable.prototype._finish = function _finish() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    this._results = arguments;
    this._next.apply(undefined, arguments);
};
_Joinable.prototype._start = function _start(next) {
    // initial join is important to set up the chain
    this.join(next);
    // prepare finish trigger
    var _finish = this._finish.bind(this);
    _finish = (0, _onceWrapper_1.default)(_finish);
    arguments[0] = _finish;
    arguments.length = arguments.length || 1;
    try {
        this._task.apply(undefined, arguments);
    }
    catch (err) {
        _finish(err);
    }
    return this;
};
function JoinableConstructor(task) {
    task = task || PassThrough_1.default;
    return function _JoinableConstructor(next) {
        var joinable = new _Joinable(task);
        joinable._start.apply(joinable, arguments);
        return joinable;
    };
}
module.exports = JoinableConstructor;
