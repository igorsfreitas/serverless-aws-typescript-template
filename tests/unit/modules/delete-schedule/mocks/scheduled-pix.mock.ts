import { IScheduledPixEntity } from '@modules/delete-schedule/interfaces/scheduled-pix.entity.interface';
import { IPostgreSQLRepository } from '@modules/shared/repositories/interfaces/postgre.repository.interface';

export const scheduledPixRepositoryMock: jest.Mocked<
  IPostgreSQLRepository<IScheduledPixEntity>
> = {
  create: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
};
