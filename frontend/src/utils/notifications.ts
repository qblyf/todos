// 通知工具类
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

class NotificationManager {
  private container: HTMLElement;
  private notifications: Map<string, HTMLElement> = new Map();

  constructor() {
    this.container = document.getElementById('notifications')!;
  }

  show(notification: Omit<Notification, 'id'>): string {
    const id = this.generateId();
    const element = this.createNotificationElement({
      ...notification,
      id
    });

    this.container.appendChild(element);
    this.notifications.set(id, element);

    // 添加动画
    setTimeout(() => {
      element.classList.add('animate-slide-up');
    }, 10);

    // 自动移除
    const duration = notification.duration || 5000;
    setTimeout(() => {
      this.remove(id);
    }, duration);

    return id;
  }

  remove(id: string): void {
    const element = this.notifications.get(id);
    if (element) {
      element.classList.add('animate-fade-out');
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
        this.notifications.delete(id);
      }, 300);
    }
  }

  private createNotificationElement(notification: Notification): HTMLElement {
    const div = document.createElement('div');
    div.className = `
      max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto 
      ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all
      duration-300 ease-out translate-x-full opacity-0
    `;

    const iconMap = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    const colorMap = {
      success: 'text-success-600',
      error: 'text-danger-600',
      warning: 'text-yellow-600',
      info: 'text-primary-600'
    };

    div.innerHTML = `
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <span class="text-xl">${iconMap[notification.type]}</span>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">
              ${notification.title}
            </p>
            ${notification.message ? `
              <p class="mt-1 text-sm text-gray-500">
                ${notification.message}
              </p>
            ` : ''}
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" onclick="notifications.remove('${notification.id}')">
              <span class="sr-only">关闭</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    // 添加点击关闭功能
    const closeButton = div.querySelector('button');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.remove(notification.id));
    }

    return div;
  }

  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // 便捷方法
  success(title: string, message?: string, duration?: number): string {
    return this.show({ type: 'success', title, message, duration });
  }

  error(title: string, message?: string, duration?: number): string {
    return this.show({ type: 'error', title, message, duration });
  }

  warning(title: string, message?: string, duration?: number): string {
    return this.show({ type: 'warning', title, message, duration });
  }

  info(title: string, message?: string, duration?: number): string {
    return this.show({ type: 'info', title, message, duration });
  }
}

// 全局实例
const notifications = new NotificationManager();

// 添加到全局对象以便在HTML中使用
(window as any).notifications = notifications;

export default notifications;