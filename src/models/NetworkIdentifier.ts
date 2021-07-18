import { SubNetworkIdentifier } from 'types';

export default class NetworkIdentifier {
    blockchain: string;
    network: string;
    sub_network_identifier?: SubNetworkIdentifier;
    constructor() {
        this.blockchain = '';
        this.network = '';
        this.sub_network_identifier = {
            network: '',
            metadata: {
                producer: '',
            },
        }; // Optional
    }
}
