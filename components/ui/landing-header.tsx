import React from 'react'
import { CompactLogo } from './compact-logo'
import { Button } from './button'
import { ThemeToggle } from './theme-toggle'

interface LandingHeaderProps {
  showSignIn?: boolean
  rightContent?: React.ReactNode
  className?: string
}

export function LandingHeader({ 
  showSignIn = true, 
  rightContent,
  className = '' 
}: LandingHeaderProps) {
  return (
    <header className={`sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}>
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <CompactLogo size="lg" variant="colorful" />
        </div>
        
        <div className="flex items-center space-x-4">
          {rightContent}
          
          <ThemeToggle />
          
          {showSignIn && (
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <a href="/signin">Sign In</a>
              </Button>
              <Button variant="gradient" asChild>
                <a href="/signup">Get Started</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default LandingHeader
