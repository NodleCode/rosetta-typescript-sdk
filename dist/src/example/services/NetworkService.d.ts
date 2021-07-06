import { NetworkOptionsResponse, NetworkRequest, NetworkStatusResponse, Params } from 'types';
/**
 * Get List of Available Networks
 * This endpoint returns a list of NetworkIdentifiers that the Rosetta server can handle.
 *
 * metadataRequest MetadataRequest
 * returns NetworkListResponse
 * */
export declare const networkList: (params: any) => Promise<any>;
/**
 * Get Network Options
 * This endpoint returns the version information and allowed network-specific types for a NetworkIdentifier. Any NetworkIdentifier returned by /network/list should be accessible here.  Because options are retrievable in the context of a NetworkIdentifier, it is possible to define unique options for each network.
 *
 * networkRequest NetworkRequest
 * returns NetworkOptionsResponse
 * */
export declare const networkOptions: (params: Params<NetworkRequest>) => Promise<NetworkOptionsResponse>;
/**
 * Get Network Status
 * This endpoint returns the current status of the network requested. Any NetworkIdentifier returned by /network/list should be accessible here.
 *
 * networkRequest NetworkRequest
 * returns NetworkStatusResponse
 * */
export declare const networkStatus: (params: Params<NetworkRequest>) => Promise<NetworkStatusResponse>;
