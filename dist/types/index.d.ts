export * from './rosetta-types';
export * from './components';
export interface Params<T> {
    [key: string]: T;
}
export interface OpenApiConfig {
    ROOT_DIR: string;
    URL_PORT: number;
    URL_PATH: string;
    BASE_VERSION: string;
    CONTROLLER_DIRECTORY: string;
    PROJECT_DIR: string;
    BEAUTIFY_JSON: boolean;
    OPENAPI_YAML?: string;
    FULL_PATH?: string;
    FILE_UPLOAD_PATH?: string;
}
