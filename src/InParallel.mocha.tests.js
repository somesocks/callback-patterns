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

const { InSeries, InParallel, PassThrough, CatchError, Logging } = require('./');

describe('InParallel', () => {
	const LONG_CHAIN = InParallel(
		...Array(20000).fill(PassThrough)
	);

	it('Parallel Performance', (done) => {
		LONG_CHAIN(done);
	});

	it('Function.length should be at least 1', () => {
		if (InParallel().length < 1) { throw new Error(); }
		if (InParallel(() => {}).length < 1) { throw new Error(); }
		if (InParallel(() => {}, () => {}).length < 1) { throw new Error(); }
	});

	it('test with 0 handlers', (done) => {
		InParallel()(done);
	});

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
