/*
  CallHandler calls registered service handlers (if existing).
  Must be called with .bind(expressApp)
*/

const CallAsserter = async function (asserter, className, params) {
    if (!asserter || !className || !params) return;

    const validationFunc = asserter[className];
    if (!validationFunc) {
        console.log(`No validation func ${className} found`);
        return;
    }

    return validationFunc.bind(asserter)(params);
};

const CallHandler = async function (route, args) {
    const app = this;
    const routeHandlers = app.routeHandlers;

    const data = routeHandlers[route];
    if (!data || !data.handler) {
        throw new Error(`Service for ${route} not implemented`);
    }

    // Each route can have a specific asserter.
    // If a specific asserter was not set, the global asserter will
    // be used to validate requests, if set.
    const asserter = data.asserter || app.asserter;

    // Retrieve the modelName that was set by the Controller (collectRequestParams).
    // Also retrieve the request POST args using the modelName.
    const modelName = args.params.class;
    const requestParamsKey = args.params.requestParamsKey;
    const requestParams = args.params[requestParamsKey];

    // Try to call the asserter.
    await CallAsserter(asserter, modelName, requestParams);

    // Add the ability to access response/requests objects
    // from the service handlers.
    return await data.handler(args.params, args.request, args.response);
};
export default CallHandler;
