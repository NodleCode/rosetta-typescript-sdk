"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const default_1 = __importDefault(require("./config/default"));
const expressServer_1 = __importDefault(require("./expressServer"));
class RosettaServer {
    config;
    expressServer;
    constructor(configuration = {}) {
        this.config = Object.assign({}, default_1.default, configuration);
        const port = this.config.URL_PORT;
        const host = this.config.URL_PATH; //URL_HOST
        const openAPIPath = this.config.OPENAPI_YAML;
        this.expressServer = new expressServer_1.default(port, host, openAPIPath);
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
            console.info(`Express server running on port ${port} using OpenAPI Spec: ${openAPIPath}`);
        }
        catch (error) {
            console.error("Express Server failure", error.message);
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
    register(route, handler, asserter) {
        this.expressServer.app.routeHandlers[route] = { handler, asserter };
    }
    /**
     * Gets called on failure. Currently unused.
     */
    async close() { }
}
exports.default = RosettaServer;
