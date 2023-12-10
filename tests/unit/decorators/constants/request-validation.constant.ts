import { IHttpRequest } from '@modules/http/interfaces/requests.interface';

const mockBaseHttpRequestValidation: IHttpRequest = {
  body: {},
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'PostmanRuntime/7.32.3',
    Accept: '*/*',
    'Postman-Token': '5c1db9a3-4cf9-4f84-b419-59e2ed0114fa',
    Host: '0.0.0.0:3000',
    'Accept-Encoding': 'gzip, deflate, br',
    Connection: 'keep-alive',
    'Content-Length': '48',
  },
  isBase64Encoded: false,
  pathParameters: null,
  queryStringParameters: {},
  requestContext: { ip: '127.0.0.1', httpMethod: 'POST' },
  httpMethod: 'POST',
};

export const mockValidateRequest: IHttpRequest = {
  ...mockBaseHttpRequestValidation,
  body: { field1: 'teste', field2: 0 },
};

export const mockInvalidateRequest: IHttpRequest = {
  ...mockBaseHttpRequestValidation,
  body: { field1: 'teste' },
};

export const mockValidateFilteredBodyRequest: IHttpRequest = {
  ...mockBaseHttpRequestValidation,
  body: { field1: 'teste', field2: 0, field3: 1 },
};
