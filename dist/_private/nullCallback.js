/* eslint-env node */

function _nullCallback(err) {
	if (err) {
		console.warn('callback-patterns ignored error\n', err);
	}
}

module.exports = _nullCallback;
