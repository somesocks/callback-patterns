
import Memoize from './Memoize';

let task = Memoize(
	(val) => `val is ${val}`,
	(val) => `${val}`
);
