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
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var default_1 = __importDefault(require("../config/default"));
var CallHandler_1 = __importDefault(require("./CallHandler"));
var Controller = /** @class */ (function () {
    function Controller() {
    }
    Controller.sendResponse = function (response, payload, beautify) {
        if (beautify === void 0) { beautify = false; }
        /**
         * The default response-code is 200. We want to allow to change that. in That case,
         * payload will be an object consisting of a code and a payload. If not customized
         * send 200 and the payload as received in this method.
         */
        response.status(payload.code || 200);
        response.setHeader('content-type', 'application/json');
        var responsePayload = payload.payload !== undefined ? payload.payload : payload;
        if (responsePayload instanceof Object) {
            if (beautify) {
                var json = JSON.stringify(responsePayload, null, 4);
                response.send(json);
                response.end();
            }
            else {
                response.json(responsePayload, null, 4);
            }
        }
        else {
            response.send(responsePayload);
            response.end();
        }
    };
    Controller.sendError = function (response, error) {
        console.error(error);
        var errResponse = {
            code: error.code,
            message: error.error || error.message,
            retriable: error.retriable || false,
            details: error.details
        };
        var serialized = JSON.stringify(errResponse, null, 4);
        response.status(500);
        response.send(serialized);
        response.end();
    };
    /**
     * Files have been uploaded to the directory defined by config.js as upload directory
     * Files have a temporary name, that was saved as 'filename' of the file object that is
     * referenced in reuquest.files array.
     * This method finds the file and changes it to the file name that was originally called
     * when it was uploaded. To prevent files from being overwritten, a timestamp is added between
     * the filename and its extension
     * @param request
     * @param fieldName
     * @returns {string}
     */
    Controller.collectFile = function (request, fieldName) {
        var uploadedFileName = '';
        if (request.files && request.files.length > 0) {
            var fileObject = request.files.find(function (file) { return file.fieldname === fieldName; });
            if (fileObject) {
                var fileArray = fileObject.originalname.split('.');
                var extension = fileArray.pop();
                fileArray.push("_" + Date.now());
                uploadedFileName = fileArray.join('') + "." + extension;
                fs_1["default"].renameSync(path_1["default"].join(default_1["default"].FILE_UPLOAD_PATH, fileObject.filename), path_1["default"].join(default_1["default"].FILE_UPLOAD_PATH, uploadedFileName));
            }
        }
        return uploadedFileName;
    };
    // static collectFiles(request) {
    //   logger.info('Checking if files are expected in schema');
    //   const requestFiles = {};
    //   if (request.openapi.schema.requestBody !== undefined) {
    //     const [contentType] = request.headers['content-type'].split(';');
    //     if (contentType === 'multipart/form-data') {
    //       const contentSchema = request.openapi.schema.requestBody.content[contentType].schema;
    //       Object.entries(contentSchema.properties).forEach(([name, property]) => {
    //         if (property.type === 'string' && ['binary', 'base64'].indexOf(property.format) > -1) {
    //           const fileObject = request.files.find(file => file.fieldname === name);
    //           const fileArray = fileObject.originalname.split('.');
    //           const extension = fileArray.pop();
    //           fileArray.push(`_${Date.now()}`);
    //           const uploadedFileName = `${fileArray.join('')}.${extension}`;
    //           fs.renameSync(path.join(config.FILE_UPLOAD_PATH, fileObject.filename),
    //             path.join(config.FILE_UPLOAD_PATH, uploadedFileName));
    //           requestFiles[name] = uploadedFileName;
    //         }
    //       });
    //     } else if (request.openapi.schema.requestBody.content[contentType] !== undefined
    //         && request.files !== undefined) {
    //       [request.body] = request.files;
    //     }
    //   }
    //   return requestFiles;
    // }
    /**
     * Extracts the given schema model name.
     * input: { $ref: '#components/scope/ModelName' }
     * output: ModelName (if lcFirstChar == false)
     * output: modelName (if lcFirstChar == true)
     **/
    Controller.extractModelName = function (schema, lcFirstChar) {
        if (lcFirstChar === void 0) { lcFirstChar = true; }
        var index = schema.$ref.lastIndexOf('/');
        if (index == -1) {
            console.warn(schema.$ref + " did not have the expected format.");
            return schema.$ref;
        }
        var lastPart = schema.$ref.substr(index + 1);
        if (!lcFirstChar)
            return lastPart;
        return lastPart.charAt(0).toLowerCase() + lastPart.slice(1);
    };
    Controller.collectRequestParams = function (request) {
        var _this = this;
        var requestParams = {};
        if (request.openapi.schema.requestBody !== undefined) {
            var content_1 = request.openapi.schema.requestBody.content;
            if (content_1['application/json'] !== undefined) {
                var schema = request.openapi.schema.requestBody.content['application/json'].schema;
                if (schema.$ref) {
                    var modelName = Controller.extractModelName(schema);
                    requestParams[modelName] = request.body;
                    requestParams['class'] = Controller.extractModelName(schema, false);
                    requestParams['requestParamsKey'] = modelName;
                }
                else {
                    requestParams.body = request.body;
                }
            }
            else if (content_1['multipart/form-data'] !== undefined) {
                Object.keys(content_1['multipart/form-data'].schema.properties).forEach(function (property) {
                    var propertyObject = content_1['multipart/form-data'].schema.properties[property];
                    if (propertyObject.format !== undefined &&
                        propertyObject.format === 'binary') {
                        requestParams[property] = _this.collectFile(request, property);
                    }
                    else {
                        requestParams[property] = request.body[property];
                    }
                });
            }
        }
        // if (request.openapi.schema.requestBody.content['application/json'] !== undefined) {
        //   const schema = request.openapi.schema.requestBody.content['application/json'];
        //   if (schema.$ref) {
        //     requestParams[schema.$ref.substr(schema.$ref.lastIndexOf('.'))] = request.body;
        //   } else {
        //     requestParams.body = request.body;
        //   }
        // }
        request.openapi.schema.parameters.forEach(function (param) {
            if (param["in"] === 'path') {
                requestParams[param.name] =
                    request.openapi.pathParams[param.name];
            }
            else if (param["in"] === 'query') {
                requestParams[param.name] = request.query[param.name];
            }
            else if (param["in"] === 'header') {
                requestParams[param.name] = request.headers[param.name];
            }
        });
        return requestParams;
    };
    Controller.rejectResponse = function (error, code) {
        if (code === void 0) { code = 500; }
        return { error: error, code: code };
    };
    Controller.successResponse = function (payload, code) {
        if (code === void 0) { code = 200; }
        return { payload: payload, code: code };
    };
    Controller.handleRequest = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var params, app, route, content, wrapped, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        params = {
                            params: this.collectRequestParams(request),
                            request: request,
                            response: response
                        };
                        app = request.app;
                        route = request.route.path;
                        return [4 /*yield*/, CallHandler_1["default"].bind(app)(route, params)];
                    case 1:
                        content = _a.sent();
                        wrapped = Controller.successResponse(content);
                        // And finalize the response (json)
                        Controller.sendResponse(response, wrapped, default_1["default"].BEAUTIFY_JSON);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        Controller.sendError(response, error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Controller;
}());
exports["default"] = Controller;
