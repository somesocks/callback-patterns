/** @namespace callback-patterns */

module.exports = {

	unstable: require('./unstable'),

	Assert: require('./Assert'),
	Background: require('./Background'),
	Callbackify: require('./Callbackify'),
	CatchError: require('./CatchError'),
	Delay: require('./Delay'),
	If: require('./If'),
	InOrder: require('./InOrder'),
	InParallel: require('./InParallel'),
	InSeries: require('./InSeries'),
	Logging: require('./Logging'),
	Memoize: require('./Memoize'),
	ParallelFilter: require('./ParallelFilter'),
	ParallelMap: require('./ParallelMap'),
	PassThrough: require('./PassThrough'),
	Promisify: require('./Promisify'),
	Race: require('./Race'),
	Throttle: require('./Throttle'),
	TimeIn: require('./TimeIn'),
	TimeOut: require('./TimeOut'),
	Timer: require('./Timer'),
	While: require('./While'),
	Retry: require('./Retry'),
};
