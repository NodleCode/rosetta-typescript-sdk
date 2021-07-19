import { NetworkIdentifier } from 'types';

export default class NetworkListResponse {
    network_identifiers: NetworkIdentifier[];
    constructor() {
        this.network_identifiers = [];
    }
}
