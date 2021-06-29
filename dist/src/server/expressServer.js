"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const OpenApiValidator = __importStar(require("express-openapi-validator"));
class ExpressServer {
    port;
    host;
    openApiPath;
    //TODO add types
    app;
    schema;
    server;
    constructor(port, host, openApiYaml) {
        this.port = port;
        this.host = host;
        this.app = express_1.default();
        this.openApiPath = openApiYaml;
        try {
            this.schema = js_yaml_1.default.load(fs_1.default.readFileSync(openApiYaml, "utf-8")); //this.schema = jsYaml.safeLoad(fs.readFileSync(openApiYaml));
        }
        catch (e) {
            console.error("failed to start Express Server");
            process.exit(1);
        }
        this.setupMiddleware();
    }
    setupMiddleware() {
        // this.setupAllowedMedia();
        this.app.use(cors_1.default());
        //this.app.use(bodyParser.json({ limit: "14MB" }));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.text());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(cookie_parser_1.default());
        //Simple test to see that the server is up and responding
        this.app.get("/hello", (req, res) => res.send(`Hello World. path: ${this.openApiPath}`));
        //Send the openapi document *AS GENERATED BY THE GENERATOR*
        this.app.get("/openapi", (req, res) => res.sendFile(path_1.default.join(__dirname, "..", "..", "api", "openapi.yaml")));
        //View the openapi document in a visual interface. Should be able to test from this page
        this.app.use("/api-doc", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(this.schema));
        this.app.get("/login-redirect", (req, res) => {
            res.status(200);
            res.json(req.query);
        });
        this.app.get("/oauth2-redirect.html", (req, res) => {
            res.status(200);
            res.json(req.query);
        });
        this.app.routeHandlers = {};
        this.app.use(OpenApiValidator.middleware({
            apiSpec: this.openApiPath,
            operationHandlers: path_1.default.join(__dirname),
            validateRequests: true,
            validateResponses: false,
        }));
        this.app.use((err, req, res, next) => {
            // 7. Customize errors
            console.error(err); // dump error to console for debug
            res.status(err.status || 500).json({
                message: err.message,
                errors: err.errors,
            });
        });
    }
    configure(config) {
        this.app.config = config;
    }
    launch() {
        http_1.default.createServer(this.app).listen(this.port);
        console.log(`Listening on port ${this.port}`);
    }
    async close() {
        if (this.server !== undefined) {
            await this.server.close();
            console.log(`Server on port ${this.port} shut down`);
        }
    }
}
exports.default = ExpressServer;
