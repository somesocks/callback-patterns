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

const { If } = require('../');

describe('If', () => {
	it('Function.length should be at least 1', () => {
		if (If().length < 1) { throw new Error(); }
		if (If(() => {}).length < 1) { throw new Error(); }
		if (If(() => {}, () => {}).length < 1) { throw new Error(); }
	});

	it('test with 0 handlers', (done) => {
		If()(done);
	});

	it('test with null callback', (done) => {
		If()();
		setTimeout(done, 16);
	});

	it('catches errors', (done) => {
		If(
			(next) => next(null, true),
			(next) => { throw new Error('error'); }
		)((err, res) => done(err != null ? null : err));
	});
});
