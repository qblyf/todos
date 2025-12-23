#!/bin/bash

echo "🔍 服务器诊断脚本"
echo "=================="

echo ""
echo "📁 当前目录："
pwd

echo ""
echo "🔄 Git 状态："
git status --porcelain
git log --oneline -5

echo ""
echo "📄 HTML 文件内容（前20行）："
head -20 frontend/index.html

echo ""
echo "🔍 检查 Tailwind CDN："
if grep -q "cdn.tailwindcss.com" frontend/index.html; then
    echo "❌ 发现 Tailwind CDN 引用"
    grep -n "cdn.tailwindcss.com" frontend/index.html
else
    echo "✅ 没有 Tailwind CDN 引用"
fi

echo ""
echo "🔍 检查脚本引用："
grep -n "main.js" frontend/index.html

echo ""
echo "📦 检查 JS 文件："
ls -la frontend/js/main.js
ls -la frontend/js/api/client.js

echo ""
echo "🔍 检查 API 配置："
head -5 frontend/js/api/client.js

echo ""
echo "🔄 PM2 状态："
pm2 status

echo ""
echo "🌐 测试本地 API："
curl -s http://localhost:3000/health || echo "❌ API 连接失败"

echo ""
echo "📊 文件时间戳："
stat frontend/index.html
stat frontend/js/main.js
stat frontend/js/api/client.js