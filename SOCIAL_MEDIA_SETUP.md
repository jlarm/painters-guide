# Social Media & SEO Setup

## Overview
This document outlines the social media meta tags and SEO optimizations that have been added to the Painter's Perspective app.

## Social Media Preview Image

To complete the social media setup, you'll need to create an `og-image.jpg` file in the `/public` directory.

### Recommended Image Specifications:
- **Size**: 1200x630 pixels (Facebook/Twitter recommended)
- **Format**: JPG or PNG
- **Content**: Screenshot of the app interface showing:
  - The main image editor with a reference photo
  - The tabbed color analysis interface
  - Some color swatches and analysis results
  - The app title "Painter's Perspective"

### Quick Creation Steps:
1. Take a screenshot of the app with an image loaded
2. Add the app title and tagline as overlay text
3. Resize to 1200x630 pixels
4. Save as `/public/og-image.jpg`

## Meta Tags Added

### Primary SEO Tags
- Title, description, keywords
- Author and robots directives
- Canonical URL

### Open Graph (Facebook/LinkedIn)
- og:type, og:url, og:title
- og:description, og:image
- og:site_name, og:locale

### Twitter Cards
- twitter:card (summary_large_image)
- twitter:title, twitter:description
- twitter:image, twitter:creator

### Additional Features
- Apple Touch Icon (180x180 SVG)
- Web App Manifest for PWA capability
- Structured Data (JSON-LD) for rich snippets
- Robots.txt and sitemap.xml for SEO

## Testing Social Media Previews

### Facebook Sharing Debugger
- URL: https://developers.facebook.com/tools/debug/
- Test URL: https://painters-perspective.vercel.app/

### Twitter Card Validator
- URL: https://cards-dev.twitter.com/validator
- Test URL: https://painters-perspective.vercel.app/

### LinkedIn Post Inspector
- URL: https://www.linkedin.com/post-inspector/
- Test URL: https://painters-perspective.vercel.app/

## PWA Features
The app now includes a web manifest that allows users to:
- Install as a Progressive Web App
- Add to home screen on mobile devices
- Run in standalone mode

## SEO Benefits
- Rich snippets in search results
- Better social media link previews
- Improved mobile experience
- Enhanced discoverability