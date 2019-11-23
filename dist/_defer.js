"use strict";
/* globals setImmediate */
require("setimmediate");
var _defer = setImmediate;
module.exports = _defer;
// let stack = 0;
// let MAX_STACK = 256;
//
// function _defer2(task : any) {
// 	if (stack < MAX_STACK) {
// 		stack++;
// 		arguments[0] = undefined;
// 		task.call.apply(task, arguments);
// 	} else {
// 		stack = 0;
// 		_defer.apply(undefined, arguments);
// 	}
// }
//
// export = _defer2;
