import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types/todo';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR', details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'AppError';
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = '服务器内部错误';
  let details: any = undefined;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    code = error.code;
    message = error.message;
    details = error.details;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = '请求数据验证失败';
    details = error.message;
  } else if (error.message.includes('duplicate key')) {
    statusCode = 409;
    code = 'DUPLICATE_ERROR';
    message = '数据已存在';
  } else if (error.message.includes('not found')) {
    statusCode = 404;
    code = 'NOT_FOUND';
    message = '资源未找到';
  }

  // 记录错误日志
  console.error(`[${new Date().toISOString()}] ${statusCode} ${code}: ${message}`, {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    details
  });

  const errorResponse: ErrorResponse = {
    error: {
      message,
      code,
      details
    },
    timestamp: new Date().toISOString(),
    path: req.path
  };

  res.status(statusCode).json(errorResponse);
};

// 404 处理中间件
export const notFoundHandler = (req: Request, res: Response): void => {
  const errorResponse: ErrorResponse = {
    error: {
      message: `路由 ${req.method} ${req.path} 未找到`,
      code: 'ROUTE_NOT_FOUND'
    },
    timestamp: new Date().toISOString(),
    path: req.path
  };

  res.status(404).json(errorResponse);
};