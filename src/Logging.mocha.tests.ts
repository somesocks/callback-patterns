
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
import Logging from './Logging';
// import PassThrough from './PassThrough';

describe('Logging', () => {
	it('Function.length should be at least 1', () => {
		if ((Logging as any)().length < 1) { throw new Error(); }
	});

	it('Logging with string', (done) => {
		Logging('test')(done, 1, 2, 3);
	});

	it('Logging with function', (done) => {
		Logging((...args) => `${args}`)(done, 1, 2, 3);
	});

	it('Logging with multiple statements function', (done) => {
		Logging(
			'Logging test',
			{ test: 1 },
			1,
			false,
			(...args) => `${args[0]}`,
			(...args) => `${args[1]}`,
			(...args) => `${args[2]}`,
			(...args) => `${args}`
		)(done, 1, 2, 3);
	});
});
