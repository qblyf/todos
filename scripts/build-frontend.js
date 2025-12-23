const { execSync } = require('child_process');
const path = require('path');

console.log('构建前端 TypeScript...');

try {
  // 切换到前端目录并编译 TypeScript
  const frontendDir = path.join(__dirname, '../frontend');
  process.chdir(frontendDir);
  
  // 使用项目根目录的 TypeScript
  const tscPath = path.join(__dirname, '../node_modules/.bin/tsc');
  execSync(`"${tscPath}"`, { stdio: 'inherit' });
  
  console.log('✅ 前端 TypeScript 编译完成');
} catch (error) {
  console.error('❌ 前端编译失败:', error.message);
  process.exit(1);
}