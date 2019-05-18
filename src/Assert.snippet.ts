
import Assert from './Assert';

let task = Assert(
	(val) => val > 0,
	(val) => `val is less than 0`
);
