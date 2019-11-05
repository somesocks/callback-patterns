"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __importDefault(require("./Assert"));
// import Background from './Background';
// import Bridge from './Bridge';
// import Callbackify from './Callbackify';
var CatchError_1 = __importDefault(require("./CatchError"));
// import Delay from './Delay';
// import If from './If';
// import InOrder from './InOrder';
// import InParallel from './InParallel';
var InSeries_1 = __importDefault(require("./InSeries"));
var Logging_1 = __importDefault(require("./Logging"));
var PassThrough_1 = __importDefault(require("./PassThrough"));
describe('InSeries tests', function () {
    it('Function.length should be at least 1', function () {
        if (InSeries_1.default().length < 1) {
            throw new Error();
        }
        if (InSeries_1.default(function () { }).length < 1) {
            throw new Error();
        }
        if (InSeries_1.default(function () { }, function () { }).length < 1) {
            throw new Error();
        }
    });
    it('test with 0 handlers', function (done) {
        InSeries_1.default()(done);
    });
    it('test with null return', function (done) {
        InSeries_1.default(function (next) { return next(); }, function (next) { return next(); })(done);
    });
    it('test with null callback', function (done) {
        var task = InSeries_1.default(function (next) { return next(); }, function (next) { return next(); });
        task();
        setTimeout(done, 16);
    });
    it('works 1', InSeries_1.default(function (next) { return next(null, 1); }, function (next, val) { return next(null, val + 1); }, function (next, val) { return next(null, val + 1); }, function (next, val) { return next(null, val + 1); }, Assert_1.default(function (val) { return val === 4; })));
    it('catches errors', function (done) {
        InSeries_1.default(function (next) { return next(); }, function (next) { throw new Error('error'); })(function (err, res) { return done(err != null ? null : err); });
    });
    it('catches errors 2', function (done) {
        InSeries_1.default(function (next) { return next(); }, function (next) { throw new Error('error'); })(function (err, res) { return done(err != null ? null : err); });
    });
    it('callback shouldnt get called', function (done) {
        InSeries_1.default(function (next) { })(function () { return done(new Error('called')); });
        setTimeout(done, 500);
    });
    it('deep error stack works', InSeries_1.default(CatchError_1.default(InSeries_1.default(InSeries_1.default(function (next) { return next(); }, function (next) { throw new Error('error'); }))), Logging_1.default('Error Stack')));
    var SHORT_CHAIN = InSeries_1.default.apply(void 0, Array(1000).fill(PassThrough_1.default));
    var LONG_CHAIN = InSeries_1.default.apply(void 0, Array(1000).fill(SHORT_CHAIN));
    it('Long Chain Performance', function (done) {
        LONG_CHAIN(done, 1, 2, 3);
    });
});
