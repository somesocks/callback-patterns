
import TinyLRU from 'tiny-lru';

// import Callback from './types/Callback';

import Task from './types/Task';

import _catchWrapper from './_catchWrapper';
import _onceWrapper from './_onceWrapper';
import _nullCallback from './_nullCallback';

import PassThrough from './PassThrough';

import Joinable from './unstable/Joinable';

var DEFAULT_KEY_FUNCTION = function () {
	var args = Array.prototype.slice.call(arguments);
	return JSON.stringify(args);
};

type _MemoizeCache = {
	has : (key : string) => boolean,
	get : (key : string) => any,
	set : (key : string, val : any) => void,
	del : (key : string) => void,
}

function ObjectCache(this : any) : void {
	this._cache = {};
};

ObjectCache.prototype.has = function has(key : string) {
	return this._cache.hasOwnProperty(key);
};

ObjectCache.prototype.get = function get(key : string) {
	return this._cache[key];
};

ObjectCache.prototype.set = function set(key : string, val : any) {
	this._cache[key] = val;
	return this;
};

ObjectCache.prototype.del = function del(key : string) {
	delete this._cache[key];
};


function LRUCache(this : any, size : number, ttl : number = 0) : void {
	this._cache = TinyLRU(size, ttl);
}

LRUCache.prototype.has = function has(key : string) {
	return this._cache.get(key) != null;
	// tiny-lru doesn't check for expiration in `has`
	// return this._cache.has(key);
};

LRUCache.prototype.get = function get(key : string) {
	return this._cache.get(key);
};

LRUCache.prototype.set = function set(key : string, val : any) {
	this._cache.set(key, val);
	return this;
};

LRUCache.prototype.del = function del(key : string) {
	this._cache.delete(key);
};


/**
* Memoize builds a wrapper function that caches results of previous executions.
* As a result, repeated calls to Memoize may be much faster, if the request hits the cache.
*
* NOTE: As of now, there are no cache eviction mechanisms.
*   You should try to use Memoized functions in a 'disposable' way as a result
*
* NOTE: Memoize is not 'thread-safe' currently.  If two calls are made for the same object currently,
*   two calls to the wrapped function will be made
*
* NOTE: Memoize will cache errors as well as results.
*
* @param {CallbackTask} CallbackTask - the task function to memoize.
* @param {function=} keyFunction - a function that synchronously generates a key for a request.
* @param {object=} cache - a pre-filled cache to use
* @returns {CallbackTask}
* @memberof callback-patterns
* @example
* ```javascript
*
*   let Delay = require('callback-patterns/Delay');
*   let InOrder = require('callback-patterns/InOrder');
*   let InSeries = require('callback-patterns/InSeries');
*   let Memoize = require('callback-patterns/Memoize');
*
*   let slowTask = InSeries(
*     (next, i) => {
*       console.log('task called with ', i);
*       next(null, i + 1);
*     },
*     Delay(1000)
*   );
*
*   let memoizedTask = Memoize(slowTask);
*
*   let test = InOrder(
*     memoizedTask,
*     memoizedTask,
*     memoizedTask
*   );
*
*
*   test(null, 1); // task is only called once, even though memoizedTask is called three times
* ```
*/
function Memoize(task ?: Task, keyFunction ?: (...args : any[]) => string, cache ?: _MemoizeCache) : Task {
	let _task = task != null ? _catchWrapper(task) : PassThrough;
	_task = Joinable(_task);
	const _keyFunction = keyFunction || DEFAULT_KEY_FUNCTION;
	const _cache : _MemoizeCache = cache || new ObjectCache();

	return function _memoizeInstance(_1) {
		var next = _onceWrapper(_1 || _nullCallback);
		var args = arguments;

		args[0] = undefined;
		const key : string = _keyFunction.call.apply(_keyFunction, args as any) as string;

		if (_cache.has(key)) {
			const joinable = _cache.get(key);
			joinable.join(next);
		} else {
			args[0] = next; // setting the first arg back to the initial callback
			args.length = args.length || 1;
			const joinable : any = _task.apply(undefined, args as any);
			_cache.set(key, joinable);
		}
	};
}

Memoize.ObjectCache = ObjectCache;

Memoize.LRUCache = LRUCache;

export = Memoize;
