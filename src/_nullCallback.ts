/* eslint-env node */

import Callback from './types/Callback';

const nullCallback : Callback = function nullCallback(err ?: any) {
	if (err) {
		console.warn('callback-patterns ignored error\n', err);
	}
}

export = nullCallback;
