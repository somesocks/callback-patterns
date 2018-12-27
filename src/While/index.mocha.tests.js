/* eslint-disable */

const { Assert, While, InSeries, InParallel, PassThrough, CatchError, Logging } = require('../');

describe('While', () => {
	it('Function.length should be at least 1', () => {
		if (While().length < 1) { throw new Error(); }
	});

	it('test with 0 handlers', (done) => {
		While()(done);
	});

	it('test with null callback', (done) => {
		While()();
		setTimeout(done, 16);
	});

	it('works correctly',
		InSeries(
			(next) => next(null, 1),
			While(
				(next, num) => next(null, num < 10),
				(next, num) => next(null, num + 1)
			),
			Assert((...args) => args[0] === 10, 'Value not 10')
		)
	);

	it('catches errors', (done) => {
		While(
			(next) => next(null, true),
			(next) => { throw new Error('error'); }
		)((err, res) => done(err != null ? null : err));
	});

	it('deep loop works correctly',
		InSeries(
			(next) => next(null, 1),
			While(
				(next, num) => next(null, num < 100000),
				(next, num) => next(null, num + 1)
			),
			Assert((...args) => args[0] === 100000, 'Value not 10')
		)
	);

});
