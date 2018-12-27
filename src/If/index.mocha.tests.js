/* eslint-disable */

const { If, InSeries, InParallel, PassThrough, CatchError, Logging } = require('../');

describe('If', () => {
	it('Function.length should be at least 1', () => {
		if (If().length < 1) { throw new Error(); }
		if (If(() => {}).length < 1) { throw new Error(); }
		if (If(() => {}, () => {}).length < 1) { throw new Error(); }
	});

	it('test with 0 handlers', (done) => {
		If()(done);
	});

	it('test with null callback', (done) => {
		If()();
		setTimeout(done, 16);
	});

	it('catches errors', (done) => {
		If(
			(next) => next(null, true),
			(next) => { throw new Error('error'); }
		)((err, res) => done(err != null ? null : err));
	});
});
