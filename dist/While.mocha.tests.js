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
// import InOrder from './InOrder';
// import InParallel from './InParallel';
var InSeries_1 = __importDefault(require("./InSeries"));
// import Logging from './Logging';
// import Memoize from './Memoize';
// import ParallelFilter from './ParallelFilter';
// import ParallelMap from './ParallelMap';
// import PassThrough from './PassThrough';
// import Promisify from './Promisify';
// import Retry from './Retry';
// import Throttle from './Throttle';
// import TimeIn from './TimeIn';
// import TimeOut from './TimeOut';
// import Timer from './Timer';
var While_1 = __importDefault(require("./While"));
describe('While', function () {
    it('Function.length should be at least 1', function () {
        if (While_1.default().length < 1) {
            throw new Error();
        }
    });
    it('test with 0 handlers', function (done) {
        While_1.default()(done);
    });
    it('test with null callback', function (done) {
        While_1.default()();
        setTimeout(done, 16);
    });
    it('works correctly', InSeries_1.default(function (next) { return next(null, 1); }, While_1.default(function (next, num) { return next(null, num < 10); }, function (next, num) { return next(null, num + 1); }), Assert_1.default(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return args[0] === 10;
    }, 'Value not 10')));
    it('catches errors', function (done) {
        While_1.default(function (next) { return next(null, true); }, function (next) { throw new Error('error'); })(function (err, res) { return done(err != null ? null : err); });
    });
    it('deep loop works correctly', InSeries_1.default(function (next) { return next(null, 1); }, While_1.default(function (next, num) { return next(null, num < 100000); }, function (next, num) { return next(null, num + 1); }), Assert_1.default(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return args[0] === 100000;
    }, 'Value not 10')));
});
