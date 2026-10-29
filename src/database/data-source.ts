import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DataSource, DataSourceOptions } from 'typeorm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'lock',
  synchronize: false,
  entities: [__dirname + '/entities/**/*{.js,.ts}'],
  migrations: [__dirname + '/migrations/**/*{.js,.ts}'],
};

export const AppDataSource = new DataSource(databaseConfig);
