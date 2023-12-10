import { IDeleteScheduleService } from '@modules/delete-schedule/interfaces/delete-schedule.service.interface';

export const deleteScheduleMock: jest.Mocked<IDeleteScheduleService> = {
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};
