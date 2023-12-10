import { IHttpResponse } from '@modules/http/interfaces/http-response.service.interface';
import { EError } from './enums/http.enum';

export abstract class HttpResponseError extends Error {
  constructor(
    public code: number,
    public messages: string | string[],
    public error: EError,
    public data?: any,
    public internalCodeError?: number,
  ) {
    super();
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toResponse(): IHttpResponse {
    return {
      statusCode: this.code,
      body: JSON.stringify({
        statusCode: this.code,
        messages: this.messages,
        error: this.error,
        code: this.internalCodeError,
        data: this.data,
      }),
    };
  }
}
