
// import optional from 'vet/optional';
// import exists from 'vet/exists';
import isBoolean from 'vet/booleans/isBoolean';
// import isNumber from 'vet/numbers/isNumber';
// import isShape from 'vet/objects/isShape';

import Assert from './Assert';
import CatchError from './CatchError';
import InSeries from './InSeries';
import PassThrough from './PassThrough';

describe('Assert', () => {
	it('Assert',
		InSeries(
			(next) => next(null, true),
			Assert(
				(arg) => isBoolean(arg)
			)
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
