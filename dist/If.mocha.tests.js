"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __importDefault(require("./Assert"));
// import Background from './Background';
// import Bridge from './Bridge';
// import CatchError from './CatchError';
// import Delay from './Delay';
var If_1 = __importDefault(require("./If"));
// import Callbackify from './Callbackify';
var InSeries_1 = __importDefault(require("./InSeries"));
// import PassThrough from './PassThrough';
describe('If', function () {
    it('Function.length should be at least 1', function () {
        if ((0, If_1.default)().length < 1) {
            throw new Error();
        }
        if ((0, If_1.default)(function () { }).length < 1) {
            throw new Error();
        }
        if ((0, If_1.default)(function () { }, function () { }).length < 1) {
            throw new Error();
        }
    });
    it('test with 0 handlers', function (done) {
        (0, If_1.default)()(done);
    });
    it('test with null callback', function (done) {
        (0, If_1.default)()();
        setTimeout(done, 16);
    });
    it('catches errors', function (done) {
        (0, If_1.default)(function (next) { return next(null, true); }, function (next) { throw new Error('error'); })(function (err, res) { return done(err != null ? null : err); });
    });
    it('then works', (0, InSeries_1.default)(function (next) { return next(null, 1); }, (0, If_1.default)(function (next, i) { return next(null, i > 0); }, function (next) { return next(null, true); }, function (next) { return next(null, false); }), (0, Assert_1.default)(function (val) { return val === true; })));
    it('else works', (0, InSeries_1.default)(function (next) { return next(null, -1); }, (0, If_1.default)(function (next, i) { return next(null, i > 0); }, function (next) { return next(null, true); }, function (next) { return next(null, false); }), (0, Assert_1.default)(function (val) { return val === false; })));
});
