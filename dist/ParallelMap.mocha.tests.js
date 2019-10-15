"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
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
// import InOrder from './InOrder';
// import InParallel from './InParallel';
var InSeries_1 = __importDefault(require("./InSeries"));
// import Logging from './Logging';
// import Memoize from './Memoize';
// import ParallelFilter from './ParallelFilter';
var ParallelMap_1 = __importDefault(require("./ParallelMap"));
// import PassThrough from './PassThrough';
describe('ParallelMap', function () {
    it('Function.length should be at least 1', function () {
        if (ParallelMap_1.default(function (next) { return true; }).length < 1) {
            throw new Error();
        }
    });
    it('test with 0 args', function (done) {
        var task = ParallelMap_1.default(function (next, item) { return next(null, item); });
        task(done);
    });
    it('catches errors', function (done) {
        var task = ParallelMap_1.default(function (next, item) { throw new Error('error'); });
        var onDone = function (err, res) { return done(err != null ? null : err); };
        task(onDone, 1, 2, 3);
    });
    it('works 1', function (done) {
        var task = InSeries_1.default(function (next) { return next(null, 1, 2, 3); }, ParallelMap_1.default(function (next, item) { return next(null, item + 1); }), Assert_1.default(function (a, b, c) { return a === 2 && b === 3 && c === 4; }));
        task(done);
    });
    it('ParallelMap performance', function (done) {
        var task = InSeries_1.default(ParallelMap_1.default(function (next, item) { return next(null, item + 1); }));
        task.apply(void 0, __spreadArrays([done], Array(10000).fill(1)));
    });
});
