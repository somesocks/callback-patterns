"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _nullCallback_1 = __importDefault(require("./_nullCallback"));
function onceWrapper(func) {
    var wrapper = function _onceWrapperInstance() {
        var temp = func || _nullCallback_1.default;
        func = undefined;
        temp.apply(undefined, arguments);
    };
    return wrapper;
}
module.exports = onceWrapper;
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
