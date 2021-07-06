declare function PromisePool(poolLimit: number, argArray: any, promiseBodyFn: any, applierFn?: (promiseBodyFn: any, arg: any) => any): Promise<any[]>;
/**
 * PromisePool.js
 * Author: Yoshi Jaeger
 *
 * Adapted the code from https://github.com/rxaviers/async-pool/blob/master/lib/es7.js
 * to use an applier proxy.
 */
export function defaultApplier(promiseBodyFn: any, arg: any): any;
export function arrayApplier(promiseBodyFn: any, args?: any[]): any;
export { PromisePool as create };
