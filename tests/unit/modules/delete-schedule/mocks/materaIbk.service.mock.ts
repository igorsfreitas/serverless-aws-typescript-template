import { IMateraIbkService } from '@modules/shared/matera/interfaces/materaIbk.interface';

export const MateraIbkServiceMock: jest.Mocked<IMateraIbkService> = {
  getToken: jest.fn(),
  postDeleteTed: jest.fn(),
};
