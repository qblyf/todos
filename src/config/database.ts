import { DatabaseConfig } from '../types/todo';

export const getDatabaseConfig = (): DatabaseConfig => {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.NODE_ENV === 'test' 
      ? process.env.TEST_DB_NAME || 'todo_management_test'
      : process.env.DB_NAME || 'todo_management',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: process.env.NODE_ENV === 'production'
  };
};