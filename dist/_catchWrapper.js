var _nullCallback = require('./_nullCallback');

module.exports = function _catchWrapper(_1) {
	var func = _1;

	// eslint-disable-next-line camelcase
	return function _catchWrapper_instance(_1) {
		var next = _1;
		try {
			// eslint-disable-next-line prefer-spread, prefer-rest-params
			func.apply(undefined, arguments);
		} catch (err) {
			// eslint-disable-next-line no-param-reassign
			next = next || _nullCallback;
			next(err);
		}
	};
};
