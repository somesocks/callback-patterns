"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
// import Assert from './Assert';
// import Background from './Background';
// import Bridge from './Bridge';
// import Callbackify from './Callbackify';
// import CatchError from './CatchError';
// import Delay from './Delay';
// import If from './If';
// import InOrder from './InOrder';
var InParallel_1 = __importDefault(require("./InParallel"));
var InSeries_1 = __importDefault(require("./InSeries"));
var Logging_1 = __importDefault(require("./Logging"));
// import Memoize from './Memoize';
// import ParallelFilter from './ParallelFilter';
// import ParallelMap from './ParallelMap';
// import PassThrough from './PassThrough';
// import Promisify from './Promisify';
// import Retry from './Retry';
var Throttle_1 = __importDefault(require("./Throttle"));
describe('Throttle', function () {
    it('test with 0 handlers', function (done) {
        Throttle_1.default()(done);
    });
    it('Function.length should be at least 1', function () {
        if (Throttle_1.default().length < 1) {
            throw new Error();
        }
        if (Throttle_1.default(function (next) { return true; }).length < 1) {
            throw new Error();
        }
    });
    it('throttling works', function (done) {
        var arr = [];
        var task = Throttle_1.default(InSeries_1.default(Logging_1.default('task before'), function (next, i, timeout) { return setTimeout(next, timeout, null, i); }, Logging_1.default('task after '), function (next, i) {
            arr.push(i);
            next();
        }));
        InSeries_1.default(InParallel_1.default(function (next) { return task(next, 1, 300); }, function (next) { return task(next, 2, 200); }, function (next) { return task(next, 3, 100); }, function (next) { return task(next, 4, 0); }), function (next, res) {
            chai_1.assert.deepEqual(arr, [1, 2, 3, 4]);
            next();
        })(done);
    });
    it('throttling works 2', function (done) {
        var arr = [];
        var task = Throttle_1.default(InSeries_1.default(Logging_1.default('task before'), function (next, i, timeout) { return setTimeout(next, timeout, null, i); }, Logging_1.default('task after '), function (next, i) {
            arr.push(i);
            next();
        }), 2);
        InSeries_1.default(InParallel_1.default(function (next) { return task(next, 1, 100); }, function (next) { return task(next, 2, 0); }, function (next) { return task(next, 3, 100); }, function (next) { return task(next, 4, 0); }), function (next, res) {
            chai_1.assert.deepEqual(arr, [2, 1, 3, 4]);
            next();
        })(done);
    });
});
