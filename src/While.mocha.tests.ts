
import Assert from './Assert';
// import Background from './Background';
// import Bridge from './Bridge';
// import Callbackify from './Callbackify';
// import CatchError from './CatchError';
// import Delay from './Delay';
// import If from './If';
// import InOrder from './InOrder';
// import InParallel from './InParallel';
import InSeries from './InSeries';
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
// import Timer from './Timer';
import While from './While';

describe('While', () => {
	it('Function.length should be at least 1', () => {
		if (While().length < 1) { throw new Error(); }
	});

	it('test with 0 handlers', (done) => {
		While()(done);
	});

	it('test with null callback', (done) => {
		(While() as any)();
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
