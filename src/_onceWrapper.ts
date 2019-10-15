
import Callback from './types/Callback';

import _nullCallback from './_nullCallback';

function onceWrapper(func ?: Callback) : Callback {
	const wrapper : Callback = function _onceWrapperInstance() {
		var temp = func || _nullCallback;
		func = undefined;
		temp.apply(undefined, arguments as any);
	};

	return wrapper;
}

export = onceWrapper;

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
