# 宝塔面板部署指南

## 🚀 在宝塔面板部署 Todo 项目

### 前置条件
- 已安装宝塔面板的服务器
- 已安装 Nginx、Node.js、PM2
- 域名已解析到服务器

---

## 📋 部署步骤

### 1. 准备服务器环境

#### 安装 Node.js (在宝塔面板)
1. 进入宝塔面板
2. 软件商店 → 搜索 "Node.js" → 安装
3. 选择 Node.js 18.x 版本

#### 安装 PM2 (在宝塔面板)
1. 软件商店 → 搜索 "PM2" → 安装

### 2. 上传项目文件

#### 方法一：Git 克隆 (推荐)
```bash
# SSH 连接到服务器
cd /www/wwwroot
git clone https://github.com/qblyf/todos.git todos.ipoo.fun
cd todos.ipoo.fun
```

#### 方法二：文件管理器上传
1. 宝塔面板 → 文件 → 进入 `/www/wwwroot`
2. 新建文件夹 `todos.ipoo.fun`
3. 上传项目文件到该文件夹

### 3. 安装依赖和构建

```bash
cd /www/wwwroot/todos.ipoo.fun

# 安装依赖
npm install

# 构建项目
npm run build

# 创建日志目录
mkdir -p logs

# 设置权限
chown -R www:www /www/wwwroot/todos.ipoo.fun
```

### 4. 配置环境变量

```bash
# 复制环境变量文件
cp .env.example .env

# 编辑环境变量
nano .env
```

环境变量配置：
```env
# 生产环境配置
NODE_ENV=production
PORT=3000

# 数据库配置 (如果使用 PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_management
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# 如果使用 SQLite (默认)
# 无需额外配置，会自动创建数据库文件
```

### 5. 配置 PM2 启动

#### 创建 PM2 配置文件
```bash
nano ecosystem.config.js
```

内容：
```javascript
module.exports = {
  apps: [{
    name: 'todo-app',
    script: './dist/server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

#### 启动应用
```bash
# 启动应用
pm2 start ecosystem.config.js

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
```

### 6. 配置 Nginx

#### 在宝塔面板中配置

1. **添加站点**
   - 宝塔面板 → 网站 → 添加站点
   - 域名：`todos.ipoo.fun` (你的域名)
   - 根目录：`/www/wwwroot/todos.ipoo.fun/frontend`

2. **修改 Nginx 配置**
   - 点击站点设置 → 配置文件
   - 替换为以下配置：

```nginx
server {
    listen 80;
    server_name todos.ipoo.fun;
    
    # 前端静态文件目录
    root /www/wwwroot/todos.ipoo.fun/frontend;
    index index.html;
    
    # 前端路由
    location / {
        try_files $uri $uri/ /index.html;
        
        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API 代理
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
```

3. **保存并重载 Nginx**
   - 点击保存
   - 宝塔面板会自动重载 Nginx

### 7. 配置 SSL (可选)

1. 宝塔面板 → 网站 → 你的站点 → SSL
2. 选择 "Let's Encrypt" 免费证书
3. 点击申请，等待证书生成
4. 开启 "强制 HTTPS"

---

## 🔧 故障排除

### 常见错误及解决方案

#### 1. Nginx 配置错误
**错误信息：** `"location" directive is not allowed here`

**解决方案：**
1. 检查 `location` 块是否在 `server` 块内
2. 确保大括号匹配
3. 使用上面提供的标准配置

#### 2. Node.js 应用无法启动
```bash
# 查看 PM2 状态
pm2 status

# 查看应用日志
pm2 logs todo-app

# 重启应用
pm2 restart todo-app
```

#### 3. 端口被占用
```bash
# 查看端口占用
netstat -tlnp | grep :3000

# 杀死占用进程
kill -9 PID
```

#### 4. 权限问题
```bash
# 设置正确权限
chown -R www:www /www/wwwroot/todos
chmod -R 755 /www/wwwroot/todos
```

### 检查服务状态

```bash
# 检查 Nginx 状态
systemctl status nginx

# 检查 PM2 应用
pm2 status

# 检查端口监听
netstat -tlnp | grep :3000

# 测试 API
curl http://localhost:3000/api/todos
```

---

## 🔄 更新部署

当你更新代码后：

```bash
cd /www/wwwroot/todos.ipoo.fun

# 拉取最新代码
git pull origin main

# 重新构建
npm run build

# 重启应用
pm2 restart todo-app
```

---

## 📊 监控和维护

### 查看日志
```bash
# PM2 应用日志
pm2 logs todo-app

# Nginx 访问日志
tail -f /www/wwwroot/todos.ipoo.fun/logs/access.log

# Nginx 错误日志
tail -f /www/wwwroot/todos.ipoo.fun/logs/error.log
```

### 性能监控
```bash
# PM2 监控
pm2 monit

# 系统资源
htop
```

---

## ✅ 验证部署

1. **访问网站：** `http://todos.ipoo.fun`
2. **测试 API：** `http://todos.ipoo.fun/api/todos`
3. **检查功能：** 添加、编辑、删除待办事项

部署成功后，你的 Todo 应用就可以在线访问了！