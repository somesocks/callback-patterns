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
var Promisify_1 = __importDefault(require("./Promisify"));
describe('Promisify', function () {
    it('Promisify works', function (done) {
        new Promise(function (resolve) { return resolve(); })
            .then(Promisify_1.default(function (next) { return next(null, 1); }))
            .then(function (val) { return done(val !== 1 ? new Error('missing res') : null); });
    });
    it('Promisify accepts multiple arguments', function (done) {
        var task = Promisify_1.default(function (next, a, b, c) { return next(null, a + b + c); });
        task(1, 2, 3)
            .then(function (val) { return done(val !== 6 ? new Error('missing arguments') : null); });
    });
    it('Promisify returns single argument correctly', function (done) {
        var task = Promisify_1.default(function (next, a, b) { return next(null, a); });
        task(1, 2)
            .then(function (val) { return done(val !== 1 ? new Error("bad results " + val) : null); });
    });
    it('Promisify returns multiple arguments correctly', function (done) {
        var task = Promisify_1.default(function (next, a, b) { return next(null, a, b); });
        task(1, 2)
            .then(function (val) { return done((val[0] !== 1 || val[1] !== 2) ? new Error("missing arguments " + val) : null); });
    });
    it('Promisify catches callback errors', function (done) {
        var onCatch = function (err) {
            if (err == null) {
                done(new Error('didnt catch'));
            }
            else {
                done();
            }
        };
        new Promise(function (resolve) { return resolve(); })
            .then(Promisify_1.default(function (next) { return next(new Error('throw error')); }))
            .catch(onCatch);
    });
    it('Promisify catches thrown errors', function (done) {
        var onCatch = function (err) {
            if (err == null) {
                done(new Error('didnt catch'));
            }
            else {
                done();
            }
        };
        new Promise(function (resolve) { return resolve(); })
            .then(Promisify_1.default(function (next) { throw new Error('throw error'); }))
            .catch(onCatch);
    });
});
