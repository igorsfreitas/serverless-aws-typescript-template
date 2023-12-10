import { AWSService } from './aws.service';
import {
  IOutputGetEnvironments,
  IOutputGetEnvironmentsMateraIbk,
} from '../interfaces/environments.interface';

export class HelperService {
  static isJsonString = (string: string) => {
    try {
      const json = JSON.parse(string);

      return json;
    } catch (e) {
      return false;
    }
  };

  static getSSMEnvironments = async (): Promise<IOutputGetEnvironments> => {
    try {
      const ssmKey = 'COREAPP_ENVIRONMENTS';
      const parameters = await AWSService.getParameters([
        ssmKey,
        'COREAPP_AES_REQUEST_SECRET_KEY',
        'COREAPP_AES_RESPONSE_SECRET_KEY',
        'COREAPP_RSA_PRIVATE',
        'COREAPP_RSA_SECRET',
        'APP_DB_NAME',
        'APP_DB_HOST',
        'APP_DB_PASSWORD',
        'APP_DB_PORT',
        'APP_DB_USER',
      ]);

      const environments: IOutputGetEnvironments = {
        ...JSON.parse(parameters[ssmKey]),
        ...(parameters && parameters),
      };

      // parses
      environments.APP_DB_PORT = Number(environments.APP_DB_PORT);

      return environments;
    } catch (e) {
      // default values
      return {
        APP_DB_NAME: '',
        APP_DB_HOST: '',
        APP_DB_PASSWORD: '',
        APP_DB_PORT: 5432,
        APP_DB_USER: '',
        COREAPP_AES_REQUEST_SECRET_KEY: '',
        COREAPP_AES_RESPONSE_SECRET_KEY: '',
        COREAPP_RSA_PRIVATE: '',
        COREAPP_RSA_SECRET: '',
        REDIS_HOST: '',
        REDIS_PORT: 6379,
        ENABLE_CRYPTOGRAPHY: false,
      };
    }
  };

  static getEnvironmentsMateraIbk = (): IOutputGetEnvironmentsMateraIbk => {
    try {
      const environments = JSON.parse(String(process.env.COREAPP_ENVIRONMENTS));

      return environments;
    } catch (e) {
      return {
        MATERA_IBK_URL: '',
        MATERA_IBK_USERNAME: '',
        MATERA_IBK_PASSWORD: '',
      };
    }
  };

  static firstLetterToLowerCase = (str: string): string => {
    return str.charAt(0).toLowerCase() + str.slice(1);
  };
}
