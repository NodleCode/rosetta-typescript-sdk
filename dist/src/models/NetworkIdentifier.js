"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NetworkIdentifier {
    constructor() {
        this.blockchain = '';
        this.network = '';
        this.sub_network_identifier = {
            'network': '',
            'metadata': {
                'producer': '',
            },
        }; // Optional
    }
}
exports.default = NetworkIdentifier;
