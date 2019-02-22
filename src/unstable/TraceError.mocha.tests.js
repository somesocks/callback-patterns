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

const { InSeries, Delay, InParallel, CatchError, PassThrough, Logging } = require('../');
const TraceError = require('./TraceError');

describe('TraceError tests', () => {
	it('Function.length should be at least 1', () => {
		if (TraceError().length < 1) { throw new Error(); }
		if (TraceError(() => {}).length < 1) { throw new Error(); }
		if (TraceError(() => {}, () => {}).length < 1) { throw new Error(); }
	});

	it('test with 0 handlers', (done) => {
		TraceError()(done);
	});

	it('test with null return', (done) => {
		TraceError(
			(next) => next()
		)(done);
	});

	it('passes errors', (done) => {
		TraceError(
			(next) => next(new Error('error'))
		)((err, res) => done(err != null ? null : err));
	});

	it(
		'deep error stack works',
		InSeries(
			CatchError(
				TraceError(
					InSeries(
						InSeries(
							(next) => next(),
							Delay(500),
							(next) => { throw new Error('error'); }
						)
					)
				)
			),
			Logging(
				'Error Stack\n',
				(err) => err
			)
		)
	);

});
