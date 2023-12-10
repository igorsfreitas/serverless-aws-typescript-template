import { inject, singleton } from 'tsyringe';
import { ILoggerService } from '../interfaces/logger.service.interface';
import { WinstonService } from '@modules/winston/implementations/winston.service';
import { ELogLevelType } from '@modules/winston/enums/logger.enum';
import {
  IGetLoggerOutput,
  IWinstonService,
} from '@modules/winston/interfaces/winston.service.interface';

@singleton()
export class LoggerService implements ILoggerService {
  constructor(
    @inject(WinstonService)
    private readonly logger: IWinstonService,
  ) {}

  public protectString(data: string): string {
    this.logger.protectData(data);
    return data;
  }

  public protectArrayOfStrings(
    ...data: Array<string | null | undefined>
  ): void {
    const values = data.filter(
      (value) => typeof value === 'string',
    ) as string[];
    this.logger.protectData(...values);
  }

  // Não utilizar sem proteção try...catch
  public getLogger(): IGetLoggerOutput {
    return this.logger.getLogger();
  }

  public error(message = '', ...description: any[]): void {
    this.logger.log({
      message,
      level: ELogLevelType.ERROR,
      description: { meta: description },
    });
  }

  public warn(message = '', ...description: any[]): void {
    this.logger.log({
      message,
      level: ELogLevelType.WARN,
      description: { meta: description },
    });
  }

  public info(message = '', ...description: any[]): void {
    this.logger.log({
      message,
      level: ELogLevelType.INFO,
      description: { meta: description },
    });
  }

  public http(message = '', ...description: any[]): void {
    this.logger.log({
      message,
      level: ELogLevelType.HTTP,
      description: { meta: description },
    });
  }

  public debug(message = '', ...description: any[]): void {
    this.logger.log({
      message,
      level: ELogLevelType.DEBUG,
      description: { meta: description },
    });
  }
}
