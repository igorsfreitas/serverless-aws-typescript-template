import omit from 'lodash.omit';
import { singleton } from 'tsyringe';
import { createLogger, format, transports, Logger } from 'winston';
import {
  IGetLoggerOutput,
  ILogInput,
  IWinstonService,
} from '../interfaces/winston.service.interface';
import { ELogLevelCodeType } from '../enums/logger.enum';

interface ILogObject extends ILogInput {
  timestamp: Date;
  body?: string;
}

@singleton()
export class WinstonService implements IWinstonService {
  private privateData: string[];

  constructor() {
    this.privateData = [];
  }

  public protectData(...data: Array<string | number>): void {
    const newData = data.filter(
      (value) =>
        ['string', 'number'].includes(typeof value) &&
        !['undefined', 'null', 'NaN', 'Infinity', ...this.privateData].includes(
          value.toString(),
        ),
    );
    if (newData.length > 0)
      this.privateData.push(...newData.map((value) => value.toString()));
  }

  public clearProtectData(): void {
    this.privateData = [];
  }

  public getLogger(): IGetLoggerOutput {
    return this.createWinstonLogger();
  }

  public log<O = any>({
    level,
    description,
    message,
    stack,
  }: ILogInput<O>): void {
    const logger = this.createWinstonLogger();
    try {
      logger[level](message, description, stack);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`[${new Date().toISOString()}] [ALERT]: `, {
        level: 'error',
        levelCode: '0',
        message: `Erro com o Logger - ${err?.message || 'Desconhecido'}`,
        functionName: process.env.AWS_LAMBDA_FUNCTION_NAME ?? 'NOT-LAMBDA',
        meta: [{ level, message, stack }],
      });
    }
  }

  private createWinstonLogger(): Logger {
    return createLogger({
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.splat(),
        format.printf((logObject: ILogObject) => {
          const meta = {
            ...omit(logObject, ['level', 'message', 'timestamp']),
          };

          if (meta?.body) {
            try {
              meta.body = JSON.parse(meta.body);
            } catch (err) {
              // eslint-disable-next-line no-console
              console.warn(`[${new Date().toISOString()}] [WARN]: `, {
                level: 'warn',
                levelCode: '0',
                message: `Erro ao fazer o JSON.parser  - ${
                  err?.message || 'Desconhecido'
                }`,
                functionName:
                  process.env.AWS_LAMBDA_FUNCTION_NAME ?? 'NOT-LAMBDA',
              });
            }
          }
          let objectReturn: object | string = {
            level: logObject.level,
            levelCode: ELogLevelCodeType[logObject.level] || 'n/a',
            message: logObject.message?.trim(),
            functionName: process.env.AWS_LAMBDA_FUNCTION_NAME ?? 'NOT-LAMBDA',
            ...meta,
          };

          try {
            objectReturn = JSON.stringify(
              {
                ...objectReturn,
              },
              (_key, value) => {
                return ['string', 'number'].includes(typeof value)
                  ? this.filterProtectedDateAndBase64(value.toString())
                  : value;
              },
            );
          } catch (err) {
            // eslint-disable-next-line no-console
            console.warn(`[${new Date().toISOString()}] [WARN]: `, {
              level: 'warn',
              levelCode: '0',
              message: `Erro ao fazer o JSON.parser  - ${
                err?.message || 'Desconhecido'
              }`,
              functionName:
                process.env.AWS_LAMBDA_FUNCTION_NAME ?? 'NOT-LAMBDA',
            });
          }

          return `[${
            logObject.timestamp
          }] [${logObject.level.toUpperCase()}]: ${objectReturn}`;
        }),
      ),
      transports: [
        new transports.Console({
          level: 'info',
          handleExceptions: false,
        }),
      ],
      exitOnError: false,
    });
  }

  private filterProtectedDateAndBase64(data: string): string {
    data = data.replace(/[A-Za-z0-9/+]{500,}[=*]?/g, '<BASE64>');
    this.privateData.forEach((protectedData) => {
      const reg = new RegExp(protectedData, 'g');
      data = data.replace(reg, '<PRIVATE DATA>');
    });
    return data;
  }
}
