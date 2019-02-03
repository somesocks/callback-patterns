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

const { Assert, InSeries, CatchError, PassThrough } = require('./');

const Vet = require('vet');
const { optional, exists, isBoolean, isNumber } = Vet;
const { matches } = Vet.Object;

describe('Assert', () => {
	it('Assert 1',
		InSeries(
			(next) => next(null, true),
			Assert(
				(arg) => isBoolean(arg)
			)
		)
	);

	it('Assert 2', (done) => {
		const chain = InSeries(
			(next) => next(null, false),
			Assert(matches([ isNumber ]))
		)((err) => done(err != null ? null : err));
	});

	it('Assert 3', (done) => {
		const chain = Assert(
			(...args) => matches(optional(exists))(...args)
		);
		chain(done);
	});

	it('Assert 4',
		InSeries(
			(next) => next(null, true),
			CatchError(
				Assert(
					(val) => val === false,
					(val) => `val should be false, is ${val}`
				)
			),
			Assert((...args) => matches([ exists ])(args))
		)
	);

	const LONG_CHAIN = InSeries(
		...Array(100000).fill(
			Assert(
				function (val) { return val > 0; }
			)
		)
	);

	it('Long Chain Performance', (done) => {
		LONG_CHAIN(done, 1, 2, 3, 4, 5, 6);
	});

	const LONG_CHAIN_PASSTHROUGH = InSeries(
		...Array(100000).fill(
			PassThrough
		)
	);

	it('Long Chain Performance (reference)', (done) => {
		LONG_CHAIN_PASSTHROUGH(done, 1, 2, 3, 4, 5, 6);
	});

});
