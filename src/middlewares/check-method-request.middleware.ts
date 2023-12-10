import { ERequestMethod } from '@decorators/enum/request-validation.enum';
import middy from '@middy/core';
import { BadRequestError } from '@modules/errors/bad-request-error.service';

const checkMethodRequest = (
  allowedHttpMethod?: ERequestMethod,
): middy.MiddlewareObj => {
  const checkMethodRequestBefore = (request: middy.Request): void => {
    if (
      allowedHttpMethod !== ERequestMethod.NO_HTTP &&
      allowedHttpMethod &&
      request.event.httpMethod !== allowedHttpMethod
    ) {
      throw new BadRequestError('Requisição não permitida');
    }
  };
  return {
    before: checkMethodRequestBefore,
  };
};
export default checkMethodRequest;
