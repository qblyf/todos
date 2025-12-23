const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('构建前端 TypeScript...');

try {
  // 切换到前端目录并编译 TypeScript
  const frontendDir = path.join(__dirname, '../frontend');
  process.chdir(frontendDir);
  
  // 使用项目根目录的 TypeScript
  const tscPath = path.join(__dirname, '../node_modules/.bin/tsc');
  execSync(`"${tscPath}"`, { stdio: 'inherit' });
  
  // 在生产环境构建时，使用生产版本的 HTML
  if (process.env.NODE_ENV === 'production') {
    console.log('使用生产环境 HTML...');
    const productionHtml = path.join(frontendDir, 'index.production.html');
    const targetHtml = path.join(frontendDir, 'index.html');
    
    if (fs.existsSync(productionHtml)) {
      fs.copyFileSync(productionHtml, targetHtml);
      console.log('✅ 已切换到生产环境 HTML');
    }
  }
  
  console.log('✅ 前端 TypeScript 编译完成');
} catch (error) {
  console.error('❌ 前端编译失败:', error.message);
  process.exit(1);
}