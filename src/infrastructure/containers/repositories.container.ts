import { loggerService } from '@infrastructure/constants/services.constants';

import { AccountEntity } from '@modules/delete-schedule/entities/account.entity';
import { IAccountEntity } from '@modules/delete-schedule/interfaces/account.entity.interface';

import { ScheduledPaymentEntity } from '@modules/delete-schedule/entities/scheduled-payment.entity';
import { IScheduledPaymentEntity } from '@modules/delete-schedule/interfaces/scheduled-payment.entity.interface';

import { PostgreSQLRepository } from '@modules/shared/repositories/implementations/postgresql.repository';
import { IPostgreSQLRepository } from '@modules/shared/repositories/interfaces/postgre.repository.interface';

import { IScheduledPixEntity } from '@modules/delete-schedule/interfaces/scheduled-pix.entity.interface';
import { ScheduledPixEntity } from '@modules/delete-schedule/entities/scheduled-pix.entity';

import { container } from 'tsyringe';

container.register<IPostgreSQLRepository<IAccountEntity>>(AccountEntity.name, {
  useValue: new PostgreSQLRepository(AccountEntity, loggerService),
});

container.register<IPostgreSQLRepository<IScheduledPaymentEntity>>(
  ScheduledPaymentEntity.name,
  {
    useValue: new PostgreSQLRepository(ScheduledPaymentEntity, loggerService),
  },
);

container.register<IPostgreSQLRepository<IScheduledPixEntity>>(
  ScheduledPixEntity.name,
  {
    useValue: new PostgreSQLRepository(ScheduledPixEntity, loggerService),
  },
);

export { container };
