import { $ } from '../utils/dom.js';
export default class StatsDisplay {
    constructor() {
        this.container = $('#stats-section');
    }
    render(stats) {
        const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
        this.container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <!-- 总任务数 -->
        <div class="bg-white rounded-xl shadow-md p-6 text-center transform hover:scale-105 transition-transform">
          <div class="text-3xl font-bold text-gray-800 mb-2">${stats.total}</div>
          <div class="text-gray-600 text-sm">总任务</div>
        </div>
        
        <!-- 已完成 -->
        <div class="bg-white rounded-xl shadow-md p-6 text-center transform hover:scale-105 transition-transform">
          <div class="text-3xl font-bold text-success-600 mb-2">${stats.completed}</div>
          <div class="text-gray-600 text-sm">已完成</div>
        </div>
        
        <!-- 待完成 -->
        <div class="bg-white rounded-xl shadow-md p-6 text-center transform hover:scale-105 transition-transform">
          <div class="text-3xl font-bold text-primary-600 mb-2">${stats.pending}</div>
          <div class="text-gray-600 text-sm">待完成</div>
        </div>
        
        <!-- 完成率 -->
        <div class="bg-white rounded-xl shadow-md p-6 text-center transform hover:scale-105 transition-transform">
          <div class="text-3xl font-bold text-indigo-600 mb-2">${completionRate}%</div>
          <div class="text-gray-600 text-sm">完成率</div>
          <div class="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              class="bg-gradient-to-r from-primary-500 to-success-500 h-2 rounded-full transition-all duration-500 ease-out" 
              style="width: ${completionRate}%"
            ></div>
          </div>
        </div>
      </div>
    `;
    }
    hide() {
        this.container.innerHTML = '';
    }
}
//# sourceMappingURL=StatsDisplay.js.map