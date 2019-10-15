"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __importDefault(require("./Assert"));
// import Background from './Background';
// import Bridge from './Bridge';
var CatchError_1 = __importDefault(require("./CatchError"));
// import Callbackify from './Callbackify';
var InSeries_1 = __importDefault(require("./InSeries"));
// import PassThrough from './PassThrough';
describe('CatchError', function () {
    it('CatchError 1', function (done) {
        var task = InSeries_1.default(CatchError_1.default(function (next) { return next(); }), Assert_1.default(function (err, res) { return err == null; }), function (next) { return next(); });
        task(done);
    });
    it('CatchError 2', function (done) {
        var task = InSeries_1.default(CatchError_1.default(function (next) { return next(new Error('error')); }), Assert_1.default(function (err, res) { return err != null; }), Assert_1.default(function (err, res) { return res == null; }), function (next) { return next(); });
        task(done);
    });
    it('CatchError 3', function (done) {
        var task = InSeries_1.default(CatchError_1.default(function (next) { throw new Error('error'); }), Assert_1.default(function (err, res) { return err != null; }), Assert_1.default(function (err, res) { return res == null; }), function (next) { return next(); });
        task(done);
    });
    it('CatchError 4', function (done) {
        var task = InSeries_1.default(CatchError_1.default(function (next) { return next(new Error('error'), null); }), Assert_1.default(function (err, res) { return err != null; }), Assert_1.default(function (err, res) { return res == null; }), function (next) { return next(); });
        task(done);
    });
    it('CatchError 5', function (done) {
        var task = InSeries_1.default(CatchError_1.default(function (next) { return next(new Error('error'), null); }), function (next) { return done(); });
        task(null);
    });
});
