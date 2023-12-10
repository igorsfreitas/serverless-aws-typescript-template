import { injectable } from 'tsyringe';
import { IAccountEntity } from '@modules/delete-schedule/interfaces/account.entity.interface';
import { Column, Entity } from '@decorators/postgre-db.decorator';
import { PGBaseEntity } from '@modules/shared/entities/pg-base.entity';

@Entity('core_banking', 'Account')
@injectable()
export class AccountEntity extends PGBaseEntity implements IAccountEntity {
  @Column({ type: 'number' })
  public Branch: number;

  @Column({ type: 'number' })
  public Number: number;

  @Column({ type: 'string' })
  public TypePerson: string;

  @Column({ type: 'string' })
  public Type: string;

  @Column({ type: 'boolean' })
  public Status: boolean;

  @Column({ type: 'date' })
  public deletedAt: Date | null;
}
