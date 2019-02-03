/* eslint-env mocha, node */
/* eslint-disable es5/no-destructuring */
/* eslint-disable es5/no-block-scoping */
/* eslint-disable es5/no-shorthand-properties */
/* eslint-disable es5/no-arrow-expression */
/* eslint-disable es5/no-arrow-functions */
/* eslint-disable es5/no-rest-parameters */
/* eslint-disable es5/no-spread */
/* eslint-disable es5/no-template-literals */
/* eslint-disable es5/no-es6-methods */

const { Assert, InSeries, PassThrough, Memoize, Delay } = require('./');

describe('Memoize', () => {
	it('Function.length should be at least 1', () => {
		if (Memoize().length < 1) { throw new Error(); }
		if (Memoize(() => {}).length < 1) { throw new Error(); }
	});

	it('test with 0 handlers', (done) => {
		Memoize()(done);
	});

	it('test with null callback', (done) => {
		Memoize()();
		setTimeout(done, 16);
	});

	it('catches errors', (done) => {
		Memoize(
			(next) => { throw new Error('error'); }
		)((err, res) => done(err != null ? null : err));
	});


	it('memoize works', (done) => {
		var counter = 0;
		var task = (next) => next(null, ++counter);
		task = Memoize(task);

		var test = InSeries(
			(next) => task(next),
			(next) => task(next),
			(next) => task(next),
			Assert(
				(val) => val === 1,
				(val) => `expected val to be 1, got ${val}`
			),
			Assert(
				() => counter === 1,
				() => `expected counter to be 1, got ${counter}`
			)
		);

		test(done);
	});

	it('memoize speeds up task', (done) => {
		var slowTask = InSeries(
			PassThrough,
			Delay(1000)
		);

		var fastTask = Memoize(slowTask);

		var start;
		var finish;

		var test = InSeries(
			(next) => { start = Date.now(); next(); },
			(next) => fastTask(next),
			(next) => fastTask(next),
			(next) => fastTask(next),
			(next) => fastTask(next),
			(next) => fastTask(next),
			(next) => fastTask(next),
			(next) => { finish = Date.now(); next(); },
			Assert(
				() => finish - start < 2000,
				(val) => `expected elapsed time under 2000 ms, got ${finish - start}`
			)
		);

		test(done);
	});


	const MEMOIZED_TASK = Memoize(PassThrough);

	const SHORT_CHAIN = InSeries(
		...Array(1000).fill(MEMOIZED_TASK)
	);

	const LONG_CHAIN = InSeries(
		...Array(1000).fill(SHORT_CHAIN)
	);

	it('Long Chain Performance', (done) => {
		LONG_CHAIN(done, 1, 2, 3);
	});


});
