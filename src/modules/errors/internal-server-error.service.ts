import { EStatusCodeType } from '@modules/http/enums/status-code.enum';
import { HttpResponseError } from './http-response-error.service';
import { EError } from './enums/http.enum';

export class InternalServerError extends HttpResponseError {
  constructor(
    messages: string | string[],
    data?: any,
    internalCodeError?: number,
  ) {
    super(
      EStatusCodeType.INTERNAL_SERVER_ERROR,
      messages,
      EError.INTERNAL_SERVER_ERROR,
      data,
      internalCodeError,
    );
  }
}
