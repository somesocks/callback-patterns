
import Assert from './Assert';
// import Background from './Background';
// import Bridge from './Bridge';
// import Callbackify from './Callbackify';
// import CatchError from './CatchError';
// import Delay from './Delay';
// import If from './If';
import InOrder from './InOrder';
import InSeries from './InSeries';
import PassThrough from './PassThrough';

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
		const task = InOrder(
			(next) => next(),
			(next) => next()
		);

		(task as any)();

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

	it('works 1',
		InSeries(
			(next) => next(null, 1),
			InOrder(
				(next, val) => next(null, val + 1),
				(next, val) => next(null, val + 1),
				(next, val) => next(null, val + 1)
			),
			Assert(
				(val) => val === 1
			)
		)
	);

	it('works 2',
		InSeries(
			(next) => next(null, { a: 1 }),
			InOrder(
				(next, val) => { val.a++; next(); },
				(next, val) => { val.a++; next(); },
				(next, val) => { val.a++; next(); }
			),
			Assert(
				(val) => val.a === 4
			)
		)
	);

});
