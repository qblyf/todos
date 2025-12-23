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

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
}

export interface ErrorResponse {
  error: {
    message: string;
    code: string;
    details?: any;
  };
  timestamp: string;
  path: string;
}