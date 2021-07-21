declare class Controller {
    static sendResponse(response: any, payload: any, beautify?: boolean): void;
    static sendError(response: any, error: any): void;
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
    static collectFile(request: any, fieldName: any): string;
    /**
     * Extracts the given schema model name.
     * input: { $ref: '#components/scope/ModelName' }
     * output: ModelName (if lcFirstChar == false)
     * output: modelName (if lcFirstChar == true)
     **/
    static extractModelName(schema: any, lcFirstChar?: boolean): any;
    static collectRequestParams(request: any): any;
    static rejectResponse(error: any, code?: number): {
        error: any;
        code: number;
    };
    static successResponse(payload: any, code?: number): {
        payload: any;
        code: number;
    };
    static handleRequest(request: any, response: any): Promise<void>;
}
export default Controller;
