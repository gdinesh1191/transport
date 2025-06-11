// components/toaster.tsx
'use client';

import React, { useState, useEffect } from 'react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  timestamp: number;
}

// Toast Manager Class
class ToasterManager {
  private toasts: ToastItem[] = [];
  private listeners: Array<(toasts: ToastItem[]) => void> = [];

  // Add a listener for toast changes
  subscribe(listener: (toasts: ToastItem[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners
  private notify() {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }

  // Show a new toast
  showToast(type: ToastType, message: string) {
    const toast: ToastItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: Date.now()
    };

    this.toasts.push(toast);
    this.notify();

    // Auto remove after 4 seconds
    setTimeout(() => {
      this.removeToast(toast.id);
    }, 4000);
  }

  // Remove a specific toast
  removeToast(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notify();
  }

  // Get current toasts
  getToasts(): ToastItem[] {
    return [...this.toasts];
  }
}

// Create singleton instance
export const toaster = new ToasterManager();

// Convenience methods
export const showToast = {
  success: (message: string) => toaster.showToast('success', message),
  warning: (message: string) => toaster.showToast('warning', message),
  error: (message: string) => toaster.showToast('error', message),
  info: (message: string) => toaster.showToast('info', message),
};

// Toast Container Component
const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsubscribe = toaster.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const getColorClasses = (type: string) => {
    const colors = {
      success: {
        border: 'bg-green-500',
        text: 'text-green-800',
      },
      warning: {
        border: 'bg-yellow-500',
        text: 'text-yellow-800',
      },
      error: {
        border: 'bg-red-500',
        text: 'text-red-800',
      },
      info: {
        border: 'bg-blue-500',
        text: 'text-blue-800',
      },
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  const closeToast = (id: string) => {
    toaster.removeToast(id);
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => {
        const colorClasses = getColorClasses(toast.type);
        return (
          <div
            key={toast.id}
            className="relative flex items-start gap-3 p-3 pl-4 rounded-2xl shadow-lg bg-white w-[250px] animate-slide-in-right overflow-hidden transition-all duration-300"
          >
            {/* Left border indicator */}
            <div className={`absolute top-4 bottom-4 left-3 w-1.5 ${colorClasses.border} rounded-full`}></div>
            
            {/* Content */}
            <div className="flex-1 pl-6">
              <div className={`font-semibold capitalize ${colorClasses.text}`}>
                {toast.type}
              </div>
              <p className="text-sm text-gray-600">
                {toast.message}
              </p>
            </div>
            
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-lg font-bold text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => closeToast(toast.id)}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;