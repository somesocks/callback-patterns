"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Assert_1 = __importDefault(require("./Assert"));
// import Background from './Background';
// import Bridge from './Bridge';
var CatchError_1 = __importDefault(require("./CatchError"));
var Callbackify_1 = __importDefault(require("./Callbackify"));
var InSeries_1 = __importDefault(require("./InSeries"));
// import PassThrough from './PassThrough';
describe('Callbackify', function () {
    it('Function.length should be at least 1', function () {
        if (Callbackify_1.default(function () { }).length < 1) {
            throw new Error();
        }
    });
    it('Callbackify.resolve works', InSeries_1.default(function (next) { return next(null, 2); }, Callbackify_1.default(function (val) { return new Promise(function (resolve, reject) { return resolve(val); }); }), Assert_1.default(function (val) { return val === 2; }, 'Callbackify failed to resolve')));
    it('Callbackify works on a function that doesnt return a promise', InSeries_1.default(function (next) { return next(null, 1); }, Callbackify_1.default(function (val) { return val + 1; }), Assert_1.default(function (val) { return val === 2; }, 'Callbackify failed to resolve')));
    it('Callbackify.reject works', InSeries_1.default(function (next) { return next(null, 2); }, CatchError_1.default(Callbackify_1.default(function (val) { return new Promise(function (resolve, reject) { return reject(val); }); })), Assert_1.default(function (err) { return err !== null; }, 'Callbackify failed to reject')));
    it('test with 0 handlers', function (done) {
        Callbackify_1.default()(done);
    });
    it('test with null return', InSeries_1.default(function (next) { return next(null, 2); }, CatchError_1.default(Callbackify_1.default(function (val) { return null; })), Assert_1.default(function (err) { return err == null; }, 'Callbackify should have rejected null')));
});
