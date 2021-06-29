import Controller from "./Controller";

export const block = async (request, response) => {
  await Controller.handleRequest(request, response);
};

export const blockTransaction = async (request, response) => {
  await Controller.handleRequest(request, response);
};
