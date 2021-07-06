"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var default_1 = __importDefault(require("./config/default"));
var expressServer_1 = __importDefault(require("./expressServer"));
var RosettaServer = /** @class */ (function () {
    function RosettaServer(configuration) {
        if (configuration === void 0) { configuration = {}; }
        this.config = Object.assign({}, default_1["default"], configuration);
        var port = this.config.URL_PORT;
        var host = this.config.URL_PATH; //URL_HOST
        var openAPIPath = this.config.OPENAPI_YAML;
        this.expressServer = new expressServer_1["default"](port, host, openAPIPath);
    }
    /**
     * Launches the Server Listener.
     * Makes use of the config provided in the constructor.
     */
    RosettaServer.prototype.launch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var port, openAPIPath, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 1, , 3]);
                        port = this.config.URL_PORT;
                        openAPIPath = this.config.OPENAPI_YAML;
                        this.expressServer.launch();
                        console.info("Express server running on port " + port + " using OpenAPI Spec: " + openAPIPath);
                        return [3 /*break*/, 3];
                    case 1:
                        error_1 = _a.sent();
                        console.error('Express Server failure', error_1.message);
                        return [4 /*yield*/, this.close()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Register asserter to be used for all requests.
     * Only one can be registered at a time.
     */
    RosettaServer.prototype.useAsserter = function (asserter) {
        this.expressServer.app.asserter = asserter;
    };
    /**
     * Register a routehandler at {route}.
     * Optionally, pass an asserter that only handles requests to this
     * specific route.
     */
    RosettaServer.prototype.register = function (route, handler, asserter) {
        this.expressServer.app.routeHandlers[route] = { handler: handler, asserter: asserter };
    };
    /**
     * Gets called on failure. Currently unused.
     */
    RosettaServer.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    return RosettaServer;
}());
exports["default"] = RosettaServer;
