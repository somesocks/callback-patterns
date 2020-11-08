
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

type TMemoizeCache = {
	has : (key : string) => boolean,
	get : (key : string) => any,
	set : (key : string, val : any) => void,
	del : (key : string) => void,
}

function ObjectCache(this : any) : TMemoizeCache {
  const self = this instanceof ObjectCache ? this : Object.create(ObjectCache.prototype);
	self._cache = {};
  return self;
}

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


function LRUCache(this : any, size : number, ttl : number = 0) : TMemoizeCache {
  const self = this instanceof ObjectCache ? this : Object.create(LRUCache.prototype);
	self._cache = TinyLRU(size, ttl);
  return self;
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
function Memoize(task ?: Task, keyFunction ?: (...args : any[]) => string, cache ?: TMemoizeCache) : Task {
	let _task = task != null ? _catchWrapper(task) : PassThrough;
	_task = Joinable(_task);
	const _keyFunction = keyFunction || DEFAULT_KEY_FUNCTION;
	const _cache : TMemoizeCache = cache || ObjectCache();

	const res = function _memoizeInstance(_1) {
		const next = _onceWrapper(_1 || _nullCallback);
		const args = arguments;

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

  res._keyFunction = _keyFunction;
  res._cache = _cache;

  return res;
}

Memoize.ObjectCache = ObjectCache;

Memoize.LRUCache = LRUCache;

type TKeyFunction = (...args : any[]) => string;

type TSWRMemoizeOptions = {
  keyFunction ?: TKeyFunction,
  staleCache ?: TMemoizeCache,
  refreshCache ?: TMemoizeCache,
};

function SWRMemoize(task ?: Task, options ?: TSWRMemoizeOptions) : Task {
  let _task = task != null ? _catchWrapper(task) : PassThrough;
  _task = Joinable(_task);

  const keyFunction = options?.keyFunction || DEFAULT_KEY_FUNCTION;
	const staleCache : TMemoizeCache = options?.staleCache || ObjectCache();
  const refreshCache : TMemoizeCache = options?.refreshCache || LRUCache(999999999, 0);

  const res = function _SWRMemoizeInstance(_1) {
		const next = _onceWrapper(_1 || _nullCallback);
		const args = arguments;

		args[0] = undefined;
		const key : string = keyFunction.call.apply(keyFunction, args as any) as string;

    // console.log('_SWRMemoizeInstance state', key, refreshCache.has(key), staleCache.has(key));

    let staleJoinable = staleCache.get(key);
    let refreshJoinable;
    if (refreshCache.has(key)) {
      refreshJoinable = refreshCache.get(key);
    } else {
      args[0] = next; // setting the first arg back to the initial callback
			args.length = args.length || 1;
			refreshJoinable = _task.apply(undefined, args as any);
			refreshCache.set(key, refreshJoinable);
      refreshJoinable.join(
        () => {
          if (staleCache.get(key) === staleJoinable) {
            // console.log('refreshing stale cache');
            staleCache.set(key, refreshJoinable);
          }
          if (refreshCache.get(key) === refreshJoinable) {
            // console.log('clearing refresh cache');
            refreshCache.del(key);
          }
        }
      );
    }

    // console.log('_SWRMemoizeInstance 2', key, refreshCache.has(key), staleCache.has(key));
    (staleJoinable || refreshJoinable).join(next);
	};

  res._keyFunction = keyFunction;
  res._staleCache = staleCache;
  res._refreshCache = refreshCache;

  return res;
}

SWRMemoize.ObjectCache = ObjectCache;

SWRMemoize.LRUCache = LRUCache;

Memoize.SWR = SWRMemoize;

export = Memoize;
