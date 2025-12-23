import { Request, Response } from 'express';
import { AppError } from '../middleware/errorHandler';
import { asyncHandler } from '../middleware/validation';
import TodoModel from '../models/todo';
import { CreateTodoRequest, UpdateTodoRequest } from '../types/todo';

export class TodoController {
  // 获取所有待办事项
  getAllTodos = asyncHandler(async (req: Request, res: Response) => {
    const todos = await TodoModel.findAll();
    res.json({
      success: true,
      data: todos,
      count: todos.length
    });
  });

  // 根据ID获取待办事项
  getTodoById = asyncHandler(async (req: Request, res: Response) => {
    const id = (req as any).todoId;
    const todo = await TodoModel.findById(id);
    
    if (!todo) {
      throw new AppError('待办事项未找到', 404, 'TODO_NOT_FOUND');
    }

    res.json({
      success: true,
      data: todo
    });
  });

  // 创建新待办事项
  createTodo = asyncHandler(async (req: Request, res: Response) => {
    const data: CreateTodoRequest = req.body;
    const todo = await TodoModel.create(data);
    
    res.status(201).json({
      success: true,
      data: todo,
      message: '待办事项创建成功'
    });
  });

  // 更新待办事项
  updateTodo = asyncHandler(async (req: Request, res: Response) => {
    const id = (req as any).todoId;
    const data: UpdateTodoRequest = req.body;
    
    const todo = await TodoModel.update(id, data);
    
    if (!todo) {
      throw new AppError('待办事项未找到', 404, 'TODO_NOT_FOUND');
    }

    res.json({
      success: true,
      data: todo,
      message: '待办事项更新成功'
    });
  });

  // 删除待办事项
  deleteTodo = asyncHandler(async (req: Request, res: Response) => {
    const id = (req as any).todoId;
    
    const deleted = await TodoModel.delete(id);
    
    if (!deleted) {
      throw new AppError('待办事项未找到', 404, 'TODO_NOT_FOUND');
    }

    res.json({
      success: true,
      message: '待办事项删除成功'
    });
  });

  // 切换完成状态
  toggleTodo = asyncHandler(async (req: Request, res: Response) => {
    const id = (req as any).todoId;
    
    const todo = await TodoModel.toggleCompleted(id);
    
    if (!todo) {
      throw new AppError('待办事项未找到', 404, 'TODO_NOT_FOUND');
    }

    res.json({
      success: true,
      data: todo,
      message: `待办事项已${todo.completed ? '完成' : '重新激活'}`
    });
  });

  // 获取统计信息
  getStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await TodoModel.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  });
}

export default new TodoController();