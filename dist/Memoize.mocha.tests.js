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
var Delay_1 = __importDefault(require("./Delay"));
// import If from './If';
// import InOrder from './InOrder';
// import InParallel from './InParallel';
var InSeries_1 = __importDefault(require("./InSeries"));
// import Logging from './Logging';
var Memoize_1 = __importDefault(require("./Memoize"));
var PassThrough_1 = __importDefault(require("./PassThrough"));
describe('Memoize', function () {
    it('Function.length should be at least 1', function () {
        if (Memoize_1.default().length < 1) {
            throw new Error();
        }
        if (Memoize_1.default(function () { }).length < 1) {
            throw new Error();
        }
    });
    it('test with 0 handlers', function (done) {
        Memoize_1.default()(done);
    });
    it('test with null callback', function (done) {
        Memoize_1.default()();
        setTimeout(done, 16);
    });
    it('catches errors', function (done) {
        Memoize_1.default(function (next) { throw new Error('error'); })(function (err, res) { return done(err != null ? null : err); });
    });
    it('memoize works', function (done) {
        var counter = 0;
        var task = function (next) { return next(null, ++counter); };
        task = Memoize_1.default(task);
        var test = InSeries_1.default(function (next) { return task(next); }, function (next) { return task(next); }, function (next) { return task(next); }, Assert_1.default(function (val) { return val === 1; }, function (val) { return "expected val to be 1, got " + val; }), Assert_1.default(function () { return counter === 1; }, function () { return "expected counter to be 1, got " + counter; }));
        test(done);
    });
    it('memoize speeds up task', function (done) {
        var slowTask = InSeries_1.default(PassThrough_1.default, Delay_1.default(1000));
        var fastTask = Memoize_1.default(slowTask);
        var start;
        var finish;
        var test = InSeries_1.default(function (next) { start = Date.now(); next(); }, function (next) { return fastTask(next); }, function (next) { return fastTask(next); }, function (next) { return fastTask(next); }, function (next) { return fastTask(next); }, function (next) { return fastTask(next); }, function (next) { return fastTask(next); }, function (next) { finish = Date.now(); next(); }, Assert_1.default(function () { return finish - start < 2000; }, function (val) { return "expected elapsed time under 2000 ms, got " + (finish - start); }));
        test(done);
    });
    var MEMOIZED_TASK = Memoize_1.default(PassThrough_1.default);
    var SHORT_CHAIN = InSeries_1.default.apply(void 0, Array(1000).fill(MEMOIZED_TASK));
    var LONG_CHAIN = InSeries_1.default.apply(void 0, Array(1000).fill(SHORT_CHAIN));
    it('Long Chain Performance', function (done) {
        LONG_CHAIN(done, 1, 2, 3);
    });
});
