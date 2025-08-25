import React from 'react'
import { Logo } from './logo'
import { CompactLogo } from './compact-logo'

export function LogoShowcase() {
  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">UXplain Logo Showcase</h1>
        <p className="text-muted-foreground">All available logo variants and sizes</p>
      </div>

      {/* Full Logo Variants */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Full Logo Variants</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Large</h3>
            <Logo variant="full" size="lg" />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Medium</h3>
            <Logo variant="full" size="md" />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Small</h3>
            <Logo variant="full" size="sm" />
          </div>
        </div>
      </div>

      {/* Compact Logo Variants */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Compact Logo Variants</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Large</h3>
            <CompactLogo size="lg" />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Medium</h3>
            <CompactLogo size="md" />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Small</h3>
            <CompactLogo size="sm" />
          </div>
        </div>
      </div>

      {/* Icon Only */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Icon Only</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Large</h3>
            <Logo variant="icon" className="h-8 w-8" />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Medium</h3>
            <Logo variant="icon" className="h-6 w-6" />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Small</h3>
            <Logo variant="icon" className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Compact without text */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Compact Logo (Icon Only)</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Large</h3>
            <CompactLogo size="lg" showText={false} />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Medium</h3>
            <CompactLogo size="md" showText={false} />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Small</h3>
            <CompactLogo size="sm" showText={false} />
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Usage Examples</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Header Navigation</h3>
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <CompactLogo size="md" />
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm border rounded">Home</button>
                <button className="px-3 py-1 text-sm border rounded">About</button>
                <button className="px-3 py-1 text-sm border rounded">Contact</button>
              </div>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Page Header</h3>
            <div className="p-3 bg-muted rounded">
              <div className="flex items-center gap-4">
                <Logo variant="full" size="md" />
                <div className="h-6 w-px bg-border"></div>
                <h4 className="text-lg font-semibold">Page Title</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogoShowcase
