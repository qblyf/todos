// 前端 Todo 类型定义（与后端保持一致）
export interface Todo {
  id: number;
  description: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTodoRequest {
  description: string;
}

export interface UpdateTodoRequest {
  description?: string;
  completed?: boolean;
}

// 前端特有的类型
export interface TodoAppState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
}