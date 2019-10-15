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

const { Bridge, InSeries, Assert, CatchError, PassThrough, Callbackify, Logging } = require('../dist');

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

			EXAMPLE_BRIDGE(2)
				.then((val) => done(val === 2 ? null : new Error()))
				.catch((err) => done(err));

		}
	);

	it(
		'Bridge fails correctly in promise mode',
		(done) => {
			FAILING_BRIDGE_1(2)
				.then((val) => done(new Error('should have rejected promise')))
				.catch((err) => done());
		}
	);

	it(
		'Bridge fails correctly in promise mode 2',
		(done) => {
			FAILING_BRIDGE_2(2)
				.then((val) => done(new Error('should have rejected promise')))
				.catch((err) => done());
		}
	);

	it('test with 0 handlers', (done) => {
		Bridge()(done);
	});

});
