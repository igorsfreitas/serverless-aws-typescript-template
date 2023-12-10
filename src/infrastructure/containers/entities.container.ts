import { ScheduledPaymentEntity } from '@modules/delete-schedule/entities/scheduled-payment.entity';
import { IScheduledPaymentEntity } from '@modules/delete-schedule/interfaces/scheduled-payment.entity.interface';

import { AccountEntity } from '@modules/delete-schedule/entities/account.entity';
import { IAccountEntity } from '@modules/delete-schedule/interfaces/account.entity.interface';

import { ScheduledPixEntity } from '@modules/delete-schedule/entities/scheduled-pix.entity';
import { IScheduledPixEntity } from '@modules/delete-schedule/interfaces/scheduled-pix.entity.interface';

import { container } from 'tsyringe';

container.registerSingleton<IAccountEntity>(AccountEntity.name, AccountEntity);

container.registerSingleton<IScheduledPaymentEntity>(
  ScheduledPaymentEntity.name,
  ScheduledPaymentEntity,
);

container.registerSingleton<IScheduledPixEntity>(
  ScheduledPixEntity.name,
  ScheduledPixEntity,
);

export { container };
