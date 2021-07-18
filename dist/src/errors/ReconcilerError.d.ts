export default class ReconcilerError extends Error {
    type: string;
    filename: string;
    lineNumber: number;
    constructor(message: string, type?: string, filename?: string, lineNumber?: number);
}
