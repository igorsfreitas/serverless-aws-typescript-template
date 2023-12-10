import { IHttpRequest } from '@modules/http/interfaces/requests.interface';
import { IScheduledPaymentEntity } from './scheduled-payment.entity.interface';

export interface IDeleteScheduleController {
  findOne(request: IHttpRequest): Promise<IScheduledPaymentEntity | null>;
  update(request: IHttpRequest): Promise<void>;
  remove(request: IHttpRequest): Promise<boolean>;
}
