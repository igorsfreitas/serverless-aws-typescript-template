import { EStatusCodeType } from '@modules/http/enums/status-code.enum';
import { HttpResponseError } from './http-response-error.service';
import { EError } from './enums/http.enum';

export class BadRequestError extends HttpResponseError {
  constructor(
    messages: string | string[],
    data?: any,
    internalCodeError?: number,
  ) {
    super(
      EStatusCodeType.BAD_REQUEST,
      messages,
      EError.BAD_REQUEST,
      data,
      internalCodeError,
    );
  }
}
