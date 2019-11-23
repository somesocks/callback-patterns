"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __importDefault(require("../Assert"));
// import Background from './Background';
// import Bridge from './Bridge';
// import Callbackify from './Callbackify';
var CatchError_1 = __importDefault(require("../CatchError"));
var Delay_1 = __importDefault(require("../Delay"));
// import If from './If';
// import InOrder from './InOrder';
var InParallel_1 = __importDefault(require("../InParallel"));
var InSeries_1 = __importDefault(require("../InSeries"));
var Joinable_1 = __importDefault(require("./Joinable"));
// import PassThrough from './PassThrough';
var process_1 = __importDefault(require("process"));
describe('Joinable', function () {
    it('Function.length should be at least 1', function () {
        if (Joinable_1.default().length < 1) {
            throw new Error();
        }
    });
    it('Joinable works 1', function (done) {
        var task = Joinable_1.default(function (next) { return next(null, 1); });
        var record = task(function () { });
        var verify = InSeries_1.default(function (next) { return record.join(next); }, Assert_1.default(function (val) { return val === 1; }));
        verify(done);
    });
    it('Joinable works 2', function (done) {
        var task = Joinable_1.default(function (next) { return next(null, 1); });
        var record = task(function () { });
        var verify = InSeries_1.default(InParallel_1.default.Flatten(function (next) { return record.join(next); }, function (next) { return record.join(next); }, function (next) { return record.join(next); }), 
        // Logging((...args) => args),
        Assert_1.default(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args.length === 3;
        }), Assert_1.default(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args[0] === 1;
        }), Assert_1.default(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args[1] === 1;
        }), Assert_1.default(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args[2] === 1;
        }));
        verify(done);
    });
    it('Joinable handles errors', function (done) {
        var task = Joinable_1.default(function (next) { return next('error!'); });
        var record = task(function () { });
        var verify = InSeries_1.default(InParallel_1.default.Flatten(CatchError_1.default(function (next) { return record.join(next); }), CatchError_1.default(function (next) { return record.join(next); }), CatchError_1.default(function (next) { return record.join(next); })), 
        // Logging((...args) => args),
        Assert_1.default(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args.length === 3;
        }), Assert_1.default(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args[0] === 'error!';
        }), Assert_1.default(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args[1] === 'error!';
        }), Assert_1.default(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return args[2] === 'error!';
        }));
        verify(done);
    });
    it('deep join doesnt crash', function (done) {
        var task = Joinable_1.default(InSeries_1.default(Delay_1.default(1000), function (next) { return next(null, 1); }));
        var record = task(function (err, res) {
            if (err) {
                done(err);
            }
            else if (res != 1) {
                done('error');
            }
            else {
                done();
            }
        });
        var heapBefore = process_1.default.memoryUsage();
        for (var i = 0; i < 1000; i++) {
            record.join(function (err) { if (err) {
                done(err);
            } });
        }
        var heapAfter = process_1.default.memoryUsage();
        console.log('process mem heap/join', (heapAfter.heapUsed - heapBefore.heapUsed) / 1000);
    });
    it('deeper join doesnt crash', function (done) {
        var task = Joinable_1.default(InSeries_1.default(Delay_1.default(1000), function (next) { return next(null, 1); }));
        var record = task(function (err, res) {
            if (err) {
                done(err);
            }
            else if (res != 1) {
                done('error');
            }
            else {
                done();
            }
        });
        var heapBefore = process_1.default.memoryUsage();
        for (var i = 0; i < 10000; i++) {
            record.join(function (err) { if (err) {
                done(err);
            } });
        }
        var heapAfter = process_1.default.memoryUsage();
        console.log('process mem heap/join', (heapAfter.heapUsed - heapBefore.heapUsed) / 10000);
    });
    it('suuuper-deep join doesnt crash', function (done) {
        var task = Joinable_1.default(InSeries_1.default(Delay_1.default(1000), function (next) { return next(null, 1); }));
        var record = task(function (err, res) {
            if (err) {
                done(err);
            }
            else if (res != 1) {
                done('error');
            }
            else {
                done();
            }
        });
        var heapBefore = process_1.default.memoryUsage();
        for (var i = 0; i < 100000; i++) {
            record.join(function (err, res) {
                if (err) {
                    done(err);
                }
                else if (res != 1) {
                    done('error');
                }
            });
        }
        var heapAfter = process_1.default.memoryUsage();
        console.log('process mem heap/join', (heapAfter.heapUsed - heapBefore.heapUsed) / 100000);
    });
});
