import { $ } from '../utils/dom.js';
import TodoItem from './TodoItem.js';
export default class TodoList {
    constructor(callbacks) {
        this.todoItems = new Map();
        this.callbacks = callbacks;
        this.container = $('#todos-container');
    }
    render(todos) {
        // 清理不存在的待办事项
        const currentIds = new Set(todos.map(todo => todo.id));
        for (const [id, item] of this.todoItems) {
            if (!currentIds.has(id)) {
                item.destroy();
                this.todoItems.delete(id);
            }
        }
        // 清空容器
        this.container.innerHTML = '';
        if (todos.length === 0) {
            return;
        }
        // 按状态和创建时间排序
        const sortedTodos = [...todos].sort((a, b) => {
            // 未完成的任务排在前面
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            // 相同状态按创建时间倒序（新的在前）
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        // 渲染每个待办事项
        sortedTodos.forEach((todo, index) => {
            let todoItem = this.todoItems.get(todo.id);
            if (!todoItem) {
                todoItem = new TodoItem(todo, {
                    onToggle: () => this.callbacks.onToggle(todo.id),
                    onDelete: () => this.callbacks.onDelete(todo.id),
                    onEdit: (description) => this.callbacks.onEdit(todo.id, description)
                });
                this.todoItems.set(todo.id, todoItem);
            }
            else {
                todoItem.update(todo);
            }
            const element = todoItem.getElement();
            // 添加动画延迟
            element.style.animationDelay = `${index * 50}ms`;
            element.classList.add('animate-slide-up');
            this.container.appendChild(element);
        });
        // 添加分组标题
        this.addGroupHeaders();
    }
    addGroupHeaders() {
        const items = Array.from(this.container.children);
        let hasCompleted = false;
        let hasPending = false;
        // 检查是否有已完成和待完成的任务
        items.forEach(item => {
            const isCompleted = item.dataset.completed === 'true';
            if (isCompleted)
                hasCompleted = true;
            else
                hasPending = true;
        });
        // 如果两种状态都有，添加分组标题
        if (hasCompleted && hasPending) {
            let completedHeaderAdded = false;
            items.forEach((item, index) => {
                const isCompleted = item.dataset.completed === 'true';
                // 在第一个已完成任务前添加标题
                if (isCompleted && !completedHeaderAdded) {
                    const header = this.createGroupHeader('已完成', hasCompleted);
                    this.container.insertBefore(header, item);
                    completedHeaderAdded = true;
                }
            });
            // 在开头添加待完成标题
            if (hasPending) {
                const header = this.createGroupHeader('待完成', hasPending);
                this.container.insertBefore(header, this.container.firstChild);
            }
        }
    }
    createGroupHeader(title, hasItems) {
        const header = document.createElement('div');
        header.className = 'flex items-center my-6 first:mt-0';
        header.innerHTML = `
      <div class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      <div class="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-600 shadow-sm">
        ${title}
      </div>
      <div class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
    `;
        return header;
    }
    // 公共方法
    clear() {
        this.todoItems.forEach(item => item.destroy());
        this.todoItems.clear();
        this.container.innerHTML = '';
    }
    getTodoItem(id) {
        return this.todoItems.get(id);
    }
    getItemCount() {
        return this.todoItems.size;
    }
}
//# sourceMappingURL=TodoList.js.map