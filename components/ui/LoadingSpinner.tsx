'use client'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
  color?: string
}

const LoadingSpinner = ({ 
  size = 'medium', 
  className = '', 
  color = '#007aff' 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'loading-spinner-small',
    medium: 'loading-spinner',
    large: 'loading-spinner-large'
  }

  return (
    <div 
      className={`${sizeClasses[size]} ${className}`}
      style={{ borderTopColor: color }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Загрузка...</span>
    </div>
  )
}

export default LoadingSpinner
