export default class ReconcilerError extends Error {
    type: string;
    filename: string;
    lineNumber: number;
    constructor(
        message: string,
        type: string,
        filename: string,
        lineNumber: number
    ) {
        super(message);
        this.type = type;
        this.filename = filename;
        this.lineNumber = lineNumber;
        this.name = 'ReconcilerError';
    }
}
