"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import optional from 'vet/optional';
// import exists from 'vet/exists';
var isBoolean_1 = __importDefault(require("vet/booleans/isBoolean"));
// import isNumber from 'vet/numbers/isNumber';
// import isShape from 'vet/objects/isShape';
var Assert_1 = __importDefault(require("./Assert"));
var CatchError_1 = __importDefault(require("./CatchError"));
var InSeries_1 = __importDefault(require("./InSeries"));
var PassThrough_1 = __importDefault(require("./PassThrough"));
describe('Assert', function () {
    it('Assert', InSeries_1.default(function (next) { return next(null, true); }, Assert_1.default(function (arg) { return isBoolean_1.default(arg); })));
    var LONG_CHAIN = InSeries_1.default.apply(void 0, Array(100000).fill(Assert_1.default(function (val) { return val > 0; })));
    it('Long Chain Performance', function (done) {
        LONG_CHAIN(done, 1, 2, 3, 4, 5, 6);
    });
    var LONG_CHAIN_PASSTHROUGH = InSeries_1.default.apply(void 0, Array(100000).fill(PassThrough_1.default));
    it('Long Chain Performance (reference)', function (done) {
        LONG_CHAIN_PASSTHROUGH(done, 1, 2, 3, 4, 5, 6);
    });
    it('re-throws error', InSeries_1.default(CatchError_1.default(Assert_1.default(function () { return false; }, // always fail,
    function () {
        var err = new Error('foo');
        err.foo = true;
        return err;
    })), Assert_1.default(function (error) { return error.foo === true; }, 'incorrect error re-thrown')));
});
