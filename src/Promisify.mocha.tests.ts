
// import Assert from './Assert';
// import Background from './Background';
// import Bridge from './Bridge';
// import Callbackify from './Callbackify';
// import CatchError from './CatchError';
// import Delay from './Delay';
// import If from './If';
// import InOrder from './InOrder';
// import InParallel from './InParallel';
// import InSeries from './InSeries';
// import Logging from './Logging';
// import Memoize from './Memoize';
// import ParallelFilter from './ParallelFilter';
// import ParallelMap from './ParallelMap';
// import PassThrough from './PassThrough';
import Promisify from './Promisify';

describe('Promisify', () => {
	it('Promisify works', (done) => {
		new Promise((resolve) => resolve())
			.then(
				Promisify((next) => next(null, 1))
			)
			.then(
				(val) => done(val !== 1 ? new Error('missing res') : null)
			);
	});

	it('Promisify accepts multiple arguments', (done) => {
		const task = Promisify(
			(next, a, b, c) => next(null, a + b + c)
		);

		task(1, 2, 3)
			.then(
				(val) => done(val !== 6 ? new Error('missing arguments') : null)
			)
	});

	it('Promisify returns single argument correctly', (done) => {
		const task = Promisify(
			(next, a, b) => next(null, a)
		);

		task(1, 2)
			.then(
				(val) => done(
					val !== 1 ? new Error(`bad results ${val}`) : null
				)
			);
	});

	it('Promisify returns multiple arguments correctly', (done) => {
		const task = Promisify(
			(next, a, b) => next(null, a, b)
		);

		task(1, 2)
			.then(
				(val) => done(
					(val[0] !== 1 || val[1] !== 2) ? new Error(`missing arguments ${val}`) : null
				)
			);
	});


	it('Promisify catches callback errors', (done) => {
		const onCatch = (err) => {
			if (err == null) {
				done(new Error('didnt catch'));
			} else {
				done();
			}
		};

		new Promise((resolve) => resolve())
			.then(
				Promisify((next) => next(new Error('throw error')))
			)
			.catch(onCatch);
	});

	it('Promisify catches thrown errors', (done) => {
		const onCatch = (err) => {
			if (err == null) {
				done(new Error('didnt catch'));
			} else {
				done();
			}
		};

		new Promise((resolve) => resolve())
			.then(
				Promisify((next) => { throw new Error('throw error'); })
			)
			.catch(onCatch);
	});
});
