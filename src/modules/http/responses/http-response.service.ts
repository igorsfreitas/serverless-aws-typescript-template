import { EStatusCodeType } from '../enums/status-code.enum';
import { IHttpResponse } from '../interfaces/http-response.service.interface';

export abstract class HttpResponse implements IHttpResponse {
  constructor(
    public readonly body: any,
    public readonly statusCode: EStatusCodeType,
    public readonly message?: string | undefined,
    public readonly internalCodeError?: number | undefined,
  ) {}

  toResponse(): IHttpResponse {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify({
        code: this.internalCodeError,
        message: this.message,
        data: this.body,
      }),
    };
  }
}
