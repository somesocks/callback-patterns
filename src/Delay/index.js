/* eslint-env node */

var _delay = require('../_private/delay');
var _nullCallback = require('../_private/nullCallback');
var _stringWrapper = require('../_private/stringWrapper');

/**
*
* ```javascript
*   const Delay = require('callback-patterns/Delay');
*   const InSeries = require('callback-patterns/InSeries');
*
*   const task = InSeries(
*     (next, num) => next(null, num),
*     Delay(100),
*     (next, num) => next(null, num + 1),
*   );
*
*   const onDone = (err, result) => console.log(err, result);
*
*   task(onDone, 1); // prints null 1, after a 100 ms delay
* ```
* Delay acts like PassThrough, but inserts a delay in the call.
* @param {number} delay - The time to delay, in ms.
* @returns {taskFunction} a delay task
* @memberof callback-patterns
*/
function Delay(_1) {
	var ms = _1 || 100;

	return function _delayInstance(_1) {
		var next = _1 || _nullCallback;
		var args = arguments;
		args.length+=2;
		for (var i = args.length - 1; i > 1; i--) {
			args[i] = args[i - 2];
		}
		args[0] = next;
		args[1] = ms
		args[2] = null;

		_delay.apply(null, args);
	};
}

Delay.default = Delay;

module.exports = Delay;
