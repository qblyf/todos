# 待办事项管理系统

一个简单高效的待办事项管理系统，使用现代技术栈构建。

## 技术栈

- **前端**: HTML5 + Tailwind CSS + TypeScript
- **后端**: Node.js + Express + TypeScript
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **测试**: Jest + fast-check (属性测试)

## 功能特性

- ✅ 添加新的待办事项
- ✅ 查看待办事项列表
- ✅ 标记任务完成/未完成
- ✅ 编辑任务描述
- ✅ 删除不需要的任务
- ✅ 响应式设计
- ✅ 实时数据同步

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 环境配置

1. 复制环境变量模板：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，配置数据库连接信息。

### 数据库设置

项目默认使用SQLite数据库，无需额外配置。首次运行时会自动创建数据库和表。

### 运行应用

#### 开发模式
```bash
npm run dev
```

这将同时启动：
- 后端服务器 (http://localhost:3000)
- 前端开发服务器 (http://localhost:3001)

#### 生产模式
```bash
npm run build
npm start
```

### 运行测试

```bash
# 运行所有测试
npm test

# 监听模式运行测试
npm run test:watch
```

## 项目结构

```
├── src/                    # 后端源码
│   ├── types/             # TypeScript 类型定义
│   ├── config/            # 配置文件
│   ├── database/          # 数据库相关
│   ├── models/            # 数据模型
│   ├── controllers/       # 控制器
│   ├── routes/            # 路由
│   ├── middleware/        # 中间件
│   ├── test/              # 测试配置
│   ├── app.ts             # Express 应用配置
│   └── server.ts          # 服务器启动文件
├── frontend/              # 前端源码
│   ├── src/               # TypeScript 源码
│   ├── js/                # 编译后的 JavaScript
│   └── index.html         # 主页面
├── dist/                  # 后端编译输出
└── coverage/              # 测试覆盖率报告
```

## API 接口

### 获取所有待办事项
```
GET /api/todos
```

### 创建新待办事项
```
POST /api/todos
Content-Type: application/json

{
  "description": "任务描述"
}
```

### 更新待办事项
```
PUT /api/todos/:id
Content-Type: application/json

{
  "description": "新的任务描述",
  "completed": true
}
```

### 删除待办事项
```
DELETE /api/todos/:id
```

## 开发指南

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 编写单元测试和属性测试
- 保持代码简洁和可读性

### 测试策略

项目采用双重测试方法：

1. **单元测试**: 验证特定功能和边界情况
2. **属性测试**: 使用 fast-check 验证通用属性

### 贡献指南

1. Fork 项目
2. 创建功能分支
3. 编写测试
4. 提交代码
5. 创建 Pull Request

## 许可证

MIT License
