
type validator = (...args : any[]) => boolean;

type message = ((...args : any[]) => string) | string;

type callback = (err ?: Error, ...res: any[]) => void;

type task = (next ?: callback, ...args: any[]) => void;

/**
* Wraps a task and attempts to retry if it throws an error, with an exponential backoff.
* @param {taskFunction} task - the task to wrap.
* @param {object} options - an optional set of retry options.
* @param {object} options.timeout - maximum time to attempt retries.
* @param {object} options.retries - maximum number of retries to attempt.
* @returns {taskFunction} a task
* @memberof callback-patterns
*/
declare function Retry(task: task, options ?: object) : task;

export default Retry;
