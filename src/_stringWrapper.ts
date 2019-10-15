import isString from './_isString';
import isFunction from './_isFunction';

function emptyStringWrapper () { return ''; }

function stringWrapper(_1) {
	var log = _1;

	if (isFunction(log)) {
		return log;
	} else if (isString(log)) {
		return function _stringWrapperInstance() { return log; };
	} else {
		return emptyStringWrapper;
	}
}

export = stringWrapper;
