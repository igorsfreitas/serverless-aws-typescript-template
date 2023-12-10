import { IPGBaseEntity } from '@modules/shared/interfaces/pg-base.entity.interface';

export interface IAccountEntity extends IPGBaseEntity {
  Branch: number;
  Number: number;
  TypePerson: string;
  Type: string;
  Status: boolean;
}
