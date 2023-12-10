import { injectable } from 'tsyringe';
import {
  IScheduledPixEntity,
  IPix,
} from '../interfaces/scheduled-pix.entity.interface';
import { Column, Entity } from '@decorators/postgre-db.decorator';

@Entity('core_banking', 'ScheduledPix')
@injectable()
export class ScheduledPixEntity implements IScheduledPixEntity {
  @Column({ primaryKey: true, type: 'string' })
  public Id: string;

  @Column({ type: 'string' })
  public IdAccount: string;

  @Column({ type: 'date' })
  public ScheduledDate: Date;

  @Column({ type: 'json' })
  public Pix: IPix;

  @Column({ type: 'date' })
  public createdAt: Date;

  @Column({ type: 'date' })
  public updatedAt: Date;

  @Column({ type: 'date' })
  public deletedAt: Date | null;
}
