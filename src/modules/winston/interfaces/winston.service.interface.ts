import { ELogLevelType } from '../enums/logger.enum';

export interface ILogInput<O = any> {
  description: O;
  level: ELogLevelType;
  message: string;
  stack?: string;
}

export interface IGetLoggerOutput {
  error: (message: string, ...description: any[]) => void;
  warn: (message: string, ...description: any[]) => void;
  info: (message: string, ...description: any[]) => void;
  http: (message: string, ...description: any[]) => void;
  debug: (message: string, ...description: any[]) => void;
}

export interface IWinstonService {
  log<O = any>({ level, description, message, stack }: ILogInput<O>): void;
  getLogger(): IGetLoggerOutput;
  protectData(...data: Array<string | number>): void;
  clearProtectData(): void;
}
