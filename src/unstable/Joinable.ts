
import defer from '../_defer';
import once from '../_onceWrapper';

import PassThrough from '../PassThrough';

function _Joinable (this : any, task) {
	this._next = null;
	this._task = task;
	this._results = undefined;
}

_Joinable.prototype.join = function join(_then) {
	// console.log('_Joinable.prototype.join', _then);
	if (this._results != null) {
		_then.apply(undefined, this._results);
	} else {
		const self = this;
		const _source = this._next;
		this._next = function () {
			if (_source) { defer(_source); }
			_then.apply(undefined, self._results);
		};
	}
	return this;
};

_Joinable.prototype._finish = function _finish(...args : any[]) {
	this._results = arguments;
	this._next.apply(undefined, arguments);
};

_Joinable.prototype._start = function _start(next) {

	// initial join is important to set up the chain
	this.join(next);

	// prepare finish trigger
	let _finish = this._finish.bind(this);
	_finish = once(_finish);

	arguments[0] = _finish;
	arguments.length = arguments.length || 1;
	try {
		this._task.apply(undefined, arguments);
	} catch (err) {
		_finish(err);
	}

	return this;
};


function JoinableConstructor(task) {
	task = task || PassThrough;

	return function _JoinableConstructor(next) {
		const joinable = new _Joinable(task);
		joinable._start.apply(joinable, arguments);
		return joinable;
	};

}


export = JoinableConstructor;
