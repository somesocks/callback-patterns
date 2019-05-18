
import InParallel from './InParallel';

let task = InParallel(
	(next, val) => next(null, val),
	(next, val) => next(null, val),
	(next, val) => next(null, val)
);

let task2 = InParallel.Flatten(
	(next, val) => next(null, val),
	(next, val) => next(null, val),
	(next, val) => next(null, val)
);
