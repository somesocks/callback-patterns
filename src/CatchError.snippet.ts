
import CatchError from './CatchError';

let task = CatchError(
	(next, val) => next(null, val)
);
