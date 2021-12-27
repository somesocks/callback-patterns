
export type TCallback = {
	(err ?: any | null | undefined, ...results : any[]) : void;
}

export type TCallbackTask<TExtras = {}> = {
	(next : TCallback, ...args : any[]) : void;
} & TExtras;
