"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import Assert from './Assert';
// import Background from './Background';
// import Bridge from './Bridge';
// import Callbackify from './Callbackify';
// import CatchError from './CatchError';
// import Delay from './Delay';
// import If from './If';
// import InOrder from './InOrder';
// import InParallel from './InParallel';
// import InSeries from './InSeries';
// import Logging from './Logging';
// import Memoize from './Memoize';
// import ParallelFilter from './ParallelFilter';
// import ParallelMap from './ParallelMap';
// import PassThrough from './PassThrough';
// import Promisify from './Promisify';
var Retry_1 = __importDefault(require("./Retry"));
describe('Retry', function () {
    it('test with 0 handlers', function (done) {
        Retry_1.default()(done);
    });
    it('test with null return', function (done) {
        (0, Retry_1.default)(function (next) { return next(); })(done);
    });
    it('Function.length should be at least 1', function () {
        if (Retry_1.default().length < 1) {
            throw new Error();
        }
        if ((0, Retry_1.default)(function (next) { return true; }).length < 1) {
            throw new Error();
        }
    });
    it('test with null callback', function (done) {
        var task = (0, Retry_1.default)(function (next) { return next(); });
        task();
        setTimeout(done, 16);
    });
    it('retry works', function (done) {
        var count = 0;
        var task = (0, Retry_1.default)(function (next) {
            if (count < 5) {
                count++;
                throw new Error('foo');
            }
            else {
                next();
            }
        });
        task(done);
    });
    it('retry works 2', function (done) {
        var count = 0;
        var task = (0, Retry_1.default)(function (next) {
            if (count < 5) {
                count++;
                throw new Error('foo');
            }
            else {
                next();
            }
        }, {
            retries: 10,
        });
        task(done);
    });
    it('retry works with LinearRetryStrategy set', function (done) {
        var count = 0;
        var task = (0, Retry_1.default)(function (next) {
            if (count < 5) {
                count++;
                throw new Error('foo');
            }
            else {
                next();
            }
        }, Retry_1.default.LinearRetryStrategy());
        task(done);
    });
    it('retry works with ExponentialRetryStrategy set', function (done) {
        var count = 0;
        var task = (0, Retry_1.default)(function (next) {
            if (count < 5) {
                count++;
                throw new Error('foo');
            }
            else {
                next();
            }
        }, Retry_1.default.ExponentialRetryStrategy());
        task(done);
    });
    it('retry works with ManualRetryStrategy set', function (done) {
        var count = 0;
        var task = (0, Retry_1.default)(function (next) {
            if (count < 5) {
                count++;
                throw new Error('foo');
            }
            else {
                next();
            }
        }, Retry_1.default.ManualRetryStrategy(1, 1, 1, 100, 1000, 1000, 1000));
        task(done);
    });
    it('catches errors', function (done) {
        (0, Retry_1.default)(function (next) { throw new Error('error'); })(function (err, res) { return done(err != null ? null : err); });
    });
    it('returns 1', function (done) {
        (0, Retry_1.default)(function (next) { return next(null, 1); })(function (err, res) { return done(((err != null) && (res === 1)) ? null : err); });
    });
});
