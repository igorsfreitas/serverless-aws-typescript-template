import middy from '@middy/core';
import { EContentTypeEnum } from '@modules/http/enums/headers.enum';
import { EStatusCodeType } from '@modules/http/enums/status-code.enum';

/**
 * @param httpStatusCode
 * Set http status code response
 */
const httpResponse = (
  httpStatusCode: EStatusCodeType,
  contentType: EContentTypeEnum,
): middy.MiddlewareObj => {
  const checkMethodRequestBefore = (handler: middy.Request) => {
    const { response } = handler;
    let statusCode = EStatusCodeType.OK;
    let body = response;

    // class validator payload
    if (response?.body) {
      body = JSON.parse(response?.body);
      statusCode = EStatusCodeType.BAD_REQUEST;

      // No content controller decorator response
    } else if (!response && httpStatusCode === EStatusCodeType.NO_CONTENT) {
      body = {};
      statusCode = httpStatusCode;
    } else if (httpStatusCode) {
      statusCode = httpStatusCode;
    }

    return {
      statusCode,
      body: contentType === EContentTypeEnum.JSON ? JSON.stringify(body) : body,
      headers: {
        'Content-Type': contentType,
      },
    };
  };

  return {
    after: checkMethodRequestBefore,
  };
};

export default httpResponse;
