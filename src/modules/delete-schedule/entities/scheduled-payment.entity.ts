import { injectable } from 'tsyringe';
import {
  IBankPaymentSlip,
  IScheduledPaymentEntity,
} from '../interfaces/scheduled-payment.entity.interface';
import { Column, Entity } from '@decorators/postgre-db.decorator';

@Entity('core_banking', 'ScheduledPayment')
@injectable()
export class ScheduledPaymentEntity implements IScheduledPaymentEntity {
  @Column({ primaryKey: true, type: 'string' })
  public Id: string;

  @Column({ type: 'string' })
  public IdAccount: string;

  @Column({ type: 'date' })
  public ScheduledDate: Date;

  @Column({ type: 'json' })
  public BankPaymentSlip: IBankPaymentSlip;

  @Column({ type: 'date' })
  public createdAt: Date;

  @Column({ type: 'date' })
  public updatedAt: Date;

  @Column({ type: 'date' })
  public deletedAt: Date | null;
}
