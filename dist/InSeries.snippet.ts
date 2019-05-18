
import InSeries from './InSeries';

let task = InSeries(
	(next, val) => next(null, val),
	(next, val) => next(null, val),
	(next, val) => next(null, val)
);
