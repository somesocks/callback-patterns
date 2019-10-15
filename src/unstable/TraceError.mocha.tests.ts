
import InSeries from '../InSeries';
import CatchError from '../CatchError';
import Logging from '../Logging';
import Delay from '../Delay';

import TraceError from './TraceError';

describe('TraceError tests', () => {
	it('Function.length should be at least 1', () => {
		if ((TraceError as any)().length < 1) { throw new Error(); }
		if (TraceError(() => {}).length < 1) { throw new Error(); }
	});

	it('test with 0 handlers', (done) => {
		(TraceError as any)()(done);
	});

	it('test with null return', (done) => {
		TraceError(
			(next) => next()
		)(done);
	});

	it('passes errors', (done) => {
		TraceError(
			(next) => next(new Error('error'))
		)((err, res) => done(err != null ? null : err));
	});

	it(
		'deep error stack works',
		InSeries(
			CatchError(
				TraceError(
					InSeries(
						InSeries(
							(next) => next(),
							Delay(500),
							(next) => { throw new Error('error'); }
						)
					)
				)
			),
			Logging(
				'Error Stack\n',
				(err) => err
			)
		)
	);

});
