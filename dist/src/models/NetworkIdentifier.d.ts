export default class NetworkIdentifier {
    blockchain: string;
    network: string;
    sub_network_identifier: {
        network: string;
        metadata: {
            producer: string;
        };
    };
}
