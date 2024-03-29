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
var Race_1 = __importDefault(require("./Race"));
describe('Race', function () {
    it('test with 0 handlers', function (done) {
        (0, Race_1.default)()(done);
    });
    it('test with null return', function (done) {
        (0, Race_1.default)(function (next) { return next(); }, function (next) { return next(); })(done);
    });
    it('Function.length should be at least 1', function () {
        if ((0, Race_1.default)().length < 1) {
            throw new Error();
        }
        if ((0, Race_1.default)(function (next) { return true; }).length < 1) {
            throw new Error();
        }
    });
    it('test with null callback', function (done) {
        var task = (0, Race_1.default)(function (next) { return next(); }, function (next) { return next(); });
        task();
        setTimeout(done, 16);
    });
    it('catches errors', function (done) {
        (0, Race_1.default)(function (next) { throw new Error('error'); })(function (err, res) { return done(err != null ? null : err); });
    });
    it('returns 1', function (done) {
        (0, Race_1.default)(function (next) { return next(null, 1); }, function (next) { })(function (err, res) { return done(((err != null) && (res === 1)) ? null : err); });
    });
    it('returns 1', function (done) {
        (0, Race_1.default)(function (next) { return next(null, 1); }, function (next) { return next(null, 2); })(function (err, res) { return done(((err != null) && (res === 1)) ? null : err); });
    });
    it('returns 1', function (done) {
        (0, Race_1.default)(function (next) { return setTimeout(next, 500, null, 2); }, function (next) { return next(null, 1); })(function (err, res) { return done(((err != null) && (res === 1)) ? null : err); });
    });
});
