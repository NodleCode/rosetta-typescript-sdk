import path from 'path';
import { OpenApiConfig } from '../../../src/types';

const defaultConfig: OpenApiConfig = {
    ROOT_DIR: path.join(__dirname, '..'),
    URL_PORT: 8080,
    URL_PATH: 'http://localhost',
    BASE_VERSION: 'v2',
    CONTROLLER_DIRECTORY: path.join(__dirname, '..', 'controllers'),
    PROJECT_DIR: path.join(__dirname, '..'),
    BEAUTIFY_JSON: true,
};

defaultConfig.OPENAPI_YAML = path.join(
    defaultConfig.ROOT_DIR,
    '..',
    '..',
    '..', //TODO USE ABSOLUTE PATH
    'api',
    'openapi.yaml'
);
defaultConfig.FULL_PATH = `${defaultConfig.URL_PATH}:${defaultConfig.URL_PORT}/${defaultConfig.BASE_VERSION}`;
defaultConfig.FILE_UPLOAD_PATH = path.join(
    defaultConfig.PROJECT_DIR,
    'uploaded_files'
);

export default defaultConfig;
