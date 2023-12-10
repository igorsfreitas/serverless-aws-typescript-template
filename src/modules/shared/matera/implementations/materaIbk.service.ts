import { inject, injectable } from 'tsyringe';
import * as querystring from 'querystring';
import { RestClientService } from '@modules/shared/services/rest-client.service';
import { IMateraIbkService } from '../interfaces/materaIbk.interface';
import { HelperService } from '@modules/shared/services/helper.service';
import { ILoggerService } from '@modules/logger/interfaces/logger.service.interface';
import { LoggerService } from '@modules/logger/implementations/logger.service';
import { IRestClientConfig } from '@modules/shared/interfaces/rest-client.service.interface';

@injectable()
export class MateraIbkService
  extends RestClientService
  implements IMateraIbkService
{
  private readonly materaIbkEnvironments: {
    ibkUsername: string;
    ibkPassword: string;
  };

  constructor(
    @inject(LoggerService.name)
    private readonly loggerService: ILoggerService,
  ) {
    const { MATERA_IBK_URL, MATERA_IBK_USERNAME, MATERA_IBK_PASSWORD } =
      HelperService.getEnvironmentsMateraIbk();

    const config: IRestClientConfig = {
      baseURL: MATERA_IBK_URL,
      maxRetries: 3,
      retryDelay: 1000,
      retryStatusCodes: [408, 500, 501, 502],
    };

    super(config);

    this.materaIbkEnvironments = {
      ibkUsername: MATERA_IBK_USERNAME,
      ibkPassword: MATERA_IBK_PASSWORD,
    };
  }

  async getToken(): Promise<string> {
    let token;
    const { ibkUsername, ibkPassword } = this.materaIbkEnvironments;
    const credentials = Buffer.from(`${ibkUsername}:${ibkPassword}`).toString(
      'base64',
    );

    const body = querystring.stringify({
      grant_type: 'client_credentials',
    });

    try {
      this.loggerService.info('will generate a new token');
      const { data } = await this.post<any>('/server/oauth/token', body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`,
        },
      });
      token = data.access_token;

      this.loggerService.info('final token', token);

      return token;
    } catch (error) {
      this.loggerService.error(
        'An error occurred while generating the token',
        error,
      );
      throw error;
    }
  }

  async postDeleteTed(id: string): Promise<string> {
    try {
      this.loggerService.info('API de exclusão de ted agendado');
      const { data } = await this.post<any>(
        `/api/v1/server/scheduling/cancel/${id}`,
        null,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${await this.getToken()}`,
          },
        },
      );

      this.loggerService.info('retorno da API do Matera: ', data);
      return data;
    } catch (error) {
      this.loggerService.error('Erro ao acessar o Matera', error);
      throw error;
    }
  }
}
