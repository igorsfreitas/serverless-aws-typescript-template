import cors from '@middy/http-cors';
import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { IHttpRequest } from '../interfaces/requests.interface';
import httpSecurityHeaders from '@middy/http-security-headers';
import { EStatusCodeType } from '../enums/status-code.enum';
import checkMethodRequest from 'src/middlewares/check-method-request.middleware';
import middyEventRequestParser from 'src/middlewares/event-request-parser.midleware';
import httpErrorHandlerMiddleware from 'src/middlewares/http-error-handler.middleware';
import httpResponse from 'src/middlewares/http-response.middleware';
import { container } from '@infrastructure/containers';
import { ERequestMethod } from '@decorators/enum/request-validation.enum';
import { HTTP_METHOD_KEY } from '@decorators/constants/metadata.constants';
import { EContentTypeEnum } from '../enums/headers.enum';
import { IHttpResponse } from '../interfaces/http-response.service.interface';
import { getHttpStatusCode } from '@decorators/http-status-code.decorator';
import middyEventCryptography from 'src/middlewares/cryptography.midleware';

export class BaseHandlerService {
  defaultHandler<T>(
    ClassType: new (...args: any[]) => T,
    functionName: string,
    contentType: EContentTypeEnum,
  ) {
    const instance = container.resolve(ClassType) as Record<string, Function>;

    // get metadatas
    const httpMethod = Reflect.getMetadata(
      HTTP_METHOD_KEY,
      instance,
      functionName,
    );

    const httpStatusCode: EStatusCodeType = getHttpStatusCode(
      instance,
      functionName,
    );

    const handler = async (event: IHttpRequest): Promise<IHttpResponse> =>
      instance[functionName](event);

    let middlyApplyResponse = middy(handler);

    if (httpMethod !== ERequestMethod.NO_HTTP) {
      middlyApplyResponse = middlyApplyResponse
        .use(
          cors({
            credentials: true,
            headers:
              'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Hmac-Iso,X-Hmac-Hash,X-Amz-Security-Token,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers',
            origin: '*',
            methods: 'OPTIONS,GET,POST,PUT,DELETE,HEAD,PATCH',
          }),
        )
        .use(middyJsonBodyParser())
        .use(checkMethodRequest(httpMethod));
    }

    middlyApplyResponse = middlyApplyResponse
      .use(httpErrorHandlerMiddleware())
      .use(middyEventRequestParser())
      .use(httpSecurityHeaders())
      .use(httpResponse(httpStatusCode, contentType))
      .use(middyEventCryptography());

    return middlyApplyResponse;
  }
}
