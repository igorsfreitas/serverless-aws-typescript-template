import { container } from '@infrastructure/containers';
import middy from '@middy/core';
import { BadRequestError } from '@modules/errors/bad-request-error.service';
import { ForbiddenError } from '@modules/errors/forbidden-request-error.service';
import { EStatusCodeType } from '@modules/http/enums/status-code.enum';
import { LoggerService } from '@modules/logger/implementations/logger.service';
import { CryptographyService } from '@modules/shared/services/cryptography.service';
import { HelperService } from '@modules/shared/services/helper.service';
import { APIGatewayProxyEvent } from 'aws-lambda';

const middyEventCryptography = (): middy.MiddlewareObj => {
  const cryptographyService = container.resolve(CryptographyService);
  const logger = container.resolve(LoggerService);

  const validateXToken = async (request: middy.Request): Promise<void> => {
    const event: APIGatewayProxyEvent = request.event;
    const { headers } = event;
    const token = headers['x-validate-token'];

    if (!token) {
      logger.error('x-validate-token não encontrado nos headers');
      throw new ForbiddenError(
        'x-validate-token should exists',
        EStatusCodeType.FORBIDDEN,
      );
    }

    const isValidUUID = await cryptographyService.validateXToken(token);

    if (!isValidUUID) {
      throw new ForbiddenError(
        'x-validate-token is invalid',
        EStatusCodeType.FORBIDDEN,
      );
    }
  };

  const decrypt = async (request: middy.Request): Promise<void> => {
    try {
      const dataEncrypted = request.event.body?.data;
      const headers = request.event.headers;
      const { COREAPP_AES_REQUEST_SECRET_KEY } =
        await HelperService.getSSMEnvironments();

      if ((headers && !headers['X-Hmac-Hash']) || !headers['X-Hmac-Iso']) {
        throw new BadRequestError('Hmac não informado');
      }

      const hmac = headers['X-Hmac-Hash'];
      const hmacTimestamp = headers['X-Hmac-Iso'];
      const body = await cryptographyService.decrypt(
        dataEncrypted,
        COREAPP_AES_REQUEST_SECRET_KEY,
      );

      await cryptographyService.verifySignature(
        hmac,
        hmacTimestamp,
        dataEncrypted,
      );

      request.event.body = body;

      // console.log('VAI DECRIPTAR', dataEncrypted)
    } catch (error) {
      throw error;
    }
  };

  const encrypt = async (request: middy.Request): Promise<void> => {
    try {
      const bodyStringfy = JSON.stringify(request.response);
      const { COREAPP_AES_RESPONSE_SECRET_KEY } =
        await HelperService.getSSMEnvironments();

      const response = await cryptographyService.encrypt(
        bodyStringfy,
        COREAPP_AES_RESPONSE_SECRET_KEY,
      );

      request.response = {
        data: response,
      };
    } catch (error) {
      throw error;
    }
  };

  return {
    before: async (request: middy.Request) => {
      const { ENABLE_CRYPTOGRAPHY } = await HelperService.getSSMEnvironments();

      if (ENABLE_CRYPTOGRAPHY) {
        await decrypt(request);
        await validateXToken(request);
      }
    },
    after: async (request: middy.Request) => {
      const { ENABLE_CRYPTOGRAPHY } = await HelperService.getSSMEnvironments();

      if (ENABLE_CRYPTOGRAPHY) {
        await encrypt(request);
      }
    },
  };
};

export default middyEventCryptography;
