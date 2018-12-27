/* eslint-disable */

const { InOrder, InParallel, CatchError, PassThrough, Logging } = require('../');

describe('InOrder', () => {
	it('Long Chain Performance', (done) => {
		const chain = InOrder(
			...Array(100000).fill(PassThrough)
		);

		chain(done, 1, 2, 3);
	});

	it('Function.length should be at least 1', () => {
		if (InOrder().length < 1) { throw new Error(); }
		if (InOrder(() => {}).length < 1) { throw new Error(); }
		if (InOrder(() => {}, () => {}).length < 1) { throw new Error(); }
	});

	it('test with 0 handlers', (done) => {
		InOrder()(done);
	});

	it('test with null return', (done) => {
		InOrder(
			(next) => next(),
			(next) => next()
		)(done);
	});

	it('test with null callback', (done) => {
		InOrder(
			(next) => next(),
			(next) => next()
		)();
		setTimeout(done, 16);
	});

	it('catches errors', (done) => {
		InOrder(
			(next) => next(),
			(next) => { throw new Error('error'); }
		)((err, res) => done(err != null ? null : err));
	});

	it('catches errors 2', (done) => {
		InOrder(
			(next) => next(),
			(next) => { throw new Error('error'); }
		)((err, res) => done(err != null ? null : err));
	});

	it('callback shouldnt get called', (done) => {
		InOrder(
			(next) => {}
		)(() => done(new Error('called')));
		setTimeout(done, 500);
	});
});
