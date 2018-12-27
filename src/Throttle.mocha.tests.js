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

const { InSeries, InParallel, Race, PassThrough, Logging, Throttle } = require('../dist');

const { assert } = require('chai');

describe('Throttle', () => {
	it('test with 0 handlers', (done) => {
		Throttle()(done);
	});

	it('Function.length should be at least 1', () => {
		if (Throttle().length < 1) { throw new Error(); }
		if (Throttle((next) => true).length < 1) { throw new Error(); }
	});

	it('test with null callback', (done) => {
		Throttle(
			(next) => next(),
			(next) => next()
		)();
		setTimeout(done, 16);
	});

	it('throttling works', (done) => {
		const arr = [];

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
		const arr = [];

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
