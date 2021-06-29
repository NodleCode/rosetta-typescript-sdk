"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
const ServiceHandlers = __importStar(require("./services"));
const network_1 = require("./network");
const asserter = __1.Asserter.NewServer(["Transfer", "Reward"], false, [
    network_1.networkIdentifier,
]);
/* Create a server configuration */
const Server = new __1.Server({
    URL_PORT: 8080,
});
// Register global asserter
Server.useAsserter(asserter);
/* Construction API */
Server.register("/construction/metadata", ServiceHandlers.Construction.constructionMetadata);
Server.register("/construction/submit", ServiceHandlers.Construction.constructionSubmit);
Server.register("/construction/combine", ServiceHandlers.Construction.constructionCombine);
Server.register("/construction/derive", ServiceHandlers.Construction.constructionDerive);
Server.register("/construction/hash", ServiceHandlers.Construction.constructionHash);
Server.register("/construction/parse", ServiceHandlers.Construction.constructionParse);
Server.register("/construction/payloads", ServiceHandlers.Construction.constructionPayloads);
Server.register("/construction/preprocess", ServiceHandlers.Construction.constructionPreprocess);
/* Data API: Network */
Server.register("/network/list", ServiceHandlers.Network.networkList);
Server.register("/network/options", ServiceHandlers.Network.networkOptions);
Server.register("/network/status", ServiceHandlers.Network.networkStatus);
/* Data API: Block */
Server.register("/block", ServiceHandlers.Block.block);
Server.register("/block/transaction", ServiceHandlers.Block.blockTransaction);
Server.register("/network/list", ServiceHandlers.Network.networkList);
Server.register("/network/options", ServiceHandlers.Network.networkOptions);
Server.register("/network/status", ServiceHandlers.Network.networkStatus);
/* Data API: Block */
Server.register("/block", ServiceHandlers.Block.block);
Server.register("/block/transaction", ServiceHandlers.Block.blockTransaction);
/* Data API: Account */
Server.register("/account/balance", ServiceHandlers.Account.balance);
/* Data API: Mempool */
Server.register("/mempool", ServiceHandlers.Mempool.mempool);
Server.register("/mempool/transaction", ServiceHandlers.Mempool.mempoolTransaction);
Server.launch();
