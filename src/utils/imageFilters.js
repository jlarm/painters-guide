// Oil painting filter effect
export function applyOilPaintingFilter(canvas, radius = 4, intensity = 25) {
  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  const width = canvas.width
  const height = canvas.height
  
  const newData = new Uint8ClampedArray(data.length)
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const intensityCount = new Array(intensity).fill(0)
      const avgR = new Array(intensity).fill(0)
      const avgG = new Array(intensity).fill(0)
      const avgB = new Array(intensity).fill(0)
      
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = Math.max(0, Math.min(width - 1, x + dx))
          const ny = Math.max(0, Math.min(height - 1, y + dy))
          const idx = (ny * width + nx) * 4
          
          const r = data[idx]
          const g = data[idx + 1] 
          const b = data[idx + 2]
          
          const curIntensity = Math.floor(((r + g + b) / 3) * intensity / 255)
          const clampedIntensity = Math.max(0, Math.min(intensity - 1, curIntensity))
          
          intensityCount[clampedIntensity]++
          avgR[clampedIntensity] += r
          avgG[clampedIntensity] += g
          avgB[clampedIntensity] += b
        }
      }
      
      let maxIndex = 0
      for (let i = 1; i < intensity; i++) {
        if (intensityCount[i] > intensityCount[maxIndex]) {
          maxIndex = i
        }
      }
      
      const pixelIdx = (y * width + x) * 4
      if (intensityCount[maxIndex] > 0) {
        newData[pixelIdx] = avgR[maxIndex] / intensityCount[maxIndex]
        newData[pixelIdx + 1] = avgG[maxIndex] / intensityCount[maxIndex]
        newData[pixelIdx + 2] = avgB[maxIndex] / intensityCount[maxIndex]
      } else {
        newData[pixelIdx] = data[pixelIdx]
        newData[pixelIdx + 1] = data[pixelIdx + 1]
        newData[pixelIdx + 2] = data[pixelIdx + 2]
      }
      newData[pixelIdx + 3] = data[pixelIdx + 3] // Alpha
    }
  }
  
  const newImageData = new ImageData(newData, width, height)
  ctx.putImageData(newImageData, 0, 0)
}

// Simplified oil painting effect (faster)
export function applySimplifiedFilter(canvas, radius = 2) {
  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  const width = canvas.width
  const height = canvas.height
  
  const newData = new Uint8ClampedArray(data.length)
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, count = 0
      
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = Math.max(0, Math.min(width - 1, x + dx))
          const ny = Math.max(0, Math.min(height - 1, y + dy))
          const idx = (ny * width + nx) * 4
          
          r += data[idx]
          g += data[idx + 1]
          b += data[idx + 2]
          count++
        }
      }
      
      const pixelIdx = (y * width + x) * 4
      newData[pixelIdx] = Math.floor(r / count)
      newData[pixelIdx + 1] = Math.floor(g / count)
      newData[pixelIdx + 2] = Math.floor(b / count)
      newData[pixelIdx + 3] = data[pixelIdx + 3]
    }
  }
  
  const newImageData = new ImageData(newData, width, height)
  ctx.putImageData(newImageData, 0, 0)
}

// Convert RGB to HSL for color analysis
export function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  
  return [h * 360, s * 100, l * 100]
}

// Get color temperature (warm/cool)
export function getColorTemperature(r, g, b) {
  // Simple temperature calculation based on red vs blue
  const warmth = (r - b) / 255
  if (warmth > 0.2) return 'Warm'
  if (warmth < -0.2) return 'Cool'
  return 'Neutral'
}

// Get color information for analysis
export function analyzeColor(r, g, b) {
  const [h, s, l] = rgbToHsl(r, g, b)
  const temperature = getColorTemperature(r, g, b)
  
  return {
    rgb: { r, g, b },
    hsl: { h: Math.round(h), s: Math.round(s), l: Math.round(l) },
    hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
    chroma: Math.round(s), // Saturation represents chroma
    value: Math.round(l), // Lightness represents value
    temperature: temperature,
    tint: h < 60 || h > 300 ? 'Warm' : h > 180 ? 'Cool' : 'Neutral'
  }
}