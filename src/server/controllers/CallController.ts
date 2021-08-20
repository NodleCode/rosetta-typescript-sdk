import Controller from './Controller';

export const call = async (request, response) => {
  await Controller.handleRequest(request, response);
};
