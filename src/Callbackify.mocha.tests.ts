
import Assert from './Assert';
// import Background from './Background';
// import Bridge from './Bridge';
import CatchError from './CatchError';
import Callbackify from './Callbackify';
import InSeries from './InSeries';
// import PassThrough from './PassThrough';

describe('Callbackify', () => {
	it('Function.length should be at least 1', () => {
		if (Callbackify(() => {}).length < 1) { throw new Error(); }
	});

	it(
		'Callbackify.resolve works',
		InSeries(
			(next) => next(null, 2),
			Callbackify(
				(val) => new Promise((resolve, reject) => resolve(val))
			),
			Assert((val) => val === 2, 'Callbackify failed to resolve')
		)
	);

	it(
		'Callbackify works on a function that doesnt return a promise',
		InSeries(
			(next) => next(null, 1),
			Callbackify(
				(val) => val + 1
			),
			Assert((val) => val === 2, 'Callbackify failed to resolve')
		)
	);


	it(
		'Callbackify.reject works',
		InSeries(
			(next) => next(null, 2),
			CatchError(
				Callbackify(
					(val) => new Promise((resolve, reject) => reject(val))
				)
			),
			Assert((err) => err !== null, 'Callbackify failed to reject')
		)
	);


	it('test with 0 handlers', (done) => {
		(Callbackify as any)()(done);
	});

	it('test with null return',
		InSeries(
			(next) => next(null, 2),
			CatchError(
				Callbackify(
					(val) => null
				)
			),
			Assert((err) => err == null, 'Callbackify should have rejected null')
		)
	);
});
