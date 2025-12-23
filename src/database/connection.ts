import { Pool, PoolClient } from 'pg';
import { getDatabaseConfig } from '../config/database';

class Database {
  private pool: Pool;
  private static instance: Database;

  private constructor() {
    const config = getDatabaseConfig();
    this.pool = new Pool(config);
    
    // 处理连接错误
    this.pool.on('error', (err) => {
      console.error('数据库连接池错误:', err);
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  public async query(text: string, params?: any[]): Promise<any> {
    const client = await this.getClient();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }

  // 初始化数据库表
  public async initializeTables(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        description VARCHAR(500) NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createTriggerFunction = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `;

    const createTrigger = `
      DROP TRIGGER IF EXISTS update_todos_updated_at ON todos;
      CREATE TRIGGER update_todos_updated_at 
          BEFORE UPDATE ON todos 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column();
    `;

    try {
      await this.query(createTableQuery);
      await this.query(createTriggerFunction);
      await this.query(createTrigger);
      console.log('✅ 数据库表初始化完成');
    } catch (error) {
      console.error('❌ 数据库表初始化失败:', error);
      throw error;
    }
  }

  // 测试数据库连接
  public async testConnection(): Promise<boolean> {
    try {
      const result = await this.query('SELECT NOW()');
      console.log('✅ 数据库连接成功:', result.rows[0].now);
      return true;
    } catch (error) {
      console.error('❌ 数据库连接失败:', error);
      return false;
    }
  }
}

export default Database;