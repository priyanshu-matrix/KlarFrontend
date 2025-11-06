# Highlight Component

A versatile React component for highlighting text or wrapping other components with customizable color palettes and styling options.

## Features

- 🎨 **15+ Predefined Color Palettes** - Primary, secondary, status colors, light variations, gradients, and more
- 🎯 **Multiple Variants** - Filled, outlined, ghost, and subtle styles
- 📏 **4 Size Options** - Small, medium, large, and xlarge
- 🔄 **Flexible Rounded Corners** - None, small, medium, large, and full rounded options
- 🎨 **Custom Colors** - Pass your own color palette
- 🖱️ **Interactive** - Optional click handlers with hover effects
- 🧩 **Versatile** - Highlight text or wrap entire components
- ♿ **Accessible** - Proper ARIA attributes and keyboard support

## Installation

Import the component in your React file:

```jsx
import Highlight, { COLOR_PALETTES } from './Assets/Highlight';
```

## Basic Usage

### Text Highlighting

```jsx
// Simple text highlighting
<Highlight text="Important text" palette="primary" />

// Inline content highlighting
<p>This is <Highlight palette="success">highlighted content</Highlight> in a sentence.</p>
```

### Component Wrapping

```jsx
// Wrap entire components
<Highlight palette="lightInfo" className="block p-4">
  <div>
    <h3>Card Title</h3>
    <p>This entire card is highlighted.</p>
  </div>
</Highlight>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to be highlighted (alternative to text) |
| `text` | `string` | - | Text to be highlighted (alternative to children) |
| `palette` | `string` | `'primary'` | Predefined color palette name |
| `customColors` | `object` | - | Custom color palette object |
| `variant` | `string` | `'filled'` | Style variant: 'filled', 'outlined', 'ghost', 'subtle' |
| `size` | `string` | `'medium'` | Size: 'small', 'medium', 'large', 'xlarge' |
| `rounded` | `string` | `'medium'` | Border radius: 'none', 'small', 'medium', 'large', 'full' |
| `className` | `string` | `''` | Additional CSS classes |
| `style` | `object` | `{}` | Additional inline styles |
| `onClick` | `function` | - | Click event handler |
| `title` | `string` | - | Tooltip text |
| `id` | `string` | - | HTML id attribute for the element |

## Available Color Palettes

### Primary Colors
- `primary` - Blue theme
- `secondary` - Gray theme

### Status Colors
- `success` - Green theme
- `warning` - Orange theme
- `error` - Red theme
- `info` - Cyan theme

### Light Variations
- `lightPrimary` - Light blue theme
- `lightSuccess` - Light green theme
- `lightWarning` - Light orange theme
- `lightError` - Light red theme
- `lightInfo` - Light cyan theme

### Gradient Styles
- `gradientPurple` - Purple to pink gradient
- `gradientOrange` - Pink to red gradient
- `gradientBlue` - Blue to cyan gradient

### Theme Colors
- `dark` - Dark theme
- `neutral` - Neutral gray theme

## Custom Colors

You can pass a custom color object with the following structure:

```jsx
const customColors = {
  background: '#ff6b6b', // Background color
  color: '#ffffff',      // Text color
  border: '#ee5a52'      // Border color (optional)
};

<Highlight text="Custom" customColors={customColors} />
```

## Variants

### Filled (Default)
```jsx
<Highlight text="Filled" variant="filled" palette="primary" />
```

### Outlined
```jsx
<Highlight text="Outlined" variant="outlined" palette="primary" />
```

### Ghost
```jsx
<Highlight text="Ghost" variant="ghost" palette="primary" />
```

### Subtle
```jsx
<Highlight text="Subtle" variant="subtle" palette="primary" />
```

## Sizes

```jsx
<Highlight text="Small" size="small" />
<Highlight text="Medium" size="medium" />
<Highlight text="Large" size="large" />
<Highlight text="XLarge" size="xlarge" />
```

## Interactive Highlights

```jsx
<Highlight
  text="Click me!"
  palette="primary"
  id="my-highlight"
  onClick={() => alert('Clicked!')}
  title="Click to see alert"
/>
```

## Using ID for DOM Manipulation

```jsx
// Component with ID
<Highlight
  text="Target Element"
  palette="info"
  id="target-highlight"
/>

// Later in your code, you can target it
const element = document.getElementById('target-highlight');
element.style.transform = 'scale(1.2)';
```## Common Use Cases

### Status Indicators
```jsx
<div className="flex items-center gap-2">
  <Highlight text="Online" palette="success" size="small" />
  <span>User is currently online</span>
</div>
```

### Tags/Labels
```jsx
<div className="flex gap-2">
  <Highlight text="React" palette="lightPrimary" rounded="full" size="small" />
  <Highlight text="JavaScript" palette="lightWarning" rounded="full" size="small" />
  <Highlight text="CSS" palette="lightInfo" rounded="full" size="small" />
</div>
```

### Cards/Containers
```jsx
<Highlight palette="gradientPurple" className="block p-6 mb-4">
  <h2 className="text-xl font-bold mb-2">Featured Content</h2>
  <p>This entire card has a beautiful gradient background.</p>
</Highlight>
```

### Inline Text Emphasis
```jsx
<p>
  Our system supports <Highlight text="real-time updates" palette="info" />
  and <Highlight text="automatic backups" palette="success" />.
</p>
```

## Styling

The component uses Tailwind CSS classes by default but also supports custom styles. You can:

1. Add additional Tailwind classes via the `className` prop
2. Override styles using the `style` prop
3. Customize colors using the `customColors` prop

## Accessibility

The component includes:
- Proper semantic HTML structure
- ARIA attributes when needed
- Keyboard navigation support for interactive elements
- Hover and focus states

## TypeScript

The component includes PropTypes validation and can be easily converted to TypeScript by replacing PropTypes with TypeScript interfaces.

## Browser Support

This component works in all modern browsers that support:
- CSS Grid and Flexbox
- CSS Custom Properties
- ES6+ JavaScript features