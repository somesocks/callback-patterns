
import InSeries from './InSeries';
import PassThrough from './PassThrough';

let task = InSeries(
	(next, val) => next(null, val + 0),
	PassThrough,
	(next, val) => next(null, val + 0)
);

task(null, -1, 0, 1, 2, 3);
