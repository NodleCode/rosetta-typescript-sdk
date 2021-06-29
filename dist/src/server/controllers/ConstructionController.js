"use strict";
/**
 * The ConstructionController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic reoutes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructionSubmit = exports.constructionPreprocess = exports.constructionPayloads = exports.constructionParse = exports.constructionMetadata = exports.constructionHash = exports.constructionDerive = exports.constructionCombine = void 0;
const Controller_1 = __importDefault(require("./Controller"));
const constructionCombine = async (request, response) => {
    await Controller_1.default.handleRequest(request, response);
};
exports.constructionCombine = constructionCombine;
const constructionDerive = async (request, response) => {
    await Controller_1.default.handleRequest(request, response);
};
exports.constructionDerive = constructionDerive;
const constructionHash = async (request, response) => {
    await Controller_1.default.handleRequest(request, response);
};
exports.constructionHash = constructionHash;
const constructionMetadata = async (request, response) => {
    await Controller_1.default.handleRequest(request, response);
};
exports.constructionMetadata = constructionMetadata;
const constructionParse = async (request, response) => {
    await Controller_1.default.handleRequest(request, response);
};
exports.constructionParse = constructionParse;
const constructionPayloads = async (request, response) => {
    await Controller_1.default.handleRequest(request, response);
};
exports.constructionPayloads = constructionPayloads;
const constructionPreprocess = async (request, response) => {
    await Controller_1.default.handleRequest(request, response);
};
exports.constructionPreprocess = constructionPreprocess;
const constructionSubmit = async (request, response) => {
    await Controller_1.default.handleRequest(request, response);
};
exports.constructionSubmit = constructionSubmit;
