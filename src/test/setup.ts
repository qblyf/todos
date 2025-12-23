// Jest 测试设置文件
import dotenv from 'dotenv';

// 加载测试环境变量
dotenv.config({ path: '.env.test' });

// 设置测试超时
jest.setTimeout(10000);

// 全局测试设置
beforeAll(async () => {
  // 这里可以添加全局测试设置，比如数据库连接
});

afterAll(async () => {
  // 这里可以添加全局清理逻辑
});