import { ConstructionCombineRequest, ConstructionCombineResponse, ConstructionDeriveRequest, ConstructionDeriveResponse, ConstructionHashRequest, ConstructionMetadataRequest, ConstructionMetadataResponse, ConstructionParseRequest, ConstructionParseResponse, ConstructionPayloadsRequest, ConstructionPayloadsResponse, ConstructionPreprocessRequest, ConstructionPreprocessResponse, ConstructionSubmitRequest, Params, TransactionIdentifierResponse } from "types";
/**
 * Get Transaction Construction Metadata
 * Get any information required to construct a transaction for a specific network. Metadata returned here could be a recent hash to use, an account sequence number, or even arbitrary chain state. It is up to the client to correctly populate the options object with any network-specific details to ensure the correct metadata is retrieved.  It is important to clarify that this endpoint should not pre-construct any transactions for the client (this should happen in the SDK). This endpoint is left purposely unstructured because of the wide scope of metadata that could be required.  In a future version of the spec, we plan to pass an array of Rosetta Operations to specify which metadata should be received and to create a transaction in an accompanying SDK. This will help to insulate the client from chain-specific details that are currently required here.
 *
 * constructionMetadataRequest ConstructionMetadataRequest
 * returns ConstructionMetadataResponse
 * */
export declare const constructionMetadata: (params: Params<ConstructionMetadataRequest>) => Promise<ConstructionMetadataResponse>;
/**
 * Submit a Signed Transaction
 * Submit a pre-signed transaction to the node. This call should not block on the transaction being included in a block. Rather, it should return immediately with an indication of whether or not the transaction was included in the mempool.  The transaction submission response should only return a 200 status if the submitted transaction could be included in the mempool. Otherwise, it should return an error.
 *
 * constructionSubmitRequest ConstructionSubmitRequest
 * returns ConstructionSubmitResponse
 * */
export declare const constructionSubmit: (params: Params<ConstructionSubmitRequest>) => Promise<TransactionIdentifierResponse>;
/**
 * Create Network Transaction from Signatures
 * Combine creates a network-specific transaction from an unsigned transaction and an array of provided signatures. The signed transaction returned from this method will be sent to the `/construction/submit` endpoint by the caller.
 *
 * constructionCombineRequest ConstructionCombineRequest
 * returns ConstructionCombineResponse
 * */
export declare const constructionCombine: (params: Params<ConstructionCombineRequest>) => Promise<ConstructionCombineResponse>;
/**
 * Derive an Address from a PublicKey
 * Derive returns the network-specific address associated with a public key. Blockchains that require an on-chain action to create an account should not implement this method.
 *
 * constructionDeriveRequest ConstructionDeriveRequest
 * returns ConstructionDeriveResponse
 * */
export declare const constructionDerive: (params: Params<ConstructionDeriveRequest>) => Promise<ConstructionDeriveResponse>;
/**
 * Get the Hash of a Signed Transaction
 * TransactionHash returns the network-specific transaction hash for a signed transaction.
 *
 * constructionHashRequest ConstructionHashRequest
 * returns TransactionIdentifierResponse
 * */
export declare const constructionHash: (params: Params<ConstructionHashRequest>) => Promise<TransactionIdentifierResponse>;
/**
 * Parse a Transaction
 * Parse is called on both unsigned and signed transactions to understand the intent of the formulated transaction. This is run as a sanity check before signing (after `/construction/payloads`) and before broadcast (after `/construction/combine`).
 *
 * constructionParseRequest ConstructionParseRequest
 * returns ConstructionParseResponse
 * */
export declare const constructionParse: (params: Params<ConstructionParseRequest>) => Promise<ConstructionParseResponse>;
/**
 * Generate an Unsigned Transaction and Signing Payloads
 * Payloads is called with an array of operations and the response from `/construction/metadata`. It returns an unsigned transaction blob and a collection of payloads that must be signed by particular addresses using a certain SignatureType. The array of operations provided in transaction construction often times can not specify all \"effects\" of a transaction (consider invoked transactions in Ethereum). However, they can deterministically specify the \"intent\" of the transaction, which is sufficient for construction. For this reason, parsing the corresponding transaction in the Data API (when it lands on chain) will contain a superset of whatever operations were provided during construction.
 *
 * constructionPayloadsRequest ConstructionPayloadsRequest
 * returns ConstructionPayloadsResponse
 * */
export declare const constructionPayloads: (params: Params<ConstructionPayloadsRequest>) => Promise<ConstructionPayloadsResponse>;
/**
 * Create a Request to Fetch Metadata
 * Preprocess is called prior to `/construction/payloads` to construct a request for any metadata that is needed for transaction construction given (i.e. account nonce). The request returned from this method will be used by the caller (in a different execution environment) to call the `/construction/metadata` endpoint.
 *
 * constructionPreprocessRequest ConstructionPreprocessRequest
 * returns ConstructionPreprocessResponse
 * */
export declare const constructionPreprocess: (params: Params<ConstructionPreprocessRequest>) => Promise<ConstructionPreprocessResponse>;
