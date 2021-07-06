"use strict";
exports.__esModule = true;
var NetworkIdentifier = /** @class */ (function () {
    function NetworkIdentifier() {
        this.blockchain = '';
        this.network = '';
        this.sub_network_identifier = {
            'network': '',
            'metadata': {
                'producer': ''
            }
        }; // Optional
    }
    return NetworkIdentifier;
}());
exports["default"] = NetworkIdentifier;
