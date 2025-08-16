# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (runs Vite dev server with hot reload)
- **Build for production**: `npm run build` (creates optimized bundle in `dist/`)
- **Run linter**: `npm run lint` (ESLint with React-specific rules)
- **Preview production build**: `npm run preview` (serves built files locally)

## Project Overview

This is a **professional Painter's Guide** React application that helps artists analyze reference photos for oil painting. The app features a modern, polished UI with comprehensive image processing and detailed color analysis tools designed for professional artists.

### Key Features
- **Image Upload**: Drag-and-drop or click to upload reference images
- **Oil Painting Filters**: "Simplified" (fast blur) and "Oil Paint" (advanced artistic filter)
- **Eyedropper Tool**: Click any pixel to analyze color properties
- **Color Analysis**: Displays chroma, value, temperature, tint, HSL values, and mixing notes

### Architecture

#### Main Components
- **App.jsx**: Main application with state management for images and color selection
- **ImageUpload.jsx**: Handles file upload with drag-and-drop support
- **ImageCanvas.jsx**: Canvas-based image editor with filters and eyedropper tool
- **ColorAnalysis.jsx**: Detailed color information display with mixing recommendations

#### Key Utilities
- **imageFilters.js**: Canvas-based image processing algorithms
  - `applyOilPaintingFilter()`: Advanced oil painting effect with intensity sampling
  - `applySimplifiedFilter()`: Fast blur effect for basic reference
  - `analyzeColor()`: RGB to HSL conversion and color property analysis

#### UI Components (shadcn/ui)
- **button.jsx**: Styled button variants (default, outline, destructive, etc.)
- **card.jsx**: Card components with header, content, footer sections
- **badge.jsx**: Status badges for color properties
- **utils.js**: Class name utility with clsx and tailwind-merge

### Technology Stack
- **React 19.1.1**: Modern React with hooks and functional components
- **Vite 7.1.2**: Fast build tool with HMR and ES modules
- **Tailwind CSS 4.1.12**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for UI elements
- **Canvas API**: For image processing and color sampling

### Styling System
- **Tailwind CSS**: Configured with custom color variables and design tokens
- **CSS Custom Properties**: HSL-based color system for light/dark theme support
- **Component Styling**: Uses cn() utility for conditional class names
- **Responsive Design**: Grid layouts with mobile-first approach

### Image Processing Details
- **Oil Painting Filter**: Uses intensity-based pixel sampling to create painterly effects
- **Color Sampling**: Precise pixel-level color extraction with RGB values
- **Canvas Management**: Maintains original image data for non-destructive editing
- **Color Analysis**: Converts RGB to HSL and calculates artistic color properties

### Development Notes
- Uses path aliases (`@/` points to `src/`)
- ES6+ modules with Vite's native ES module support
- Canvas-based image manipulation for performance
- Responsive design with mobile and desktop layouts
- All components use React hooks (no class components)