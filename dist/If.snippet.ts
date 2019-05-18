
import If from './If';

let task = If(
	(next, val) => next(null, val),
	(next, val) => next(null, val + 1)
);
