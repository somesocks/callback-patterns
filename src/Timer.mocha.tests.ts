
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
// import Retry from './Retry';
// import Throttle from './Throttle';
// import TimeIn from './TimeIn';
// import TimeOut from './TimeOut';
import Timer from './Timer';

describe('Timer', () => {
	it('test with 0 handlers', (done) => {
		(Timer as any)()(done);
	});

	it('test with null return', (done) => {
		(Timer as any)(
			(next) => next()
		)(done);
	});

	it('Function.length should be at least 1', () => {
		if ((Timer as any)().length < 1) { throw new Error(); }
		if ((Timer as any)((next) => true).length < 1) { throw new Error(); }
	});

	it('test with null callback', (done) => {
		(Timer as any)(
			(next) => next()
		)();
		setTimeout(done, 16);
	});

	it('catches errors', (done) => {
		(Timer as any)(
			(next) => { throw new Error('error'); }
		)((err, res) => done(err != null ? null : err));
	});

	it('returns 1', (done) => {
		(Timer as any)(
			(next) => next(null, 1)
		)((err, res) => done(
			((err != null) && (res === 1)) ? null : err)
		);
	});

	it('label works', (done) => {
		Timer(
			(next) => next(null, 1),
			'Label'
		)((err, res) => done(
			((err != null) && (res === 1)) ? null : err)
		);
	});

	it('measures time', (done) => {
		(Timer as any)(
			(next) => setTimeout(next, 128)
		)(done);
	});
});
