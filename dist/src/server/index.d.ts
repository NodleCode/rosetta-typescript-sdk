import ExpressServer from './expressServer';
import { OpenApiConfig } from '../../src/types';
export default class RosettaServer {
    config: OpenApiConfig;
    expressServer: ExpressServer;
    constructor(configuration?: OpenApiConfig);
    /**
     * Launches the Server Listener.
     * Makes use of the config provided in the constructor.
     */
    launch(): Promise<void>;
    /**
     * Register asserter to be used for all requests.
     * Only one can be registered at a time.
     */
    useAsserter(asserter: any): void;
    /**
     * Register a routehandler at {route}.
     * Optionally, pass an asserter that only handles requests to this
     * specific route.
     */
    register(route: string, handler: any, asserter?: any): void;
    /**
     * Gets called on failure. Currently unused.
     */
    close(): Promise<void>;
}
