"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const defaultConfig = {
    ROOT_DIR: path_1.default.join(__dirname, '..'),
    URL_PORT: 8080,
    URL_PATH: 'http://localhost',
    BASE_VERSION: 'v2',
    CONTROLLER_DIRECTORY: path_1.default.join(__dirname, '..', 'controllers'),
    PROJECT_DIR: path_1.default.join(__dirname, '..'),
    BEAUTIFY_JSON: true,
};
defaultConfig.OPENAPI_YAML = path_1.default.join(defaultConfig.ROOT_DIR, 'api', 'openapi.yaml');
defaultConfig.FULL_PATH = `${defaultConfig.URL_PATH}:${defaultConfig.URL_PORT}/${defaultConfig.BASE_VERSION}`;
defaultConfig.FILE_UPLOAD_PATH = path_1.default.join(defaultConfig.PROJECT_DIR, 'uploaded_files');
exports.default = defaultConfig;
