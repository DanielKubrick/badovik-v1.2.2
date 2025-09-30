'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

const ToastComponent = ({ toast, onRemove }: ToastProps) => {
  const { id, type, title, message, duration = 4000 } = toast

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onRemove])

  const getIcon = () => {
    const iconSize = 18
    switch (type) {
      case 'success':
        return <CheckCircle size={iconSize} className="text-green-600" />
      case 'error':
        return <XCircle size={iconSize} className="text-red-600" />
      case 'warning':
        return <AlertCircle size={iconSize} className="text-yellow-600" />
      case 'info':
      default:
        return <Info size={iconSize} className="text-blue-600" />
    }
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800'
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800'
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800'
    }
  }

  return (
    <div
      className={`
        toast-notification
        ${getStyles()}
      `}
      role="alert"
    >
      <div className="toast-content">
        <div className="toast-icon">
          {getIcon()}
        </div>
        <div className="toast-text">
          <p className="toast-title">
            {title}
          </p>
          {message && (
            <p className="toast-message">
              {message}
            </p>
          )}
        </div>
        <button
          onClick={() => onRemove(id)}
          className="toast-close-btn"
          aria-label="Закрыть уведомление"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

export default ToastComponent
