/* eslint-disable */

const { Assert, InSeries, InParallel, PassThrough, Logging, CatchError } = require('../');

const Vet = require('vet');
const { optional, exists, isBoolean, isNumber } = Vet;
const { matches } = Vet.Object;

describe('Assert', () => {
	it('Assert 1',
		InSeries(
			(next) => next(null, true),
			Logging(
				(...args) => `args ${args}`
			),
			Assert(
				(arg) => {
					console.log('assert arg', arg);
					return isBoolean(arg);
				}
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
				Assert((val) => val === false, (val) => `val should be false, is ${val}`)
			),
			Assert((...args) => matches([ exists ])(args))
		)
	);
});
