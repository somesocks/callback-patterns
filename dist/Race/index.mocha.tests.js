/* eslint-disable */

const { InSeries, InParallel, Race, PassThrough, Logging } = require('../');

describe('Race', () => {
	it('test with 0 handlers', (done) => {
		Race()(done);
	});

	it('test with null return', (done) => {
		Race(
			(next) => next(),
			(next) => next()
		)(done);
	});

	it('Function.length should be at least 1', () => {
		if (Race().length < 1) { throw new Error(); }
		if (Race((next) => true).length < 1) { throw new Error(); }
	});

	it('test with null callback', (done) => {
		Race(
			(next) => next(),
			(next) => next()
		)();
		setTimeout(done, 16);
	});

	it('catches errors', (done) => {
		Race(
			(next) => { throw new Error('error'); }
		)((err, res) => done(err != null ? null : err));
	});

	it('returns 1', (done) => {
		Race(
			(next) => next(null, 1),
			(next) => {}
		)((err, res) => done(
			((err != null) && (res === 1)) ? null : err)
		);
	});

	it('returns 1', (done) => {
		Race(
			(next) => next(null, 1),
			(next) => next(null, 2)
		)((err, res) => done(
			((err != null) && (res === 1)) ? null : err)
		);
	});

	it('returns 1', (done) => {
		Race(
			(next) => setTimeout(next, 500, null, 2),
			(next) => next(null, 1)
		)((err, res) => done(
			((err != null) && (res === 1)) ? null : err)
		);
	});
});
