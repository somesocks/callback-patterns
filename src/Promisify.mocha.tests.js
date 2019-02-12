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

const {
	InSeries,
	Assert,
	CatchError,
	PassThrough,
	PromiseWrapper,
	Logging,
	Promisify,
} = require('../dist');

describe('Promisify', () => {
	it('Promisify works', (done) => {
		new Promise((resolve) => resolve())
			.then(
				Promisify((next) => next(null, 1))
			)
			.then(
				(val) => done(val !== 1 ? new Error('missing res') : null)
			);
	});

	it('Promisify accepts multiple arguments', (done) => {
		const task = Promisify(
			(next, a, b, c) => next(null, a + b + c)
		);

		task(1, 2, 3)
			.then(
				(val) => done(val !== 6 ? new Error('missing arguments') : null)
			)
	});

	it('Promisify returns single argument correctly', (done) => {
		const task = Promisify(
			(next, a, b) => next(null, a)
		);

		task(1, 2)
			.then(
				(val) => done(
					val !== 1 ? new Error(`bad results ${val}`) : null
				)
			);
	});

	it('Promisify returns multiple arguments correctly', (done) => {
		const task = Promisify(
			(next, a, b) => next(null, a, b)
		);

		task(1, 2)
			.then(
				(val) => done(
					(val[0] !== 1 || val[1] !== 2) ? new Error(`missing arguments ${val}`) : null
				)
			);
	});


	it('Promisify catches callback errors', (done) => {
		const onCatch = (err) => {
			if (err == null) {
				done(new Error('didnt catch'));
			} else {
				done();
			}
		};

		new Promise((resolve) => resolve())
			.then(
				Promisify((next) => next(new Error('throw error')))
			)
			.catch(onCatch);
	});

	it('Promisify catches thrown errors', (done) => {
		const onCatch = (err) => {
			if (err == null) {
				done(new Error('didnt catch'));
			} else {
				done();
			}
		};

		new Promise((resolve) => resolve())
			.then(
				Promisify((next) => { throw new Error('throw error'); })
			)
			.catch(onCatch);
	});
});
