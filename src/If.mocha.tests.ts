
import Assert from './Assert';
// import Background from './Background';
// import Bridge from './Bridge';
// import CatchError from './CatchError';
// import Delay from './Delay';
import If from './If';
// import Callbackify from './Callbackify';
import InSeries from './InSeries';
// import PassThrough from './PassThrough';

describe('If', () => {
	it('Function.length should be at least 1', () => {
		if (If().length < 1) { throw new Error(); }
		if (If(() => {}).length < 1) { throw new Error(); }
		if (If(() => {}, () => {}).length < 1) { throw new Error(); }
	});

	it('test with 0 handlers', (done) => {
		If()(done);
	});

	it('test with null callback', (done) => {
		(If() as any)();
		setTimeout(done, 16);
	});

	it('catches errors', (done) => {
		If(
			(next) => next(null, true),
			(next) => { throw new Error('error'); }
		)((err, res) => done(err != null ? null : err));
	});

	it('then works',
		InSeries(
			(next) => next(null, 1),
			If(
				(next, i) => next(null, i > 0),
				(next) => next(null, true),
				(next) => next(null, false)
			),
			Assert(
				(val) => val === true
			)
		)
	);

	it('else works',
		InSeries(
			(next) => next(null, -1),
			If(
				(next, i) => next(null, i > 0),
				(next) => next(null, true),
				(next) => next(null, false)
			),
			Assert(
				(val) => val === false
			)
		)
	);


});
