import { Todo, CreateTodoRequest, UpdateTodoRequest, ApiResponse } from '../types/todo.js';

const API_BASE_URL = 'http://localhost:3000/api';

class ApiClient {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || {
            message: `HTTP ${response.status}: ${response.statusText}`,
            code: 'HTTP_ERROR'
          }
        };
      }

      return { data: data.data || data };
    } catch (error) {
      console.error('API请求失败:', error);
      return {
        error: {
          message: error instanceof Error ? error.message : '网络请求失败',
          code: 'NETWORK_ERROR'
        }
      };
    }
  }

  // 获取所有待办事项
  async getAllTodos(): Promise<ApiResponse<Todo[]>> {
    return this.request<Todo[]>('/todos');
  }

  // 根据ID获取待办事项
  async getTodoById(id: number): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/todos/${id}`);
  }

  // 创建新待办事项
  async createTodo(data: CreateTodoRequest): Promise<ApiResponse<Todo>> {
    return this.request<Todo>('/todos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 更新待办事项
  async updateTodo(id: number, data: UpdateTodoRequest): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // 删除待办事项
  async deleteTodo(id: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/todos/${id}`, {
      method: 'DELETE',
    });
  }

  // 切换完成状态
  async toggleTodo(id: number): Promise<ApiResponse<Todo>> {
    return this.request<Todo>(`/todos/${id}/toggle`, {
      method: 'PATCH',
    });
  }

  // 获取统计信息
  async getStats(): Promise<ApiResponse<{ total: number; completed: number; pending: number }>> {
    return this.request<{ total: number; completed: number; pending: number }>('/todos/stats');
  }
}

export default new ApiClient();