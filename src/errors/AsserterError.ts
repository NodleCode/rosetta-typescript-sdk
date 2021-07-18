export default class AsserterError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AsserterError';
    }
}
