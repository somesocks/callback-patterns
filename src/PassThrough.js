
var _nullCallback = require('./_nullCallback');

/**
*
* Sometimes, you need to pass previous arguments along with a new result.  The easiest way to do this is to use PassThrough, which is a convenience method for:
* ```javascript
*  (next, ...args) => next(null, ...args),
* ```
* @memberof callback-params
*/
function PassThrough(_1) {
	var next = _1 || _nullCallback;
	arguments[0] = undefined;
	next.apply(undefined, arguments);
}

PassThrough.default = PassThrough;

module.exports = PassThrough;
