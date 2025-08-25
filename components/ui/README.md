# UXplain Logo Components

This directory contains the new UXplain logo components that can be used throughout the application.

## Components

### Logo
The main logo component with three variants:
- `full` - Full logo with "UXplain" text (default)
- `compact` - Compact logo with "UX" text
- `icon` - Just the icon without text

**Props:**
- `variant`: 'full' | 'compact' | 'icon' (default: 'full')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `className`: Additional CSS classes

**Usage:**
```tsx
import { Logo } from '@/components/ui/logo'

// Full logo (default)
<Logo />

// Compact logo
<Logo variant="compact" />

// Icon only
<Logo variant="icon" />

// Different sizes
<Logo size="lg" />
<Logo size="sm" />
```

### CompactLogo
A specialized compact logo component for smaller spaces like navigation bars.

**Props:**
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `className`: Additional CSS classes
- `showText`: boolean to show/hide "UX" text (default: true)

**Usage:**
```tsx
import { CompactLogo } from '@/components/ui/compact-logo'

// With text
<CompactLogo />

// Without text (icon only)
<CompactLogo showText={false} />

// Different sizes
<CompactLogo size="lg" />
<CompactLogo size="sm" />
```

### LogoShowcase
A demo component that displays all logo variants and sizes for testing and reference.

**Usage:**
```tsx
import { LogoShowcase } from '@/components/ui/logo-showcase'

<LogoShowcase />
```

## Logo Design

The UXplain logo features:
- **Person figure**: Represents the user/UX focus
- **Speech bubble**: Symbolizes communication and explanation
- **Bar chart**: Represents data analysis and insights
- **Typography**: Clean, modern font for "UXplain" text

## Color Schemes

The logo components use CSS custom properties for colors:
- `currentColor` for stroke and fill (inherits from parent)
- `text-foreground` for text color
- Automatically adapts to light/dark themes

## File Assets

- `public/favicon.svg` - Main favicon (dark theme)
- `public/favicon-white.svg` - White favicon for dark backgrounds

## Integration Examples

### In Headers
```tsx
<div className="flex items-center gap-6">
  <Logo variant="full" size="lg" />
  <div className="h-8 w-px bg-border"></div>
  <h1 className="text-3xl font-bold">Page Title</h1>
</div>
```

### In Navigation
```tsx
<nav className="flex items-center justify-between p-4">
  <CompactLogo size="md" />
  <div className="flex space-x-4">
    <a href="/">Home</a>
    <a href="/about">About</a>
  </div>
</nav>
```

### As Favicon
```tsx
// In your HTML head
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

## Styling

All logo components are built with Tailwind CSS and follow the design system:
- Responsive sizing
- Consistent spacing
- Theme-aware colors
- Accessible contrast ratios

## Browser Support

- Modern browsers with SVG support
- Fallback to PNG versions if needed
- Responsive design for all screen sizes
