"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockTransaction = exports.block = void 0;
const Controller_1 = __importDefault(require("./Controller"));
const block = async (request, response) => {
    await Controller_1.default.handleRequest(request, response);
};
exports.block = block;
const blockTransaction = async (request, response) => {
    await Controller_1.default.handleRequest(request, response);
};
exports.blockTransaction = blockTransaction;
