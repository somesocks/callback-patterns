
type validator = (...args : any[]) => boolean;

type message = ((...args : any[]) => string) | string;

type callback = (err ?: Error, ...res: any[]) => void;

type task = (next ?: callback, ...args: any[]) => void;

/**
* Wraps a task and ensures that only X number of instances of the task can be run in parallel.
* Requests are queued up in an unbounded FIFO queue until they can be run.
* @param {taskFunction} task - the task to throttle
* @param {number} limit - the number of instances that can run in parallel. default 1.
* @returns {taskFunction} a task
* @memberof callback-patterns
*/
declare function Throttle(task: task, limit ?: number) : task;

export default Throttle;
