#!/bin/bash

echo "🚀 启动待办事项管理系统..."

# 检查PostgreSQL是否可用
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL未找到，请先安装PostgreSQL"
    echo "📖 安装指南："
    echo "1. 访问 https://www.postgresql.org/download/macosx/"
    echo "2. 下载并安装PostgreSQL 15+"
    echo "3. 将PostgreSQL添加到PATH：export PATH=\"/Library/PostgreSQL/15/bin:\$PATH\""
    exit 1
fi

echo "✅ PostgreSQL已找到"

# 检查PostgreSQL服务是否运行
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "⚠️  PostgreSQL服务未运行，尝试启动..."
    
    # 尝试不同的启动方法
    if command -v brew &> /dev/null; then
        brew services start postgresql@15 || brew services start postgresql
    else
        echo "请手动启动PostgreSQL服务"
        echo "或运行: sudo -u postgres pg_ctl start -D /usr/local/var/postgres"
    fi
    
    # 等待服务启动
    sleep 3
    
    if ! pg_isready -h localhost -p 5432 &> /dev/null; then
        echo "❌ 无法启动PostgreSQL服务，请手动启动"
        exit 1
    fi
fi

echo "✅ PostgreSQL服务正在运行"

# 设置数据库
echo "🗄️  设置数据库..."
npm run db:setup

if [ $? -eq 0 ]; then
    echo "✅ 数据库设置完成"
else
    echo "⚠️  数据库设置可能失败，但继续启动应用..."
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

# 启动应用
echo "🚀 启动应用..."
echo "前端将在 http://localhost:3001 启动"
echo "后端将在 http://localhost:3000 启动"
echo ""
npm run dev