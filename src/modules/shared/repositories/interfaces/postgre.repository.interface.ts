import {
  TAcceptedEntityproperties,
  TReflectPartialEntityProperties,
} from '@modules/shared/types/global.type';

export interface IQueryParams<T> {
  select?: TAcceptedEntityproperties<T>;
  where:
    | TReflectPartialEntityProperties<T>
    | TReflectPartialEntityProperties<T>[];
}

export interface IPostgreSQLRepository<T> {
  create(entity: TReflectPartialEntityProperties<T>): Promise<any>;
  find(queryParams: IQueryParams<T>): {
    getOne: () => Promise<T>;
    getAll: () => Promise<T[]>;
  };
  delete(entity: TReflectPartialEntityProperties<T>): Promise<void>;
}
