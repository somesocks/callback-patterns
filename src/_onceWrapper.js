
var _nullCallback = require('./_nullCallback');

function _onceWrapper(_1) {
	var func = _1;

	return function _onceWrapperInstance() {
		var temp = func || _nullCallback;
		func = undefined;
		temp.apply(undefined, arguments);
	};
}

module.exports = _onceWrapper;

//
//
// const once = function (func) {
// 	return function () {
// 		const args = arguments;
// 		const temp = func || nop;
// 		func = nop;
// 		temp.apply(undefined, args);
// 	};
// };
