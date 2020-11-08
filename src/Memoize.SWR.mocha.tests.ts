
import Assert from './Assert';
// import Background from './Background';
// import Bridge from './Bridge';
// import Callbackify from './Callbackify';
// import CatchError from './CatchError';
import Delay from './Delay';
// import If from './If';
// import InOrder from './InOrder';
import InParallel from './InParallel';
import InSeries from './InSeries';
// import Logging from './Logging';
import Memoize from './Memoize';
import PassThrough from './PassThrough';
import TimeIn from './TimeIn';
import Timer from './Timer';

describe('Memoize.SWR', () => {
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
	it('memoize with LRU cache ttl works', (done) => {
		let counter = 0;
		let task = TimeIn((next) => {
      counter = counter + 1;
      console.log('task called', counter);
      next(null, counter);
    }, 10);

		task = Memoize.SWR(task, { staleCache: Memoize.LRUCache(100, 200) });

		let test = InSeries(
      Timer((next) => task(next)),
      Timer((next) => task(next)),
      Timer((next) => task(next)),
      Timer((next) => task(next)),
      Timer((next) => task(next)),
      Timer((next) => task(next)),
      Timer((next) => task(next)),
      Timer((next) => task(next)),
			Delay(400),
      Timer((next) => task(next)),
			Assert(
				(val) => val === 3,
				(val) => `expected val to be 3, got ${val}`
			),
			Assert(
				() => counter === 3,
				() => `expected counter to be 3, got ${counter}`
			)
		);

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
