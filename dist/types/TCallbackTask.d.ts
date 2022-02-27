import TCallback from './TCallback';
declare type TCallbackTask<TExtras = {}> = {
    (next: TCallback, ...args: any[]): void;
} & TExtras;
export default TCallbackTask;
