// DOM 操作工具函数
export function createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className)
        element.className = className;
    if (textContent)
        element.textContent = textContent;
    return element;
}
export function createElementWithHTML(tag, className, innerHTML) {
    const element = document.createElement(tag);
    if (className)
        element.className = className;
    if (innerHTML)
        element.innerHTML = innerHTML;
    return element;
}
export function show(element) {
    element.classList.remove('hidden');
}
export function hide(element) {
    element.classList.add('hidden');
}
export function toggle(element) {
    element.classList.toggle('hidden');
}
export function addClass(element, className) {
    element.classList.add(className);
}
export function removeClass(element, className) {
    element.classList.remove(className);
}
export function hasClass(element, className) {
    return element.classList.contains(className);
}
// 安全的元素查找
export function $(selector) {
    return document.querySelector(selector);
}
export function $$(selector) {
    return document.querySelectorAll(selector);
}
// 事件处理工具
export function on(element, event, handler) {
    element.addEventListener(event, handler);
}
export function off(element, event, handler) {
    element.removeEventListener(event, handler);
}
// 防抖函数
export function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
// 节流函数
export function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
// 格式化日期
export function formatDate(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    // 小于1分钟
    if (diff < 60000) {
        return '刚刚';
    }
    // 小于1小时
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes}分钟前`;
    }
    // 小于1天
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}小时前`;
    }
    // 小于7天
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days}天前`;
    }
    // 超过7天显示具体日期
    return d.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
// 转义HTML
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
//# sourceMappingURL=dom.js.map