import Controller from './Controller';

export const eventsBlocks = async (request, response) => {
  await Controller.handleRequest(request, response);
};

