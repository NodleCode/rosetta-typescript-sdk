export default class RosettaFetcher {
    constructor({ apiClient, retryOptions, options, server, asserter }?: {
        apiClient: any;
        retryOptions?: {};
        options?: {};
        server?: {};
        asserter?: any;
    });
    apiClient: any;
    backOffOptions: {
        delayFirstAttempt: boolean;
        jitter: string;
        mayDelay: number;
        numOfAttempts: number;
        retry: () => true;
        startingDelay: number;
        timeMultiple: number;
    };
    options: {
        promisePoolSize: number;
    };
    asserter: any;
    initializeAsserter(): Promise<{
        primaryNetwork: any;
        networkStatus: any;
    }>;
    defaultApiClient(options: any): any;
    accountBalance(networkIdentifier: any, accountIdentifier: any, partialBlockIdentifier: any): Promise<{
        block: any;
        balances: any;
        metadata: any;
        coins: any;
    }>;
    accountBalanceRetry(networkIdentifier: any, accountIdentifier: any, partialBlockIdentifier: any, retryOptions?: {}): Promise<{
        block: any;
        balances: any;
        metadata: any;
        coins: any;
    }>;
    block(networkIdentifier: any, blockIdentifier: any): Promise<any>;
    transactions(networkIdentifier: any, blockIdentifier: any, hashes: any): Promise<any[]>;
    transaction(networkIdentifier: any, blockIdentifier: any, hash: any): Promise<any>;
    blockRetry(networkIdentifier: any, blockIdentifier: any, retryOptions?: {}): Promise<any>;
    /**
     * BlockRange fetches blocks from startIndex to endIndex, inclusive.
     * A direct path from startIndex to endIndex may not exist in the response,
     * if called during a re-org. This case must be handled by any callers.
     * @param {NetworkIdentifier} networkIdentifier
     * @param {number} startIndex - index from first block
     * @param {number} endIndex - index from last block
     */
    blockRange(networkIdentifier: any, startIndex: number, endIndex: number): Promise<any[]>;
    mempool(networkIdentifier: any): Promise<any>;
    mempoolTransaction(networkIdentifier: any, transactionIdentifier: any): Promise<any>;
    networkStatus(networkIdentifier: any, metadata?: {}): Promise<any>;
    networkStatusRetry(networkIdentifier: any, metadata?: {}, retryOptions?: {}): Promise<any>;
    networkList(metadata?: {}): Promise<any>;
    networkListRetry(metadata?: {}, retryOptions?: {}): Promise<any>;
    networkOptions(networkIdentifier: any, metadata?: {}): Promise<any>;
    networkOptionsRetry(networkIdentifier: any, metadata?: {}, retryOptions?: {}): Promise<any>;
    constructionMetadata(networkIdentifier: any, options?: {}): Promise<any>;
    constructionSubmit(networkIdentifier: any, signedTransaction: any): Promise<{
        transactionIdentifier: any;
        metadata: any;
    }>;
    constructionCombine(networkIdentifier: any, unsignedTransaction: any, signatureArray: any): Promise<any>;
    constructionDerive(networkidentifier: any, publicKey: any, metadataMap: any): Promise<{
        address: any;
        metadata: any;
    }>;
    constructionHash(networkIdentifier: any, signedTransaction: any): Promise<any>;
    constructionParse(networkIdentifier: any, signed: any, transaction: any): Promise<{
        operations: any;
        signers: any;
    }>;
    constructionPayloads(networkIdentifier: any, operationArray: any, metadataMap: any): Promise<{
        unsigned_transaction: any;
        payloads: any;
    }>;
    constructionPreprocess(networkIdentifier: any, operationArray: any, metadataMap: any): Promise<any>;
}
