"use strict";
/**
 * The NetworkController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic reoutes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.networkStatus = exports.networkOptions = exports.networkList = void 0;
const Controller_1 = __importDefault(require("./Controller"));
const networkList = async (request, response) => {
    await Controller_1.default.handleRequest(request, response);
};
exports.networkList = networkList;
const networkOptions = async (request, response) => {
    await Controller_1.default.handleRequest(request, response);
};
exports.networkOptions = networkOptions;
const networkStatus = async (request, response) => {
    await Controller_1.default.handleRequest(request, response);
};
exports.networkStatus = networkStatus;
