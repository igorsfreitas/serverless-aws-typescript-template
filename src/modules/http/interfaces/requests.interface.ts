import { TObjectOfStringType } from '../types/requests.type';

export interface IHttpRequest {
  headers?: TObjectOfStringType;
  body?: any;
  pathParameters?: TObjectOfStringType | null;
  queryStringParameters?: TObjectOfStringType | null;
  requestContext?: any;
  isBase64Encoded?: boolean;
  httpMethod?: string;
  auth?: any;
}
