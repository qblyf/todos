#!/bin/bash

echo "🔧 强制更新服务器文件..."

# 在服务器上运行这个脚本
cd /www/wwwroot/todos.ipoo.fun

echo "1️⃣ 备份当前文件..."
cp frontend/index.html frontend/index.html.backup

echo "2️⃣ 强制拉取最新代码..."
git fetch origin
git reset --hard origin/main

echo "3️⃣ 清理并重新构建..."
rm -rf frontend/js/*
rm -rf dist/*
NODE_ENV=production npm run build

echo "4️⃣ 手动创建正确的 HTML 文件..."
cat > frontend/index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>待办事项管理</title>
    <style>
        /* 内联 CSS 样式 - 避免外部依赖 */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 2rem; 
        }
        .header { 
            text-align: center; 
            margin-bottom: 2rem; 
            color: white;
        }
        .header h1 { 
            font-size: 2.5rem; 
            margin-bottom: 0.5rem; 
        }
        .main-card { 
            background: white; 
            border-radius: 1rem; 
            padding: 2rem; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .loading { 
            text-align: center; 
            padding: 3rem; 
        }
        .spinner { 
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .error { 
            color: #e74c3c; 
            text-align: center; 
            padding: 2rem; 
        }
        .btn { 
            background: #667eea; 
            color: white; 
            border: none; 
            padding: 0.75rem 1.5rem; 
            border-radius: 0.5rem; 
            cursor: pointer; 
            font-size: 1rem;
        }
        .btn:hover { background: #5a67d8; }
        .form-group { margin-bottom: 1rem; }
        .form-input { 
            width: 100%; 
            padding: 0.75rem; 
            border: 2px solid #e2e8f0; 
            border-radius: 0.5rem; 
            font-size: 1rem;
        }
        .form-input:focus { 
            outline: none; 
            border-color: #667eea; 
        }
        .todo-item { 
            display: flex; 
            align-items: center; 
            padding: 1rem; 
            border: 1px solid #e2e8f0; 
            border-radius: 0.5rem; 
            margin-bottom: 0.5rem;
            background: #f8f9fa;
        }
        .todo-item.completed { opacity: 0.6; }
        .todo-item.completed .todo-text { text-decoration: line-through; }
        .todo-checkbox { margin-right: 1rem; }
        .todo-text { flex: 1; }
        .todo-actions { display: flex; gap: 0.5rem; }
        .btn-sm { padding: 0.5rem 1rem; font-size: 0.875rem; }
        .btn-danger { background: #e74c3c; }
        .btn-danger:hover { background: #c0392b; }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>📝 待办事项管理</h1>
            <p>简单高效的任务管理工具</p>
        </header>
        
        <main class="main-card">
            <div id="app">
                <div class="loading">
                    <div class="spinner"></div>
                    <p>加载中...</p>
                </div>
            </div>
        </main>
    </div>

    <script type="module" src="js/main.js?v=20251223-force"></script>
</body>
</html>
EOF

echo "5️⃣ 验证 API 配置..."
echo "API 配置内容："
head -5 frontend/js/api/client.js

echo "6️⃣ 重启 PM2 应用..."
pm2 restart todo-app

echo "7️⃣ 清理 Nginx 缓存..."
# 如果有 Nginx 缓存，清理它
if [ -d "/var/cache/nginx" ]; then
    rm -rf /var/cache/nginx/*
fi

echo "8️⃣ 重载 Nginx..."
systemctl reload nginx

echo "✅ 强制更新完成！"
echo ""
echo "🔍 验证步骤："
echo "1. 访问 http://todos.ipoo.fun"
echo "2. 按 Ctrl+Shift+R 强制刷新"
echo "3. 检查开发者工具 Network 标签"
echo "4. 确认加载了 main.js?v=20251223-force"
echo "5. 确认 API 请求发送到 /api/todos 而不是 localhost:3000"