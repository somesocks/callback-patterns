
import Assert from './Assert';
// import Background from './Background';
// import Bridge from './Bridge';
// import Callbackify from './Callbackify';
import CatchError from './CatchError';
// import Delay from './Delay';
// import If from './If';
// import InOrder from './InOrder';
import InParallel from './InParallel';
import InSeries from './InSeries';
import Logging from './Logging';
import PassThrough from './PassThrough';

describe('InParallel', () => {
	const LONG_CHAIN = InParallel(
		...Array(50000).fill(PassThrough)
	);

	it('Parallel Performance', (done) => {
		LONG_CHAIN(done);
	});

	it('Parallel Performance 2', (done) => {
		LONG_CHAIN(done, 1);
	});

	it('Parallel Performance 3', (done) => {
		LONG_CHAIN(done, 1, 2, 3, 4, 5, 6, 7, 8);
	});

	it('Function.length should be at least 1', () => {
		if (InParallel().length < 1) { throw new Error(); }
		if (InParallel(() => {}).length < 1) { throw new Error(); }
		if (InParallel(() => {}, () => {}).length < 1) { throw new Error(); }
	});

	it('test with 0 handlers', (done) => {
		InParallel()(done);
	});

	it('autoboxing works',
		InSeries(
			InParallel(
				(next) => next(),
				(next) => next(null),
				(next) => next(null, 1),
				(next) => next(null, 2, 3)
			),
			Assert(
				(r0, r1, r2, r3) => r0[0] === undefined,
				'autoboxing with empty results failed'
			),
			Assert(
				(r0, r1, r2, r3) => r1[0] === undefined,
				'autoboxing with 0 results failed'
			),
			Assert(
				(r0, r1, r2, r3) => r2[0] === 1,
				'autoboxing with 1 results failed'
			),
			Assert(
				(r0, r1, r2, r3) => r3[0] === 2 && r3[1] === 3,
				'autoboxing with 2 results failed'
			)
		)
	);

	it('test with null return', (done) => {
		InParallel(
			(next) => next(),
			(next) => next()
		)(done);
	});

	it('test with null callback', (done) => {
		const task = InParallel(
			(next) => next(),
			(next) => next()
		);

		(task as any)();

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

describe('InParallel.Flatten', () => {
	const LONG_CHAIN = InParallel.Flatten(
		...Array(50000).fill(PassThrough)
	);

	it('Parallel Performance', (done) => {
		LONG_CHAIN(done);
	});

	it('Parallel Performance 2', (done) => {
		LONG_CHAIN(done, 1);
	});

	it('Parallel Performance 3', (done) => {
		LONG_CHAIN(done, 1, 2, 3, 4, 5, 6, 7, 8);
	});

	it('Function.length should be at least 1', () => {
		if (InParallel.Flatten().length < 1) { throw new Error(); }
		if (InParallel.Flatten(() => {}).length < 1) { throw new Error(); }
		if (InParallel.Flatten(() => {}, () => {}).length < 1) { throw new Error(); }
	});

	it('test with 0 handlers', (done) => {
		InParallel.Flatten()(done);
	});

	it('autoboxing works',
		InSeries(
			InParallel.Flatten(
				(next) => next(),
				(next) => next(null),
				(next) => next(null, 1),
				(next) => next(null, 2, 3)
			),
			Assert(
				(r0, r1, r2, r3) => r0 === undefined,
				(...args) => `autoboxing with empty results failed: ${console.log(args)}`
			),
			Assert(
				(r0, r1, r2, r3) => r1 === undefined,
				'autoboxing with 0 results failed'
			),
			Assert(
				(r0, r1, r2, r3) => r2 === 1,
				'autoboxing with 1 results failed'
			),
			Assert(
				(r0, r1, r2, r3) => r3[0] === 2 && r3[1] === 3,
				'autoboxing with 2 results failed'
			)
		)
	);

	it('test with null return', (done) => {
		InParallel.Flatten(
			(next) => next(),
			(next) => next()
		)(done);
	});

	it('test with null callback', (done) => {
		const task = InParallel.Flatten(
			(next) => next(),
			(next) => next()
		);

		(task as any)();

		setTimeout(done, 16);
	});

	it('catches errors', (done) => {
		InParallel.Flatten(
			(next) => next(),
			(next) => { throw new Error('error'); }
		)((err, res) => done(err != null ? null : err));
	});

	it('doesnt return on no callback', (done) => {
		InSeries(
			InParallel.Flatten(
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
				InParallel.Flatten(
					InParallel.Flatten(
						(next) => next(),
						(next) => { throw new Error('error'); }
					)
				)
			),
			Logging('Error Stack')
		)
	);
});
