
import ParallelFilter from './ParallelFilter';

let task = ParallelFilter(
	(next, val) => next(null, val > 0)
);

task(null, -1, 0, 1, 2, 3);
