import { TypeOrmModuleOptions } from '@nestjs/typeorm';



export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3307,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'base',
  entities: ['**/*.entity{ .ts,.js}'],
  synchronize: true,  // Set to false in production
  logging: false,
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsTableName:'typeorm_migrations',
  migrationsRun: false,
  legacySpatialSupport: false,
};
