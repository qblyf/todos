#!/bin/bash

echo "🔧 修复 HTML DOM 结构..."

cd /www/wwwroot/todos.ipoo.fun

# 创建包含完整 DOM 结构的 HTML 文件
cat > frontend/index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>待办事项管理</title>
    <style>
        /* 内联 CSS 样式 */
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
            margin: 0.25rem;
        }
        .btn:hover { background: #5a67d8; }
        .btn-danger { background: #e74c3c; }
        .btn-danger:hover { background: #c0392b; }
        .btn-success { background: #27ae60; }
        .btn-success:hover { background: #229954; }
        .btn-sm { padding: 0.5rem 1rem; font-size: 0.875rem; }
        
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
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            text-align: center;
        }
        .stat-number { font-size: 1.5rem; font-weight: bold; }
        .stat-label { font-size: 0.875rem; opacity: 0.9; }
        
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
        
        .hidden { display: none; }
        .space-y-3 > * + * { margin-top: 0.75rem; }
        .mb-8 { margin-bottom: 2rem; }
        .py-12 { padding: 3rem 0; }
        .text-center { text-align: center; }
        .text-6xl { font-size: 3rem; }
        .text-xl { font-size: 1.25rem; }
        .font-semibold { font-weight: 600; }
        .text-gray-800 { color: #2d3748; }
        .text-gray-600 { color: #718096; }
        
        /* 通知样式 */
        .notification {
            position: fixed;
            top: 1rem;
            right: 1rem;
            background: white;
            border-radius: 0.5rem;
            padding: 1rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 300px;
        }
        .notification.success { border-left: 4px solid #27ae60; }
        .notification.error { border-left: 4px solid #e74c3c; }
    </style>
</head>
<body>
    <div id="app" class="container">
        <!-- 头部 -->
        <header class="header mb-8">
            <h1>📝 待办事项管理</h1>
            <p>简单高效的任务管理工具</p>
        </header>
        
        <!-- 统计信息 -->
        <div id="stats-section" class="mb-8">
            <!-- 统计卡片将通过 JavaScript 动态生成 -->
        </div>
        
        <!-- 主要内容区域 -->
        <main id="todo-app" class="main-card">
            <!-- 添加任务表单 -->
            <div id="todo-form-section" class="mb-8">
                <!-- 表单将通过 JavaScript 动态生成 -->
            </div>
            
            <!-- 任务列表 -->
            <div id="todo-list-section">
                <!-- 初始加载状态 -->
                <div id="loading-state" class="text-center py-12">
                    <div class="spinner"></div>
                    <p>加载中...</p>
                </div>
                
                <!-- 错误状态 -->
                <div id="error-state" class="hidden text-center py-12">
                    <div class="text-6xl mb-4">⚠️</div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">出现错误</h3>
                    <p id="error-message" class="text-gray-600 mb-4"></p>
                    <button id="retry-button" class="btn">
                        重试
                    </button>
                </div>
                
                <!-- 空状态 -->
                <div id="empty-state" class="hidden text-center py-12">
                    <div class="text-6xl mb-4">📋</div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">暂无待办事项</h3>
                    <p class="text-gray-600">添加您的第一个任务开始使用吧！</p>
                </div>
                
                <!-- 任务列表容器 -->
                <div id="todos-container" class="space-y-3">
                    <!-- 任务项将通过 JavaScript 动态生成 -->
                </div>
            </div>
        </main>
        
        <!-- 页脚 -->
        <footer class="text-center mt-8" style="color: white; margin-top: 2rem;">
            <p>&copy; 2024 待办事项管理系统 - 让生活更有条理</p>
        </footer>
    </div>

    <!-- 通知容器 -->
    <div id="notifications" style="position: fixed; top: 1rem; right: 1rem; z-index: 1000;">
        <!-- 通知将通过 JavaScript 动态生成 -->
    </div>

    <!-- JavaScript 模块 -->
    <script type="module" src="js/main.js?v=20251223-fixed"></script>
</body>
</html>
EOF

echo "✅ HTML 文件已更新，包含完整的 DOM 结构"

# 重载 Nginx 以清除缓存
systemctl reload nginx

echo "🔍 现在访问 http://todos.ipoo.fun 并强制刷新 (Ctrl+Shift+R)"