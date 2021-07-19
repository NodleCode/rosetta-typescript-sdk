const defaultApplier = (promiseBodyFn: Function, arg: IArguments) => {
    const r = promiseBodyFn(arg);
    return r;
};

const arrayApplier = (promiseBodyFn: Function, args = []) => {
    const r = promiseBodyFn(...args);
    return r;
};

async function PromisePool(
    poolLimit = 8,
    argArray = [],
    promiseBodyFn: Function,
    applierFn = defaultApplier
) {
    const ret = [];
    const executing = [];

    for (const item of argArray) {
        const p = Promise.resolve().then(() => applierFn(promiseBodyFn, item));
        ret.push(p);

        const e = p.then(() => executing.splice(executing.indexOf(e), 1));
        executing.push(e);

        if (executing.length >= poolLimit) {
            await Promise.race(executing);
        }
    }

    return Promise.all(ret);
}

export { PromisePool as create, defaultApplier, arrayApplier };
