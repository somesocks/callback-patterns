import Callback from './Callback';
declare type Task = {
    (next: Callback, ...args: any[]): void;
};
export default Task;
