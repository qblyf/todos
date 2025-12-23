import ApiClient from '../api/client.js';
import notifications from '../utils/notifications.js';
import { $, show, hide } from '../utils/dom.js';
import TodoForm from './TodoForm.js';
import TodoList from './TodoList.js';
import StatsDisplay from './StatsDisplay.js';
export default class TodoApp {
    constructor() {
        this.state = {
            todos: [],
            loading: false,
            error: null
        };
        this.initializeElements();
        this.initializeComponents();
        this.bindEvents();
        this.loadTodos();
    }
    initializeElements() {
        this.loadingState = $('#loading-state');
        this.errorState = $('#error-state');
        this.emptyState = $('#empty-state');
        this.errorMessage = $('#error-message');
        this.retryButton = $('#retry-button');
    }
    initializeComponents() {
        this.todoForm = new TodoForm(this.handleCreateTodo.bind(this));
        this.todoList = new TodoList({
            onToggle: this.handleToggleTodo.bind(this),
            onDelete: this.handleDeleteTodo.bind(this),
            onEdit: this.handleEditTodo.bind(this)
        });
        this.statsDisplay = new StatsDisplay();
    }
    bindEvents() {
        this.retryButton.addEventListener('click', () => {
            this.loadTodos();
        });
    }
    // 状态管理
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }
    render() {
        this.updateLoadingState();
        this.updateErrorState();
        this.updateEmptyState();
        this.todoList.render(this.state.todos);
        this.updateStats();
    }
    updateLoadingState() {
        if (this.state.loading) {
            show(this.loadingState);
            hide(this.errorState);
            hide(this.emptyState);
        }
        else {
            hide(this.loadingState);
        }
    }
    updateErrorState() {
        if (this.state.error && !this.state.loading) {
            show(this.errorState);
            hide(this.emptyState);
            this.errorMessage.textContent = this.state.error;
        }
        else {
            hide(this.errorState);
        }
    }
    updateEmptyState() {
        if (!this.state.loading && !this.state.error && this.state.todos.length === 0) {
            show(this.emptyState);
        }
        else {
            hide(this.emptyState);
        }
    }
    async updateStats() {
        if (this.state.todos.length > 0) {
            const stats = {
                total: this.state.todos.length,
                completed: this.state.todos.filter(todo => todo.completed).length,
                pending: this.state.todos.filter(todo => !todo.completed).length
            };
            this.statsDisplay.render(stats);
        }
    }
    // API 操作
    async loadTodos() {
        this.setState({ loading: true, error: null });
        try {
            const response = await ApiClient.getAllTodos();
            if (response.error) {
                throw new Error(response.error.message);
            }
            this.setState({
                todos: response.data || [],
                loading: false
            });
        }
        catch (error) {
            console.error('加载待办事项失败:', error);
            this.setState({
                loading: false,
                error: error instanceof Error ? error.message : '加载失败'
            });
        }
    }
    async handleCreateTodo(description) {
        try {
            const response = await ApiClient.createTodo({ description });
            if (response.error) {
                throw new Error(response.error.message);
            }
            // 乐观更新：立即添加到本地状态
            const newTodo = response.data;
            this.setState({
                todos: [newTodo, ...this.state.todos]
            });
            notifications.success('任务创建成功', `"${description}" 已添加到待办列表`);
        }
        catch (error) {
            console.error('创建待办事项失败:', error);
            notifications.error('创建失败', error instanceof Error ? error.message : '未知错误');
        }
    }
    async handleToggleTodo(id) {
        try {
            // 乐观更新：立即更新本地状态
            const updatedTodos = this.state.todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
            this.setState({ todos: updatedTodos });
            const response = await ApiClient.toggleTodo(id);
            if (response.error) {
                // 回滚乐观更新
                this.setState({ todos: this.state.todos });
                throw new Error(response.error.message);
            }
            // 使用服务器返回的数据更新状态
            const updatedTodo = response.data;
            const finalTodos = this.state.todos.map(todo => todo.id === id ? updatedTodo : todo);
            this.setState({ todos: finalTodos });
            notifications.success(updatedTodo.completed ? '任务已完成' : '任务已重新激活', `"${updatedTodo.description}"`);
        }
        catch (error) {
            console.error('切换待办事项状态失败:', error);
            notifications.error('操作失败', error instanceof Error ? error.message : '未知错误');
            // 重新加载数据以确保一致性
            this.loadTodos();
        }
    }
    async handleDeleteTodo(id) {
        const todo = this.state.todos.find(t => t.id === id);
        if (!todo)
            return;
        try {
            // 乐观更新：立即从本地状态移除
            const updatedTodos = this.state.todos.filter(t => t.id !== id);
            this.setState({ todos: updatedTodos });
            const response = await ApiClient.deleteTodo(id);
            if (response.error) {
                // 回滚乐观更新
                this.setState({ todos: this.state.todos });
                throw new Error(response.error.message);
            }
            notifications.success('任务已删除', `"${todo.description}" 已从列表中移除`);
        }
        catch (error) {
            console.error('删除待办事项失败:', error);
            notifications.error('删除失败', error instanceof Error ? error.message : '未知错误');
            // 重新加载数据以确保一致性
            this.loadTodos();
        }
    }
    async handleEditTodo(id, description) {
        const originalTodo = this.state.todos.find(t => t.id === id);
        if (!originalTodo)
            return;
        try {
            // 乐观更新：立即更新本地状态
            const updatedTodos = this.state.todos.map(todo => todo.id === id ? { ...todo, description } : todo);
            this.setState({ todos: updatedTodos });
            const response = await ApiClient.updateTodo(id, { description });
            if (response.error) {
                // 回滚乐观更新
                this.setState({ todos: this.state.todos });
                throw new Error(response.error.message);
            }
            // 使用服务器返回的数据更新状态
            const updatedTodo = response.data;
            const finalTodos = this.state.todos.map(todo => todo.id === id ? updatedTodo : todo);
            this.setState({ todos: finalTodos });
            notifications.success('任务已更新', `内容已修改为 "${description}"`);
        }
        catch (error) {
            console.error('编辑待办事项失败:', error);
            notifications.error('编辑失败', error instanceof Error ? error.message : '未知错误');
            // 重新加载数据以确保一致性
            this.loadTodos();
        }
    }
    // 公共方法
    refresh() {
        this.loadTodos();
    }
    getState() {
        return { ...this.state };
    }
}
//# sourceMappingURL=TodoApp.js.map