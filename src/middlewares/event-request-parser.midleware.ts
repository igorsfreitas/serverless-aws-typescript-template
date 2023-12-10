import middy from '@middy/core';
import { IHttpRequest } from '@modules/http/interfaces/requests.interface';
import { LoggerService } from '@modules/logger/implementations/logger.service';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { container } from 'src/infrastructure/containers';

const middyEventRequestParser = (): middy.MiddlewareObj => {
  const eventRequestParser = async (request: middy.Request): Promise<void> => {
    const logger = container.resolve(LoggerService);
    const event: APIGatewayProxyEvent = request.event;

    const httpRequest: IHttpRequest = {
      body: event.body,
      headers: event.headers,
      isBase64Encoded: event.isBase64Encoded,
      pathParameters: event.pathParameters,
      queryStringParameters: event.queryStringParameters,
      requestContext: {
        ip: event.requestContext?.identity?.sourceIp,
        httpMethod: event.requestContext?.httpMethod,
      },
      httpMethod: event.httpMethod,
    };
    request.event = httpRequest;

    logger.info(`Request da Função ${process.env.AWS_LAMBDA_FUNCTION_NAME}`, {
      httpRequest,
    });
  };

  return {
    before: eventRequestParser,
  };
};
export default middyEventRequestParser;
