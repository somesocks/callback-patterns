
import { assert } from 'chai';

// import Assert from './Assert';
// import Background from './Background';
// import Bridge from './Bridge';
// import Callbackify from './Callbackify';
// import CatchError from './CatchError';
// import Delay from './Delay';
// import If from './If';
// import InOrder from './InOrder';
import InParallel from './InParallel';
import InSeries from './InSeries';
import Logging from './Logging';
// import Memoize from './Memoize';
// import ParallelFilter from './ParallelFilter';
// import ParallelMap from './ParallelMap';
// import PassThrough from './PassThrough';
// import Promisify from './Promisify';
// import Retry from './Retry';
import Throttle from './Throttle';

describe('Throttle', () => {
	it('test with 0 handlers', (done) => {
		Throttle()(done);
	});

	it('Function.length should be at least 1', () => {
		if (Throttle().length < 1) { throw new Error(); }
		if (Throttle((next) => true).length < 1) { throw new Error(); }
	});

	it('throttling works', (done) => {
		const arr : any[] = [];

		const task = Throttle(
			InSeries(
				Logging('task before'),
				(next, i, timeout) => setTimeout(next, timeout, null, i),
				Logging('task after '),
				(next, i) => {
					arr.push(i);
					next();
				}
			)
		);

		InSeries(
			InParallel(
				(next) => task(next, 1, 300),
				(next) => task(next, 2, 200),
				(next) => task(next, 3, 100),
				(next) => task(next, 4, 0)
			),
			(next, res) => {
				assert.deepEqual(arr, [ 1, 2, 3, 4 ]);
				next();
			}
		)(done);
	});

	it('throttling works 2', (done) => {
		const arr : any[] = [];

		const task = Throttle(
			InSeries(
				Logging('task before'),
				(next, i, timeout) => setTimeout(next, timeout, null, i),
				Logging('task after '),
				(next, i) => {
					arr.push(i);
					next();
				}
			),
			2
		);

		InSeries(
			InParallel(
				(next) => task(next, 1, 100),
				(next) => task(next, 2, 0),
				(next) => task(next, 3, 100),
				(next) => task(next, 4, 0)
			),
			(next, res) => {
				assert.deepEqual(arr, [ 2, 1, 3, 4 ]);
				next();
			}
		)(done);
	});
});
