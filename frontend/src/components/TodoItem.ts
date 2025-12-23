import { Todo } from '../types/todo.js';
import { formatDate, escapeHtml } from '../utils/dom.js';
import { addClass, removeClass, hasClass } from '../utils/dom.js';

interface TodoItemCallbacks {
  onToggle: () => Promise<void>;
  onDelete: () => Promise<void>;
  onEdit: (description: string) => Promise<void>;
}

export default class TodoItem {
  private todo: Todo;
  private callbacks: TodoItemCallbacks;
  private element: HTMLElement;
  private isEditing = false;
  private isLoading = false;

  // DOM 元素引用
  private checkbox: HTMLInputElement;
  private description: HTMLElement;
  private editInput: HTMLInputElement;
  private editForm: HTMLFormElement;
  private deleteButton: HTMLButtonElement;
  private editButton: HTMLButtonElement;
  private saveButton: HTMLButtonElement;
  private cancelButton: HTMLButtonElement;
  private timestamp: HTMLElement;

  constructor(todo: Todo, callbacks: TodoItemCallbacks) {
    this.todo = todo;
    this.callbacks = callbacks;
    this.createElement();
    this.bindEvents();
  }

  private createElement(): void {
    this.element = document.createElement('div');
    this.element.className = `
      group bg-white rounded-xl shadow-sm border border-gray-200 p-4 
      hover:shadow-md hover:border-gray-300 transition-all duration-200
      ${this.todo.completed ? 'opacity-75' : ''}
    `;
    this.element.dataset.todoId = this.todo.id.toString();
    this.element.dataset.completed = this.todo.completed.toString();

    this.render();
  }

  private render(): void {
    const completedClass = this.todo.completed ? 'line-through text-gray-500' : 'text-gray-800';
    const checkboxChecked = this.todo.completed ? 'checked' : '';
    
    this.element.innerHTML = `
      <div class="flex items-start space-x-3">
        <!-- 复选框 -->
        <div class="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            ${checkboxChecked}
            class="todo-checkbox w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 cursor-pointer transition-all"
          />
        </div>

        <!-- 内容区域 -->
        <div class="flex-1 min-w-0">
          <!-- 显示模式 -->
          <div class="todo-display ${this.isEditing ? 'hidden' : ''}">
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <p class="todo-description text-lg font-medium ${completedClass} break-words">
                  ${escapeHtml(this.todo.description)}
                </p>
                <p class="todo-timestamp text-sm text-gray-500 mt-1">
                  ${formatDate(this.todo.created_at)}
                  ${this.todo.updated_at !== this.todo.created_at ? 
                    `· 已编辑 ${formatDate(this.todo.updated_at)}` : ''}
                </p>
              </div>
              
              <!-- 操作按钮 -->
              <div class="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  class="edit-button p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="编辑"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  type="button"
                  class="delete-button p-2 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                  title="删除"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 编辑模式 -->
          <form class="todo-edit-form ${this.isEditing ? '' : 'hidden'}">
            <div class="space-y-3">
              <div class="relative">
                <input
                  type="text"
                  class="edit-input w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
                  value="${escapeHtml(this.todo.description)}"
                  maxlength="500"
                  required
                />
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                  <span class="char-count">${this.todo.description.length}</span>/500
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <button
                  type="submit"
                  class="save-button px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                >
                  保存
                </button>
                <button
                  type="button"
                  class="cancel-button px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  取消
                </button>
                <span class="text-sm text-gray-500">
                  按 Enter 保存，Escape 取消
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- 加载状态覆盖层 -->
      <div class="loading-overlay absolute inset-0 bg-white bg-opacity-75 rounded-xl flex items-center justify-center ${this.isLoading ? '' : 'hidden'}">
        <div class="flex items-center space-x-2 text-gray-600">
          <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm">处理中...</span>
        </div>
      </div>
    `;

    // 获取DOM元素引用
    this.checkbox = this.element.querySelector('.todo-checkbox') as HTMLInputElement;
    this.description = this.element.querySelector('.todo-description') as HTMLElement;
    this.editInput = this.element.querySelector('.edit-input') as HTMLInputElement;
    this.editForm = this.element.querySelector('.todo-edit-form') as HTMLFormElement;
    this.deleteButton = this.element.querySelector('.delete-button') as HTMLButtonElement;
    this.editButton = this.element.querySelector('.edit-button') as HTMLButtonElement;
    this.saveButton = this.element.querySelector('.save-button') as HTMLButtonElement;
    this.cancelButton = this.element.querySelector('.cancel-button') as HTMLButtonElement;
    this.timestamp = this.element.querySelector('.todo-timestamp') as HTMLElement;
  }

  private bindEvents(): void {
    // 复选框切换
    this.checkbox.addEventListener('change', this.handleToggle.bind(this));

    // 编辑按钮
    this.editButton.addEventListener('click', this.startEdit.bind(this));

    // 删除按钮
    this.deleteButton.addEventListener('click', this.handleDelete.bind(this));

    // 编辑表单
    this.editForm.addEventListener('submit', this.handleEditSubmit.bind(this));
    this.cancelButton.addEventListener('click', this.cancelEdit.bind(this));

    // 编辑输入框事件
    this.editInput.addEventListener('keydown', this.handleEditKeydown.bind(this));
    this.editInput.addEventListener('input', this.updateCharCount.bind(this));

    // 双击编辑
    this.description.addEventListener('dblclick', this.startEdit.bind(this));
  }

  private async handleToggle(): Promise<void> {
    if (this.isLoading) return;

    this.setLoading(true);
    try {
      await this.callbacks.onToggle();
    } catch (error) {
      // 回滚复选框状态
      this.checkbox.checked = this.todo.completed;
    } finally {
      this.setLoading(false);
    }
  }

  private async handleDelete(): Promise<void> {
    if (this.isLoading) return;

    // 确认删除
    if (!confirm(`确定要删除 "${this.todo.description}" 吗？`)) {
      return;
    }

    this.setLoading(true);
    try {
      await this.callbacks.onDelete();
    } catch (error) {
      this.setLoading(false);
    }
  }

  private startEdit(): void {
    if (this.isLoading || this.isEditing) return;

    this.isEditing = true;
    this.updateEditMode();
    this.editInput.focus();
    this.editInput.select();
  }

  private cancelEdit(): void {
    if (!this.isEditing) return;

    this.isEditing = false;
    this.editInput.value = this.todo.description;
    this.updateEditMode();
  }

  private async handleEditSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    if (this.isLoading) return;

    const newDescription = this.editInput.value.trim();
    
    if (!newDescription) {
      alert('任务描述不能为空');
      this.editInput.focus();
      return;
    }

    if (newDescription === this.todo.description) {
      this.cancelEdit();
      return;
    }

    this.setLoading(true);
    try {
      await this.callbacks.onEdit(newDescription);
      this.isEditing = false;
      this.updateEditMode();
    } catch (error) {
      this.setLoading(false);
    }
  }

  private handleEditKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.cancelEdit();
      event.preventDefault();
    } else if (event.key === 'Enter' && !event.shiftKey) {
      this.editForm.dispatchEvent(new Event('submit'));
      event.preventDefault();
    }
  }

  private updateCharCount(): void {
    const charCount = this.element.querySelector('.char-count');
    if (charCount) {
      charCount.textContent = this.editInput.value.length.toString();
    }
  }

  private updateEditMode(): void {
    const displayElement = this.element.querySelector('.todo-display') as HTMLElement;
    const editElement = this.element.querySelector('.todo-edit-form') as HTMLElement;

    if (this.isEditing) {
      addClass(displayElement, 'hidden');
      removeClass(editElement, 'hidden');
    } else {
      removeClass(displayElement, 'hidden');
      addClass(editElement, 'hidden');
    }
  }

  private setLoading(loading: boolean): void {
    this.isLoading = loading;
    const overlay = this.element.querySelector('.loading-overlay') as HTMLElement;
    
    if (loading) {
      removeClass(overlay, 'hidden');
      this.element.style.position = 'relative';
    } else {
      addClass(overlay, 'hidden');
    }
  }

  // 公共方法
  public update(todo: Todo): void {
    const oldCompleted = this.todo.completed;
    this.todo = todo;
    
    // 如果完成状态改变，重新渲染
    if (oldCompleted !== todo.completed) {
      this.render();
      this.bindEvents();
    } else {
      // 只更新描述和时间戳
      this.description.textContent = todo.description;
      this.timestamp.innerHTML = `
        ${formatDate(todo.created_at)}
        ${todo.updated_at !== todo.created_at ? 
          `· 已编辑 ${formatDate(todo.updated_at)}` : ''}
      `;
      this.editInput.value = todo.description;
    }

    this.element.dataset.completed = todo.completed.toString();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public getTodo(): Todo {
    return { ...this.todo };
  }

  public destroy(): void {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}