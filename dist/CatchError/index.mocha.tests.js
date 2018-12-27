/* eslint-disable */

const { InSeries, InParallel, PassThrough, Logging, CatchError } = require('../');

describe('CatchError', () => {
	it('CatchError 1', (done) => {
		const chain = CatchError(
			(next) => next()
		);

		chain(done);
	});

	it('CatchError 2', (done) => {
		const chain = CatchError(
			(next) => next(new Error('error'))
		);

		chain(done);
	});

	it('CatchError 3', (done) => {
		const chain = CatchError(
			(next) => { throw new Error('error'); }
		);

		chain(done);
	});

	it('CatchError 4', (done) => {
		const chain = CatchError(
			(next) => next(new Error('error'), null)
		);

		chain(done);
	});

	it('CatchError 5', (done) => {
		const chain = InSeries(
				CatchError(
				(next) => next(new Error('error'), null)
			),
			(next) => done()
		);

		chain(null);
	});
});
