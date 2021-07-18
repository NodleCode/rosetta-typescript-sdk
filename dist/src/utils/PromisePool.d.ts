declare const defaultApplier: (promiseBodyFn: Function, arg: IArguments) => any;
declare const arrayApplier: (promiseBodyFn: Function, args?: any[]) => any;
declare function PromisePool(poolLimit: number, argArray: any[], promiseBodyFn: Function, applierFn?: (promiseBodyFn: Function, arg: IArguments) => any): Promise<any[]>;
export { PromisePool as create, defaultApplier, arrayApplier };
