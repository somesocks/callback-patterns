# callback-patterns

`callback-patterns` is a collection of design patterns for callback-driven async code.  The design patterns in this library are constructors that build callback-expecting functions.  Each pattern is designed to be a stand-alone piece of code, tested for performance and robustness.

## Design

There is one major difference between this package and many other callback-driven async libraries: **the callback comes first**.

```javascript

// this
function task(callback, arg1, arg2, ...) { }

// not this
function task(arg1, arg2, ..., callback) { }

```

This makes it easier to compose callback-driven functions in useful ways, with almost no boilerplate code.

## API

<a name="callback-patterns"></a>

## callback-patterns : <code>object</code>
**Kind**: global namespace  

* [callback-patterns](#callback-patterns) : <code>object</code>
    * [.unstable](#callback-patterns.unstable) : <code>object</code>
        * [.TraceError(task)](#callback-patterns.unstable.TraceError) ⇒ <code>CallbackTask</code>
    * [.Assert(validator, message)](#callback-patterns.Assert) ⇒ <code>CallbackTask</code>
    * [.Background(backgroundTask)](#callback-patterns.Background) ⇒ <code>CallbackTask</code>
    * [.Bridge(task)](#callback-patterns.Bridge) ⇒ <code>function</code>
    * [.Callbackify(generator)](#callback-patterns.Callbackify) ⇒ <code>CallbackTask</code>
    * [.CatchError(task)](#callback-patterns.CatchError) ⇒ <code>CallbackTask</code>
    * [.Delay(delay)](#callback-patterns.Delay) ⇒ <code>CallbackTask</code>
    * [.If(ifTask, thenTask, elseTask)](#callback-patterns.If) ⇒ <code>CallbackTask</code>
    * [.InOrder(...tasks)](#callback-patterns.InOrder) ⇒ <code>CallbackTask</code>
    * [.InParallel(...tasks)](#callback-patterns.InParallel) ⇒ <code>CallbackTask</code>
        * [.Flatten(...tasks)](#callback-patterns.InParallel.Flatten) ⇒ <code>CallbackTask</code>
    * [.InSeries(...tasks)](#callback-patterns.InSeries) ⇒ <code>CallbackTask</code>
    * [.Logging(...statements)](#callback-patterns.Logging) ⇒ <code>CallbackTask</code>
    * [.Memoize(CallbackTask, [keyFunction], [cache])](#callback-patterns.Memoize) ⇒ <code>CallbackTask</code>
    * [.ParallelFilter(filter)](#callback-patterns.ParallelFilter) ⇒ <code>CallbackTask</code>
    * [.ParallelMap(task)](#callback-patterns.ParallelMap) ⇒ <code>CallbackTask</code>
    * [.PassThrough()](#callback-patterns.PassThrough)
    * [.Promisify(task)](#callback-patterns.Promisify) ⇒ <code>function</code>
    * [.Race(...tasks)](#callback-patterns.Race) ⇒ <code>CallbackTask</code>
    * [.Retry(task, retryStrategy)](#callback-patterns.Retry) ⇒ <code>CallbackTask</code>
    * [.Throttle(task, limit)](#callback-patterns.Throttle) ⇒ <code>CallbackTask</code>
    * [.TimeIn(task, ms)](#callback-patterns.TimeIn) ⇒ <code>CallbackTask</code>
    * [.TimeOut(task, ms)](#callback-patterns.TimeOut) ⇒ <code>CallbackTask</code>
    * [.Timer(task, label)](#callback-patterns.Timer) ⇒ <code>CallbackTask</code>
    * [.While(conditionTask, loopTask)](#callback-patterns.While) ⇒ <code>function</code>


* * *

<a name="callback-patterns.unstable"></a>

### callback-patterns.unstable : <code>object</code>
**Kind**: static namespace of [<code>callback-patterns</code>](#callback-patterns)  

* * *

<a name="callback-patterns.unstable.TraceError"></a>

#### unstable.TraceError(task) ⇒ <code>CallbackTask</code>
TraceError is an experimental wrapper that attempts to make errors more informative.
It does this by appending extra information to the stack of any error thrown in the task.

NOTE: TraceError is marked as 'unstable' as stack traces in JS are not standardized,
so it may not always provide useful information.

**Kind**: static method of [<code>unstable</code>](#callback-patterns.unstable)  
**Returns**: <code>CallbackTask</code> - a wrapper function that modifies the stack trace of any errors thrown within  
**Params**

- task <code>CallbackTask</code> - a task function to wrap

**Example**  
```javascript
  let TraceError = require('callback-patterns/unstable/TraceError');
  let InSeries = require('callback-patterns/InSeries');

  let task = InSeries(
    function(next, ...args) {},
    function(next, ...args) {},
    ...
  );

  task = TraceError(task);

  task(next, ...args);
```

* * *

<a name="callback-patterns.Assert"></a>

### callback-patterns.Assert(validator, message) ⇒ <code>CallbackTask</code>
Builds an assertion task.  When called,
if the arguments do not match the validator functions,
Assert passes an error to its callback.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>CallbackTask</code> - an assertion task  
**Params**

- validator <code>function</code> - a function that checks the arguments.
- message <code>string</code> - an optional error message to throw if the assertion fails, or a message builder function.

**Example**  
```javascript
  let Assert = require('callback-patterns/Assert');
  let InSeries = require('callback-patterns/InSeries');

  let task = InSeries(
    (next, num) => next(null, num),
    Assert(
      (num) => (num >= 0),
      (num) => `${num} is less than zero`
    ),
    (next, num) => next(null, num),
  );

  let onDone = (err, result) => console.log(err, result);

  task(onDone, 1); // prints null 1, eventually
  task(onDone, -1); // prints '-1 is less than zero', eventually
```

* * *

<a name="callback-patterns.Background"></a>

### callback-patterns.Background(backgroundTask) ⇒ <code>CallbackTask</code>
`Background` runs a task in the background.
It acts like `PassThrough`, but also schedules the backround task to be called.

NOTE: any error a background task throws is caught and ignored.  If you need
error handling in a background task, catch the error using `CatchError`

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>CallbackTask</code> - a wrapper task that schedules backgroundTask to be run when called.  
**Params**

- backgroundTask <code>CallbackTask</code> - a task function to be run in the background.

**Example**  
```javascript
  let InSeries = require('callback-patterns/InSeries');
  let Background = require('callback-patterns/Background');

  let logRequest = (next, ...args) => { ... }; // log a request in some logging service
  let loadData = (next, ...args) => { ... }; // load some data for analysis
  let buildReport = (next, ...args) => { ... }; // build aggregate statistics report on data
  let saveReport = (next, ...args) => { ... }; // dump report into filesystem somewhere as a backup

  let fetchReport = InSeries(
     Background(logRequest), // don't wait for the request to finish logging
     loadData,
     buildReport,
     Background(saveReport) // don't wait for the report to be saved before returning it
  );
```

* * *

<a name="callback-patterns.Bridge"></a>

### callback-patterns.Bridge(task) ⇒ <code>function</code>
Wraps around a callback-driven function,
and returns a function that can be called either with a callback,
or as an async function that returns a promise.
This makes it easier to bridge the gap between callback-driven code and promise-driven code

NOTE: Bridge works by checking if the first argument is a function, and assuming its a callback if so.
You should take care to not use the Bridge wrapper if your task expects the first argument to be a function.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>function</code> - a task that can either be passed a callback, or awaited  
**Params**

- task <code>function</code> - a callback-driven task.

**Example**  
```javascript

  let InSeries = require('callback-patterns/InSeries');
  let Bridge = require('callback-patterns/Bridge');

  let task = Bridge(
    function(next, ...args) {...},
  );

  task(next, ...args); // this works

  task(...args).then(...); // this works too

```

* * *

<a name="callback-patterns.Callbackify"></a>

### callback-patterns.Callbackify(generator) ⇒ <code>CallbackTask</code>
Wraps around a promise generator function,
to make it easier to integrate with task functions.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>CallbackTask</code> - a task that wraps around the promise  
**Params**

- generator <code>function</code> - a function that generates a promise from the args.

**Example**  
```javascript
  let InSeries = require('callback-patterns/InSeries');
  let Callbackify = require('callback-patterns/Callbackify');

  let task = InSeries(
    function(next, ...args) {...},
    Callbackify(
      (...args) => new Promise((resolve, reject) => resolve(...args))
    ),
    function(next, ...args) {},
    ...
  );

  task(next, ...args);
```

* * *

<a name="callback-patterns.CatchError"></a>

### callback-patterns.CatchError(task) ⇒ <code>CallbackTask</code>
Errors bypass the normal flow of execution.
They always return immediately up the "stack",
even if they occur inside nested InSeries or InParallel chains.

```javascript
  let InSeries = require('callback-patterns/InSeries');
  let CatchError = require('callback-patterns/CatchError');

  let task = InSeries(
    (next) => { console.log(1); next(); }
    InSeries(
      (next) => { console.log(2); next(); }
      (next) => { console.log(3); next('Error'); }
    ),
    InSeries(
      (next) => { console.log(4); next();}
      (next) => { console.log(5); next();}
    )
  )(console.log); // prints out 1 2 3 Error, eventually
```

If you need to catch an error explicitly at some point,
wrap a task in CatchError, which will return the error as the first argument
to the next function.

```javascript
  let InSeries = require('callback-patterns/InSeries');
  let CatchError = require('callback-patterns/CatchError');
  let task = InSeries(
    (next) => { console.log(1); next();}
    CatchError(
      InSeries(
        (next) => { console.log(2); next();}
        (next) => { console.log(3); next('Error');}
      ),
    ),
    (next, error) => error != null ? console.log('Error Caught') : null,
    InSeries(
      (next) => { console.log(4); next();}
      (next) => { console.log(5); next();}
    )
  )(console.log); // prints out 1 2 3 Error Caught 4 5, eventually
```

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>CallbackTask</code> - a wrapper function around the task  
**Params**

- task <code>CallbackTask</code> - a function that checks the arguments.


* * *

<a name="callback-patterns.Delay"></a>

### callback-patterns.Delay(delay) ⇒ <code>CallbackTask</code>
Delay acts like `PassThrough`, but inserts a delay in the call.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>CallbackTask</code> - a delay task  
**Params**

- delay <code>number</code> - The time to delay, in ms.

**Example**  
```javascript
  let Delay = require('callback-patterns/Delay');
  let InSeries = require('callback-patterns/InSeries');

  let task = InSeries(
    (next, num) => next(null, num),
    Delay(100),
    (next, num) => next(null, num + 1),
  );

  let onDone = (err, result) => console.log(err, result);

  task(onDone, 1); // prints null 1, after a 100 ms delay
```

* * *

<a name="callback-patterns.If"></a>

### callback-patterns.If(ifTask, thenTask, elseTask) ⇒ <code>CallbackTask</code>
`If` accepts up to three tasks,
an 'if' task, a 'then' task, and lastly an 'else' task
note: by default, the ifTask, thenTask, and elseTask are PassThrough
note: the ifTask can return multiple results,
but only the first is checked for truthiness

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Params**

- ifTask <code>CallbackTask</code> - a condition task.
- thenTask <code>CallbackTask</code> - a task to run when ifTask returns a truthy value.
- elseTask <code>CallbackTask</code> - a task to run when ifTask returns a falsy value.

**Example**  
```javascript
  let If = require('callback-patterns/If');

  let logIfEven = If(
    (next, num) => next(null, num % 2 === 0)
    (next, num) => { console.log('is even!'); next(null, num); },
    (next, num) => { console.log('is not even!'); next(null, num); },
  );

  let onDone = (err, ...results) => console.log(results);

  logIfEven(null, 1); // prints out 'is not even!' eventually
  logIfEven(null, 2); // prints out 'is even!' eventually
```

* * *

<a name="callback-patterns.InOrder"></a>

### callback-patterns.InOrder(...tasks) ⇒ <code>CallbackTask</code>
```javascript
  let InOrder = require('callback-patterns/InOrder');

  let task = InOrder(
    function(next, ...args) {},
    function(next, ...args) {},
    ...
  );

  task(next, ...args);
```
Runs several asynchronous tasks one after another.
Each task gets the arguments that were originally passed into the wrapper.
This is different from InSeries, where the output of each is task is passed as the input to the next.
```javascript
  const InOrder = require('callback-patterns/InOrder');

  const task = InOrder(
    (next, a) => { a.val = 1; console.log(a.val); next();}
    (next, a) => { a.val = 2; console.log(a.val); next();}
    (next, a) => { a.val = 3; console.log(a.val); next();}
  )(null, {}); // prints out 1 2 3, eventually
```

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>CallbackTask</code> - a wrapper function that runs the tasks in order  
**Params**

- ...tasks <code>CallbackTask</code> - any number of tasks to run in order.


* * *

<a name="callback-patterns.InParallel"></a>

### callback-patterns.InParallel(...tasks) ⇒ <code>CallbackTask</code>
```javascript
  let InParallel = require('callback-patterns/InParallel');

  let task = InParallel(
    function(next, ...args) {},
    function(next, ...args) {},
    ...
  );

  task(next, ...args);
```
InParallel accepts a number of functions, and returns a task function that executes all of its child tasks in parallel.

note: because the callbacks can return any number of results,
the results from each task are autoboxed into an array.
This includes an empty array for tasks that don't return results.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>CallbackTask</code> - a wrapper function that runs the tasks in parallel  
**Params**

- ...tasks <code>CallbackTask</code> - any number of tasks to run in parallel.

**Example**  
```javascript
  let InParallel = require('callback-patterns/InParallel');

  let task = InParallel(
    (next) => next(null, 1),
    (next) => next(null, 2),
    (next) => next(null, 3, 4),
  );

  let onDone = (err, ...results) => console.log(results);

  chain(onDone); // prints [ [ 1 ], [ 2 ], [ 3, 4 ] ]
```

* * *

<a name="callback-patterns.InParallel.Flatten"></a>

#### InParallel.Flatten(...tasks) ⇒ <code>CallbackTask</code>
```javascript
  let InParallel = require('callback-patterns/InParallel');

  let task = InParallel.Flatten(
    function(next, ...args) {},
    function(next, ...args) {},
    ...
  );

  task(next, ...args);
```
InParallel.Flatten is identical to InParallel, except tasks that return
single results do not get autoboxed in arrays

note: because the callbacks can return any number of results,
the results from each task are autoboxed into an array.
This includes an empty array for tasks that don't return results.

**Kind**: static method of [<code>InParallel</code>](#callback-patterns.InParallel)  
**Returns**: <code>CallbackTask</code> - a wrapper function that runs the tasks in parallel  
**Params**

- ...tasks <code>CallbackTask</code> - any number of tasks to run in parallel.

**Example**  
```javascript
  let InParallel = require('callback-patterns/InParallel');

  let task = InParallel.Flatten(
    (next) => next(),
    (next) => next(null, 1),
    (next) => next(null, 2, 3),
  );

  let onDone = (err, ...results) => console.log(results);

  chain(onDone); // prints [ undefined, 1, [ 2, 3 ] ]
```

* * *

<a name="callback-patterns.InSeries"></a>

### callback-patterns.InSeries(...tasks) ⇒ <code>CallbackTask</code>
```javascript
  let InSeries = require('callback-patterns/InSeries');

  let task = InSeries(
    function(next, ...args) {},
    function(next, ...args) {},
    ...
  );

  task(next, ...args);
```
Runs several tasks in series, and passes the results from one down to the next.
This works similarly to the 'waterfall' method in caolan's async.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>CallbackTask</code> - a wrapper function that runs the tasks in series  
**Params**

- ...tasks <code>CallbackTask</code> - any number of tasks to run in series.

**Example**  
```javascript
  let InSeries = require('callback-patterns/InSeries');

  let chain = InSeries(
    (next) => { console.log(1); next();}
    InSeries(
      (next) => { console.log(2); next();}
      (next) => { console.log(3); next();}
    ),
    InSeries(
      (next) => { console.log(4); next();}
      (next) => { console.log(5); next();}
    )
  )(); // prints out 1 2 3 4 5, eventually
```

* * *

<a name="callback-patterns.Logging"></a>

### callback-patterns.Logging(...statements) ⇒ <code>CallbackTask</code>
A logging utility.
It passes the arguments received into all the statements, collects the results, and joins them together with newlines to build the final log statement

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>CallbackTask</code> - a logging task  
**Params**

- ...statements <code>function</code> - any number of logging values.  Functions are called with the calling arguments, everything else is passed directly to

**Example**  
```javascript
  let InSeries = require('callback-patterns/InSeries');
  let Logging = require('callback-patterns/Logging');

  let task = InSeries(
    (next, ...args) => next(null, ...args),
    Logging(
      'log statement here'
      (...args) => `args are ${args}`
    ),
    (next, ...args) => next(null, ...args),
    ...
  );

  task(next, ...args);
```

* * *

<a name="callback-patterns.Memoize"></a>

### callback-patterns.Memoize(CallbackTask, [keyFunction], [cache]) ⇒ <code>CallbackTask</code>
Memoize builds a wrapper function that caches results of previous executions.
As a result, repeated calls to Memoize may be much faster, if the request hits the cache.

NOTE: As of now, there are no cache eviction mechanisms.
  You should try to use Memoized functions in a 'disposable' way as a result

NOTE: Memoize is not 'thread-safe' currently.  If two calls are made for the same object currently,
  two calls to the wrapped function will be made

NOTE: Memoize will cache errors as well as results.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Params**

- CallbackTask <code>CallbackTask</code> - the task function to memoize.
- [keyFunction] <code>function</code> - a function that synchronously generates a key for a request.
- [cache] <code>object</code> - a pre-filled cache to use

**Example**  
```javascript

  let Delay = require('callback-patterns/Delay');
  let InOrder = require('callback-patterns/InOrder');
  let InSeries = require('callback-patterns/InSeries');
  let Memoize = require('callback-patterns/Memoize');

  let slowTask = InSeries(
    (next, i) => {
      console.log('task called with ', i);
      next(null, i + 1);
    },
    Delay(1000)
  );

  let memoizedTask = Memoize(slowTask);

  let test = InOrder(
    memoizedTask,
    memoizedTask,
    memoizedTask
  );


  test(null, 1); // task is only called once, even though memoizedTask is called three times
```

* * *

<a name="callback-patterns.ParallelFilter"></a>

### callback-patterns.ParallelFilter(filter) ⇒ <code>CallbackTask</code>
Builds a task that filters all of its arguments in parallel, and returns the results

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>CallbackTask</code> - a filtering task  
**Params**

- filter <code>CallbackTask</code> - an asynchronous filter function that returns true or false through its callback.

**Example**  
```javascript
  let InSeries = require('callback-patterns/InSeries');
  let Logging = require('callback-patterns/Logging');
  let ParallelFilter = require('callback-patterns/ParallelFilter');

  let isEven = (next, val) => next(null, val % 2 === 0);

  let task = InSeries(
    (next) => next(null, 1, 2, 3, 4, 5, 6),
    Logging((...args) => args), // logs [1, 2, 3, 4, 5, 6]
    ParallelFilter(isEven),
    Logging((...args) => args), // logs [2, 4, 6]
    ...
  );

  task(next, ...args);
```

* * *

<a name="callback-patterns.ParallelMap"></a>

### callback-patterns.ParallelMap(task) ⇒ <code>CallbackTask</code>
Builds a task wrapper that asynchronously maps each of its arguments to a result.
Note: even though the mapping function can return any number of results, ParallelMap only uses the first result

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>CallbackTask</code> - a parallel map task  
**Params**

- task <code>CallbackTask</code> - an asynchronous mapping function.

**Example**  
```javascript
  let InSeries = require('callback-patterns/InSeries');
  let Logging = require('callback-patterns/Logging');
  let ParallelMap = require('callback-patterns/ParallelMap');

  let addOne = (next, val) => next(null, val + 1);

  let task = InSeries(
    (next) => next(null, 1, 2, 3, 4, 5, 6),
    Logging((...args) => args), // logs [1, 2, 3, 4, 5, 6]
    ParallelMap(addOne),
    Logging((...args) => args), // logs [2, 3, 4, 5, 6, 7]
    ...
  );

  task(next, ...args);
```

* * *

<a name="callback-patterns.PassThrough"></a>

### callback-patterns.PassThrough()
Sometimes, you need to pass previous arguments along with a new result.  The easiest way to do this is to use PassThrough, which is a convenience method for:
```javascript
 (next, ...args) => next(null, ...args),
```

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Example**  
```javascript
  let InSeries = require('callback-patterns/InSeries');
  let Logging = require('callback-patterns/Logging');
  let PassThrough = require('callback-patterns/PassThrough');

  let task = InSeries(
    (next) => next(null, 1, 2, 3, 4, 5, 6),
			Logging((...args) => args), // logs [1, 2, 3, 4, 5, 6]
    PassThrough,
			Logging((...args) => args), // logs [2, 3, 4, 5, 6, 7]
    ...
  );

  task(next, ...args);
```

* * *

<a name="callback-patterns.Promisify"></a>

### callback-patterns.Promisify(task) ⇒ <code>function</code>
Wraps around a task function and greates a promise generator,
to make it easier to integrate task functions and promises.

NOTE: callback-patterns does not come bundled with a promise library,
it expects Promise to already exists in the global namespace.

NOTE: if a function 'returns' multiple values through the next callback,
Promisify auto-boxes these into an array.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>function</code> - a function that generates a Promise when called  
**Params**

- task <code>function</code> - a function that generates a promise from the args.

**Example**  
```javascript
  let InSeries = require('callback-patterns/InSeries');
  let Promisify = require('callback-patterns/Promisify');

  let task = Promisify(
    InSeries(
      function(next, ...args) {...},
      function(next, ...args) {...},
      ...
    )
  );

 task()
   .then()
   ...

```

* * *

<a name="callback-patterns.Race"></a>

### callback-patterns.Race(...tasks) ⇒ <code>CallbackTask</code>
Race accepts a number of functions, and returns a task function that executes all of its child tasks simultaneously.  The first result (or error) is returned, and the remaining results (or errors) are ignored.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>CallbackTask</code> - a task  
**Params**

- ...tasks <code>CallbackTask</code> - any number of tasks to run in parallel.

**Example**  
```javascript
  let Race = require('callback-patterns/Race');

  let task = Race(
    (next) => next(null, 1),
    (next) => setTimeout(next, 100, null, 2),
    (next) => { throw new Error(); } ,
  );

  let onDone = (err, ...results) => console.log(results);

  task(onDone); // prints out [ 1 ], eventually
```

* * *

<a name="callback-patterns.Retry"></a>

### callback-patterns.Retry(task, retryStrategy) ⇒ <code>CallbackTask</code>
Wraps a task and attempts to retry if it throws an error, with an exponential backoff.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>CallbackTask</code> - a task  
**Params**

- task <code>CallbackTask</code> - the task to wrap.
- retryStrategy <code>function</code> - an optional retry strategy.

**Example**  
```javascript
  let Retry = require('callback-patterns/Retry');

  let unstableTask = (next) => {
    if (Math.random() > 0.9) { throw new Error(); }
    else { next(); }
  };

  // attempt retries up to 10 times for up to 10000 ms ,
  // with a constant retry delay of 100 ms between attempts
  let stableTask = Retry(unstableTask, Retry.LinearRetryStrategy(100, 10, 10000));

  // attempt retries up to 10 times for up to 10000 ms,
  // with an exponential backoff retry delay of 100 ms, 200 ms, 400 ms, ...
  let stableTask2 = Retry(unstableTask, Retry.ExponentialRetryStrategy(100, 10, 10000, 2));

  // attempt retries up to 4 times,
  // with retry delays of 100 ms, 100 ms, 100 ms, 1000ms
  let stableTask3 = Retry(unstableTask, Retry.ManualRetryStrategy(100, 100, 100, 1000));

```

* * *

<a name="callback-patterns.Throttle"></a>

### callback-patterns.Throttle(task, limit) ⇒ <code>CallbackTask</code>
Wraps a task and ensures that only X number of instances of the task can be run in parallel.
Requests are queued up in an unbounded FIFO queue until they can be run.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>CallbackTask</code> - a task  
**Params**

- task <code>CallbackTask</code> - the task to throttle
- limit <code>number</code> - the number of instances that can run in parallel. default 1.


* * *

<a name="callback-patterns.TimeIn"></a>

### callback-patterns.TimeIn(task, ms) ⇒ <code>CallbackTask</code>
TimeIn wraps a single task function, and returns a function that only returns after X ms.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>CallbackTask</code> - a task  
**Params**

- task <code>CallbackTask</code> - the task to wrap in a timeout.
- ms <code>number</code> - the timein in ms.

**Example**  
```javascript
  let TimeIn = require('callback-patterns/TimeIn');

  let task = TimeIn(
    function(next, ...args) {},
			1000
  );

  task(next, ...args);
```

* * *

<a name="callback-patterns.TimeOut"></a>

### callback-patterns.TimeOut(task, ms) ⇒ <code>CallbackTask</code>
TimeOut wraps a single task function, and returns a function that returns early if the task fails to complete before the timeout triggers.

NOTE: the timeout being triggered will not cancel the original task.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>CallbackTask</code> - a task  
**Params**

- task <code>CallbackTask</code> - the task to wrap in a timeout.
- ms <code>number</code> - the timeout in ms.

**Example**  
```javascript
  let TimeOut = require('callback-patterns/TimeOut');

  let chain = TimeOut(
    function(next, ...args) {},
			1000
  );

  chain(next, ...args);
```

* * *

<a name="callback-patterns.Timer"></a>

### callback-patterns.Timer(task, label) ⇒ <code>CallbackTask</code>
Wraps a task and logs how long it takes to finish, or fail.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>CallbackTask</code> - a task  
**Params**

- task <code>CallbackTask</code> - the task to wrap.
- label <code>string</code> - an optional label to log.


* * *

<a name="callback-patterns.While"></a>

### callback-patterns.While(conditionTask, loopTask) ⇒ <code>function</code>
While accepts two tasks and returns a task that conditionally executes some number of times.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Params**

- conditionTask <code>function</code> - a condition task.
- loopTask <code>function</code> - a task to run if the condition returns a truthy value.

**Example**  
```javascript
  let While = require('callback-patterns/While');

  let task = While(
    (next, num) => next(null, num < 10),
    (next, num) => next(null, num + 1),
  );

  let onDone = (err, result) => console.log(result);

  task(onDone, 1); // prints 9, eventually
```

* * *

