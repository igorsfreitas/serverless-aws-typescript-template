import { EStatusCodeType } from '@modules/http/enums/status-code.enum';
import { HttpResponseError } from './http-response-error.service';
import { EError } from './enums/http.enum';

export class NotFoundError extends HttpResponseError {
  constructor(
    messages: string | string[],
    data?: any,
    internalCodeError?: number,
  ) {
    super(
      EStatusCodeType.NOT_FOUND,
      messages,
      EError.NOT_FOUND,
      data,
      internalCodeError,
    );
  }
}
