import AWS from 'aws-sdk';
import { inject } from 'tsyringe';
import {
  IPostgreSQLRepository,
  IQueryParams,
} from '../interfaces/postgre.repository.interface';
import { getSchema, getTableName } from '@decorators/postgre-db.decorator';
import { LoggerService } from '@modules/logger/implementations/logger.service';
import { ILoggerService } from '@modules/logger/interfaces/logger.service.interface';
import { TReflectPartialEntityProperties } from '@modules/shared/types/global.type';
import databaseConnection from '@modules/shared/config/database';

export class PostgreSQLRepository<T> implements IPostgreSQLRepository<T> {
  public readonly tableName: string;

  public readonly schemaName: string;

  public readonly dynamoDB: AWS.DynamoDB.DocumentClient;

  public readonly primaryKeys: string[];

  private db: any;

  constructor(
    EntityClass: new () => T,
    @inject(LoggerService.name)
    public readonly loggerService: ILoggerService,
  ) {
    this.tableName = getTableName(EntityClass);
    this.schemaName = getSchema(EntityClass);

    this.dynamoDB = new AWS.DynamoDB.DocumentClient();
  }

  private async connect() {
    this.db = await databaseConnection();
  }

  private async insert(props: TReflectPartialEntityProperties<T>) {
    try {
      const values = [];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_key, value] of Object.entries(props)) {
        if (value) {
          values.push(typeof value === 'string' ? `'${value}'` : value);
        }
      }

      const insertString = `INSERT INTO "${this.schemaName}"."${
        this.tableName
      }"(${Object.keys(props)
        .map((column) => `"${column}"`)
        .join(',')}) VALUES (${values
        .filter((value) => value && value !== '')
        .join(',')})`;

      await this.connect();
      const result = await this.db.any(insertString);

      return result;
    } catch (error) {
      // console.log(error);
      this.loggerService.error('Erro insert: ', error);
      throw error;
    }
  }

  private async query(queryParams: IQueryParams<T>) {
    try {
      let sqlSelectString;
      const sqlWhereString = [];

      const select = queryParams?.select;
      const where: any = queryParams?.where;

      if (select) {
        sqlSelectString = Object.keys(select)
          .map((column) => `"${column}"`)
          .join(',');
      }

      if (where) {
        for (const [key, value] of Object.entries(where)) {
          if (value) {
            sqlWhereString.push(
              `"${key}" = ${typeof value === 'string' ? `'${value}'` : value}`,
            );
          }
        }
      }

      const queryString = `SELECT ${
        !sqlSelectString ? '*' : sqlSelectString
      } FROM "${this.schemaName}"."${
        this.tableName
      }" WHERE ${sqlWhereString.join(' AND ')}`;

      await this.connect();
      const result = await this.db.any(queryString);

      return result;
    } catch (error) {
      // console.log(error);
      this.loggerService.error('Erro query: ', error);
      throw error;
    }
  }

  private async remove(entity: TReflectPartialEntityProperties<T>) {
    try {
      const sqlWhereString = [];

      if (entity) {
        for (const [key, value] of Object.entries(entity)) {
          if (value) {
            sqlWhereString.push(
              `"${key}" = ${typeof value === 'string' ? `'${value}'` : value}`,
            );
          }
        }
      }

      const queryString = `DELETE FROM "${this.schemaName}"."${
        this.tableName
      }" WHERE ${sqlWhereString.join(' AND ')}`;

      await this.connect();
      await this.db.any(queryString);
    } catch (error) {
      // console.log(error);
      this.loggerService.error('Erro delete: ', error);
    }
  }

  async create(entity: TReflectPartialEntityProperties<T>): Promise<any> {
    const response = this.insert(entity);

    return response;
  }

  /**
   * @param queryParams
   * @description query handler
   */
  find(queryParams: IQueryParams<T>) {
    const response = {
      getOne: async () => {
        const result = await this.query(queryParams);

        return result?.length ? result[0] : null;
      },
      getAll: async () => {
        const result = await this.query(queryParams);

        return result || [];
      },
    };

    return response;
  }

  async delete(entity: TReflectPartialEntityProperties<T>) {
    await this.remove(entity);
  }
}
