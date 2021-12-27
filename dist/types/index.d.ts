export declare type TCallback = {
    (err?: any | null | undefined, ...results: any[]): void;
};
export declare type TCallbackTask<TExtras = {}> = {
    (next: TCallback, ...args: any[]): void;
} & TExtras;
