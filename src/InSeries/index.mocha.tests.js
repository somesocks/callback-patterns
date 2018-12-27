/* eslint-disable */

const { InSeries, InParallel, CatchError, PassThrough, Logging } = require('../');

describe('InSeries tests', () => {
	it('Function.length should be at least 1', () => {
		if (InSeries().length < 1) { throw new Error(); }
		if (InSeries(() => {}).length < 1) { throw new Error(); }
		if (InSeries(() => {}, () => {}).length < 1) { throw new Error(); }
	});

	it('test with 0 handlers', (done) => {
		InSeries()(done);
	});

	it('test with null return', (done) => {
		InSeries(
			(next) => next(),
			(next) => next()
		)(done);
	});

	it('test with null callback', (done) => {
		InSeries(
			(next) => next(),
			(next) => next()
		)();
		setTimeout(done, 16);
	});

	it('catches errors', (done) => {
		InSeries(
			(next) => next(),
			(next) => { throw new Error('error'); }
		)((err, res) => done(err != null ? null : err));
	});

	it('catches errors 2', (done) => {
		InSeries(
			(next) => next(),
			(next) => { throw new Error('error'); }
		)((err, res) => done(err != null ? null : err));
	});

	it('callback shouldnt get called', (done) => {
		InSeries(
			(next) => {}
		)(() => done(new Error('called')));
		setTimeout(done, 500);
	});

	it(
		'deep error stack works',
		InSeries(
			CatchError(
				InSeries(
					InSeries(
						(next) => next(),
						(next) => { throw new Error('error'); }
					)
				)
			),
			Logging('Error Stack')
		)
	);

	it('Long Chain Performance', (done) => {
		const chain = InSeries(
			...Array(100000).fill(PassThrough)
		);

		chain(done, 1, 2, 3);
	});

});
