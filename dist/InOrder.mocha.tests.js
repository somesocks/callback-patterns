"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __importDefault(require("./Assert"));
// import Background from './Background';
// import Bridge from './Bridge';
// import Callbackify from './Callbackify';
// import CatchError from './CatchError';
// import Delay from './Delay';
// import If from './If';
var InOrder_1 = __importDefault(require("./InOrder"));
var InSeries_1 = __importDefault(require("./InSeries"));
var PassThrough_1 = __importDefault(require("./PassThrough"));
describe('InOrder', function () {
    it('Long Chain Performance', function (done) {
        var chain = InOrder_1.default.apply(void 0, Array(100000).fill(PassThrough_1.default));
        chain(done, 1, 2, 3);
    });
    it('Function.length should be at least 1', function () {
        if ((0, InOrder_1.default)().length < 1) {
            throw new Error();
        }
        if ((0, InOrder_1.default)(function () { }).length < 1) {
            throw new Error();
        }
        if ((0, InOrder_1.default)(function () { }, function () { }).length < 1) {
            throw new Error();
        }
    });
    it('test with 0 handlers', function (done) {
        (0, InOrder_1.default)()(done);
    });
    it('test with null return', function (done) {
        (0, InOrder_1.default)(function (next) { return next(); }, function (next) { return next(); })(done);
    });
    it('test with null callback', function (done) {
        var task = (0, InOrder_1.default)(function (next) { return next(); }, function (next) { return next(); });
        task();
        setTimeout(done, 16);
    });
    it('catches errors', function (done) {
        (0, InOrder_1.default)(function (next) { return next(); }, function (next) { throw new Error('error'); })(function (err, res) { return done(err != null ? null : err); });
    });
    it('catches errors 2', function (done) {
        (0, InOrder_1.default)(function (next) { return next(); }, function (next) { throw new Error('error'); })(function (err, res) { return done(err != null ? null : err); });
    });
    it('callback shouldnt get called', function (done) {
        (0, InOrder_1.default)(function (next) { })(function () { return done(new Error('called')); });
        setTimeout(done, 500);
    });
    it('works 1', (0, InSeries_1.default)(function (next) { return next(null, 1); }, (0, InOrder_1.default)(function (next, val) { return next(null, val + 1); }, function (next, val) { return next(null, val + 1); }, function (next, val) { return next(null, val + 1); }), (0, Assert_1.default)(function (val) { return val === 1; })));
    it('works 2', (0, InSeries_1.default)(function (next) { return next(null, { a: 1 }); }, (0, InOrder_1.default)(function (next, val) { val.a++; next(); }, function (next, val) { val.a++; next(); }, function (next, val) { val.a++; next(); }), (0, Assert_1.default)(function (val) { return val.a === 4; })));
});
