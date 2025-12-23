#!/bin/bash

echo "🔧 修复服务器部署问题..."

# 1. 构建生产版本
echo "📦 构建生产版本..."
NODE_ENV=production npm run build

# 2. 提交更改
echo "📤 提交更改到 Git..."
git add .
git commit -m "修复生产环境部署：使用生产版本HTML，修复静态文件路径"
git push origin main

echo "✅ 本地修复完成！"
echo ""
echo "🚀 现在在服务器上执行以下命令："
echo ""
echo "cd /www/wwwroot/todos.ipoo.fun"
echo "git pull origin main"
echo "NODE_ENV=production npm run build"
echo ""
echo "📋 然后在宝塔面板中更新 Nginx 配置："
echo ""
cat << 'EOF'
server {
    listen 80;
    server_name todos.ipoo.fun;
    
    # 前端静态文件目录
    root /www/wwwroot/todos.ipoo.fun/frontend;
    index index.html;
    
    # 静态文件直接服务（重要！）
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|map)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
    
    # API 代理到后端
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # 前端路由（SPA）
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 日志
    access_log /www/wwwroot/todos.ipoo.fun/logs/access.log;
    error_log /www/wwwroot/todos.ipoo.fun/logs/error.log;
    
    # 安全配置
    location ~ /\. {
        deny all;
    }
    
    location ~* \.(env|log|sql)$ {
        deny all;
    }
}
EOF
echo ""
echo "💡 保存 Nginx 配置后，重载 Nginx：systemctl reload nginx"