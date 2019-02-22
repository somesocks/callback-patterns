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

const { InSeries, Delay, InParallel, CatchError, PassThrough, Logging } = require('../');
const TraceError = require('./TraceError');

let task = InSeries(
	(next) => next(),
	(next) => { throw new Error('error'); }
);

task = TraceError(task);

task();
