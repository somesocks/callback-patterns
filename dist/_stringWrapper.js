"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _isString_1 = __importDefault(require("./_isString"));
var _isFunction_1 = __importDefault(require("./_isFunction"));
function emptyStringWrapper() { return ''; }
function stringWrapper(_1) {
    var log = _1;
    if ((0, _isFunction_1.default)(log)) {
        return log;
    }
    else if ((0, _isString_1.default)(log)) {
        return function _stringWrapperInstance() { return log; };
    }
    else {
        return emptyStringWrapper;
    }
}
module.exports = stringWrapper;
