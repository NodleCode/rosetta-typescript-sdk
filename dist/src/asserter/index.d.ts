export default RosettaAsserter;
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
    static NewServer(supportedOperationTypes: any, historicalBalanceLookup: any, supportedNetworks: any): RosettaAsserter;
    static NewClientWithFile(filePath: any): RosettaAsserter;
    static NewClientWithResponses(networkIdentifier: any, networkStatus: any, networkOptions: any): RosettaAsserter;
    static NewClientWithOptions(networkIdentifier: any, genesisBlockIdentifier: any, operationTypes: any, operationStatuses?: any[], errors?: any[]): RosettaAsserter;
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
    constructor({ operationTypes, operationStatuses, errorTypes, genesisBlockIdentifier, supportedNetworks, historicalBalanceLookup, }?: string[]);
    operationTypes: any;
    genesisBlockIdentifier: any;
    supportedNetworks: any;
    historicalBalanceLookup: any;
    operationStatusMap: {};
    errorTypeMap: {};
    networkIdentifier: any;
    /**
     * SupportedNetworks validates an array of NetworkIdentifiers.
     * @throws {AsserterError} if the array is empty or one of the networks is invalid.
     */
    SupportedNetworks(supportedNetworks: any): void;
    /**
     * SupportedNetwork validates a single NetworkIdentifiers.
     * @param {Rosetta:NetworkIdentifier} networkIdentifier - NetworkIdentifier which will be validated.
     * @throws {AsserterError} if the networkIdentifier is not supported by the asserter.
     */
    SupportedNetwork(networkIdentifier: any): void;
    /**
     * ValidSupportedNetwork is a wrapper method, that checks both, the validity and whether
     * the provided network is supported by the asserter.
     *
     * @param {Rosetta:NetworkIdentifier} requestNetwork - NetworkIdentifier which will be validated.
     * @throws {AsserterError} if the networkIdentifier is not valid or not supported by the asserter.
     */
    ValidSupportedNetwork(requestNetwork: any): void;
    /**
     * Validates an Rosetta:AccountBalanceRequest.
     *
     * @param {Rosetta:AccountBalanceRequest} accountBalanceRequest - Request that will be validated.
     * @throws {AsserterError} thrown if either one of the networks is invalid or not supported, the account
     *     identifier is invalid, or if a historical request is being made by specifiying
     *     a Rosetta:PartialBlockIdentifier, although it is not supported by
     *     this asserter (historicalBalanceRequest = false).
     */
    AccountBalanceRequest(accountBalanceRequest: any): void;
    /**
     * Validates an Rosetta:BlockRequest.
     *
     * @param {Rosetta:BlockRequest} blockRequest - Request that will be validated.
     * @throws {AsserterError} thrown if either one of the networks is invalid or not supported, or
     *     if the specified Rosetta:PartialBlockIdentifier is invalid.
     */
    BlockRequest(blockRequest: any): void;
    /**
     * Validates an Rosetta:BlockTransactionRequest.
     *
     * @param {Rosetta:BlockTransactionRequest} blockTransactionRequest - Request that will be validated.
     * @throws {AsserterError} thrown if either the request is null, one of the networks is invalid or not supported,
     *     the specified Rosetta:BlockIdentifier is invalid, or the Rosetta:TransactionIdentifier
     *     is invalid.
     */
    BlockTransactionRequest(blockTransactionRequest: any): void;
    /**
     * Validates an Rosetta:ConstructionMetadataRequest.
     *
     * @param {Rosetta:ConstructionMetadataRequest} constructionMetadataRequest - Request that will be validated.
     * @throws {AsserterError} thrown if either the request is null, one of the networks is invalid or not supported,
     *     the the required parameter options is missing.
     */
    ConstructionMetadataRequest(constructionMetadataRequest: any): void;
    /**
     * Validates an Rosetta:ConstructionSubmitRequest.
     *
     * @param {Rosetta:ConstructionSubmitRequest} constructionSubmitRequest - Request that will be validated.
     * @throws {AsserterError} thrown if either the request is null, one of the networks is invalid or not supported,
     *     or the the required signed_transaction is empty.
     */
    ConstructionSubmitRequest(constructionSubmitRequest: any): void;
    /**
     * Validates an Rosetta:MempoolTransactionRequest.
     *
     * @param {Rosetta:MempoolTransactionRequest} mempoolTransactionRequest - Request that will be validated.
     * @throws {AsserterError} thrown if either the request is null, one of the networks is invalid or not supported,
     *     or the Rosetta:TransactionIdentifier is invalid.
     */
    MempoolTransactionRequest(mempoolTransactionRequest: any): void;
    /**
     * Validates an Rosetta:MetadataRequest.
     *
     * @param {Rosetta:MetadataRequest} metadataRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null.
     */
    MetadataRequest(metadataRequest: any): void;
    /**
     * Validates an Rosetta:NetworkRequest.
     *
     * @param {Rosetta:NetworkRequest} networkRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null, or if the privded network is
     *     invalid or not supported.
     */
    NetworkRequest(networkRequest: any): void;
    /**
     * Validates an Rosetta:ConstructionMetadataResponse.
     *
     * @param {Rosetta:ConstructionMetadataResponse} constructionMetadataResponse - Response that will be validated.
     * @throws {AsserterError} thrown if the provided response is null, or if the metadata property is missing.
     */
    ConstructionMetadataResponse(constructionMetadataResponse: any): void;
    /**
     * Validates an Rosetta:TransactionIdentifierResponse.
     *
     * @param {Rosetta:TransactionIdentifierResponse} transactionIdentifierResponse - Response that will be validated.
     * @throws {AsserterError} thrown if the provided response is null, or if the the returned Rosetta:Transactionidetifier
     *     happens to be invalid..
     */
    TransactionIdentifierResponse(transactionIdentifierResponse: any): void;
    /**
     * Validates an Rosetta:ConstructionCombineResponse.
     *
     * @param {Rosetta:ConstructionCombineResponse} constructionCombineResponse - Response that will be validated.
     * @throws {AsserterError} thrown if the provided response is null, or if the returned signed transaction
     *     is empty.
     */
    ConstructionCombineResponse(constructionCombineResponse: any): void;
    /**
     * Validates an Rosetta:ConstructionDeriveResponse.
     *
     * @param {Rosetta:ConstructionDeriveResponse} constructionDeriveResponse - Response that will be validated.
     * @throws {AsserterError} thrown if the provided response is null, or if the returned address is empty
     */
    ConstructionDeriveResponse(constructionDeriveResponse: any): void;
    /**
     * Validates an Rosetta:ConstructionDeriveRequest.
     *
     * @param {Rosetta:ConstructionDeriveRequest} constructionDeriveRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null, the specified network is invalid not supported
     *     or the provided public key is invalid.
     */
    ConstructionDeriveRequest(constructionDeriveRequest: any): void;
    /**
     * Validates an Rosetta:ConstructionPreprocessRequest.
     *
     * @param {Rosetta:ConstructionPreprocessRequest} constructionPreprocessRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null, the specified network is invalid or not supported
     *     or the provided operations are invalid.
     */
    ConstructionPreprocessRequest(constructionPreprocessRequest: any): void;
    /**
     * Validates an Rosetta:ConstructionPayloadsRequest.
     *
     * @param {Rosetta:ConstructionPayloadsRequest} constructionPayloadsRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null, the specified network is invalid or not supported
     *     or the provided operations are invalid.
     */
    ConstructionPayloadsRequest(constructionPayloadsRequest: any): void;
    /**
     * Validates an Rosetta:ConstructionCombineRequest.
     *
     * @param {Rosetta:constructionCombineRequest} constructionCombineRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null, the specified network is invalid or not supported,
     *     the unsigned transaction is empty or if the provided signatures (Rosetta:Signature[]) are invalid.
     */
    ConstructionCombineRequest(constructionCombineRequest: any): void;
    /**
     * Validates an Rosetta:ConstructionHashRequest.
     *
     * @param {Rosetta:ConstructionHashRequest} constructionHashRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null, the specified network is invalid or not supported,
     *     or if the signed transaction is empty.
     */
    ConstructionHashRequest(constructionHashRequest: any): void;
    /**
     * Validates an Rosetta:ConstructionParseRequest.
     *
     * @param {Rosetta:ConstructionParseRequest} constructionParseRequest - Request that will be validated.
     * @throws {AsserterError} thrown if the provided request is null, the specified network is invalid or not supported,
     *     or if the transaction is empty.
     */
    ConstructionParseRequest(constructionParseRequest: any): void;
    /**
     * Validates an Rosetta:ConstructionParseResponse.
     *
     * @param {Rosetta:ConstructionParseResponse} constructionParseResponse - Response that will be validated.
     * @param {boolean} signed - Whether expecting signers to be provided or not.
     * @throws {AsserterError} thrown if the provided response is null, no or invalid operations were returned,
     *     the signers were empty when expecting a signer information, signers were returned when not
     *     expecting them or when invalid signers were returned.
     */
    ConstructionParseResponse(constructionParseResponse: any, signed?: boolean): void;
    /**
     * Validates an Rosetta:ConstructionPayloadsResponse.
     *
     * @param {Rosetta:ConstructionPayloadsResponse} constructionPayloadsResponse - Response that will be validated.
     * @throws {AsserterError} thrown if the provided response is null, an empty unsigned transaction was returned,
     *     or if no or invalid payloads were returned.
     */
    ConstructionPayloadsResponse(constructionPayloadsResponse: any): void;
    /**
     * Validates a PublicKey.
     *
     * @param {Rosetta:PublicKey} publicKey - public key that will be validated.
     * @throws {AsserterError} thrown if the provided publicKey is null, the property hex_bytes
     *     is empty or not a valid hexadecimal string, or the curve type is invalid.
     */
    PublicKey(publicKey: any): void;
    /**
     * Validates a CurveType.
     *
     * @param {Rosetta:CurveType} curveType - curve type that will be validated.
     * @throws {AsserterError} thrown if the provided curve type is not defined in the standard.
     */
    CurveType(curveType: any): void;
    /**
     * Validates a SigningPayload.
     *
     * @param {Rosetta:SigningPayload} signingPayload - Signing Payload that will be validated.
     * @throws {AsserterError} thrown if the provided object is null, an empty address was specified,
     *     the specified hex_bytes property is empty or not a valid hexadecimal string, or, if provided,
     *     the signature type is invalid.
     */
    SigningPayload(signingPayload: any): void;
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
    Signatures(signatureArray?: any[]): void;
    SignatureType(signatureType: any): void;
    /**
     * Validates a transaction array.
     *
     * @param {Rosetta:Transaction[]} transactionIdentifiers - Transaction Array that will be validated.
     * @throws {AsserterError} thrown if the at least one of the provided transactions is invalid.
     */
    MempoolTransactions(transactionIdentifiers: any): void;
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
    NetworkIdentifier(networkIdentifier: any): void;
    /**
     * Validates a SubNetworkIdentifier.
     *
     * @param {Rosetta:SubNetworkIdentifier} subnetworkIdentifier - subnetwork identifier that will be validated.
     * @throws {AsserterError} thrown if the provided network identifier is null or empty
     */
    SubNetworkIdentifier(subnetworkIdentifier: any): void;
    /**
     * Validates a Peer.
     *
     * @param {Rosetta:Peer} peer - peer that will be validated.
     * @throws {AsserterError} thrown if the provided peer is null or is missing a peer id.
     */
    Peer(peer: any): void;
    /**
     * Validates a Version.
     *
     * @param {Rosetta:Version} version - version that will be validated.
     * @throws {AsserterError} thrown if the provided version is null, the
     *     property node_version is empty, or, if specified, the
     *     middleware_version is empty.
     */
    Version(version: any): void;
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
    NetworkStatusResponse(networkStatusResponse: any): void;
    /**
     * Validates an array of Rosetta:OperationStatus.
     *
     * @param {Rosetta:OperationStatus[]} operationStatuses - operation status array to be validated
     * @throws {AsserterError} thrown if the provided array is null or empty, not at least one successful
     *     operation was specified or if at least one of the operations' status is invalid.
     */
    OperationStatuses(operationStatuses: any): void;
    /**
     * Validates an array of OperationType (string).
     *
     * @param {Rosetta:OperationTypes[]} types - operation type array to be validated
     * @throws {AsserterError} thrown if the provided array is not a valid string array.
     */
    OperationTypes(types: any): void;
    /**
     * Validates a Rosetta:Error type.
     *
     * @param {Rosetta:Error} error - error to be validated
     * @throws {AsserterError} thrown if the provided error is null, the error code
     *     is negative or if the message is not a valid string.
     */
    Error(error: any): void;
    /**
     * Validates an array of Rosetta:Error.
     *
     * @param {Rosetta:Error[]} rosettaErrors - array of errors to be validated
     * @throws {AsserterError} thrown if one or more errors is invalid, or if a duplicate
     *     error code was detected.
     */
    Errors(rosettaErrors?: any[]): void;
    /**
     * Validates a Rosetta:Allow type.
     *
     * @param {Rosetta:Allow} allowed - Allow struct to be validated.
     * @throws {AsserterError} thrown if the provided Allow type is null, or if one of its
     *     specifications is invalid.
     */
    Allow(allowed: any): void;
    /**
     * Validates a NetworkOptionsResponse.
     *
     * @param {Rosetta:NetworkOptionsResponse} networkOptionsResponse - Response to be validated
     * @throws {AsserterError} thrown if the provided response is null, the returned version is invalid,
     *     or if the returned Allow struct is invalid.
     */
    NetworkOptionsResponse(networkOptionsResponse: any): void;
    /**
     * Checks if a network is contained in an array of networks.
     *
     * @param {Rosetta:NetworkIdentifier[]} networks - Array of networks
     * @param {Rosetta:NetworkIdentifier} network - network to be found in networks array.
     * @returns {boolean} describes whether the network was found in the array of networks.
     */
    containsNetworkIdentifier(networks: any, network: any): boolean;
    /**
     * Validates a NetworkListResponse.
     *
     * @param {Rosetta:NetworkListResponse} networkListResponse - Response to be validated
     * @throws {AsserterError} thrown if the provided response is null or if at least one
     *     of the network identifiers is empty or duplicated.
     */
    NetworkListResponse(networkListResponse: any): void;
    /**
     * Checks if a currency is contained in an array of currencies.
     *
     * @param {Rosetta:Currency[]} currencies - Array of currencies
     * @param {Rosetta:Currency} currency - currency to be found in currency array.
     * @returns {boolean} describes whether the currency was found in the array of currencies.
     */
    containsCurrency(currencies: any, currency: any): boolean;
    /**
     * Validates an Array of Rosetta:Amount.
     *
     * @param {Rosetta:Amount[]} amountsArray - Amounts to be validated
     * @throws {AsserterError} thrown if a currency is used multiple times, or if one
     *     of the amounts is invalid.
     */
    assertBalanceAmounts(amountsArray: any): void;
    /**
     * Validates an Amount type.
     *
     * @param {Rosetta:Amount} amount - amount to be validated
     * @throws {AsserterError} thrown if the amount is null or empty, its value is not a valid
     *     integer (encoded as string), or if the provided currency is invalid.
     */
    Amount(amount: any): void;
    /**
     * Validates a CoinIdentifier type.
     *
     * @param {Rosetta:CoinIdentifier} coinIdentifier - identifier to be validated.
     * @throws {AsserterError} thrown if the provided coin identifier is null or empty.
     */
    CoinIdentifier(coinIdentifier: any): void;
    /**
     * Validates a CoinAction.
     *
     * @param {Rosetta:CoinAction} coinAction - coin action to be validated.
     * @throws {AsserterError} thrown if the provided coin action is not defined in the standard.
     */
    CoinAction(coinAction: any): void;
    /**
     * Validates a CoinChange type.
     *
     * @param {Rosetta:CoinChange} coinChange - coin change to be validated.
     * @throws {AsserterError} thrown if the provided coin change type is null, or either
     *     the coin_identifier or coin_action is invalid.
     */
    CoinChange(coinChange: any): void;
    /**
     * Validates a Coin type.
     *
     * @param {Rosetta:Coin} coin - coin to be validated.
     * @throws {AsserterError} thrown if the provided coin type is null, or either
     *     the coin_identifier or amount is invalid.
     */
    Coin(coin: any): void;
    /**
     * Validates an array of coins.
     *
     * @param {Rosetta:Coin[]} coinArray - coin array to be validated.
     * @throws {AsserterError} thrown if the provided coin array is empty, or either
     *     the array contains duplicates or at least one of the coins is invalid.
     */
    Coins(coinArray: any): void;
    /**
     * Validates a AccountBalanceResponse.
     *
     * @param {Rosetta:PartialBlockIdentifier} partialBlockIdentifier - Partial block identifier that was requested.
     * @param {Rosetta:AccountBalanceResponse} accountBalanceResponse - Response to be validated.
     * @throws {AsserterError} thrown if the provided partial block identifier is invalid, the returned balances are
     *     invalid, the coins are invalid or, if specified, the partialBlockIndex does not match the returned
     *     block identifier.
     */
    AccountBalanceResponse(partialBlockIdentifier: any, accountBalanceResponse: any): void;
    /**
     * Validates an OperationIdentifier.
     *
     * @param {Rosetta:OperationIdentifier} operationIdentifier - Operation Identifier to validate.
     * @param {number} index - Expected index.
     * @throws {AsserterError} thrown if the provided index is not a number, the operation identifier is null,
     *     the index does not match the index specified in the operation or if the network index is invalid.
     */
    OperationIdentifier(operationIdentifier: any, index: number): void;
    /**
     * Validates an AccountIdentifier.
     *
     * @param {Rosetta:AccountIdentifier} accountIdentifier - account identifier to be validated.
     * @throws {AsserterError} thrown if the provided account identifier is null, the address is missing, or
     *     if specified, the sub_account's address is missing.
     */
    AccountIdentifier(accountIdentifier: any): void;
    /**
     * Validates an OperationStatus.
     *
     * @param {Rosetta:OperationStatus} operationStatus - operation status to be validated.
     * @throws {AsserterError} thrown if the provided status is null or empty, or if the
     *     provided status is not supported.
     */
    OperationStatus(status: any): void;
    OperationType(type: any): void;
    Operation(operation: any, index: any, construction?: boolean): any;
    BlockIdentifier(blockIdentifier: any): void;
    PartialBlockIdentifier(partialBlockIdentifier: any): any;
    TransactionIdentifier(transactionIdentifier: any): void;
    Operations(operations: any, construction?: boolean): void;
    Transaction(transaction: any): void;
    Block(block: any): void;
    OperationSuccessful(operation: any): any;
    getClientConfiguration(): {
        network_identifier: any;
        supportedNetworks: any;
        genesis_block_identifier: any;
        allowed_operation_types: any;
        allowed_operation_statuses: any[];
        allowed_errors: any[];
    };
}
declare namespace RosettaAsserter {
    const MinUnixEpoch: number;
    const MaxUnixEpoch: number;
}
