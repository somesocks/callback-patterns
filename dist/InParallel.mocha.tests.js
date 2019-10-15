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
var InParallel_1 = __importDefault(require("./InParallel"));
var InSeries_1 = __importDefault(require("./InSeries"));
var Logging_1 = __importDefault(require("./Logging"));
var PassThrough_1 = __importDefault(require("./PassThrough"));
describe('InParallel', function () {
    var LONG_CHAIN = InParallel_1.default.apply(void 0, Array(50000).fill(PassThrough_1.default));
    it('Parallel Performance', function (done) {
        LONG_CHAIN(done);
    });
    it('Parallel Performance 2', function (done) {
        LONG_CHAIN(done, 1);
    });
    it('Parallel Performance 3', function (done) {
        LONG_CHAIN(done, 1, 2, 3, 4, 5, 6, 7, 8);
    });
    it('Function.length should be at least 1', function () {
        if (InParallel_1.default().length < 1) {
            throw new Error();
        }
        if (InParallel_1.default(function () { }).length < 1) {
            throw new Error();
        }
        if (InParallel_1.default(function () { }, function () { }).length < 1) {
            throw new Error();
        }
    });
    it('test with 0 handlers', function (done) {
        InParallel_1.default()(done);
    });
    it('autoboxing works', InSeries_1.default(InParallel_1.default(function (next) { return next(); }, function (next) { return next(null); }, function (next) { return next(null, 1); }, function (next) { return next(null, 2, 3); }), Assert_1.default(function (r0, r1, r2, r3) { return r0[0] === undefined; }, 'autoboxing with empty results failed'), Assert_1.default(function (r0, r1, r2, r3) { return r1[0] === undefined; }, 'autoboxing with 0 results failed'), Assert_1.default(function (r0, r1, r2, r3) { return r2[0] === 1; }, 'autoboxing with 1 results failed'), Assert_1.default(function (r0, r1, r2, r3) { return r3[0] === 2 && r3[1] === 3; }, 'autoboxing with 2 results failed')));
    it('test with null return', function (done) {
        InParallel_1.default(function (next) { return next(); }, function (next) { return next(); })(done);
    });
    it('test with null callback', function (done) {
        var task = InParallel_1.default(function (next) { return next(); }, function (next) { return next(); });
        task();
        setTimeout(done, 16);
    });
    it('catches errors', function (done) {
        InParallel_1.default(function (next) { return next(); }, function (next) { throw new Error('error'); })(function (err, res) { return done(err != null ? null : err); });
    });
    it('doesnt return on no callback', function (done) {
        InSeries_1.default(InParallel_1.default(PassThrough_1.default, function (next) { return null; }), function () { throw new Error('shouldnt get here'); })(done);
        setTimeout(done, 500);
    });
    it('deep error stack works', InSeries_1.default(CatchError_1.default(InParallel_1.default(InParallel_1.default(function (next) { return next(); }, function (next) { throw new Error('error'); }))), Logging_1.default('Error Stack')));
});
describe('InParallel.Flatten', function () {
    var LONG_CHAIN = InParallel_1.default.Flatten.apply(InParallel_1.default, Array(50000).fill(PassThrough_1.default));
    it('Parallel Performance', function (done) {
        LONG_CHAIN(done);
    });
    it('Parallel Performance 2', function (done) {
        LONG_CHAIN(done, 1);
    });
    it('Parallel Performance 3', function (done) {
        LONG_CHAIN(done, 1, 2, 3, 4, 5, 6, 7, 8);
    });
    it('Function.length should be at least 1', function () {
        if (InParallel_1.default.Flatten().length < 1) {
            throw new Error();
        }
        if (InParallel_1.default.Flatten(function () { }).length < 1) {
            throw new Error();
        }
        if (InParallel_1.default.Flatten(function () { }, function () { }).length < 1) {
            throw new Error();
        }
    });
    it('test with 0 handlers', function (done) {
        InParallel_1.default.Flatten()(done);
    });
    it('autoboxing works', InSeries_1.default(InParallel_1.default.Flatten(function (next) { return next(); }, function (next) { return next(null); }, function (next) { return next(null, 1); }, function (next) { return next(null, 2, 3); }), Assert_1.default(function (r0, r1, r2, r3) { return r0 === undefined; }, function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return "autoboxing with empty results failed: " + console.log(args);
    }), Assert_1.default(function (r0, r1, r2, r3) { return r1 === undefined; }, 'autoboxing with 0 results failed'), Assert_1.default(function (r0, r1, r2, r3) { return r2 === 1; }, 'autoboxing with 1 results failed'), Assert_1.default(function (r0, r1, r2, r3) { return r3[0] === 2 && r3[1] === 3; }, 'autoboxing with 2 results failed')));
    it('test with null return', function (done) {
        InParallel_1.default.Flatten(function (next) { return next(); }, function (next) { return next(); })(done);
    });
    it('test with null callback', function (done) {
        var task = InParallel_1.default.Flatten(function (next) { return next(); }, function (next) { return next(); });
        task();
        setTimeout(done, 16);
    });
    it('catches errors', function (done) {
        InParallel_1.default.Flatten(function (next) { return next(); }, function (next) { throw new Error('error'); })(function (err, res) { return done(err != null ? null : err); });
    });
    it('doesnt return on no callback', function (done) {
        InSeries_1.default(InParallel_1.default.Flatten(PassThrough_1.default, function (next) { return null; }), function () { throw new Error('shouldnt get here'); })(done);
        setTimeout(done, 500);
    });
    it('deep error stack works', InSeries_1.default(CatchError_1.default(InParallel_1.default.Flatten(InParallel_1.default.Flatten(function (next) { return next(); }, function (next) { throw new Error('error'); }))), Logging_1.default('Error Stack')));
});
