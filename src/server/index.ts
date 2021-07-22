import defaultConfig from './config/default';
import ExpressServer from './expressServer';
//import * as logger from "../logger";
import { OpenApiConfig } from '../../src/types';

export default class RosettaServer {
    config: OpenApiConfig;
    expressServer: ExpressServer;
    constructor(configuration = {} as OpenApiConfig) {
        this.config = Object.assign({}, defaultConfig, configuration);
        const port = this.config.URL_PORT;
        const host = this.config.URL_PATH; //URL_HOST
        const openAPIPath = this.config.OPENAPI_YAML;

        this.expressServer = new ExpressServer(port, host, openAPIPath);
    }

    /**
     * Launches the Server Listener.
     * Makes use of the config provided in the constructor.
     */
    async launch() {
        try {
            const port = this.config.URL_PORT;
            const openAPIPath = this.config.OPENAPI_YAML;

            this.expressServer.launch();

            console.info(
                `Express server running on port ${port} using OpenAPI Spec: ${openAPIPath}`
            );
        } catch (error) {
            console.error('Express Server failure', error.message);
            await this.close();
        }
    }

    /**
     * Register asserter to be used for all requests.
     * Only one can be registered at a time.
     */
    useAsserter(asserter) {
        this.expressServer.app.asserter = asserter;
    }

    /**
     * Register a routehandler at {route}.
     * Optionally, pass an asserter that only handles requests to this
     * specific route.
     */
    register(route: string, handler, asserter?) {
        this.expressServer.app.routeHandlers[route] = { handler, asserter };
    }

    /**
     * Gets called on failure. Currently unused.
     */
    async close() {}
}
