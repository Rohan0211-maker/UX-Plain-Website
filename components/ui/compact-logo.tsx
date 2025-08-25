import React from 'react'

interface CompactLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
  variant?: 'default' | 'monochrome' | 'colorful'
}

export function CompactLogo({ 
  size = 'md', 
  className = '', 
  showText = true,
  variant = 'default'
}: CompactLogoProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  }

  const iconSize = iconSizes[size]

  const getLogoColors = () => {
    switch (variant) {
      case 'monochrome':
        return 'text-slate-900 dark:text-slate-100'
      case 'colorful':
        return 'text-blue-600'
      default:
        return 'text-slate-900 dark:text-slate-100'
    }
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${getLogoColors()}`}>
        <svg 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none"
          className="flex-shrink-0"
        >
          {/* Modern abstract UX symbol */}
          <path 
            d="M12 2L2 7L12 12L22 7L12 2Z" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            fill="none"
            className="opacity-80"
          />
          <path 
            d="M2 17L12 22L22 17" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            fill="none"
            className="opacity-60"
          />
          <path 
            d="M2 12L12 17L22 12" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            fill="none"
            className="opacity-70"
          />
          
          {/* Central focus point */}
          <circle 
            cx="12" 
            cy="12" 
            r="2" 
            fill="currentColor"
            className="drop-shadow-sm"
          />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${sizeClasses[size]} leading-none`}>
            UXplain
          </span>
          <span className={`text-xs opacity-70 leading-none -mt-0.5`}>
            AI Analysis
          </span>
        </div>
      )}
    </div>
  )
}

export default CompactLogo
