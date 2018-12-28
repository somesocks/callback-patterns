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

const { Assert, InSeries, InParallel, PassThrough, Logging, ParallelMap } = require('./');

describe('ParallelMap', () => {
	it('Function.length should be at least 1', () => {
		if (ParallelMap((next) => true).length < 1) { throw new Error(); }
	});

	it('test with 0 args', (done) => {
		const task = ParallelMap((next, item) => next(null, item));
		task(done);
	});

	it('catches errors', (done) => {
		const task = ParallelMap((next, item) => { throw new Error('error'); });

		const onDone = (err, res) => done(err != null ? null : err);

		task(onDone, 1, 2, 3);
	});

	it('works 1', (done) => {
		const task =
			InSeries(
				(next) => next(null, 1, 2, 3),
				ParallelMap((next, item) => next(null, item + 1)),
				Assert(
					(a, b, c) => a === 2 && b === 3 && c === 4
				)
			);

		task(done);
	});



	it('ParallelMap performance', (done) => {
		const task =
			InSeries(
				ParallelMap((next, item) => next(null, item + 1))
			);

		task(done, ...Array(10000).fill(1));
	});


});
