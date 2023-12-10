import { ILoggerService } from '@modules/logger/interfaces/logger.service.interface';

export const loggerMocked: jest.Mocked<ILoggerService> = {
  debug: jest.fn(),
  error: jest.fn(),
  getLogger: jest.fn(),
  http: jest.fn(),
  info: jest.fn(),
  protectArrayOfStrings: jest.fn(),
  protectString: jest.fn(),
  warn: jest.fn(),
};
