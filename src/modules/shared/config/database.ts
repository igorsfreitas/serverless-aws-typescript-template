import { HelperService } from '@modules/shared/services/helper.service';
import pgPromise from 'pg-promise';

const pgp = pgPromise();

async function databaseConnection() {
  const {
    APP_DB_NAME,
    APP_DB_HOST,
    APP_DB_PASSWORD,
    APP_DB_PORT,
    APP_DB_USER,
  } = await HelperService.getSSMEnvironments();

  const db = pgp({
    host: APP_DB_HOST,
    port: APP_DB_PORT,
    database: APP_DB_NAME,
    user: APP_DB_USER,
    password: APP_DB_PASSWORD,
  });

  return db;
}

export default databaseConnection;
