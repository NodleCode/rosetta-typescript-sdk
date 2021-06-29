export * from "./rosetta-types";
export * from "./components";

export interface Params<T> {
  [key: string]: T;
}

export interface OpenApiConfig {
  ROOT_DIR: string; // The root directory of the nodeapi
  URL_PORT: number; // The port to listen on
  URL_PATH: string; //Hostname and protocol specification
  BASE_VERSION: string; // OpenAPI Version
  CONTROLLER_DIRECTORY: string; // Specifies the location of the controller files.
  PROJECT_DIR: string; // Specifies the root location of the project.
  BEAUTIFY_JSON: boolean; // Specifies whether to beautify the returned json response.
  OPENAPI_YAML?: string; //Specifies the location of the yaml file
  FULL_PATH?: string; // undocumented
  FILE_UPLOAD_PATH?: string; // unused within this project
}