import { IWinstonService } from '@modules/winston/interfaces/winston.service.interface';
import { WinstonService } from '@modules/winston/implementations/winston.service';

import { IDeleteScheduleService } from '@modules/delete-schedule/interfaces/delete-schedule.service.interface';
import { DeleteScheduleService } from '@modules/delete-schedule/implementations/delete-schedule.service';

import { ILoggerService } from '@modules/logger/interfaces/logger.service.interface';
import { LoggerService } from '@modules/logger/implementations/logger.service';

import { ICryptographyService } from '@modules/shared/interfaces/cryptography.service.interface';
import { CryptographyService } from '@modules/shared/services/cryptography.service';

import { ICacheService } from '@modules/shared/interfaces/cache.service.interface';
import { CacheService } from '@modules/shared/services/cache.service';

import { IMateraIbkService } from '@modules/shared/matera/interfaces/materaIbk.interface';
import { MateraIbkService } from '@modules/shared/matera/implementations/materaIbk.service';

import { container } from 'tsyringe';

container.registerSingleton<IWinstonService>(WinstonService);

container.registerSingleton<ILoggerService>(LoggerService.name, LoggerService);

container.registerSingleton<IDeleteScheduleService>(
  DeleteScheduleService.name,
  DeleteScheduleService,
);

container.registerSingleton<ICryptographyService>(
  CryptographyService.name,
  CryptographyService,
);

container.registerSingleton<ICacheService>(CacheService.name, CacheService);

container.registerSingleton<IMateraIbkService>(
  MateraIbkService.name,
  MateraIbkService,
);

export { container };
