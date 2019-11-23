
import Assert from '../Assert';
// import Background from './Background';
// import Bridge from './Bridge';
// import Callbackify from './Callbackify';
import CatchError from '../CatchError';
import Delay from '../Delay';
// import If from './If';
// import InOrder from './InOrder';
import InParallel from '../InParallel';
import InSeries from '../InSeries';
import Joinable from './Joinable';
import Logging from '../Logging';
// import PassThrough from './PassThrough';

import process from 'process';

describe('Joinable', () => {
	it('Function.length should be at least 1', () => {
		if ((Joinable as any)().length < 1) { throw new Error(); }
	});

	it('Joinable works 1', (done) => {

		const task = Joinable(
			(next) => next(null, 1)
		);

		const record = task(() => {});

		const verify = InSeries(
			(next) => record.join(next),
			Assert(
				(val) => val === 1
			)
		);

		verify(done);
	});

	it('Joinable works 2', (done) => {

		const task = Joinable(
			(next) => next(null, 1)
		);

		const record = task(() => {});

		const verify = InSeries(
			InParallel.Flatten(
				(next) => record.join(next),
				(next) => record.join(next),
				(next) => record.join(next),
			),
			// Logging((...args) => args),
			Assert((...args) => args.length === 3),
			Assert((...args) => args[0] === 1),
			Assert((...args) => args[1] === 1),
			Assert((...args) => args[2] === 1),
		);

		verify(done);
	});

	it('Joinable handles errors', (done) => {

		const task = Joinable(
			(next) => next('error!')
		);

		const record = task(() => {});

		const verify = InSeries(
			InParallel.Flatten(
				CatchError(
					(next) => record.join(next),
				),
				CatchError(
					(next) => record.join(next),
				),
				CatchError(
					(next) => record.join(next),
				),
			),
			// Logging((...args) => args),
			Assert((...args) => args.length === 3),
			Assert((...args) => args[0] === 'error!'),
			Assert((...args) => args[1] === 'error!'),
			Assert((...args) => args[2] === 'error!'),
		);

		verify(done);
	});

	it('deep join doesnt crash', (done) => {
		const task = Joinable(
			InSeries(
				Delay(1000),
				(next) => next(null, 1)
			)
		);

		const record = task(
			(err, res) => {
				if (err) { done(err); }
				else if (res != 1) { done('error'); }
				else { done(); }
			}
		);

		const heapBefore = process.memoryUsage();

		for (let i = 0; i < 1000; i++) {
			record.join(
				(err) => { if (err) { done(err); } }
			);
		}

		const heapAfter = process.memoryUsage();

		console.log('process mem heap/join', (heapAfter.heapUsed - heapBefore.heapUsed) / 1000);

	});

	it('deeper join doesnt crash', (done) => {
		const task = Joinable(
			InSeries(
				Delay(1000),
				(next) => next(null, 1)
			)
		);

		const record = task(
			(err, res) => {
				if (err) { done(err); }
				else if (res != 1) { done('error'); }
				else { done(); }
			}
		);

		const heapBefore = process.memoryUsage();

		for (let i = 0; i < 10000; i++) {
			record.join(
				(err) => { if (err) { done(err); } }
			);
		}

		const heapAfter = process.memoryUsage();

		console.log('process mem heap/join', (heapAfter.heapUsed - heapBefore.heapUsed) / 10000);

	});

	it('suuuper-deep join doesnt crash', (done) => {
		const task = Joinable(
			InSeries(
				Delay(1000),
				(next) => next(null, 1)
			)
		);

		const record = task(
			(err, res) => {
				if (err) { done(err); }
				else if (res != 1) { done('error'); }
				else { done(); }
			}
		);

		const heapBefore = process.memoryUsage();

		for (let i = 0; i < 100000; i++) {
			record.join(
				(err, res) => {
					if (err) { done(err); }
					else if (res != 1) { done('error'); }
				}
			);
		}

		const heapAfter = process.memoryUsage();

		console.log('process mem heap/join', (heapAfter.heapUsed - heapBefore.heapUsed) / 100000);

	});

});
