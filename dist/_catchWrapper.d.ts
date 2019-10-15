declare function catchWrapper(func: Function): (next?: Function | undefined) => void;
export = catchWrapper;
