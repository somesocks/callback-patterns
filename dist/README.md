# callback-patterns

<a name="callback-patterns"></a>

## callback-patterns : <code>object</code>
**Kind**: global namespace  

* [callback-patterns](#callback-patterns) : <code>object</code>
    * [.Assert(validator, message)](#callback-patterns.Assert) ⇒ <code>taskFunction</code>
    * [.CatchError(task)](#callback-patterns.CatchError) ⇒ <code>taskFunction</code>
    * [.If(conditionTask, thenTask, elseTask)](#callback-patterns.If) ⇒ <code>taskFunction</code>
    * [.InOrder(...tasks)](#callback-patterns.InOrder) ⇒ <code>taskFunction</code>
    * [.InParallel(...tasks)](#callback-patterns.InParallel) ⇒ <code>taskFunction</code>
    * [.InSeries(...tasks)](#callback-patterns.InSeries) ⇒ <code>taskFunction</code>
    * [.Logging(...statements)](#callback-patterns.Logging) ⇒ <code>taskFunction</code>
    * [.Race(...tasks)](#callback-patterns.Race) ⇒ <code>taskFunction</code>
    * [.While(conditionTask, loopTask)](#callback-patterns.While) ⇒ <code>function</code>


* * *

<a name="callback-patterns.Assert"></a>

### callback-patterns.Assert(validator, message) ⇒ <code>taskFunction</code>
```javascript
  const Assert = require('callback-patterns/Assert');
  const InSeries = require('callback-patterns/InSeries');

  const task = InSeries(
    (next, num) => next(null, num),
    Assert(
      (num) => (num >= 0),
      (num) => `${num} is less than zero`
    ),
    (next, num) => next(null, num),
  );

  const onDone = (err, result) => console.log(err, result);

  task(onDone, 1); // prints null 1, eventually
  task(onDone, -1); // prints '-1 is less than zero', eventually
```
Builds an async assertion task.  When called, if the arguments do not match the validator functions,
Assert passes an error to its callback.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Returns**: <code>taskFunction</code> - an assertion task  
**Params**

- validator <code>function</code> - a function that checks the arguments.
- message <code>string</code> - an optional error message to throw if the assertion fails, or a message builder function.


* * *

<a name="callback-patterns.CatchError"></a>

### callback-patterns.CatchError(task) ⇒ <code>taskFunction</code>
Errors bypass the normal flow of execution.  They always return immediately up the "stack" even if they occur inside nested InSeries or InParallel chains.

```javascript
  const InSeries = require('callback-patterns/InSeries');
  const CatchError = require('callback-patterns/CatchError');

  const task = InSeries(
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

If you need to catch an error explicitly at some point, wrap a chain in CatchError, which will return the error as the first argument to the next function.

```javascript
  const InSeries = require('callback-patterns/InSeries');
  const CatchError = require('callback-patterns/CatchError');
  const task = InSeries(
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

<a name="callback-patterns.If"></a>

### callback-patterns.If(conditionTask, thenTask, elseTask) ⇒ <code>taskFunction</code>
```javascript
  const If = require('callback-patterns/If');

  let logIfEven = If(
    (next, num) => next(null, num % 2 === 0)
    (next, num) => { console.log('is even!'); next(null, num); },
    (next, num) => { console.log('is not even!'); next(null, num); },
  );

  let onDone = (err, ...results) => console.log(results);

  logIfEven(null, 1); // prints out 'is not even!' eventually
  logIfEven(null, 2); // prints out 'is even!' eventually
```
If accepts up to three tasks and returns a task that conditionally executes some.
note: by default, the conditionTask, thenTask, and elseTask are all set to PassThrough
note: the conditionTask can return multiple results, but only the first is checked for truthiness

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Params**

- conditionTask <code>taskFunction</code> - a condition task.
- thenTask <code>taskFunction</code> - a task to run if the condition returns a truthy value.
- elseTask <code>taskFunction</code> - a task to run if the condition returns a falsy value.


* * *

<a name="callback-patterns.InOrder"></a>

### callback-patterns.InOrder(...tasks) ⇒ <code>taskFunction</code>
```javascript
  const InOrder = require('callback-patterns/InOrder');

  const task = InOrder(
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
  const InParallel = require('callback-patterns/InParallel');

  let task = InParallel(
    function(next, ...args) {},
    function(next, ...args) {},
    ...
  );

  task(next, ...args);
```
InParallel accepts a number of functions, and returns a task function that executes all of its child tasks in parallel.

```javascript
  const InParallel = require('callback-patterns/InParallel');

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
  const InSeries = require('callback-patterns/InSeries');

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
  const InSeries = require('callback-patterns/InSeries');

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

<a name="callback-patterns.Race"></a>

### callback-patterns.Race(...tasks) ⇒ <code>taskFunction</code>
```javascript
  const Race = require('callback-patterns/Race');

  let task = Race(
    function(next, ...args) {},
    function(next, ...args) {},
    ...
  );

  task(next, ...args);
```

Race accepts a number of functions, and returns a task function that executes all of its child tasks simultaneously.  The first result (or error) is returned, and the remaining results (or errors) are ignored.

```javascript
  const Race = require('callback-patterns/Race');

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

<a name="callback-patterns.While"></a>

### callback-patterns.While(conditionTask, loopTask) ⇒ <code>function</code>
```javascript
  const While = require('callback-patterns/While');

  const task = While(
    (next, num) => next(null, num < 10),
    (next, num) => next(null, num + 1),
  );

  const onDone = (err, result) => console.log(result);

  task(onDone, 1); // prints 9, eventually
```
While accepts two tasks and returns a task that conditionally executes some number of times.

**Kind**: static method of [<code>callback-patterns</code>](#callback-patterns)  
**Params**

- conditionTask <code>function</code> - a condition task.
- loopTask <code>function</code> - a task to run if the condition returns a truthy value.


* * *

