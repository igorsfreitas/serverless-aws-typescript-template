import { DeleteScheduleController } from '@modules/delete-schedule/implementations/delete-schedule.controller';
import { deleteScheduleMock } from './mocks/delete-schedule.service.mock';

describe(DeleteScheduleController.name, () => {
  let controller: DeleteScheduleController;

  beforeEach(() => {
    controller = new DeleteScheduleController(deleteScheduleMock);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
