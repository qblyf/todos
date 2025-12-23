#!/bin/bash

# 待办事项管理系统启动脚本

echo "🚀 启动待办事项管理系统..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

# 检查PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ 错误: 未找到 PostgreSQL，请先安装 PostgreSQL"
    exit 1
fi

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "⚙️  创建环境配置文件..."
    cp .env.example .env
    echo "请编辑 .env 文件配置数据库连接信息"
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

# 设置数据库（如果需要）
read -p "是否需要设置数据库？(y/N): " setup_db
if [[ $setup_db =~ ^[Yy]$ ]]; then
    echo "🗄️  设置数据库..."
    npm run db:setup
fi

echo "✅ 启动完成！"
echo ""
echo "开发模式运行: npm run dev"
echo "生产模式运行: npm start"
echo ""
echo "前端地址: http://localhost:3001"
echo "后端地址: http://localhost:3000"