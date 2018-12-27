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

const { InSeries, CatchError } = require('./');

describe('CatchError', () => {
	it('CatchError 1', (done) => {
		const chain = CatchError(
			(next) => next()
		);

		chain(done);
	});

	it('CatchError 2', (done) => {
		const chain = CatchError(
			(next) => next(new Error('error'))
		);

		chain(done);
	});

	it('CatchError 3', (done) => {
		const chain = CatchError(
			(next) => { throw new Error('error'); }
		);

		chain(done);
	});

	it('CatchError 4', (done) => {
		const chain = CatchError(
			(next) => next(new Error('error'), null)
		);

		chain(done);
	});

	it('CatchError 5', (done) => {
		const chain = InSeries(
			CatchError(
				(next) => next(new Error('error'), null)
			),
			(next) => done()
		);

		chain(null);
	});
});
