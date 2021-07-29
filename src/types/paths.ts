import { Components } from 'types';

export namespace AccountBalance {
    export type RequestBody =
        /* An AccountBalanceRequest is utilized to make a balance request on the /account/balance endpoint. If the block_identifier is populated, a historical balance query should be performed. */ Components.Schemas.AccountBalanceRequest;
    namespace Responses {
        export type $200 =
            /* An AccountBalanceResponse is returned on the /account/balance endpoint. If an account has a balance for each AccountIdentifier describing it (ex: an ERC-20 token balance on a few smart contracts), an account balance request must be made with each AccountIdentifier. The `coins` field was removed and replaced by by `/account/coins` in `v1.4.7`. */ Components.Schemas.AccountBalanceResponse;
        export type $500 =
            /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
}
export namespace AccountCoins {
    export type RequestBody =
        /* AccountCoinsRequest is utilized to make a request on the /account/coins endpoint. */ Components.Schemas.AccountCoinsRequest;
    namespace Responses {
        export type $200 =
            /* AccountCoinsResponse is returned on the /account/coins endpoint and includes all unspent Coins owned by an AccountIdentifier. */ Components.Schemas.AccountCoinsResponse;
        export type $500 =
            /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
}
namespace Block {
    export type RequestBody =
        /* A BlockRequest is utilized to make a block request on the /block endpoint. */ Components.Schemas.BlockRequest;
    namespace Responses {
        export type $200 =
            /* A BlockResponse includes a fully-populated block or a partially-populated block with a list of other transactions to fetch (other_transactions). As a result of the consensus algorithm of some blockchains, blocks can be omitted (i.e. certain block indices can be skipped). If a query for one of these omitted indices is made, the response should not include a `Block` object. It is VERY important to note that blocks MUST still form a canonical, connected chain of blocks where each block has a unique index. In other words, the `PartialBlockIdentifier` of a block after an omitted block should reference the last non-omitted block. */ Components.Schemas.BlockResponse;
        export type $500 =
            /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
}
namespace BlockTransaction {
    export type RequestBody =
        /* A BlockTransactionRequest is used to fetch a Transaction included in a block that is not returned in a BlockResponse. */ Components.Schemas.BlockTransactionRequest;
    namespace Responses {
        export type $200 =
            /* A BlockTransactionResponse contains information about a block transaction. */ Components.Schemas.BlockTransactionResponse;
        export type $500 =
            /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
}
namespace Call {
    export type RequestBody =
        /* CallRequest is the input to the `/call` endpoint. */ Components.Schemas.CallRequest;
    namespace Responses {
        export type $200 =
            /* CallResponse contains the result of a `/call` invocation. */ Components.Schemas.CallResponse;
        export type $500 =
            /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
}
namespace ConstructionCombine {
    export type RequestBody =
        /* ConstructionCombineRequest is the input to the `/construction/combine` endpoint. It contains the unsigned transaction blob returned by `/construction/payloads` and all required signatures to create a network transaction. */ Components.Schemas.ConstructionCombineRequest;
    namespace Responses {
        export type $200 =
            /* ConstructionCombineResponse is returned by `/construction/combine`. The network payload will be sent directly to the `construction/submit` endpoint. */ Components.Schemas.ConstructionCombineResponse;
        export type $500 =
            /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
}
namespace ConstructionDerive {
    export type RequestBody =
        /* ConstructionDeriveRequest is passed to the `/construction/derive` endpoint. Network is provided in the request because some blockchains have different address formats for different networks. Metadata is provided in the request because some blockchains allow for multiple address types (i.e. different address for validators vs normal accounts). */ Components.Schemas.ConstructionDeriveRequest;
    namespace Responses {
        export type $200 =
            /* ConstructionDeriveResponse is returned by the `/construction/derive` endpoint. */ Components.Schemas.ConstructionDeriveResponse;
        export type $500 =
            /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
}
namespace ConstructionHash {
    export type RequestBody =
        /* ConstructionHashRequest is the input to the `/construction/hash` endpoint. */ Components.Schemas.ConstructionHashRequest;
    namespace Responses {
        export type $200 =
            /* TransactionIdentifierResponse contains the transaction_identifier of a transaction that was submitted to either `/construction/hash` or `/construction/submit`. */ Components.Schemas.TransactionIdentifierResponse;
        export type $500 =
            /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
}
namespace ConstructionMetadata {
    export type RequestBody =
        /* A ConstructionMetadataRequest is utilized to get information required to construct a transaction. The Options object used to specify which metadata to return is left purposely unstructured to allow flexibility for implementers. Options is not required in the case that there is network-wide metadata of interest. Optionally, the request can also include an array of PublicKeys associated with the AccountIdentifiers returned in ConstructionPreprocessResponse. */ Components.Schemas.ConstructionMetadataRequest;
    namespace Responses {
        export type $200 =
            /* The ConstructionMetadataResponse returns network-specific metadata used for transaction construction. Optionally, the implementer can return the suggested fee associated with the transaction being constructed. The caller may use this info to adjust the intent of the transaction or to create a transaction with a different account that can pay the suggested fee. Suggested fee is an array in case fee payment must occur in multiple currencies. */ Components.Schemas.ConstructionMetadataResponse;
        export type $500 =
            /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
}
namespace ConstructionParse {
    export type RequestBody =
        /* ConstructionParseRequest is the input to the `/construction/parse` endpoint. It allows the caller to parse either an unsigned or signed transaction. */ Components.Schemas.ConstructionParseRequest;
    namespace Responses {
        export type $200 =
            /* ConstructionParseResponse contains an array of operations that occur in a transaction blob. This should match the array of operations provided to `/construction/preprocess` and `/construction/payloads`. */ Components.Schemas.ConstructionParseResponse;
        export type $500 =
            /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
}
namespace ConstructionPayloads {
    export type RequestBody =
        /* ConstructionPayloadsRequest is the request to `/construction/payloads`. It contains the network, a slice of operations, and arbitrary metadata that was returned by the call to `/construction/metadata`. Optionally, the request can also include an array of PublicKeys associated with the AccountIdentifiers returned in ConstructionPreprocessResponse. */ Components.Schemas.ConstructionPayloadsRequest;
    namespace Responses {
        export type $200 =
            /* ConstructionTransactionResponse is returned by `/construction/payloads`. It contains an unsigned transaction blob (that is usually needed to construct the a network transaction from a collection of signatures) and an array of payloads that must be signed by the caller. */ Components.Schemas.ConstructionPayloadsResponse;
        export type $500 =
            /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
}
namespace ConstructionPreprocess {
    export type RequestBody =
        /* ConstructionPreprocessRequest is passed to the `/construction/preprocess` endpoint so that a Rosetta implementation can determine which metadata it needs to request for construction. Metadata provided in this object should NEVER be a product of live data (i.e. the caller must follow some network-specific data fetching strategy outside of the Construction API to populate required Metadata). If live data is required for construction, it MUST be fetched in the call to `/construction/metadata`. The caller can provide a max fee they are willing to pay for a transaction. This is an array in the case fees must be paid in multiple currencies. The caller can also provide a suggested fee multiplier to indicate that the suggested fee should be scaled. This may be used to set higher fees for urgent transactions or to pay lower fees when there is less urgency. It is assumed that providing a very low multiplier (like 0.0001) will never lead to a transaction being created with a fee less than the minimum network fee (if applicable). In the case that the caller provides both a max fee and a suggested fee multiplier, the max fee will set an upper bound on the suggested fee (regardless of the multiplier provided). */ Components.Schemas.ConstructionPreprocessRequest;
    namespace Responses {
        export type $200 =
            /* ConstructionPreprocessResponse contains `options` that will be sent unmodified to `/construction/metadata`. If it is not necessary to make a request to `/construction/metadata`, `options` should be omitted.  Some blockchains require the PublicKey of particular AccountIdentifiers to construct a valid transaction. To fetch these PublicKeys, populate `required_public_keys` with the AccountIdentifiers associated with the desired PublicKeys. If it is not necessary to retrieve any PublicKeys for construction, `required_public_keys` should be omitted. */ Components.Schemas.ConstructionPreprocessResponse;
        export type $500 =
            /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
}
namespace ConstructionSubmit {
    export type RequestBody =
        /* The transaction submission request includes a signed transaction. */ Components.Schemas.ConstructionSubmitRequest;
    namespace Responses {
        export type $200 =
            /* TransactionIdentifierResponse contains the transaction_identifier of a transaction that was submitted to either `/construction/hash` or `/construction/submit`. */ Components.Schemas.TransactionIdentifierResponse;
        export type $500 =
            /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
}
namespace EventsBlocks {
    export type RequestBody =
        /* EventsBlocksRequest is utilized to fetch a sequence of BlockEvents indicating which blocks were added and removed from storage to reach the current state. */ Components.Schemas.EventsBlocksRequest;
    namespace Responses {
        export type $200 =
            /* EventsBlocksResponse contains an ordered collection of BlockEvents and the max retrievable sequence. */ Components.Schemas.EventsBlocksResponse;
        export type $500 =
            /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
}
namespace Mempool {
    export type RequestBody =
        /* A NetworkRequest is utilized to retrieve some data specific exclusively to a NetworkIdentifier. */ Components.Schemas.NetworkRequest;
    namespace Responses {
        export type $200 =
            /* A MempoolResponse contains all transaction identifiers in the mempool for a particular network_identifier. */ Components.Schemas.MempoolResponse;
        export type $500 =
            /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
}
namespace MempoolTransaction {
    export type RequestBody =
        /* A MempoolTransactionRequest is utilized to retrieve a transaction from the mempool. */ Components.Schemas.MempoolTransactionRequest;
    namespace Responses {
        export type $200 =
            /* A MempoolTransactionResponse contains an estimate of a mempool transaction. It may not be possible to know the full impact of a transaction in the mempool (ex: fee paid). */ Components.Schemas.MempoolTransactionResponse;
        export type $500 =
            /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
}
namespace NetworkList {
    export type RequestBody =
        /* A MetadataRequest is utilized in any request where the only argument is optional metadata. */ Components.Schemas.MetadataRequest;
    namespace Responses {
        export type $200 =
            /* A NetworkListResponse contains all NetworkIdentifiers that the node can serve information for. */ Components.Schemas.NetworkListResponse;
        export type $500 =
            /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
}
namespace NetworkOptions {
    export type RequestBody =
        /* A NetworkRequest is utilized to retrieve some data specific exclusively to a NetworkIdentifier. */ Components.Schemas.NetworkRequest;
    namespace Responses {
        export type $200 =
            /* NetworkOptionsResponse contains information about the versioning of the node and the allowed operation statuses, operation types, and errors. */ Components.Schemas.NetworkOptionsResponse;
        export type $500 =
            /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
}
namespace NetworkStatus {
    export type RequestBody =
        /* A NetworkRequest is utilized to retrieve some data specific exclusively to a NetworkIdentifier. */ Components.Schemas.NetworkRequest;
    namespace Responses {
        export type $200 =
            /* NetworkStatusResponse contains basic information about the node's view of a blockchain network. It is assumed that any BlockIdentifier.Index less than or equal to CurrentBlockIdentifier.Index can be queried. If a Rosetta implementation prunes historical state, it should populate the optional `oldest_block_identifier` field with the oldest block available to query. If this is not populated, it is assumed that the `genesis_block_identifier` is the oldest queryable block. If a Rosetta implementation performs some pre-sync before it is possible to query blocks, sync_status should be populated so that clients can still monitor healthiness. Without this field, it may appear that the implementation is stuck syncing and needs to be terminated. */ Components.Schemas.NetworkStatusResponse;
        export type $500 =
            /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
}
namespace SearchTransactions {
    export type RequestBody =
        /* SearchTransactionsRequest is used to search for transactions matching a set of provided conditions in canonical blocks. */ Components.Schemas.SearchTransactionsRequest;
    namespace Responses {
        export type $200 =
            /* SearchTransactionsResponse contains an ordered collection of BlockTransactions that match the query in SearchTransactionsRequest. These BlockTransactions are sorted from most recent block to oldest block. */ Components.Schemas.SearchTransactionsResponse;
        export type $500 =
            /* Instead of utilizing HTTP status codes to describe node errors (which often do not have a good analog), rich errors are returned using this object. Both the code and message fields can be individually used to correctly identify an error. Implementations MUST use unique values for both fields. */ Components.Schemas.Error;
    }
}
