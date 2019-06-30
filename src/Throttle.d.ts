
type Callback = (err : Error | null | undefined, ...res : any[]) => void;

type CallbackTask = (next : Callback, ...args: any[]) => void;

/**
* Wraps a task and ensures that only X number of instances of the task can be run in parallel.
* Requests are queued up in an unbounded FIFO queue until they can be run.
* @param {CallbackTask} task - the task to throttle
* @param {number} limit - the number of instances that can run in parallel. default 1.
* @returns {CallbackTask} a task
* @memberof callback-patterns
*/
declare function Throttle(task: CallbackTask, limit ?: number) : CallbackTask;

export default Throttle;
