import TodoApp from './components/TodoApp.js';
import notifications from './utils/notifications.js';
// 应用初始化
class App {
    constructor() {
        this.todoApp = null;
    }
    async init() {
        try {
            console.log('🚀 初始化待办事项管理应用...');
            // 等待DOM加载完成
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            // 初始化应用
            this.todoApp = new TodoApp();
            // 显示欢迎消息
            notifications.success('欢迎使用待办事项管理', '开始添加您的第一个任务吧！', 3000);
            console.log('✅ 应用初始化完成');
        }
        catch (error) {
            console.error('❌ 应用初始化失败:', error);
            this.showInitError(error);
        }
    }
    showInitError(error) {
        const appElement = document.getElementById('todo-app');
        if (appElement) {
            appElement.innerHTML = `
        <div class="text-center py-12">
          <div class="text-danger-500 text-6xl mb-4">⚠️</div>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">应用初始化失败</h2>
          <p class="text-gray-600 mb-6">
            ${error instanceof Error ? error.message : '未知错误'}
          </p>
          <button 
            onclick="location.reload()" 
            class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            重新加载
          </button>
        </div>
      `;
        }
    }
    // 公共方法
    getTodoApp() {
        return this.todoApp;
    }
}
// 创建全局应用实例
const app = new App();
// 添加到全局对象以便调试
window.app = app;
// 启动应用
app.init().catch(error => {
    console.error('应用启动失败:', error);
});
// 导出应用实例
export default app;
//# sourceMappingURL=main.js.map