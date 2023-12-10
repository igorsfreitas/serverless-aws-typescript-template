import middy from '@middy/core';
import { HttpResponseError } from '@modules/errors/http-response-error.service';
import { EStatusCodeType } from '@modules/http/enums/status-code.enum';
import { LoggerService } from '@modules/logger/implementations/logger.service';
import { container } from 'src/infrastructure/containers';

const httpErrorHandlerMiddleware = (): middy.MiddlewareObj => {
  const httpErrorHandlerMiddlewareOnError = async (
    request: middy.Request,
  ): Promise<void> => {
    const level =
      request.error instanceof HttpResponseError &&
      request.error.code.toString().at(0) !== '5'
        ? 'warn'
        : 'error';
    const logger = container.resolve(LoggerService);
    logger[level](
      `Throw Função ${process.env.AWS_LAMBDA_FUNCTION_NAME}: ${
        request?.error?.message || 'Desconhecido'
      }`,
      {
        httpRequest: {
          body: request.event.body,
          params: request.event.pathParameters,
          pathParameters: request.event.pathParameters,
          query: request.event.queryStringParameters,
        },
        error: request?.error,
        level,
      },
    );
    if (request.response !== undefined) return;
    if (request.error instanceof HttpResponseError) {
      request.response = request.error.toResponse();
    } else {
      const statusCode = EStatusCodeType.INTERNAL_SERVER_ERROR;

      request.response = {
        statusCode,
        body: JSON.stringify({
          statusCode,
          message: 'Internal server error',
        }),
      };
    }
  };
  return {
    onError: httpErrorHandlerMiddlewareOnError,
  };
};
export default httpErrorHandlerMiddleware;
