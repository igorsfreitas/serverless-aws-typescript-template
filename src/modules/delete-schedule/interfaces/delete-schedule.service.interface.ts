import { DeleteSchedulePaymentDto } from '../dtos/delete-schedule-payments.dto';
import { IScheduledPaymentEntity } from './scheduled-payment.entity.interface';
import { UpdateDeleteScheduleDto } from '../dtos/update-delete-schedule.dto';

export interface IDeleteScheduleService {
  findOne(id: string): Promise<IScheduledPaymentEntity | null>;
  update(request: UpdateDeleteScheduleDto): Promise<void>;
  remove(request: DeleteSchedulePaymentDto): Promise<boolean>;
}
