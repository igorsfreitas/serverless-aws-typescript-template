import { LoggerService } from '@modules/logger/implementations/logger.service';
import { container } from 'tsyringe';

export const loggerService = container.resolve(LoggerService);
