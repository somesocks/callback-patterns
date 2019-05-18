
import InOrder from './InOrder';

let task = InOrder(
	(next, val) => next(null, val),
	(next, val) => next(null, val),
	(next, val) => next(null, val)
);
