var isString = require('./isString');
var isFunction = require('./isFunction');

function _emptyStringWrapper () { return ''; }

function _stringWrapper(_1) {
	var log = _1;

	if (isFunction(log)) {
		return log;
	} else if (isString(log)) {
		return function _stringWrapperInstance() { return log; };
	} else {
		return _emptyStringWrapper;
	}
}

module.exports = _stringWrapper;
