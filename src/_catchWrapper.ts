
import _nullCallback from './_nullCallback';

function catchWrapper(func : Function) {

	return function _catchWrapper_instance(next ?: Function) {
		try {
			func.apply(undefined, arguments);
		} catch (err) {
			next = next || _nullCallback;
			next(err);
		}
	};
};

export = catchWrapper;
