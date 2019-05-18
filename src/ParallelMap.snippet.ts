
import ParallelMap from './ParallelMap';

let task = ParallelMap(
	(next, val) => next(null, val + 0)
);

task(null, -1, 0, 1, 2, 3);
