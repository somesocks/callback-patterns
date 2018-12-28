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
    * [.Assert(validator, message)](#callback-patterns.Assert) ⇒ <code>taskFunction</code>
    * [.Callbackify(generator)](#callback-patterns.Callbackify) ⇒ <code>taskFunction</code>
    * [.CatchError(task)](#callback-patterns.CatchError) ⇒ <code>taskFunction</code>
    * [.Delay(delay)](#callback-patterns.Delay) ⇒ <code>taskFunction</code>
    * [.If(ifTask, thenTask, elseTask)](#callback-patterns.If) ⇒ <code>taskFunction</code>
    * [.InOrder(...tasks)](#callback-patterns.InOrder) ⇒ <code>taskFunction</code>
    * [.InParallel(...tasks)](#callback-patterns.InParallel) ⇒ <code>taskFunction</code>
    * [.InSeries(...tasks)](#callback-patterns.InSeries) ⇒ <code>taskFunction</code>
    * [.Logging(...statements)](#callback-patterns.Logging) ⇒ <code>taskFunction</code>
    * [.ParallelFilter(filter)](#callback-patterns.ParallelFilter) ⇒ <code>taskFunction</code>
    * [.ParallelMap(task)](#callback-patterns.ParallelMap) ⇒ <code>taskFunction</code>
    * [.Promisify(task)](#callback-patterns.Promisify) ⇒ <code>function</code>
    * [.Race(...tasks)](#callback-patterns.Race) ⇒ <code>taskFunction</code>
    * [.Retry(task, options)](#callback-patterns.Retry) ⇒ <code>taskFunction</code>
    * [.Throttle(task, limit)](#callback-patterns.Throttle) ⇒ <code>taskFunction</code>
    * [.TimeIn(task, ms)](#callback-patterns.TimeIn) ⇒ <code>taskFunction</code>
    * [.TimeOut(task, ms)](#callback-patterns.TimeOut) ⇒ <code>taskFunction</code>
    * [.Timer(task, label)](#callback-patterns.Timer) ⇒ <code>taskFunction</code>
    * [.While(conditionTask, loopTask)](#callback-patterns.While) ⇒ <code>function</code>


* * *

<a name="callback-patterns.Assert"></a>

### callback-patterns.Assert(validator, message) ⇒ <code>taskFunction</code>
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
Builds an async assertion task.  When called,
if the arguments do not match the validator functions,
Assert passes an error to its callback.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>taskFunction</code> - an assertion task  
**Params**

- validator <code>function</code> - a function that checks the arguments.
- message <code>string</code> - an optional error message to throw if the assertion fails, or a message builder function.


* * *

<a name="callback-patterns.Callbackify"></a>

### callback-patterns.Callbackify(generator) ⇒ <code>taskFunction</code>
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
Wraps around a promise generator function,
to make it easier to integrate with task functions.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>taskFunction</code> - a task that wraps around the promise  
**Params**

- generator <code>function</code> - a function that generates a promise from the args.


* * *

<a name="callback-patterns.CatchError"></a>

### callback-patterns.CatchError(task) ⇒ <code>taskFunction</code>
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
**Returns**: <code>taskFunction</code> - a wrapper function around the task  
**Params**

- task <code>taskFunction</code> - a function that checks the arguments.


* * *

<a name="callback-patterns.Delay"></a>

### callback-patterns.Delay(delay) ⇒ <code>taskFunction</code>
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
Delay acts like PassThrough, but inserts a delay in the call.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>taskFunction</code> - a delay task  
**Params**

- delay <code>number</code> - The time to delay, in ms.


* * *

<a name="callback-patterns.If"></a>

### callback-patterns.If(ifTask, thenTask, elseTask) ⇒ <code>taskFunction</code>
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
If accepts up to three tasks,
an 'if' task, a 'then' task, and lastly an 'else' task
note: by default, the ifTask, thenTask, and elseTask are PassThrough
note: the ifTask can return multiple results,
but only the first is checked for truthiness

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Params**

- ifTask <code>taskFunction</code> - a condition task.
- thenTask <code>taskFunction</code> - a task to run when ifTask returns a truthy value.
- elseTask <code>taskFunction</code> - a task to run when ifTask returns a falsy value.


* * *

<a name="callback-patterns.InOrder"></a>

### callback-patterns.InOrder(...tasks) ⇒ <code>taskFunction</code>
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
**Returns**: <code>taskFunction</code> - a wrapper function that runs the tasks in order  
**Params**

- ...tasks <code>taskFunction</code> - any number of tasks to run in order.


* * *

<a name="callback-patterns.InParallel"></a>

### callback-patterns.InParallel(...tasks) ⇒ <code>taskFunction</code>
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

```javascript
  let InParallel = require('callback-patterns/InParallel');

  let task = InParallel(
    (next) => next(null, 1),
    (next) => next(null, 2),
    (next) => next(null, 3, 4),
  );

  let onDone = (err, ...results) => console.log(results);

  chain(onDone); // prints out [ 1 ] [ 2 ] [ 3, 4 ], eventually
```
note: because the callbacks can return any number of results,
the results from each task are autoboxed into an array.
This includes an empty array for tasks that don't return results.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>taskFunction</code> - a wrapper function that runs the tasks in parallel  
**Params**

- ...tasks <code>taskFunction</code> - any number of tasks to run in parallel.


* * *

<a name="callback-patterns.InSeries"></a>

### callback-patterns.InSeries(...tasks) ⇒ <code>taskFunction</code>
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

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>taskFunction</code> - a wrapper function that runs the tasks in series  
**Params**

- ...tasks <code>taskFunction</code> - any number of tasks to run in series.


* * *

<a name="callback-patterns.Logging"></a>

### callback-patterns.Logging(...statements) ⇒ <code>taskFunction</code>
A logging utility.
It passes the arguments received into all the statements, collects the results, and joins them together with newlines to build the final log statement

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>taskFunction</code> - a logging task  
**Params**

- ...statements <code>function</code> - any number of logging values.  Functions are called with the calling arguments, everything else is passed directly to


* * *

<a name="callback-patterns.ParallelFilter"></a>

### callback-patterns.ParallelFilter(filter) ⇒ <code>taskFunction</code>
Builds a task that filters all of its arguments in parallel, and returns the results

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>taskFunction</code> - a filtering task  
**Params**

- filter <code>taskFunction</code> - an asynchronous filter function that returns true or false through its callback.


* * *

<a name="callback-patterns.ParallelMap"></a>

### callback-patterns.ParallelMap(task) ⇒ <code>taskFunction</code>
Builds a task wrapper that asynchronously maps each of its arguments to a result.
Note: even though the mapping function can return any number of results, ParallelMap only uses the first result

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>taskFunction</code> - a parallel map task  
**Params**

- task <code>taskFunction</code> - an asynchronous mapping function.


* * *

<a name="callback-patterns.Promisify"></a>

### callback-patterns.Promisify(task) ⇒ <code>function</code>
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

Wraps around a task function and greates a promise generator,
to make it easier to integrate task functions and promises.

NOTE: callback-patterns does not come bundled with a promise library,
it expects Promise to already exists in the global namespace.

NOTE: even though callback-patterns can 'return' multiple values through the next callback,
Promisify always resolves to the first result returned.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>function</code> - a function that generates a Promise when called  
**Params**

- task <code>function</code> - a function that generates a promise from the args.


* * *

<a name="callback-patterns.Race"></a>

### callback-patterns.Race(...tasks) ⇒ <code>taskFunction</code>
```javascript
  let Race = require('callback-patterns/Race');

  let task = Race(
    function(next, ...args) {},
    function(next, ...args) {},
    ...
  );

  task(next, ...args);
```

Race accepts a number of functions, and returns a task function that executes all of its child tasks simultaneously.  The first result (or error) is returned, and the remaining results (or errors) are ignored.

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

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>taskFunction</code> - a task  
**Params**

- ...tasks <code>taskFunction</code> - any number of tasks to run in parallel.


* * *

<a name="callback-patterns.Retry"></a>

### callback-patterns.Retry(task, options) ⇒ <code>taskFunction</code>
Wraps a task and attempts to retry if it throws an error, with an exponential backoff.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>taskFunction</code> - a task  
**Params**

- task <code>taskFunction</code> - the task to wrap.
- options <code>object</code> - an optional set of retry options.
    - .timeout <code>object</code> - maximum time to attempt retries.
    - .retries <code>object</code> - maximum number of retries to attempt.


* * *

<a name="callback-patterns.Throttle"></a>

### callback-patterns.Throttle(task, limit) ⇒ <code>taskFunction</code>
Wraps a task and ensures that only X number of instances of the task can be run in parallel.
Requests are queued up in an unbounded FIFO queue until they can be run.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>taskFunction</code> - a task  
**Params**

- task <code>taskFunction</code> - the task to throttle
- limit <code>number</code> - the number of instances that can run in parallel. default 1.


* * *

<a name="callback-patterns.TimeIn"></a>

### callback-patterns.TimeIn(task, ms) ⇒ <code>taskFunction</code>
```javascript
  let TimeIn = require('callback-patterns/TimeIn');

  let task = TimeIn(
    function(next, ...args) {},
			1000
  );

  task(next, ...args);
```

TimeIn wraps a single task function, and returns a function that only returns after X ms.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>taskFunction</code> - a task  
**Params**

- task <code>taskFunction</code> - the task to wrap in a timeout.
- ms <code>number</code> - the timein in ms.


* * *

<a name="callback-patterns.TimeOut"></a>

### callback-patterns.TimeOut(task, ms) ⇒ <code>taskFunction</code>
```javascript
  let TimeOut = require('callback-patterns/TimeOut');

  let chain = TimeOut(
    function(next, ...args) {},
			1000
  );

  chain(next, ...args);
```

TimeOut wraps a single task function, and returns a function that returns early if the task fails to complete before the timeout triggers.

NOTE: the timeout being triggered will not cancel the original task.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>taskFunction</code> - a task  
**Params**

- task <code>taskFunction</code> - the task to wrap in a timeout.
- ms <code>number</code> - the timeout in ms.


* * *

<a name="callback-patterns.Timer"></a>

### callback-patterns.Timer(task, label) ⇒ <code>taskFunction</code>
Wraps a task and logs how long it takes to finish, or fail.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>taskFunction</code> - a task  
**Params**

- task <code>taskFunction</code> - the task to wrap.
- label <code>string</code> - an optional label to log.


* * *

<a name="callback-patterns.While"></a>

### callback-patterns.While(conditionTask, loopTask) ⇒ <code>function</code>
```javascript
  let While = require('callback-patterns/While');

  let task = While(
    (next, num) => next(null, num < 10),
    (next, num) => next(null, num + 1),
  );

  let onDone = (err, result) => console.log(result);

  task(onDone, 1); // prints 9, eventually
```
While accepts two tasks and returns a task that conditionally executes some number of times.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Params**

- conditionTask <code>function</code> - a condition task.
- loopTask <code>function</code> - a task to run if the condition returns a truthy value.


* * *

