import { IScheduledPaymentEntity } from '@modules/delete-schedule/interfaces/scheduled-payment.entity.interface';
import { IPostgreSQLRepository } from '@modules/shared/repositories/interfaces/postgre.repository.interface';

export const scheduledPaymentRepositoryMock: jest.Mocked<
  IPostgreSQLRepository<IScheduledPaymentEntity>
> = {
  create: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
};
