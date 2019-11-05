
// import Assert from './Assert';
// import Background from './Background';
// import Bridge from './Bridge';
// import Callbackify from './Callbackify';
import CatchError from './CatchError';
// import Delay from './Delay';
// import If from './If';
// import InOrder from './InOrder';
// import InParallel from './InParallel';
import InSeries from './InSeries';
import Logging from './Logging';
import PassThrough from './PassThrough';

const SHORT_CHAIN = InSeries(
	...Array(1000).fill(PassThrough)
);

const LONG_CHAIN = InSeries(
	...Array(1000).fill(SHORT_CHAIN)
);

LONG_CHAIN(() => {}, 1, 2, 3);
