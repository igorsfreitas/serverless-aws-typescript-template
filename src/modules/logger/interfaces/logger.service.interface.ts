interface ILoggerServiceOutput {
  error(message: string, ...description: object[]): void;
  warn(message: string, ...description: object[]): void;
  info(message: string, ...description: object[]): void;
  http(message: string, ...description: object[]): void;
  debug(message: string, ...description: object[]): void;
}

export interface ILoggerService {
  debug(message: string, ...description: any[]): void;
  error(message: string, ...description: any[]): void;
  info(message: string, ...description: any[]): void;
  warn(message: string, ...description: any[]): void;
  http(message: string, ...description: any[]): void;
  protectString(data: string): string;
  protectArrayOfStrings(...data: Array<string | null | undefined>): void;
  getLogger(): ILoggerServiceOutput;
}
