import { ICacheService } from '@modules/shared/interfaces/cache.service.interface';

export const cacheServiceMocked: jest.Mocked<ICacheService> = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
};
