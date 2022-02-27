"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var tiny_lru_1 = __importDefault(require("tiny-lru"));
var _catchWrapper_1 = __importDefault(require("./_catchWrapper"));
var _onceWrapper_1 = __importDefault(require("./_onceWrapper"));
var _nullCallback_1 = __importDefault(require("./_nullCallback"));
var PassThrough_1 = __importDefault(require("./PassThrough"));
var Joinable_1 = __importDefault(require("./unstable/Joinable"));
var DEFAULT_KEY_FUNCTION = function () {
    var args = Array.prototype.slice.call(arguments);
    return JSON.stringify(args);
};
function ObjectCache() {
    var self = this instanceof ObjectCache ? this : Object.create(ObjectCache.prototype);
    self._cache = {};
    return self;
}
ObjectCache.prototype.has = function has(key) {
    return this._cache.hasOwnProperty(key);
};
ObjectCache.prototype.get = function get(key) {
    return this._cache[key];
};
ObjectCache.prototype.set = function set(key, val) {
    this._cache[key] = val;
    return this;
};
ObjectCache.prototype.del = function del(key) {
    delete this._cache[key];
};
function LRUCache(size, ttl) {
    if (ttl === void 0) { ttl = 0; }
    var self = this instanceof ObjectCache ? this : Object.create(LRUCache.prototype);
    self._cache = (0, tiny_lru_1.default)(size, ttl);
    return self;
}
LRUCache.prototype.has = function has(key) {
    return this._cache.get(key) != null;
    // tiny-lru doesn't check for expiration in `has`
    // return this._cache.has(key);
};
LRUCache.prototype.get = function get(key) {
    return this._cache.get(key);
};
LRUCache.prototype.set = function set(key, val) {
    this._cache.set(key, val);
    return this;
};
LRUCache.prototype.del = function del(key) {
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
function Memoize(task, keyFunction, cache) {
    var _task = task != null ? (0, _catchWrapper_1.default)(task) : PassThrough_1.default;
    _task = (0, Joinable_1.default)(_task);
    var _keyFunction = keyFunction || DEFAULT_KEY_FUNCTION;
    var _cache = cache || ObjectCache();
    var res = function _memoizeInstance(_1) {
        var next = (0, _onceWrapper_1.default)(_1 || _nullCallback_1.default);
        var args = arguments;
        args[0] = undefined;
        var key = _keyFunction.call.apply(_keyFunction, args);
        if (_cache.has(key)) {
            var joinable = _cache.get(key);
            joinable.join(next);
        }
        else {
            args[0] = next; // setting the first arg back to the initial callback
            args.length = args.length || 1;
            var joinable = _task.apply(undefined, args);
            _cache.set(key, joinable);
        }
    };
    res._keyFunction = _keyFunction;
    res._cache = _cache;
    return res;
}
Memoize.ObjectCache = ObjectCache;
Memoize.LRUCache = LRUCache;
function SWRMemoize(task, options) {
    var _task = task != null ? (0, _catchWrapper_1.default)(task) : PassThrough_1.default;
    _task = (0, Joinable_1.default)(_task);
    var keyFunction = (options === null || options === void 0 ? void 0 : options.keyFunction) || DEFAULT_KEY_FUNCTION;
    var staleCache = (options === null || options === void 0 ? void 0 : options.staleCache) || ObjectCache();
    var refreshCache = (options === null || options === void 0 ? void 0 : options.refreshCache) || LRUCache(999999999, 0);
    var res = function _SWRMemoizeInstance(_1) {
        var next = (0, _onceWrapper_1.default)(_1 || _nullCallback_1.default);
        var args = arguments;
        args[0] = undefined;
        var key = keyFunction.call.apply(keyFunction, args);
        // console.log('_SWRMemoizeInstance state', key, refreshCache.has(key), staleCache.has(key));
        var staleJoinable = staleCache.get(key);
        var refreshJoinable;
        if (refreshCache.has(key)) {
            refreshJoinable = refreshCache.get(key);
        }
        else {
            args[0] = next; // setting the first arg back to the initial callback
            args.length = args.length || 1;
            refreshJoinable = _task.apply(undefined, args);
            refreshCache.set(key, refreshJoinable);
            refreshJoinable.join(function () {
                if (staleCache.get(key) === staleJoinable) {
                    // console.log('refreshing stale cache');
                    staleCache.set(key, refreshJoinable);
                }
                if (refreshCache.get(key) === refreshJoinable) {
                    // console.log('clearing refresh cache');
                    refreshCache.del(key);
                }
            });
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
module.exports = Memoize;
