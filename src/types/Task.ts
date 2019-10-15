
import Callback from './Callback';

type Task = {
	(next : Callback, ...args: any[]) : void
};

export default Task;
