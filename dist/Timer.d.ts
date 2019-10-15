import Task from './types/Task';
/**
* Wraps a task and logs how long it takes to finish, or fail.
* @param {CallbackTask} task - the task to wrap.
* @param {string} label - an optional label to log.
* @returns {CallbackTask} a task
* @memberof callback-patterns
*/
declare function Timer(task: Task, label?: string): Task;
export = Timer;
