import React from 'react'

interface LogoProps {
  variant?: 'full' | 'compact' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  if (variant === 'icon') {
    return (
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 32 32" 
        fill="none" 
        className={className}
      >
        {/* Person figure */}
        <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M10 12C7.5 12 5.5 13.5 5.5 16V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 12C12.5 12 14.5 13.5 14.5 16V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        
        {/* Speech bubble */}
        <path d="M16 6H28C28.5 6 29 6.5 29 7V14C29 14.5 28.5 15 28 15H20L16 18V6Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        
        {/* Bar chart inside bubble */}
        <rect x="18" y="11" width="1.5" height="2" fill="currentColor"/>
        <rect x="20" y="9.5" width="1.5" height="3.5" fill="currentColor"/>
        <rect x="22" y="8" width="1.5" height="5" fill="currentColor"/>
        <rect x="24" y="10" width="1.5" height="3" fill="currentColor"/>
        <rect x="26" y="9" width="1.5" height="4" fill="currentColor"/>
      </svg>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 20 20" 
          fill="none"
          className="text-foreground"
        >
          {/* Person figure */}
          <circle cx="6" cy="4" r="2" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M6 7C4.5 7 3 8 3 9.5V12" stroke="currentColor" strokeWidth="1"/>
          <path d="M6 7C7.5 7 9 8 9 9.5V12" stroke="currentColor" strokeWidth="1"/>
          
          {/* Speech bubble with chart */}
          <rect x="10" y="2" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="0.8" fill="none"/>
          <rect x="11" y="5.5" width="1" height="1.5" fill="currentColor"/>
          <rect x="12.5" y="4.5" width="1" height="2.5" fill="currentColor"/>
          <rect x="14" y="4" width="1" height="3" fill="currentColor"/>
        </svg>
        <span className={`font-medium text-foreground ${sizeClasses[size]}`}>UX</span>
      </div>
    )
  }

  // Full version
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 32 32" 
        fill="none"
        className="text-foreground"
      >
        {/* Person figure */}
        <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M10 12C7.5 12 5.5 13.5 5.5 16V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 12C12.5 12 14.5 13.5 14.5 16V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        
        {/* Speech bubble */}
        <path d="M16 6H28C28.5 6 29 6.5 29 7V14C29 14.5 28.5 15 28 15H20L16 18V6Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        
        {/* Bar chart inside bubble */}
        <rect x="18" y="11" width="1.5" height="2" fill="currentColor"/>
        <rect x="20" y="9.5" width="1.5" height="3.5" fill="currentColor"/>
        <rect x="22" y="8" width="1.5" height="5" fill="currentColor"/>
        <rect x="24" y="10" width="1.5" height="3" fill="currentColor"/>
        <rect x="26" y="9" width="1.5" height="4" fill="currentColor"/>
      </svg>
      <span className={`font-semibold text-foreground ${sizeClasses[size] === 'text-sm' ? 'text-lg' : sizeClasses[size] === 'text-base' ? 'text-xl' : 'text-2xl'}`}>
        UXplain
      </span>
    </div>
  )
}

export default Logo
