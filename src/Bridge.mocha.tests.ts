
// import optional from 'vet/optional';
// import exists from 'vet/exists';
// import isBoolean from 'vet/booleans/isBoolean';
// import isNumber from 'vet/numbers/isNumber';
// import isShape from 'vet/objects/isShape';

import AsyncTask from './types/AsyncTask';
import Task from './types/Task';

import Assert from './Assert';
// import Background from './Background';
import Bridge from './Bridge';
// import CatchError from './CatchError';
import InSeries from './InSeries';
import PassThrough from './PassThrough';

describe('Bridge', () => {
	it('Function.length should be at least 1', () => {
		if (Bridge().length < 1) { throw new Error(); }
		if (Bridge(() => {}).length < 1) { throw new Error(); }
	});

	const EXAMPLE_BRIDGE = Bridge();

	const FAILING_BRIDGE_1 = Bridge(
		(next) => next(new Error('fail'))
	);

	const FAILING_BRIDGE_2 = Bridge(
		(next) => { throw new Error('fail'); }
	);

	it(
		'Bridge works in callback mode',
		InSeries(
			(next) => next(null, 2),
			EXAMPLE_BRIDGE,
			Assert((val) => val === 2, 'callback mode failed to pass args through')
		)
	);

	it(
		'Bridge fails correctly in callback mode',
		(done) => {
			FAILING_BRIDGE_1(
				(err, res) => done(err == null ? new Error('bridge should have failed') : null)
			);
		}
	);

	it(
		'Bridge fails correctly in callback mode 2',
		(done) => {
			FAILING_BRIDGE_2(
				(err, res) => done(err == null ? new Error('bridge should have failed') : null)
			);
		}
	);

	it(
		'Bridge works in promise mode',
		(done) => {

			(EXAMPLE_BRIDGE as AsyncTask)(2)
				.then((val) => done(val === 2 ? null : new Error()))
				.catch((err) => done(err));

		}
	);

	it(
		'Bridge fails correctly in promise mode',
		(done) => {
			(FAILING_BRIDGE_1 as AsyncTask)(2)
				.then((val) => done(new Error('should have rejected promise')))
				.catch((err) => done());
		}
	);

	it(
		'Bridge fails correctly in promise mode 2',
		(done) => {
			(FAILING_BRIDGE_2 as AsyncTask)(2)
				.then((val) => done(new Error('should have rejected promise')))
				.catch((err) => done());
		}
	);

	it('test with 0 handlers', (done) => {
		Bridge()(done);
	});

});
