import Database from '../database/connection';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types/todo';

export class TodoModel {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  // 获取所有待办事项
  async findAll(): Promise<Todo[]> {
    const query = `
      SELECT id, description, completed, created_at, updated_at 
      FROM todos 
      ORDER BY created_at DESC
    `;
    const result = await this.db.query(query);
    return result.rows;
  }

  // 根据ID获取待办事项
  async findById(id: number): Promise<Todo | null> {
    const query = `
      SELECT id, description, completed, created_at, updated_at 
      FROM todos 
      WHERE id = $1
    `;
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  // 创建新待办事项
  async create(data: CreateTodoRequest): Promise<Todo> {
    const query = `
      INSERT INTO todos (description, completed) 
      VALUES ($1, $2) 
      RETURNING id, description, completed, created_at, updated_at
    `;
    const result = await this.db.query(query, [data.description, false]);
    return result.rows[0];
  }

  // 更新待办事项
  async update(id: number, data: UpdateTodoRequest): Promise<Todo | null> {
    // 构建动态更新查询
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(data.description);
      paramCount++;
    }

    if (data.completed !== undefined) {
      updates.push(`completed = $${paramCount}`);
      values.push(data.completed);
      paramCount++;
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE todos 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount} 
      RETURNING id, description, completed, created_at, updated_at
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  // 删除待办事项
  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM todos WHERE id = $1 RETURNING id`;
    const result = await this.db.query(query, [id]);
    return result.rowCount > 0;
  }

  // 切换完成状态
  async toggleCompleted(id: number): Promise<Todo | null> {
    const query = `
      UPDATE todos 
      SET completed = NOT completed 
      WHERE id = $1 
      RETURNING id, description, completed, created_at, updated_at
    `;
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  // 获取统计信息
  async getStats(): Promise<{ total: number; completed: number; pending: number }> {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE completed = true) as completed,
        COUNT(*) FILTER (WHERE completed = false) as pending
      FROM todos
    `;
    const result = await this.db.query(query);
    return {
      total: parseInt(result.rows[0].total),
      completed: parseInt(result.rows[0].completed),
      pending: parseInt(result.rows[0].pending)
    };
  }
}

export default new TodoModel();