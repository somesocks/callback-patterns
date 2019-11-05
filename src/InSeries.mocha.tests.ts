
import Assert from './Assert';
// import Background from './Background';
// import Bridge from './Bridge';
// import Callbackify from './Callbackify';
import CatchError from './CatchError';
// import Delay from './Delay';
// import If from './If';
// import InOrder from './InOrder';
// import InParallel from './InParallel';
import InSeries from './InSeries';
import Logging from './Logging';
import PassThrough from './PassThrough';

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
		const task = InSeries(
			(next) => next(),
			(next) => next()
		);

		(task as any)();

		setTimeout(done, 16);
	});

	it('works 1',
		InSeries(
			(next) => next(null, 1),
			(next, val) => next(null, val + 1),
			(next, val) => next(null, val + 1),
			(next, val) => next(null, val + 1),
			Assert(
				(val) => val === 4
			)
		)
	);

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

	const SHORT_CHAIN = InSeries(
		...Array(1000).fill(PassThrough)
	);

	const LONG_CHAIN = InSeries(
		...Array(1000).fill(SHORT_CHAIN)
	);


	it('Long Chain Performance', (done) => {
		LONG_CHAIN(done, 1, 2, 3);
	});

});
