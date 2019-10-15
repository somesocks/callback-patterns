"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _nullCallback_1 = __importDefault(require("./_nullCallback"));
function catchWrapper(func) {
    return function _catchWrapper_instance(next) {
        try {
            func.apply(undefined, arguments);
        }
        catch (err) {
            next = next || _nullCallback_1.default;
            next(err);
        }
    };
}
;
module.exports = catchWrapper;
