import { DeleteScheduleService } from '@modules/delete-schedule/implementations/delete-schedule.service';
import { accountRepositoryMock } from './mocks/account.mock';
import { scheduledPaymentRepositoryMock } from './mocks/scheduled-payment.mock';
import { loggerMocked } from './mocks/logger.mock';
import { scheduledPixRepositoryMock } from './mocks/scheduled-pix.mock';
import { MateraIbkServiceMock } from './mocks/materaIbk.service.mock';

describe(DeleteScheduleService.name, () => {
  let service: DeleteScheduleService;

  beforeEach(() => {
    service = new DeleteScheduleService(
      accountRepositoryMock,
      scheduledPaymentRepositoryMock,
      scheduledPixRepositoryMock,
      loggerMocked,
      MateraIbkServiceMock,
    );
    // inject mock dependences here
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
