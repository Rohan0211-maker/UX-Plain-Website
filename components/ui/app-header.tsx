"use client"

import { Button } from "./button"
import { Badge } from "./badge"
import { Bell, Settings, ChevronDown, Search, Menu } from "lucide-react"
import { useState } from "react"

interface AppHeaderProps {
  title?: string
  rightContent?: React.ReactNode
}

export function AppHeader({ title = "UXplain", rightContent }: AppHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-slate-200/50 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">UX</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {title}
              </span>
              <Badge className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200 text-xs">
                Beta
              </Badge>
            </div>
          </div>

          {/* Right side - Navigation and Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {rightContent}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-slate-50"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200/50">
            <div className="space-y-4">
              {rightContent && (
                <div className="flex flex-col space-y-2">
                  {rightContent}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
