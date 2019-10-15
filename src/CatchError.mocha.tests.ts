
import Assert from './Assert';
// import Background from './Background';
// import Bridge from './Bridge';
import CatchError from './CatchError';
// import Callbackify from './Callbackify';
import InSeries from './InSeries';
// import PassThrough from './PassThrough';

describe('CatchError', () => {
	it('CatchError 1', (done) => {
		const task = InSeries(
			CatchError(
				(next) => next()
			),
			Assert(
				(err, res) => err == null
			),
			(next) => next()
		);


		task(done);
	});

	it('CatchError 2', (done) => {
		const task = InSeries(
			CatchError(
				(next) => next(new Error('error'))
			),
			Assert(
				(err, res) => err != null
			),
			Assert(
				(err, res) => res == null
			),
			(next) => next()
		);

		task(done);
	});

	it('CatchError 3', (done) => {
		const task = InSeries(
			CatchError(
				(next) => { throw new Error('error'); }
			),
			Assert(
				(err, res) => err != null
			),
			Assert(
				(err, res) => res == null
			),
			(next) => next()
		);

		task(done);
	});

	it('CatchError 4', (done) => {
		const task = InSeries(
			CatchError(
				(next) => next(new Error('error'), null)
			),
			Assert(
				(err, res) => err != null
			),
			Assert(
				(err, res) => res == null
			),
			(next) => next()
		);

		task(done);
	});

	it('CatchError 5', (done) => {
		const task = InSeries(
			CatchError(
				(next) => next(new Error('error'), null)
			),
			(next) => done()
		);

		task(null as any);
	});
});
