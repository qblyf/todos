import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { CreateTodoRequest, UpdateTodoRequest } from '../types/todo';

// 验证创建待办事项请求
export const validateCreateTodo = (req: Request, res: Response, next: NextFunction): void => {
  const { description }: CreateTodoRequest = req.body;

  if (!description) {
    throw new AppError('任务描述不能为空', 400, 'MISSING_DESCRIPTION');
  }

  if (typeof description !== 'string') {
    throw new AppError('任务描述必须是字符串', 400, 'INVALID_DESCRIPTION_TYPE');
  }

  // 检查是否为空白字符串
  if (description.trim().length === 0) {
    throw new AppError('任务描述不能为空白字符', 400, 'EMPTY_DESCRIPTION');
  }

  if (description.length > 500) {
    throw new AppError('任务描述不能超过500个字符', 400, 'DESCRIPTION_TOO_LONG');
  }

  // 清理描述（去除首尾空白）
  req.body.description = description.trim();
  next();
};

// 验证更新待办事项请求
export const validateUpdateTodo = (req: Request, res: Response, next: NextFunction): void => {
  const { description, completed }: UpdateTodoRequest = req.body;

  // 至少需要提供一个字段
  if (description === undefined && completed === undefined) {
    throw new AppError('至少需要提供 description 或 completed 字段', 400, 'NO_UPDATE_FIELDS');
  }

  // 验证描述字段
  if (description !== undefined) {
    if (typeof description !== 'string') {
      throw new AppError('任务描述必须是字符串', 400, 'INVALID_DESCRIPTION_TYPE');
    }

    if (description.trim().length === 0) {
      throw new AppError('任务描述不能为空白字符', 400, 'EMPTY_DESCRIPTION');
    }

    if (description.length > 500) {
      throw new AppError('任务描述不能超过500个字符', 400, 'DESCRIPTION_TOO_LONG');
    }

    // 清理描述
    req.body.description = description.trim();
  }

  // 验证完成状态字段
  if (completed !== undefined && typeof completed !== 'boolean') {
    throw new AppError('完成状态必须是布尔值', 400, 'INVALID_COMPLETED_TYPE');
  }

  next();
};

// 验证ID参数
export const validateTodoId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;

  if (!id) {
    throw new AppError('缺少待办事项ID', 400, 'MISSING_TODO_ID');
  }

  const todoId = parseInt(id, 10);
  if (isNaN(todoId) || todoId <= 0) {
    throw new AppError('待办事项ID必须是正整数', 400, 'INVALID_TODO_ID');
  }

  // 将解析后的ID添加到请求对象
  (req as any).todoId = todoId;
  next();
};

// 通用异步错误处理包装器
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};