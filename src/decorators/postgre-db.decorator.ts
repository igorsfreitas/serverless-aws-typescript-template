import 'reflect-metadata';
import { EDBTypes } from './enum/db.enum';
import {
  DB_TYPE,
  PG_COLUMN,
  PG_DB_TABLE_NAME_KEY,
  PG_SCHEMA,
} from './constants/metadata.constants';

export function Entity(schema: string, tableName: string) {
  return (target: Function) => {
    Reflect.defineMetadata(PG_SCHEMA, schema, target);
    Reflect.defineMetadata(PG_DB_TABLE_NAME_KEY, tableName, target);
    Reflect.defineMetadata(DB_TYPE, EDBTypes.POSTGRESQL, target);
  };
}

export function Column(options: {
  primaryKey?: boolean;
  type: string; // Define o tipo de dados SQL (por exemplo, VARCHAR, INT, etc.)
}) {
  return (target: any, propertyKey: string) => {
    let columns = Reflect.getMetadata(PG_COLUMN, target);

    if (!columns) {
      columns = [];
      Reflect.defineMetadata(PG_COLUMN, columns, target);
    }

    columns.push({ propertyKey, ...options });
  };
}

export function getColumns(target: any): [{ [key: string]: any }] {
  return Reflect.getMetadata(PG_COLUMN, target) || [];
}

export function getTableName(target: any): string {
  return Reflect.getMetadata(PG_DB_TABLE_NAME_KEY, target);
}

export function getSchema(target: any): string {
  return Reflect.getMetadata(PG_SCHEMA, target);
}

export function getDbType(target: any): EDBTypes {
  return Reflect.getMetadata(DB_TYPE, target);
}
