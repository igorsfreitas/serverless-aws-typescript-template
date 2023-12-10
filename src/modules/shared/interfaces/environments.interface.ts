export interface IOutputGetEnvironments {
  APP_DB_NAME: string;
  APP_DB_HOST: string;
  APP_DB_PASSWORD: string;
  APP_DB_PORT: number;
  APP_DB_USER: string;
  REDIS_PORT: number;
  REDIS_HOST: string;
  ENABLE_CRYPTOGRAPHY: boolean;
}

export interface IOutputGetEnvironmentsMateraIbk {
  MATERA_IBK_URL: string;
  MATERA_IBK_USERNAME: string;
  MATERA_IBK_PASSWORD: string;
}
