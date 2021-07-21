/**
 * The ConstructionController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic reoutes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */
export declare const constructionCombine: (request: any, response: any) => Promise<void>;
export declare const constructionDerive: (request: any, response: any) => Promise<void>;
export declare const constructionHash: (request: any, response: any) => Promise<void>;
export declare const constructionMetadata: (request: any, response: any) => Promise<void>;
export declare const constructionParse: (request: any, response: any) => Promise<void>;
export declare const constructionPayloads: (request: any, response: any) => Promise<void>;
export declare const constructionPreprocess: (request: any, response: any) => Promise<void>;
export declare const constructionSubmit: (request: any, response: any) => Promise<void>;
