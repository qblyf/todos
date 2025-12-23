// 使用相对路径，这样在开发和生产环境都能正常工作
const API_BASE_URL = '/api';
class ApiClient {
    async request(endpoint, options = {}) {
        try {
            const url = `${API_BASE_URL}${endpoint}`;
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    error: data.error || {
                        message: `HTTP ${response.status}: ${response.statusText}`,
                        code: 'HTTP_ERROR'
                    }
                };
            }
            return { data: data.data || data };
        }
        catch (error) {
            console.error('API请求失败:', error);
            return {
                error: {
                    message: error instanceof Error ? error.message : '网络请求失败',
                    code: 'NETWORK_ERROR'
                }
            };
        }
    }
    // 获取所有待办事项
    async getAllTodos() {
        return this.request('/todos');
    }
    // 根据ID获取待办事项
    async getTodoById(id) {
        return this.request(`/todos/${id}`);
    }
    // 创建新待办事项
    async createTodo(data) {
        return this.request('/todos', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
    // 更新待办事项
    async updateTodo(id, data) {
        return this.request(`/todos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }
    // 删除待办事项
    async deleteTodo(id) {
        return this.request(`/todos/${id}`, {
            method: 'DELETE',
        });
    }
    // 切换完成状态
    async toggleTodo(id) {
        return this.request(`/todos/${id}/toggle`, {
            method: 'PATCH',
        });
    }
    // 获取统计信息
    async getStats() {
        return this.request('/todos/stats');
    }
}
export default new ApiClient();
//# sourceMappingURL=client.js.map