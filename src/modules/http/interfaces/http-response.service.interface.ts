import { EStatusCodeType } from '../enums/status-code.enum';

export interface IHttpResponse {
  statusCode: EStatusCodeType;
  headers?: {
    [header: string]: boolean | number | string;
  };
  body: any;
  isBase64Encoded?: boolean;
  message?: string;
  internalCodeError?: number;
}
