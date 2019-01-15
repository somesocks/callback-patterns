/* eslint-env mocha, node */
/* eslint-disable es5/no-destructuring */
/* eslint-disable es5/no-block-scoping */
/* eslint-disable es5/no-shorthand-properties */
/* eslint-disable es5/no-arrow-expression */
/* eslint-disable es5/no-arrow-functions */
/* eslint-disable es5/no-rest-parameters */
/* eslint-disable es5/no-spread */
/* eslint-disable es5/no-template-literals */
/* eslint-disable es5/no-es6-methods */

const { InSeries, Assert, CatchError, PassThrough, Callbackify, Logging } = require('../dist');

describe('Callbackify', () => {
	it('Function.length should be at least 1', () => {
		if (Callbackify().length < 1) { throw new Error(); }
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
		Callbackify()(done);
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
