export default class FetcherError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FetcherError';
    }
}
