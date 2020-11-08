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
var Delay_1 = __importDefault(require("./Delay"));
var InSeries_1 = __importDefault(require("./InSeries"));
// import Logging from './Logging';
var Memoize_1 = __importDefault(require("./Memoize"));
var TimeIn_1 = __importDefault(require("./TimeIn"));
var Timer_1 = __importDefault(require("./Timer"));
describe('Memoize.SWR', function () {
    // it('Function.length should be at least 1', () => {
    // 	if (Memoize.SWR().length < 1) { throw new Error(); }
    // 	if (Memoize.SWR(() => {}).length < 1) { throw new Error(); }
    // });
    //
    // it('test with 0 handlers', (done) => {
    // 	Memoize.SWR()(done);
    // });
    //
    // it('test with null callback', (done) => {
    // 	(Memoize.SWR() as any)();
    // 	setTimeout(done, 16);
    // });
    //
    // it('catches errors', (done) => {
    // 	Memoize.SWR(
    // 		(next) => { throw new Error('error'); }
    // 	)((err, res) => done(err != null ? null : err));
    // });
    //
    //
    // it('memoize works', (done) => {
    // 	let counter = 0;
    // 	let task = (next) => next(null, ++counter);
    // 	task = Memoize.SWR(task);
    //
    // 	let test = InSeries(
    // 		(next) => task(next),
    // 		(next) => task(next),
    // 		(next) => task(next),
    // 		Assert(
    // 			(val) => val === 1,
    // 			(val) => `expected val to be 1, got ${val}`
    // 		),
    // 		Assert(
    // 			() => counter === 1,
    // 			() => `expected counter to be 1, got ${counter}`
    // 		)
    // 	);
    //
    // 	test(done);
    // });
    //
    // it('memoize joins requests correctly', (done) => {
    // 	let counter = 0;
    //
    // 	let task = InSeries(
    // 		Delay(1000),
    // 		(next) => next(null, ++counter)
    // 	);
    //
    // 	task = Memoize.SWR(task, { staleCache: Memoize.LRUCache(100) });
    //
    // 	let test = InSeries(
    // 		InParallel.Flatten(
    // 			(next) => task(next),
    // 			(next) => task(next),
    // 			(next) => task(next),
    // 		),
    // 		Assert(
    // 			(a, b, c) => a === 1,
    // 			(val) => `expected val to be 1, got ${val}`
    // 		),
    // 		Assert(
    // 			(a, b, c) => b === 1,
    // 			(val) => `expected val to be 1, got ${val}`
    // 		),
    // 		Assert(
    // 			(a, b, c) => c === 1,
    // 			(val) => `expected val to be 1, got ${val}`
    // 		),
    // 		Assert(
    // 			() => counter === 1,
    // 			() => `expected counter to be 1, got ${counter}`
    // 		)
    // 	);
    //
    // 	test(done);
    // });
    //
    // it('memoize with LRU cache works', (done) => {
    // 	let counter = 0;
    // 	let task = (next) => next(null, ++counter);
    // 	task = Memoize.SWR(task, { staleCache: Memoize.LRUCache(100) });
    //
    // 	let test = InSeries(
    // 		(next) => task(next),
    // 		(next) => task(next),
    // 		(next) => task(next),
    // 		Assert(
    // 			(val) => val === 1,
    // 			(val) => `expected val to be 1, got ${val}`
    // 		),
    // 		Assert(
    // 			() => counter === 1,
    // 			() => `expected counter to be 1, got ${counter}`
    // 		)
    // 	);
    //
    // 	test(done);
    // });
    //
    it('memoize with LRU cache ttl works', function (done) {
        var counter = 0;
        var task = TimeIn_1.default(function (next) {
            counter = counter + 1;
            console.log('task called', counter);
            next(null, counter);
        }, 10);
        task = Memoize_1.default.SWR(task, { staleCache: Memoize_1.default.LRUCache(100, 200) });
        var test = InSeries_1.default(Timer_1.default(function (next) { return task(next); }), Timer_1.default(function (next) { return task(next); }), Timer_1.default(function (next) { return task(next); }), Timer_1.default(function (next) { return task(next); }), Timer_1.default(function (next) { return task(next); }), Timer_1.default(function (next) { return task(next); }), Timer_1.default(function (next) { return task(next); }), Timer_1.default(function (next) { return task(next); }), Delay_1.default(400), Timer_1.default(function (next) { return task(next); }), Assert_1.default(function (val) { return val === 3; }, function (val) { return "expected val to be 3, got " + val; }), Assert_1.default(function () { return counter === 3; }, function () { return "expected counter to be 3, got " + counter; }));
        test(done);
    });
    //
    // it('memoize speeds up task', (done) => {
    // 	let slowTask = InSeries(
    // 		PassThrough,
    // 		Delay(1000)
    // 	);
    //
    // 	let fastTask = Memoize.SWR(slowTask);
    //
    // 	let start;
    // 	let finish;
    //
    // 	let test = InSeries(
    // 		(next) => { start = Date.now(); next(); },
    // 		(next) => fastTask(next),
    // 		(next) => fastTask(next),
    // 		(next) => fastTask(next),
    // 		(next) => fastTask(next),
    // 		(next) => fastTask(next),
    // 		(next) => fastTask(next),
    // 		(next) => { finish = Date.now(); next(); },
    // 		Assert(
    // 			() => finish - start < 2000,
    // 			(val) => `expected elapsed time under 2000 ms, got ${finish - start}`
    // 		)
    // 	);
    //
    // 	test(done);
    // });
    //
    //
    // const MEMOIZED_TASK = Memoize.SWR(PassThrough);
    //
    // const SHORT_CHAIN = InSeries(
    // 	...Array(1000).fill(MEMOIZED_TASK)
    // );
    //
    // const LONG_CHAIN = InSeries(
    // 	...Array(1000).fill(SHORT_CHAIN)
    // );
    //
    // it('Long Chain Performance', (done) => {
    // 	LONG_CHAIN(done, 1, 2, 3);
    // });
    //
});
