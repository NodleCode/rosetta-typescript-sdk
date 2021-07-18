/// <reference types="node" />
import fs from 'fs';
import { AccountBalanceRequest, AccountIdentifier, Allow, Amount, Block, BlockIdentifier, BlockRequest, BlockTransactionRequest, Coin, CoinAction, CoinChange, CoinIdentifier, ConstructionCombineRequest, ConstructionCombineResponse, ConstructionDeriveRequest, ConstructionDeriveResponse, ConstructionHashRequest, ConstructionMetadataRequest, ConstructionMetadataResponse, ConstructionParseRequest, ConstructionParseResponse, ConstructionPayloadsRequest, ConstructionPayloadsResponse, ConstructionPreprocessRequest, ConstructionSubmitRequest, Currency, CurveType, Error, MempoolTransactionRequest, MetadataRequest, NetworkIdentifier, NetworkListResponse, NetworkOptionsResponse, NetworkRequest, NetworkStatusResponse, Operation, OperationIdentifier, OperationStatus, PartialBlockIdentifier, Peer, PublicKey, Signature, SignatureType, SigningPayload, SubNetworkIdentifier, Transaction, TransactionIdentifier, TransactionIdentifierResponse, Version } from 'types';
interface AsserterConstructor {
    operationTypes?: string[];
    operationStatuses?: OperationStatus[];
    errorTypes?: Error[];
    genesisBlockIdentifier?: BlockIdentifier;
    supportedNetworks?: NetworkIdentifier[];
    historicalBalanceLookup?: boolean;
}
/**
 * @type module:OpenApiConfig
 * @class RosettaAsserter
 * Syntactical and semantical type validator.
 * This Asserter can be used to validate Requests/Responses.Constructors exist
 * that ease the creation of an asserter.
 + For example, `NewClientWithResponses` can be used in order to create a server
 * validator by only passing the network responses.
 */
declare class RosettaAsserter {
    /**
     * Create an Asserter by passing different options
     * @constructor
     * @param {string[]} operationTypes - Specifies which operation types are supported.
     *         An OperationType is defined by a string.
     * @param {Rosetta.OperationStatus[]} operationStatuses - Supported Operation Statuses
     * @param {Rosetta.Error[]} errorTypes - Supported Error Messages
     * @param {Rosetta:BlockIdentifier} genesisBlockIdentifier - Defines the genesis block of the network.
     * @param {Rosetta:NetworkIdentifier[]} supportedNetworks - Defines which networks are concidered as valid networks
     * @param {boolean} historicalBalanceLookup - Specifies whether balance requests can be performed by using
     *         a particular block identifier.
     */
    operationTypes?: string[];
    operationStatuses?: OperationStatus[];
    errorTypes?: Error[];
    genesisBlockIdentifier?: BlockIdentifier;
    supportedNetworks?: NetworkIdentifier[];
    historicalBalanceLookup?: boolean;
    operationStatusMap?: any;
    errorTypeMap?: any;
    networkIdentifier?: any;
    static MinUnixEpoch: number;
    static MaxUnixEpoch: number;
    constructor({ operationTypes, operationStatuses, errorTypes, genesisBlockIdentifier, supportedNetworks, historicalBalanceLookup, }?: AsserterConstructor);
    /**
     * SupportedNetworks validates an array of NetworkIdentifiers.
     * @throws {AsserterError} if the array is empty or one of the networks is invalid.
     */
    SupportedNetworks(supportedNetworks: NetworkIdentifier[]): void;
    /**
     * SupportedNetwork validates a single NetworkIdentifiers.
     * @param {Rosetta:NetworkIdentifier} networkIdentifier - NetworkIdentifier which will be validated.
     * @throws {AsserterError} if the networkIdentifier is not supported by the asserter.
     */
    SupportedNetwork(networkIdentifier: NetworkIdentifier): void;
    /**
     * ValidSupportedNetwork is a wrapper method, that checks both, the validity and whether
     * the provided network is supported by the asserter.
     *
     * @param {Rosetta:NetworkIdentifier} requestNetwork - NetworkIdentifier which will be validated.
     * @throws {AsserterError} if the networkIdentifier is not valid or not supported by the asserter.
     */
    ValidSupportedNetwork(requestNetwork: NetworkIdentifier): void;
    /**
     * Validates an Rosetta:AccountBalanceRequest.
     *
     * @param {Rosetta:AccountBalanceRequest} accountBalanceRequest - Request that will be validated.
     * @throws {AsserterError} thrown if either one of the networks is invalid or not supported, the account
     *     identifier is invalid, or if a historical request is being made by specifiying
     *     a Rosetta:PartialBlockIdentifier, although it is not supported by
     *     this asserter (historicalBalanceRequest = false).
     */
    AccountBalanceRequest(accountBalanceRequest: AccountBalanceRequest): void;
    /**
     * Validates an Rosetta:BlockRequest.
     *
     * @param {Rosetta:BlockRequest} blockRequest - Request that will be validated.
     * @throws {AsserterError} thrown if either one of the networks is invalid or not supported, or
     *     if the specified Rosetta:PartialBlockIdentifier is invalid.
     */
    BlockRequest(blockRequest: BlockRequest): void;
    /**
     * Validates an Rosetta:BlockTransactionRequest.
     *
     * @param {Rosetta:BlockTransactionRequest} blockTransactionRequest - Request that will be validated.
     * @throws {AsserterError} thrown if either the request is null, one of the networks is invalid or not supported,
     *     the specified Rosetta:BlockIdentifier is invalid, or the Rosetta:TransactionIdentifier
     *     is invalid.
     */
    BlockTransactionRequest(blockTransactionRequest: BlockTransactionRequest): void;
    /**
     * Validates an Rosetta:ConstructionMetadataRequest.
     *
     * @param {Rosetta:ConstructionMetadataRequest} constructionMetadataRequest - Request that will be validated.
     * @throws {AsserterError} thrown if either the request is null, one of the networks is invalid or not supported,
     *     the the required parameter options is missing.
     */
    ConstructionMetadataRequest(constructionMetadataRequest: ConstructionMetadataRequest): void;
    /**
     * Validates an Rosetta:ConstructionSubmitRequest.
     *
     * @param {Rosetta:ConstructionSubmitRequest} constructionSubmitRequest - Request that will be validated.
     * @throws {AsserterError} thrown if either the request is null, one of the networks is invalid or not supported,
     *     or the the required signed_transaction is empty.
     */
    ConstructionSubmitRequest(constructionSubmitRequest: ConstructionSubmitRequest): void;
    /**
     * Validates an Rosetta:MempoolTransactionRequest.
     *
     * @param {Rosetta:MempoolTransactionRequest} mempoolTransactionRequest - Request that will be validated.
     * @throws {AsserterError} thrown if either the request is null, one of the networks is invalid or not supported,
     *     or the Rosetta:TransactionIdentifier is invalid.
     */
    MempoolTransactionRequest(mempoolTransactionRequest: MempoolTransactionRequest): void;
    /**
     * Validates an Rosetta:MetadataRequest.
     *
     * @param {Rosetta:MetadataRequest} metadataRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null.
     */
    MetadataRequest(metadataRequest: MetadataRequest): void;
    /**
     * Validates an Rosetta:NetworkRequest.
     *
     * @param {Rosetta:NetworkRequest} networkRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null, or if the privded network is
     *     invalid or not supported.
     */
    NetworkRequest(networkRequest: NetworkRequest): void;
    /**
     * Validates an Rosetta:ConstructionMetadataResponse.
     *
     * @param {Rosetta:ConstructionMetadataResponse} constructionMetadataResponse - Response that will be validated.
     * @throws {AsserterError} thrown if the provided response is null, or if the metadata property is missing.
     */
    ConstructionMetadataResponse(constructionMetadataResponse: ConstructionMetadataResponse): void;
    /**
     * Validates an Rosetta:TransactionIdentifierResponse.
     *
     * @param {Rosetta:TransactionIdentifierResponse} transactionIdentifierResponse - Response that will be validated.
     * @throws {AsserterError} thrown if the provided response is null, or if the the returned Rosetta:Transactionidetifier
     *     happens to be invalid..
     */
    TransactionIdentifierResponse(transactionIdentifierResponse: TransactionIdentifierResponse): void;
    /**
     * Validates an Rosetta:ConstructionCombineResponse.
     *
     * @param {Rosetta:ConstructionCombineResponse} constructionCombineResponse - Response that will be validated.
     * @throws {AsserterError} thrown if the provided response is null, or if the returned signed transaction
     *     is empty.
     */
    ConstructionCombineResponse(constructionCombineResponse: ConstructionCombineResponse): void;
    /**
     * Validates an Rosetta:ConstructionDeriveResponse.
     *
     * @param {Rosetta:ConstructionDeriveResponse} constructionDeriveResponse - Response that will be validated.
     * @throws {AsserterError} thrown if the provided response is null, or if the returned address is empty
     */
    ConstructionDeriveResponse(constructionDeriveResponse: ConstructionDeriveResponse): void;
    /**
     * Validates an Rosetta:ConstructionDeriveRequest.
     *
     * @param {Rosetta:ConstructionDeriveRequest} constructionDeriveRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null, the specified network is invalid not supported
     *     or the provided public key is invalid.
     */
    ConstructionDeriveRequest(constructionDeriveRequest: ConstructionDeriveRequest): void;
    /**
     * Validates an Rosetta:ConstructionPreprocessRequest.
     *
     * @param {Rosetta:ConstructionPreprocessRequest} constructionPreprocessRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null, the specified network is invalid or not supported
     *     or the provided operations are invalid.
     */
    ConstructionPreprocessRequest(constructionPreprocessRequest: ConstructionPreprocessRequest): void;
    /**
     * Validates an Rosetta:ConstructionPayloadsRequest.
     *
     * @param {Rosetta:ConstructionPayloadsRequest} constructionPayloadsRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null, the specified network is invalid or not supported
     *     or the provided operations are invalid.
     */
    ConstructionPayloadsRequest(constructionPayloadsRequest: ConstructionPayloadsRequest): void;
    /**
     * Validates an Rosetta:ConstructionCombineRequest.
     *
     * @param {Rosetta:constructionCombineRequest} constructionCombineRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null, the specified network is invalid or not supported,
     *     the unsigned transaction is empty or if the provided signatures (Rosetta:Signature[]) are invalid.
     */
    ConstructionCombineRequest(constructionCombineRequest: ConstructionCombineRequest): void;
    /**
     * Validates an Rosetta:ConstructionHashRequest.
     *
     * @param {Rosetta:ConstructionHashRequest} constructionHashRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null, the specified network is invalid or not supported,
     *     or if the signed transaction is empty.
     */
    ConstructionHashRequest(constructionHashRequest: ConstructionHashRequest): void;
    /**
     * Validates an Rosetta:ConstructionParseRequest.
     *
     * @param {Rosetta:ConstructionParseRequest} constructionParseRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null, the specified network is invalid or not supported,
     *     or if the transaction is empty.
     */
    ConstructionParseRequest(constructionParseRequest: ConstructionParseRequest): void;
    /**
     * Validates an Rosetta:ConstructionParseResponse.
     *
     * @param {Rosetta:ConstructionParseResponse} constructionParseResponse - Response that will be validated.
     * @param {boolean} signed - Whether expecting signers to be provided or not.
     * @throws {AsserterError} thrown if the provided response is null, no or invalid operations were returned,
     *     the signers were empty when expecting a signer information, signers were returned when not
     *     expecting them or when invalid signers were returned.
     */
    ConstructionParseResponse(constructionParseResponse: ConstructionParseResponse, signed?: boolean): void;
    /**
     * Validates an Rosetta:ConstructionPayloadsResponse.
     *
     * @param {Rosetta:ConstructionPayloadsResponse} constructionPayloadsResponse - Response that will be validated.
     * @throws {AsserterError} thrown if the provided response is null, an empty unsigned transaction was returned,
     *     or if no or invalid payloads were returned.
     */
    ConstructionPayloadsResponse(constructionPayloadsResponse: ConstructionPayloadsResponse): void;
    /**
     * Validates a PublicKey.
     *
     * @param {Rosetta:PublicKey} publicKey - public key that will be validated.
     * @throws {AsserterError} thrown if the provided publicKey is null, the property hex_bytes
     *     is empty or not a valid hexadecimal string, or the curve type is invalid.
     */
    PublicKey(publicKey: PublicKey): void;
    /**
     * Validates a CurveType.
     *
     * @param {Rosetta:CurveType} curveType - curve type that will be validated.
     * @throws {AsserterError} thrown if the provided curve type is not defined in the standard.
     */
    CurveType(curveType: CurveType): void;
    /**
     * Validates a SigningPayload.
     *
     * @param {Rosetta:SigningPayload} signingPayload - Signing Payload that will be validated.
     * @throws {AsserterError} thrown if the provided object is null, an empty address was specified,
     *     the specified hex_bytes property is empty or not a valid hexadecimal string, or, if provided,
     *     the signature type is invalid.
     */
    SigningPayload(signingPayload: SigningPayload): void;
    /**
     * Checks if a string consists only of hexadecimal bytes.
     *
     * @param {string} hexPayload - Hexadecimal string that will be validated.
     * @returns {boolean} if the string is hexadecimal.
     */
    checkHex(hexPayload: string): boolean;
    /**
     * Validates a signature array.
     *
     * @param {Rosetta:Signature[]} signatureArray - Signature Array that will be validated.
     * @throws {AsserterError} thrown if the provided signatures are empty or invalid.
     */
    Signatures(signatureArray?: Signature[]): void;
    /**
     * Validates a SignatureType.
     *
     * @param {Rosetta:SignatureType} signatureType - signature type that will be validated.
     * @throws {AsserterError} thrown if the provided signature type is not defined in the standard.
     */
    SignatureType(signatureType: SignatureType): void;
    /**
     * Validates a transaction array.
     *
     * @param {Rosetta:Transaction[]} transactionIdentifiers - Transaction Array that will be validated.
     * @throws {AsserterError} thrown if the at least one of the provided transactions is invalid.
     */
    MempoolTransactions(transactionIdentifiers: TransactionIdentifier[]): void;
    /**
     * Checks if a string is valid
     *
     * @param {string} input - Input that will be validated to be a string.
     * @returns {boolean} specifies whether the input is a valid non-empty string.
     */
    validString(input: string): boolean;
    /**
     * Validates a network identifier.
     *
     * @param {Rosetta:NetworkIdentifier} networkIdentifier - network identifier that will be validated.
     * @throws {AsserterError} thrown if the provided network identifier is null or empty, the blockchain
     *     property is missing, the network is missing or empty or, if specified, the subnetwork identifier
     *     is invalid.
     */
    NetworkIdentifier(networkIdentifier: NetworkIdentifier): void;
    /**
     * Validates a SubNetworkIdentifier.
     *
     * @param {Rosetta:SubNetworkIdentifier} subnetworkIdentifier - subnetwork identifier that will be validated.
     * @throws {AsserterError} thrown if the provided network identifier is null or empty
     */
    SubNetworkIdentifier(subnetworkIdentifier: SubNetworkIdentifier): void;
    /**
     * Validates a Peer.
     *
     * @param {Rosetta:Peer} peer - peer that will be validated.
     * @throws {AsserterError} thrown if the provided peer is null or is missing a peer id.
     */
    Peer(peer: Peer): void;
    /**
     * Validates a Version.
     *
     * @param {Rosetta:Version} version - version that will be validated.
     * @throws {AsserterError} thrown if the provided version is null, the
     *     property node_version is empty, or, if specified, the
     *     middleware_version is empty.
     */
    Version(version: Version): void;
    /**
     * Validates a StringArray.
     *
     * @param {string} name - Name of the array to be validated.
     * @param {string[]} array - Array to validate.
     * @throws {AsserterError} thrown if the provided array is empty, contains
     *     empty/invalid strings or if duplicate strings are detected.
     */
    StringArray(name: string, array: string[]): void;
    /**
     * Validates a Timestamp.
     *
     * @param {number} timestamp - Timestamp to be checked.
     * @throws {AsserterError} thrown if the provided timestamp is not in the expected range.
     */
    Timestamp(timestamp?: number): any;
    /**
     * Validates a NetworkStatusResponse.
     *
     * @param {Rosetta:NetworkStatusResponse} networkStatusResponse - Response to be validated
     * @throws {AsserterError} thrown if the provided response is null, the block identifier is invalid,
     *     the block timestamp is invalid, the genesis block identifier is invalid or if at least
     *     one of the peers is invalid.
     */
    NetworkStatusResponse(networkStatusResponse: NetworkStatusResponse): void;
    /**
     * Validates an array of Rosetta:OperationStatus.
     *
     * @param {Rosetta:OperationStatus[]} operationStatuses - operation status array to be validated
     * @throws {AsserterError} thrown if the provided array is null or empty, not at least one successful
     *     operation was specified or if at least one of the operations' status is invalid.
     */
    OperationStatuses(operationStatuses: OperationStatus[]): void;
    /**
     * Validates an array of OperationType (string).
     *
     * @param {Rosetta:OperationTypes[]} types - operation type array to be validated
     * @throws {AsserterError} thrown if the provided array is not a valid string array.
     */
    OperationTypes(types: string[]): void;
    /**
     * Validates a Rosetta:Error type.
     *
     * @param {Rosetta:Error} error - error to be validated
     * @throws {AsserterError} thrown if the provided error is null, the error code
     *     is negative or if the message is not a valid string.
     */
    Error(error: Error): void;
    /**
     * Validates an array of Rosetta:Error.
     *
     * @param {Rosetta:Error[]} rosettaErrors - array of errors to be validated
     * @throws {AsserterError} thrown if one or more errors is invalid, or if a duplicate
     *     error code was detected.
     */
    Errors(rosettaErrors?: Error[]): void;
    /**
     * Validates a Rosetta:Allow type.
     *
     * @param {Rosetta:Allow} allowed - Allow struct to be validated.
     * @throws {AsserterError} thrown if the provided Allow type is null, or if one of its
     *     specifications is invalid.
     */
    Allow(allowed: Allow): void;
    /**
     * Validates a NetworkOptionsResponse.
     *
     * @param {Rosetta:NetworkOptionsResponse} networkOptionsResponse - Response to be validated
     * @throws {AsserterError} thrown if the provided response is null, the returned version is invalid,
     *     or if the returned Allow struct is invalid.
     */
    NetworkOptionsResponse(networkOptionsResponse: NetworkOptionsResponse): void;
    /**
     * Checks if a network is contained in an array of networks.
     *
     * @param {Rosetta:NetworkIdentifier[]} networks - Array of networks
     * @param {Rosetta:NetworkIdentifier} network - network to be found in networks array.
     * @returns {boolean} describes whether the network was found in the array of networks.
     */
    containsNetworkIdentifier(networks: NetworkIdentifier[], network: NetworkIdentifier): boolean;
    /**
     * Validates a NetworkListResponse.
     *
     * @param {Rosetta:NetworkListResponse} networkListResponse - Response to be validated
     * @throws {AsserterError} thrown if the provided response is null or if at least one
     *     of the network identifiers is empty or duplicated.
     */
    NetworkListResponse(networkListResponse: NetworkListResponse): void;
    /**
     * Checks if a currency is contained in an array of currencies.
     *
     * @param {Rosetta:Currency[]} currencies - Array of currencies
     * @param {Rosetta:Currency} currency - currency to be found in currency array.
     * @returns {boolean} describes whether the currency was found in the array of currencies.
     */
    containsCurrency(currencies: Currency[], currency: Currency): boolean;
    /**
     * Validates an Array of Rosetta:Amount.
     *
     * @param {Rosetta:Amount[]} amountsArray - Amounts to be validated
     * @throws {AsserterError} thrown if a currency is used multiple times, or if one
     *     of the amounts is invalid.
     */
    assertBalanceAmounts(amountsArray: Amount[]): void;
    /**
     * Validates an Amount type.
     *
     * @param {Rosetta:Amount} amount - amount to be validated
     * @throws {AsserterError} thrown if the amount is null or empty, its value is not a valid
     *     integer (encoded as string), or if the provided currency is invalid.
     */
    Amount(amount: Amount): void;
    /**
     * Validates a CoinIdentifier type.
     *
     * @param {Rosetta:CoinIdentifier} coinIdentifier - identifier to be validated.
     * @throws {AsserterError} thrown if the provided coin identifier is null or empty.
     */
    CoinIdentifier(coinIdentifier: CoinIdentifier): void;
    /**
     * Validates a CoinAction.
     *
     * @param {Rosetta:CoinAction} coinAction - coin action to be validated.
     * @throws {AsserterError} thrown if the provided coin action is not defined in the standard.
     */
    CoinAction(coinAction: CoinAction): void;
    /**
     * Validates a CoinChange type.
     *
     * @param {Rosetta:CoinChange} coinChange - coin change to be validated.
     * @throws {AsserterError} thrown if the provided coin change type is null, or either
     *     the coin_identifier or coin_action is invalid.
     */
    CoinChange(coinChange: CoinChange): void;
    /**
     * Validates a Coin type.
     *
     * @param {Rosetta:Coin} coin - coin to be validated.
     * @throws {AsserterError} thrown if the provided coin type is null, or either
     *     the coin_identifier or amount is invalid.
     */
    Coin(coin: Coin): void;
    /**
     * Validates an array of coins.
     *
     * @param {Rosetta:Coin[]} coinArray - coin array to be validated.
     * @throws {AsserterError} thrown if the provided coin array is empty, or either
     *     the array contains duplicates or at least one of the coins is invalid.
     */
    Coins(coinArray: Coin[]): void;
    /**
     * Validates a AccountBalanceResponse.
     *
     * @param {Rosetta:PartialBlockIdentifier} partialBlockIdentifier - Partial block identifier that was requested.
     * @param {Rosetta:AccountBalanceResponse} accountBalanceResponse - Response to be validated.
     * @throws {AsserterError} thrown if the provided partial block identifier is invalid, the returned balances are
     *     invalid, the coins are invalid or, if specified, the partialBlockIndex does not match the returned
     *     block identifier.
     */
    /**
     * Validates an OperationIdentifier.
     *
     * @param {Rosetta:OperationIdentifier} operationIdentifier - Operation Identifier to validate.
     * @param {number} index - Expected index.
     * @throws {AsserterError} thrown if the provided index is not a number, the operation identifier is null,
     *     the index does not match the index specified in the operation or if the network index is invalid.
     */
    OperationIdentifier(operationIdentifier: OperationIdentifier, index: number): void;
    /**
     * Validates an AccountIdentifier.
     *
     * @param {Rosetta:AccountIdentifier} accountIdentifier - account identifier to be validated.
     * @throws {AsserterError} thrown if the provided account identifier is null, the address is missing, or
     *     if specified, the sub_account's address is missing.
     */
    AccountIdentifier(accountIdentifier: AccountIdentifier): void;
    /**
     * Validates an OperationStatus.
     *
     * @param {Rosetta:OperationStatus} operationStatus - operation status to be validated.
     * @throws {AsserterError} thrown if the provided status is null or empty, or if the
     *     provided status is not supported.
     */
    OperationStatus(status: string): void;
    OperationType(type: string): void;
    Operation(operation: Operation, index: number, construction?: boolean): any;
    BlockIdentifier(blockIdentifier: BlockIdentifier): void;
    PartialBlockIdentifier(partialBlockIdentifier: PartialBlockIdentifier): any;
    TransactionIdentifier(transactionIdentifier: TransactionIdentifier): void;
    Operations(operations: Operation[], construction?: boolean): void;
    Transaction(transaction: Transaction): void;
    Block(block: Block): void;
    static NewServer(supportedOperationTypes: any, historicalBalanceLookup: any, supportedNetworks: any): RosettaAsserter;
    static NewClientWithFile(filePath: fs.PathLike | number): RosettaAsserter;
    static NewClientWithResponses(networkIdentifier: NetworkIdentifier, networkStatus: NetworkStatusResponse, networkOptions: NetworkOptionsResponse): RosettaAsserter;
    OperationSuccessful(operation: Operation): any;
    getClientConfiguration(): {
        network_identifier: any;
        supportedNetworks: NetworkIdentifier[];
        genesis_block_identifier: BlockIdentifier;
        allowed_operation_types: string[];
        allowed_operation_statuses: any[];
        allowed_errors: any[];
    };
    static NewClientWithOptions(networkIdentifier: NetworkIdentifier, genesisBlockIdentifier: BlockIdentifier, operationTypes: string[], operationStatuses?: any[], errors?: Error[]): RosettaAsserter;
}
export default RosettaAsserter;
