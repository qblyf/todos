-- 创建数据库设置脚本
-- 使用方法: psql -U postgres -f scripts/setup-database.sql

-- 创建开发数据库
DROP DATABASE IF EXISTS todo_management;
CREATE DATABASE todo_management;

-- 创建测试数据库
DROP DATABASE IF EXISTS todo_management_test;
CREATE DATABASE todo_management_test;

-- 连接到开发数据库
\c todo_management;

-- 创建待办事项表
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  description VARCHAR(500) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器
DROP TRIGGER IF EXISTS update_todos_updated_at ON todos;
CREATE TRIGGER update_todos_updated_at 
    BEFORE UPDATE ON todos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);

-- 插入示例数据
INSERT INTO todos (description, completed) VALUES 
  ('学习 TypeScript 和 Node.js', false),
  ('完成待办事项管理项目', false),
  ('编写项目文档', false),
  ('代码审查和优化', true),
  ('部署到生产环境', false)
ON CONFLICT DO NOTHING;

-- 连接到测试数据库并创建相同的表结构
\c todo_management_test;

CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  description VARCHAR(500) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_todos_updated_at ON todos;
CREATE TRIGGER update_todos_updated_at 
    BEFORE UPDATE ON todos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);

-- 完成提示
\echo '✅ 数据库设置完成！'
\echo '开发数据库: todo_management'
\echo '测试数据库: todo_management_test'