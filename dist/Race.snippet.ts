
import Race from './Race';

let task = Race(
	(next, val) => next(null, val),
	(next, val) => next(null, val),
	(next, val) => next(null, val)
);
