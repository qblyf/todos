import { $, createElement, createElementWithHTML, addClass, removeClass } from '../utils/dom.js';
import { debounce } from '../utils/dom.js';

export default class TodoForm {
  private container: HTMLElement;
  private form: HTMLFormElement;
  private input: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private charCounter: HTMLElement;
  private onSubmit: (description: string) => Promise<void>;
  private isSubmitting = false;

  private readonly MAX_LENGTH = 500;

  constructor(onSubmit: (description: string) => Promise<void>) {
    this.onSubmit = onSubmit;
    this.container = $('#todo-form-section')!;
    this.render();
    this.bindEvents();
  }

  private render(): void {
    this.container.innerHTML = `
      <form id="todo-form" class="space-y-4">
        <div class="relative">
          <div class="flex items-center space-x-3">
            <div class="flex-1 relative">
              <input
                type="text"
                id="todo-input"
                placeholder="输入新的待办事项..."
                maxlength="${this.MAX_LENGTH}"
                class="w-full px-4 py-3 pr-16 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all duration-200 text-lg placeholder-gray-400"
                autocomplete="off"
              />
              <div id="char-counter" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                0/${this.MAX_LENGTH}
              </div>
            </div>
            <button
              type="submit"
              id="submit-button"
              disabled
              class="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            >
              <span id="button-text">添加</span>
              <svg id="button-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <svg id="loading-icon" class="w-5 h-5 animate-spin hidden" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>
          
          <!-- 输入提示 -->
          <div id="input-hints" class="mt-2 text-sm text-gray-500 space-y-1">
            <div class="flex items-center space-x-2">
              <span class="text-gray-400">💡</span>
              <span>按 Enter 键快速添加，Escape 键清空输入</span>
            </div>
          </div>
          
          <!-- 错误提示 -->
          <div id="error-message" class="hidden mt-2 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
          </div>
        </div>
      </form>
    `;

    // 获取DOM元素引用
    this.form = $('#todo-form') as HTMLFormElement;
    this.input = $('#todo-input') as HTMLInputElement;
    this.submitButton = $('#submit-button') as HTMLButtonElement;
    this.charCounter = $('#char-counter')!;
  }

  private bindEvents(): void {
    // 表单提交
    this.form.addEventListener('submit', this.handleSubmit.bind(this));

    // 输入变化
    this.input.addEventListener('input', debounce(this.handleInputChange.bind(this), 100));

    // 键盘快捷键
    this.input.addEventListener('keydown', this.handleKeyDown.bind(this));

    // 输入焦点事件
    this.input.addEventListener('focus', this.handleInputFocus.bind(this));
    this.input.addEventListener('blur', this.handleInputBlur.bind(this));

    // 实时字符计数
    this.input.addEventListener('input', this.updateCharCounter.bind(this));
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    if (this.isSubmitting) return;

    const description = this.input.value.trim();
    
    if (!this.validateInput(description)) {
      return;
    }

    this.setSubmitting(true);

    try {
      await this.onSubmit(description);
      this.clearForm();
      this.hideError();
    } catch (error) {
      this.showError(error instanceof Error ? error.message : '提交失败');
    } finally {
      this.setSubmitting(false);
    }
  }

  private handleInputChange(): void {
    const value = this.input.value.trim();
    this.updateSubmitButton(value);
    this.hideError();
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.clearForm();
      event.preventDefault();
    } else if (event.key === 'Enter' && !event.shiftKey) {
      // Enter键提交（已由form的submit事件处理）
      event.preventDefault();
      this.form.dispatchEvent(new Event('submit'));
    }
  }

  private handleInputFocus(): void {
    addClass(this.input, 'ring-2');
    addClass(this.input, 'ring-primary-200');
    addClass(this.input, 'border-primary-500');
  }

  private handleInputBlur(): void {
    removeClass(this.input, 'ring-2');
    removeClass(this.input, 'ring-primary-200');
    removeClass(this.input, 'border-primary-500');
  }

  private updateCharCounter(): void {
    const length = this.input.value.length;
    this.charCounter.textContent = `${length}/${this.MAX_LENGTH}`;
    
    if (length > this.MAX_LENGTH * 0.8) {
      addClass(this.charCounter, 'text-yellow-500');
    } else {
      removeClass(this.charCounter, 'text-yellow-500');
    }
    
    if (length >= this.MAX_LENGTH) {
      addClass(this.charCounter, 'text-danger-500');
    } else {
      removeClass(this.charCounter, 'text-danger-500');
    }
  }

  private validateInput(description: string): boolean {
    if (!description) {
      this.showError('请输入待办事项内容');
      this.input.focus();
      return false;
    }

    if (description.length > this.MAX_LENGTH) {
      this.showError(`内容不能超过 ${this.MAX_LENGTH} 个字符`);
      this.input.focus();
      return false;
    }

    // 检查是否只包含空白字符
    if (!/\S/.test(description)) {
      this.showError('待办事项内容不能为空白字符');
      this.input.focus();
      return false;
    }

    return true;
  }

  private updateSubmitButton(value: string): void {
    const isValid = value.length > 0 && value.length <= this.MAX_LENGTH;
    this.submitButton.disabled = !isValid || this.isSubmitting;
  }

  private setSubmitting(submitting: boolean): void {
    this.isSubmitting = submitting;
    
    const buttonText = $('#button-text')!;
    const buttonIcon = $('#button-icon')!;
    const loadingIcon = $('#loading-icon')!;

    if (submitting) {
      buttonText.textContent = '添加中...';
      addClass(buttonIcon, 'hidden');
      removeClass(loadingIcon, 'hidden');
      this.submitButton.disabled = true;
    } else {
      buttonText.textContent = '添加';
      removeClass(buttonIcon, 'hidden');
      addClass(loadingIcon, 'hidden');
      this.updateSubmitButton(this.input.value.trim());
    }
  }

  private clearForm(): void {
    this.input.value = '';
    this.updateSubmitButton('');
    this.updateCharCounter();
    this.input.focus();
  }

  private showError(message: string): void {
    const errorElement = $('#error-message')!;
    errorElement.textContent = message;
    removeClass(errorElement, 'hidden');
    
    // 添加错误样式到输入框
    addClass(this.input, 'border-danger-500');
    addClass(this.input, 'ring-danger-200');
  }

  private hideError(): void {
    const errorElement = $('#error-message')!;
    addClass(errorElement, 'hidden');
    
    // 移除错误样式
    removeClass(this.input, 'border-danger-500');
    removeClass(this.input, 'ring-danger-200');
  }

  // 公共方法
  public focus(): void {
    this.input.focus();
  }

  public clear(): void {
    this.clearForm();
  }

  public setValue(value: string): void {
    this.input.value = value;
    this.updateSubmitButton(value.trim());
    this.updateCharCounter();
  }
}