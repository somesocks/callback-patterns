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

const { InSeries, InParallel, PassThrough, Logging, Timer } = require('./');

describe('Timer', () => {
	it('test with 0 handlers', (done) => {
		Timer()(done);
	});

	it('test with null return', (done) => {
		Timer(
			(next) => next()
		)(done);
	});

	it('Function.length should be at least 1', () => {
		if (Timer().length < 1) { throw new Error(); }
		if (Timer((next) => true).length < 1) { throw new Error(); }
	});

	it('test with null callback', (done) => {
		Timer(
			(next) => next()
		)();
		setTimeout(done, 16);
	});

	it('catches errors', (done) => {
		Timer(
			(next) => { throw new Error('error'); }
		)((err, res) => done(err != null ? null : err));
	});

	it('returns 1', (done) => {
		Timer(
			(next) => next(null, 1)
		)((err, res) => done(
			((err != null) && (res === 1)) ? null : err)
		);
	});

	it('label works', (done) => {
		Timer(
			(next) => next(null, 1),
			'Label'
		)((err, res) => done(
			((err != null) && (res === 1)) ? null : err)
		);
	});

	it('measures time', (done) => {
		Timer(
			(next) => setTimeout(next, 128)
		)(done);
	});
});
