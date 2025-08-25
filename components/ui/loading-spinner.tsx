import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'dots' | 'pulse' | 'bars'
  className?: string
  text?: string
  showText?: boolean
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default',
  className,
  text = 'Loading...',
  showText = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className={cn("bg-current rounded-full animate-bounce", sizeClasses[size])} style={{ animationDelay: '0ms' }} />
            <div className={cn("bg-current rounded-full animate-bounce", sizeClasses[size])} style={{ animationDelay: '150ms' }} />
            <div className={cn("bg-current rounded-full animate-bounce", sizeClasses[size])} style={{ animationDelay: '300ms' }} />
          </div>
        )
      
      case 'pulse':
        return (
          <div className={cn("bg-current rounded-full animate-pulse", sizeClasses[size])} />
        )
      
      case 'bars':
        return (
          <div className="flex space-x-1">
            <div className={cn("bg-current rounded-sm animate-pulse", sizeClasses[size])} style={{ animationDelay: '0ms' }} />
            <div className={cn("bg-current rounded-sm animate-pulse", sizeClasses[size])} style={{ animationDelay: '150ms' }} />
            <div className={cn("bg-current rounded-sm animate-pulse", sizeClasses[size])} style={{ animationDelay: '300ms' }} />
          </div>
        )
      
      default:
        return (
          <Loader2 className={cn("animate-spin", sizeClasses[size])} />
        )
    }
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      {renderSpinner()}
      {showText && (
        <span className={cn("text-muted-foreground font-medium", textSizes[size])}>
          {text}
        </span>
      )}
    </div>
  )
}

export function LoadingPage({ 
  text = 'Loading...',
  className 
}: { 
  text?: string
  className?: string 
}) {
  return (
    <div className={cn("min-h-screen flex items-center justify-center", className)}>
      <LoadingSpinner size="xl" text={text} showText />
    </div>
  )
}

export function LoadingCard({ 
  text = 'Loading...',
  className 
}: { 
  text?: string
  className?: string 
}) {
  return (
    <div className={cn("p-8 flex items-center justify-center", className)}>
      <LoadingSpinner size="lg" text={text} showText />
    </div>
  )
}

export default LoadingSpinner
