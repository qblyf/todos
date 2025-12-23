# 快速开始指南

## 前置要求

- Node.js 18+ 
- PostgreSQL 15+
- npm 或 yarn

## 5分钟快速启动

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接：

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_management
DB_USER=postgres
DB_PASSWORD=your_password
```

### 3. 设置数据库

```bash
npm run db:setup
```

这将创建：
- `todo_management` 数据库（开发环境）
- `todo_management_test` 数据库（测试环境）
- 所需的表和触发器
- 一些示例数据

### 4. 启动应用

```bash
npm run dev
```

这将同时启动：
- 后端服务器：http://localhost:3000
- 前端应用：http://localhost:3001

### 5. 访问应用

打开浏览器访问：http://localhost:3001

## 常见问题

### 数据库连接失败

确保PostgreSQL正在运行：
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### 端口被占用

修改 `.env` 文件中的 `PORT` 配置：
```env
PORT=3001  # 改为其他端口
```

### 前端无法连接后端

检查 `frontend/src/api/client.ts` 中的 `API_BASE_URL` 配置是否正确。

## 开发命令

```bash
# 开发模式（热重载）
npm run dev

# 仅启动后端
npm run dev:backend

# 仅启动前端
npm run dev:frontend

# 构建项目
npm run build

# 运行测试
npm test

# 重置数据库
npm run db:reset
```

## 生产部署

```bash
# 1. 构建项目
npm run build

# 2. 设置生产环境变量
export NODE_ENV=production
export DB_HOST=your_production_host
export DB_NAME=your_production_db

# 3. 启动服务器
npm start
```

## API 测试

使用 curl 测试 API：

```bash
# 获取所有待办事项
curl http://localhost:3000/api/todos

# 创建新待办事项
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"description":"测试任务"}'

# 更新待办事项
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# 删除待办事项
curl -X DELETE http://localhost:3000/api/todos/1
```

## 下一步

- 查看 [README.md](README.md) 了解完整文档
- 查看 [API文档](#) 了解所有API端点
- 查看 [开发指南](#) 了解如何贡献代码

## 获取帮助

如果遇到问题：
1. 检查控制台错误信息
2. 查看日志文件
3. 提交 Issue

祝使用愉快！ 🎉