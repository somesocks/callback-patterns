"use strict";
// import optional from 'vet/optional';
// import exists from 'vet/exists';
// import isBoolean from 'vet/booleans/isBoolean';
// import isNumber from 'vet/numbers/isNumber';
// import isShape from 'vet/objects/isShape';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __importDefault(require("./Assert"));
// import Background from './Background';
var Bridge_1 = __importDefault(require("./Bridge"));
// import CatchError from './CatchError';
var InSeries_1 = __importDefault(require("./InSeries"));
describe('Bridge', function () {
    it('Function.length should be at least 1', function () {
        if (Bridge_1.default().length < 1) {
            throw new Error();
        }
        if (Bridge_1.default(function () { }).length < 1) {
            throw new Error();
        }
    });
    var EXAMPLE_BRIDGE = Bridge_1.default();
    var FAILING_BRIDGE_1 = Bridge_1.default(function (next) { return next(new Error('fail')); });
    var FAILING_BRIDGE_2 = Bridge_1.default(function (next) { throw new Error('fail'); });
    it('Bridge works in callback mode', InSeries_1.default(function (next) { return next(null, 2); }, EXAMPLE_BRIDGE, Assert_1.default(function (val) { return val === 2; }, 'callback mode failed to pass args through')));
    it('Bridge fails correctly in callback mode', function (done) {
        FAILING_BRIDGE_1(function (err, res) { return done(err == null ? new Error('bridge should have failed') : null); });
    });
    it('Bridge fails correctly in callback mode 2', function (done) {
        FAILING_BRIDGE_2(function (err, res) { return done(err == null ? new Error('bridge should have failed') : null); });
    });
    it('Bridge works in promise mode', function (done) {
        EXAMPLE_BRIDGE(2)
            .then(function (val) { return done(val === 2 ? null : new Error()); })
            .catch(function (err) { return done(err); });
    });
    it('Bridge fails correctly in promise mode', function (done) {
        FAILING_BRIDGE_1(2)
            .then(function (val) { return done(new Error('should have rejected promise')); })
            .catch(function (err) { return done(); });
    });
    it('Bridge fails correctly in promise mode 2', function (done) {
        FAILING_BRIDGE_2(2)
            .then(function (val) { return done(new Error('should have rejected promise')); })
            .catch(function (err) { return done(); });
    });
    it('test with 0 handlers', function (done) {
        Bridge_1.default()(done);
    });
});
