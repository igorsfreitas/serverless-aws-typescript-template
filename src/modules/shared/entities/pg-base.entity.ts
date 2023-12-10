import { Column } from '@decorators/postgre-db.decorator';
import { IPGBaseEntity } from '../interfaces/pg-base.entity.interface';

export class PGBaseEntity implements IPGBaseEntity {
  @Column({ primaryKey: true, type: 'string' })
  public Id: string;

  @Column({ type: 'date' })
  public createdAt: Date;

  @Column({ type: 'date' })
  public updatedAt: Date;

  @Column({ type: 'date' })
  public deletedAt: Date | null;
}
