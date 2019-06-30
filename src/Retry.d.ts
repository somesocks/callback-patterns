
type Callback = (err ?: Error | null | undefined, ...res : any[]) => void;

type CallbackTask = (next : Callback, ...args: any[]) => void;

/**
* Wraps a task and attempts to retry if it throws an error, with an exponential backoff.
* @param {CallbackTask} task - the task to wrap.
* @param {object} options - an optional set of retry options.
* @param {object} options.timeout - maximum time to attempt retries.
* @param {object} options.retries - maximum number of retries to attempt.
* @returns {CallbackTask} a task
* @memberof callback-patterns
*/
declare function Retry(task: CallbackTask, options ?: object) : CallbackTask;

export default Retry;
