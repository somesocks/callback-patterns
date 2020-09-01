
import Assert from '../Assert';
import InSeries from '../InSeries';
import InParallel from '../InParallel';
import InOrder from '../InOrder';
import CatchError from '../CatchError';
import PassThrough from '../PassThrough';
import Logging from '../Logging';

import TraceError from '../unstable/TraceError';

interface Callback {
	(err ?: any | null | undefined, ...results : any[]) : void;
}

interface CallbackTask {
	(next : Callback, ...args : any[]) : void;

	label ?: string;

}

const DEFAULT_SETUP : CallbackTask = function (next) {
	next();
};

const DEFAULT_PREPARE : CallbackTask = function (next) {
	next();
};

const DEFAULT_EXECUTE : CallbackTask = function (next) {
	next();
};

const DEFAULT_VERIFY : CallbackTask = function (next, context) {
	next(context.error);
};

const DEFAULT_TEARDOWN : CallbackTask = function (next) {
	next();
};

interface IAssertionTest {

	/**
	*
	* `AssertionTest#describe` lets you set a description for a test case.
	* This description is part of the label attached to the test case when built.
	*
	* @function describe
	* @param {string} description - a string label describing the test case
	* @returns {AssertionTest} this
	* @memberof callback-patterns.testing.AssertionTest#
	*/
	describe(description : string) : IAssertionTest;

	/**
	*
	* `AssertionTest#setup` gives you a hook to build test fixtures before execution.
	* This is the first step that runs in a test.
	* `setup` is a separate step from `prepare` because you often want to use
	* a common setup function to build test fixtures for multiple tests.
	*
	* @function setup
	* @param {function} task - a setup task function - should return a setup object
	* @returns {AssertionTest} this
	* @memberof callback-patterns.testing.AssertionTest#
	*/
	setup(setupTask : CallbackTask) : IAssertionTest;

	/**
	*
	* `AssertionTest#prepare` gives you a hook to prepare the request that the test uses to execute.
	* This is the second step that runs in a test, and the last step before `execute`.
	* The `prepare` task is passed the results from `setup`.
	*
	* @function prepare
	* @param {function} task - a prepare task function - should accept a context containing the setup, and return a request object to be given to the executing task
	* @returns {AssertionTest} this
	* @memberof callback-patterns.testing.AssertionTest#
	*/
	prepare(prepareTask : CallbackTask) : IAssertionTest;

	/**
	*
	* `AssertionTest#execute` lets you specify the task that is executed in a test.
	* The `execute` task is passed the results from `prepare`.
	*
	* @function execute
	* @param {function} task - the task the test should execute, and capture results and errors from
	* @returns {AssertionTest} this
	* @memberof callback-patterns.testing.AssertionTest#
	*/
	execute(executeTask : CallbackTask) : IAssertionTest;

	/**
	*
	* `AssertionTest#verify` lets you specify any number of tasks to verify the test results.
	* Each `verify` task is passed a complete record of all test fixtures in an object,
	* including the setup, the request, the result, and the error (if an error was thrown)
	*
	* @function verify
	* @param {...function} tasks - any number of verification tasks
	* @returns {AssertionTest} this
	* @memberof callback-patterns.testing.AssertionTest#
	*/
	verify(...verifyTasks : CallbackTask[]) : IAssertionTest;

	/**
	*
	* `AssertionTest#teardown` gives you a hook to tear down the test fixtures after execution.
	* The `teardown` task is passed a complete record of all test fixtures in an object,
	* including the setup, the request, the result, and the error (if an error was thrown)
	*
	* @function teardown
	* @param {function} task - a task to tear down the setup
	* @returns {AssertionTest} this
	* @memberof callback-patterns.testing.AssertionTest#
	*/
	teardown(teardownTask: CallbackTask) : IAssertionTest;

	/**
	*
	* Builds the test case function.
	*
	* @function build
	* @returns {function} callback-expecting test function
	* @memberof callback-patterns.testing.AssertionTest#
	*/
	build() : CallbackTask;

}

/**
*
* ```javascript
*
* const PingTest = AssertionTest()
*   .describe('can ping internet')
*   .setup(
*     // build our setup
*     (next) => {
*       const setup = {};
*       setup.testHosts = [ 'google.com', 'microsoft.com', 'yahoo.com' ];
*       next(null, setup);
*     }
*   )
*   .prepare(
*     // run test with first host
*     (next, setup) => {
*       const host = setup.testHosts[0];
*       next(null, host);
*     }
*   )
*   .execute(
*     (next, host) => ping.sys.probe(
*       host,
*       (isAlive, error) => next(error, isAlive)
*     )
*   )
*   .verify(
*     // verify no error was thrown
*     (next, { setup, request, result, error }) => next(error),
*     // verify result is true
*     (next, { setup, request, result, error }) => next(
*       result !== true ? new Error(`could not ping host ${request}`) : null
*     )
*   )
*   .teardown(
*     // nothing to teardown
*     (next, { setup, request, result, error }) => next()
*   )
*   .build();
*
*   test( () => console.log('test done') );
*
* ```
* Constructor for an AssertionTest builder.
*
* @name AssertionTest
* @class
* @constructor
* @memberof callback-patterns.testing
*/
function AssertionTest(this : IAssertionTest | null | undefined | void) : IAssertionTest {
	const self =
		this instanceof AssertionTest ?
		this : Object.create(AssertionTest.prototype);

	self._description = '';
	self._setup = DEFAULT_SETUP;
	self._prepare = DEFAULT_PREPARE;
	self._execute = DEFAULT_EXECUTE;
	self._verify = [ DEFAULT_VERIFY ];
	self._teardown = DEFAULT_TEARDOWN;

	return self;
}

/**
*
* `AssertionTest#describe` lets you set a description for a test case.
* This description is part of the label attached to the test case when built.
*
* @function describe
* @param {string} description - a string label describing the test case
* @returns {AssertionTest} this
* @memberof callback-patterns.testing.AssertionTest#
*/
AssertionTest.prototype.describe = function describe(description) {
	this._description = description;
	return this;
};

/**
*
* `AssertionTest#setup` gives you a hook to build test fixtures before execution.
* This is the first step that runs in a test.
* `setup` is a separate step from `prepare` because you often want to use
* a common setup function to build test fixtures for multiple tests.
*
* @function setup
* @param {function} task - a setup task function - should return a setup object
* @returns {AssertionTest} this
* @memberof callback-patterns.testing.AssertionTest#
*/
AssertionTest.prototype.setup = function setup(_setup) {
	this._setup = _setup;
	return this;
};

/**
*
* `AssertionTest#prepare` gives you a hook to prepare the request that the test uses to execute.
* This is the second step that runs in a test, and the last step before `execute`.
* The `prepare` task is passed the results from `setup`.
*
* @function prepare
* @param {function} task - a prepare task function - should accept a context containing the setup, and return a request object to be given to the executing task
* @returns {AssertionTest} this
* @memberof callback-patterns.testing.AssertionTest#
*/
AssertionTest.prototype.prepare = function prepare(_prepare) {
	this._prepare = _prepare;
	return this;
};

/**
*
* `AssertionTest#execute` lets you specify the task that is executed in a test.
* The `execute` task is passed the results from `prepare`.
*
* @function execute
* @param {function} task - the task the test should execute, and capture results and errors from
* @returns {AssertionTest} this
* @memberof callback-patterns.testing.AssertionTest#
*/
AssertionTest.prototype.execute = function execute(_execute) {
	this._execute = _execute;
	return this;
};

/**
*
* `AssertionTest#verify` lets you specify any number of tasks to verify the test results.
* Each `verify` task is passed a complete record of all test fixtures in an object,
* including the setup, the request, the result, and the error (if an error was thrown)
*
* @function verify
* @param {...function} tasks - any number of verification tasks
* @returns {AssertionTest} this
* @memberof callback-patterns.testing.AssertionTest#
*/
AssertionTest.prototype.verify = function verify() {
	var _verify = arguments;
	this._verify = _verify;
	return this;
};

/**
*
* `AssertionTest#teardown` gives you a hook to tear down the test fixtures after execution.
* The `teardown` task is passed a complete record of all test fixtures in an object,
* including the setup, the request, the result, and the error (if an error was thrown)
*
* @function teardown
* @param {function} task - a task to tear down the setup
* @returns {AssertionTest} this
* @memberof callback-patterns.testing.AssertionTest#
*/
AssertionTest.prototype.teardown = function teardown(_teardown) {
	this._teardown = _teardown;
	return this;
};

/**
*
* Builds the test case function.
*
* @function build
* @returns {function} callback-expecting test function
* @memberof callback-patterns.testing.AssertionTest#
*/
AssertionTest.prototype.build = function build(this : any) {
	var _setup = this._setup;
	var _prepare = this._prepare;
	var _execute = this._execute;
	var _verify = this._verify;
	var _teardown = this._teardown;
	var _label = this._description;

	var _init : CallbackTask = function (next, context) {
		next(null, context || {});
	};

	var _setupWrapper = InSeries(
		InParallel.Flatten(
			PassThrough,
			_setup
		),
		function (next, context, setup) {
			context.setup = setup;
      next(null, context);
		}
	);


	var _prepareWrapper = InSeries(
		InParallel.Flatten(
			PassThrough,
			function (next, context) { _prepare(next, context.setup); }
		),
		function (next, context, request) {
			context.request = request;
      next(null, context);
		}
	);


	var _executeWrapper = InSeries(
		InParallel.Flatten(
			PassThrough,
			function (next, context) { _execute(next, context.request); }
		),
		function (next, context, result) {
			context.result = result;
			next(null, context);
		}
	);

	var _verifyWrapper = InOrder.apply(null, _verify);

	var _teardownWrapper = InOrder(_teardown);

  var _testCore = InSeries(
    _setupWrapper,
    _prepareWrapper,
    _executeWrapper,
    function (next) { next(); },
  );

  _testCore = InSeries(
    InParallel.Flatten(
      PassThrough,
      CatchError(_testCore)
    ),
    function (next, context, error) {
      context.error = error;
      next(null, context);
    },
  );

	var test : CallbackTask = InSeries(
    _init,
    _testCore,
    _verifyWrapper,
    _teardownWrapper,
  );

	test = TraceError(test);

	test.label = _label;

	return test;
};

/**
* verifier function to make sure test DID NOT throw an error
* @function VerifyErrorWasNotThrown
* @memberof callback-patterns.testing.AssertionTest
*/
AssertionTest.VerifyErrorWasNotThrown = Assert(
	function (context) { return context.error == null; },
	function (context) { return context.error; }
);

/**
* verifier function to make sure test DID throw an error
* @function VerifyErrorWasNotThrown
* @memberof callback-patterns.testing.AssertionTest
*/
AssertionTest.VerifyErrorWasThrown = Assert(
	function (context) { return context.error != null; },
	'AssertionTest.VerifyErrorWasThrown: error was not thrown'
);

export = AssertionTest;
