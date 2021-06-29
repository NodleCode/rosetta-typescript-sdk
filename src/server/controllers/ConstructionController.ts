/**
 * The ConstructionController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic reoutes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

import Controller from './Controller';

export const constructionCombine = async (request, response) => {
    await Controller.handleRequest(request, response);
};

export const constructionDerive = async (request, response) => {
    await Controller.handleRequest(request, response);
};

export const constructionHash = async (request, response) => {
    await Controller.handleRequest(request, response);
};

export const constructionMetadata = async (request, response) => {
    await Controller.handleRequest(request, response);
};

export const constructionParse = async (request, response) => {
    await Controller.handleRequest(request, response);
};

export const constructionPayloads = async (request, response) => {
    await Controller.handleRequest(request, response);
};

export const constructionPreprocess = async (request, response) => {
    await Controller.handleRequest(request, response);
};

export const constructionSubmit = async (request, response) => {
    await Controller.handleRequest(request, response);
};
