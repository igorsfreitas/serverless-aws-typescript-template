import { EStatusCodeType } from '@modules/http/enums/status-code.enum';
import { HttpResponseError } from './http-response-error.service';
import { EError } from './enums/http.enum';

export class ForbiddenError extends HttpResponseError {
  constructor(
    messages: string | string[],
    data?: any,
    internalCodeError?: number,
  ) {
    super(
      EStatusCodeType.FORBIDDEN,
      messages,
      EError.FORBIDDEN,
      data,
      internalCodeError,
    );
  }
}
