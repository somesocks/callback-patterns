
import TCallback from './TCallback';

type TCallbackTask<TExtras = {}> = {
	(next : TCallback, ...args : any[]) : void;
} & TExtras;

export default TCallbackTask;