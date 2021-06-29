"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountBalance = void 0;
const Controller_1 = __importDefault(require("./Controller"));
const { handleRequest } = Controller_1.default;
/**
 * The AccountController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic reoutes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */
const accountBalance = async (request, response) => {
    await handleRequest(request, response);
};
exports.accountBalance = accountBalance;
