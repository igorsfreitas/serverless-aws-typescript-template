import { IAccountEntity } from '@modules/delete-schedule/interfaces/account.entity.interface';
import { IPostgreSQLRepository } from '@modules/shared/repositories/interfaces/postgre.repository.interface';

export const accountRepositoryMock: jest.Mocked<
  IPostgreSQLRepository<IAccountEntity>
> = {
  create: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
};
