import InSeries from '../InSeries';
import TraceError from './TraceError';

let task = InSeries(
	(next) => next(),
	(next) => { throw new Error('error'); }
);

task = TraceError(task);

task();
