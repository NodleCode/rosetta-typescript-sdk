import Controller from './Controller';

export const searchTransactions = async (request, response) => {
  await Controller.handleRequest(request, response);
};
