import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import Database from './database/connection';
import todoRoutes from './routes/todos';

// 加载环境变量
dotenv.config();

const app = express();

// 中间件配置
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3001', 'http://127.0.0.1:3001'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 静态文件服务 - 提供前端文件
app.use(express.static(path.join(__dirname, '../frontend')));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API 路由
app.use('/api/todos', todoRoutes);

// 前端路由 - 提供主页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 404 处理
app.use(notFoundHandler);

// 错误处理中间件
app.use(errorHandler);

// 初始化数据库连接
export const initializeApp = async (): Promise<void> => {
  try {
    const db = Database.getInstance();
    await db.testConnection();
    await db.initializeTables();
    console.log('✅ 应用初始化完成');
  } catch (error) {
    console.error('❌ 应用初始化失败:', error);
    throw error;
  }
};

export default app;