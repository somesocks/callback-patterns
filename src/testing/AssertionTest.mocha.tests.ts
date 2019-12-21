/* eslint-env mocha */

import Assert from '../Assert';

import ping from 'ping';

import AssertionTest from './AssertionTest';


const EmptyTest = AssertionTest()
	.describe('empty test works')
	.build();

const SetupTest = AssertionTest()
	.describe('test with setup works')
	.setup(
		(next) => next(null, 'setup')
	)
	.verify(
		(next, context) => next(context.setup === 'setup' ? null : new Error('bad setup'))
	)
	.build();

const SampleTest = AssertionTest()
	.describe('sample test 1')
	.setup(
		(next) => next(null, { val: 1 })
	)
	.prepare(
		(next, setup) => next(null, setup.val)
	)
	.execute(
		(next, request) => next(null, request + 1)
	)
	.verify(
		Assert(
			(context) => context.setup.val === 1,
			'bad setup'
		),
		Assert(
			(context) => context.result === 2,
			'bad result'
		)
	)
	.teardown(
		Assert(
			(context) => context.setup.val === 1 && context.result === 2,
			'bad teardown'
		)
	)
	.build();

const PingTest = AssertionTest()
	.describe('can ping internet')
	.setup(
		// build our setup
		(next) => {
			const setup = {
				testHosts :  [ 'google.com', 'microsoft.com', 'yahoo.com' ],
			};

			next(null, setup);
		}
	)
	.prepare(
		// run test with first host
		(next, setup) => {
			const host = setup.testHosts[0];
			next(null, host);
		}
	)
	.execute(
		(next, host) => ping.sys.probe(
			host,
			(isAlive, error) => next(error, isAlive)
		)
	)
	.verify(
		// verify no error was thrown
		(next, { error }) => next(error),
		// verify result is true
		(next, { request, result }) => next(
			result !== true ? new Error(`could not ping host ${request}`) : null
		)
	)
	.teardown(
		// nothing to teardown
		(next) => next()
	)
	.build();


const TESTS = [
	EmptyTest,
	SetupTest,
	SampleTest,
	PingTest,
];

describe('AssertionTest', () => {

	TESTS.forEach(
		(test, i) => it(test.label || `test ${i}`, test)
	);

});
