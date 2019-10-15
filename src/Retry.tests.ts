
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
// import Promisify from './Promisify';
import Retry from './Retry';

describe('Retry', () => {
	it('test with 0 handlers', (done) => {
		(Retry as any)()(done);
	});

	it('test with null return', (done) => {
		Retry(
			(next) => next()
		)(done);
	});

	it('Function.length should be at least 1', () => {
		if ((Retry as any)().length < 1) { throw new Error(); }
		if (Retry((next) => true).length < 1) { throw new Error(); }
	});

	it('test with null callback', (done) => {
		const task = Retry(
			(next) => next()
		);

		(task as any)();
		setTimeout(done, 16);
	});

	it('catches errors', (done) => {
		Retry(
			(next) => { throw new Error('error'); }
		)((err, res) => done(err != null ? null : err));
	});

	it('returns 1', (done) => {
		Retry(
			(next) => next(null, 1)
		)((err, res) => done(
			((err != null) && (res === 1)) ? null : err)
		);
	});
});
