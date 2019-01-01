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

const { Assert, InSeries, InParallel, PassThrough, CatchError, Logging } = require('./');

describe('InParallel', () => {
	const LONG_CHAIN = InParallel(
		...Array(50000).fill(PassThrough)
	);

	it('Parallel Performance', (done) => {
		LONG_CHAIN(done);
	});

	it('Parallel Performance 2', (done) => {
		LONG_CHAIN(done, 1);
	});

	it('Parallel Performance 3', (done) => {
		LONG_CHAIN(done, 1, 2, 3, 4, 5, 6, 7, 8);
	});

	it('Function.length should be at least 1', () => {
		if (InParallel().length < 1) { throw new Error(); }
		if (InParallel(() => {}).length < 1) { throw new Error(); }
		if (InParallel(() => {}, () => {}).length < 1) { throw new Error(); }
	});

	it('test with 0 handlers', (done) => {
		InParallel()(done);
	});

	it('autoboxing works',
		InSeries(
			InParallel(
				(next) => next(),
				(next) => next(null),
				(next) => next(null, 1),
				(next) => next(null, 2, 3)
			),
			Assert(
				(r0, r1, r2, r3) => r0 === undefined,
				'autoboxing with empty results failed'
			),
			Assert(
				(r0, r1, r2, r3) => r1 === undefined,
				'autoboxing with 0 results failed'
			),
			Assert(
				(r0, r1, r2, r3) => r2 === 1,
				'autoboxing with 1 results failed'
			),
			Assert(
				(r0, r1, r2, r3) => r3[0] === 2 && r3[1] === 3,
				'autoboxing with 2 results failed'
			)
		)
	);

	it('test with null return', (done) => {
		InParallel(
			(next) => next(),
			(next) => next()
		)(done);
	});

	it('test with null callback', (done) => {
		InParallel(
			(next) => next(),
			(next) => next()
		)();
		setTimeout(done, 16);
	});

	it('catches errors', (done) => {
		InParallel(
			(next) => next(),
			(next) => { throw new Error('error'); }
		)((err, res) => done(err != null ? null : err));
	});

	it('doesnt return on no callback', (done) => {
		InSeries(
			InParallel(
				PassThrough,
				(next) => null
			),
			() => { throw new Error('shouldnt get here'); }
		)(done);

		setTimeout(done, 500);
	});

	it(
		'deep error stack works',
		InSeries(
			CatchError(
				InParallel(
					InParallel(
						(next) => next(),
						(next) => { throw new Error('error'); }
					)
				)
			),
			Logging('Error Stack')
		)
	);
});
