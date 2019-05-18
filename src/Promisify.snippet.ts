
import InSeries from './InSeries';
import PassThrough from './PassThrough';
import Promisify from './Promisify';

let task = InSeries(
	(next, val) => next(null, val + 0),
	PassThrough,
	(next, val) => next(null, val + 0)
);

let wrapper = Promisify(task);

let res = wrapper(1, 2, 3);
