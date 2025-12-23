# 部署指南

## 方案一：Vercel 部署 (推荐)

### 前置条件
- GitHub 账号
- Vercel 账号 (可用 GitHub 登录)

### 部署步骤

1. **安装 Vercel CLI**
```bash
npm install -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
vercel --prod
```

4. **设置环境变量** (在 Vercel 控制台)
- `NODE_ENV=production`
- `PORT=3000`

### 自动部署
- 推送到 GitHub main 分支会自动触发部署
- 每次 commit 都会创建预览部署

---

## 方案二：Railway 部署

### 前置条件
- GitHub 账号
- Railway 账号

### 部署步骤

1. **访问 Railway**
   - 前往 [railway.app](https://railway.app)
   - 用 GitHub 登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你的 todos 仓库

3. **配置环境变量**
   ```
   NODE_ENV=production
   PORT=3000
   ```

4. **添加数据库** (可选)
   - 在项目中添加 PostgreSQL 插件
   - Railway 会自动提供数据库连接信息

---

## 方案三：Heroku 部署

### 前置条件
- Heroku 账号
- Heroku CLI

### 部署步骤

1. **安装 Heroku CLI**
```bash
# macOS
brew tap heroku/brew && brew install heroku

# 其他系统请访问 https://devcenter.heroku.com/articles/heroku-cli
```

2. **登录 Heroku**
```bash
heroku login
```

3. **创建应用**
```bash
heroku create your-todo-app-name
```

4. **添加 PostgreSQL 数据库**
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

5. **设置环境变量**
```bash
heroku config:set NODE_ENV=production
```

6. **部署**
```bash
git push heroku main
```

---

## 方案四：自己的服务器 (VPS)

### 前置条件
- 云服务器 (阿里云、腾讯云、AWS 等)
- 域名 (可选)

### 部署步骤

1. **连接服务器**
```bash
ssh root@your-server-ip
```

2. **安装 Node.js**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

3. **安装 PM2**
```bash
npm install -g pm2
```

4. **克隆项目**
```bash
git clone https://github.com/qblyf/todos.git
cd todos
```

5. **安装依赖并构建**
```bash
npm install
npm run build
```

6. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件
nano .env
```

7. **启动应用**
```bash
pm2 start dist/server.js --name "todo-app"
pm2 startup
pm2 save
```

8. **配置 Nginx** (可选)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 推荐选择

### 新手推荐：Vercel
- 免费
- 自动部署
- 无需服务器管理
- 全球 CDN

### 需要数据库：Railway
- 免费额度
- 内置 PostgreSQL
- 简单配置

### 企业级：自己的服务器
- 完全控制
- 可扩展
- 需要运维知识

---

## 常见问题

### Q: 数据库数据会丢失吗？
A: 
- Vercel: 使用 SQLite，重新部署会重置数据
- Railway/Heroku: 使用 PostgreSQL，数据持久化
- 自己服务器: 取决于配置

### Q: 如何查看部署日志？
A:
- Vercel: 在控制台的 Functions 标签页
- Railway: 在项目的 Deployments 页面
- Heroku: `heroku logs --tail`

### Q: 如何更新部署？
A: 推送代码到 GitHub，大部分平台会自动重新部署