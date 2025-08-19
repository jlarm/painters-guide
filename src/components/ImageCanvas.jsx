import { useRef, useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Palette, Pipette, RotateCcw, Sparkles, Circle, Eye, Maximize } from 'lucide-react'
import { applyOilPaintingFilter, applySimplifiedFilter, analyzeColor } from '@/utils/imageFilters'

export function ImageCanvas({ image, onColorPick, onFullscreen }) {
  const canvasRef = useRef(null)
  const originalCanvasRef = useRef(null)
  const [isFiltered, setIsFiltered] = useState(false)
  const [isEyedropperActive, setIsEyedropperActive] = useState(false)
  const [filterType, setFilterType] = useState('none')
  const [isProcessing, setIsProcessing] = useState(false)
  const [studyMode, setStudyMode] = useState('original')
  const [valueGroups, setValueGroups] = useState(5)
  const [squintLevel, setSquintLevel] = useState(0)
  const [eyedropPosition, setEyedropPosition] = useState(null)

  useEffect(() => {
    if (image) {
      drawImageToCanvas(image)
    }
  }, [image])

  // Apply study mode when it changes
  useEffect(() => {
    if (image && studyMode !== 'original') {
      applyStudyModeToCanvas()
    } else if (image && studyMode === 'original') {
      resetToOriginal()
    }
  }, [studyMode, valueGroups, squintLevel, image])

  const drawImageToCanvas = (img) => {
    const canvas = canvasRef.current
    const originalCanvas = originalCanvasRef.current
    if (!canvas || !originalCanvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const originalCtx = originalCanvas.getContext('2d', { willReadFrequently: true })
    
    // Calculate dimensions to fit canvas while maintaining aspect ratio
    const maxWidth = 1000
    const maxHeight = 700
    let { width, height } = img
    
    if (width > maxWidth) {
      height = (height * maxWidth) / width
      width = maxWidth
    }
    if (height > maxHeight) {
      width = (width * maxHeight) / height
      height = maxHeight
    }
    
    canvas.width = width
    canvas.height = height
    originalCanvas.width = width
    originalCanvas.height = height
    
    // Draw original image
    ctx.drawImage(img, 0, 0, width, height)
    originalCtx.drawImage(img, 0, 0, width, height)
    
    setIsFiltered(false)
    setFilterType('none')
    setStudyMode('original')
    setEyedropPosition(null)
  }

  const applyOilFilter = async () => {
    const canvas = canvasRef.current
    const originalCanvas = originalCanvasRef.current
    if (!canvas || !originalCanvas) return

    setIsProcessing(true)
    
    // Small delay to show processing state
    await new Promise(resolve => setTimeout(resolve, 100))

    // Copy original image back first
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const originalCtx = originalCanvas.getContext('2d', { willReadFrequently: true })
    const originalImageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height)
    ctx.putImageData(originalImageData, 0, 0)
    
    // Apply oil painting filter
    applyOilPaintingFilter(canvas, 3, 20)
    setIsFiltered(true)
    setFilterType('oil')
    setIsProcessing(false)
  }

  const applySimpleFilter = async () => {
    const canvas = canvasRef.current
    const originalCanvas = originalCanvasRef.current
    if (!canvas || !originalCanvas) return

    setIsProcessing(true)
    
    // Small delay to show processing state
    await new Promise(resolve => setTimeout(resolve, 100))

    // Copy original image back first
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const originalCtx = originalCanvas.getContext('2d', { willReadFrequently: true })
    const originalImageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height)
    ctx.putImageData(originalImageData, 0, 0)
    
    // Apply simplified filter
    applySimplifiedFilter(canvas, 2)
    setIsFiltered(true)
    setFilterType('simplified')
    setIsProcessing(false)
  }

  const resetImage = () => {
    const canvas = canvasRef.current
    const originalCanvas = originalCanvasRef.current
    if (!canvas || !originalCanvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const originalCtx = originalCanvas.getContext('2d', { willReadFrequently: true })
    const originalImageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height)
    ctx.putImageData(originalImageData, 0, 0)
    
    setIsFiltered(false)
    setFilterType('none')
    setStudyMode('original')
    setEyedropPosition(null)
    setValueGroups(5)
    setSquintLevel(0)
  }

  const resetToOriginal = () => {
    const canvas = canvasRef.current
    const originalCanvas = originalCanvasRef.current
    if (!canvas || !originalCanvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const originalCtx = originalCanvas.getContext('2d', { willReadFrequently: true })
    const originalImageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height)
    ctx.putImageData(originalImageData, 0, 0)
  }

  // Study mode helper functions
  const applyGrayscale = useCallback((data) => {
    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
      data[i] = gray     // Red
      data[i + 1] = gray // Green
      data[i + 2] = gray // Blue
      // Alpha stays the same
    }
  }, [])
  
  const applyValueGrouping = useCallback((data, groups) => {
    const step = 255 / (groups - 1)
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] // Already grayscale at this point
      const groupedValue = Math.round(gray / step) * step
      data[i] = groupedValue
      data[i + 1] = groupedValue
      data[i + 2] = groupedValue
    }
  }, [])
  
  const applyPosterize = useCallback((data, levels) => {
    const step = 255 / (levels - 1)
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.round(data[i] / step) * step
      data[i + 1] = Math.round(data[i + 1] / step) * step
      data[i + 2] = Math.round(data[i + 2] / step) * step
    }
  }, [])
  
  const applyStudyModeToCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const originalCanvas = originalCanvasRef.current
    if (!canvas || !originalCanvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const originalCtx = originalCanvas.getContext('2d', { willReadFrequently: true })
    
    const imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height)
    const data = imageData.data
    
    // Apply blur first if squint mode
    if (studyMode === 'squint' && squintLevel > 0) {
      ctx.filter = `blur(${squintLevel}px)`
      ctx.drawImage(originalCanvas, 0, 0)
      ctx.filter = 'none'
      return
    }
    
    switch (studyMode) {
      case 'grayscale':
        applyGrayscale(data)
        break
      case 'grouped':
        applyGrayscale(data)
        applyValueGrouping(data, valueGroups)
        break
      case 'posterize':
        applyPosterize(data, valueGroups)
        break
      default:
        // Original - no changes needed
        break
    }
    
    ctx.putImageData(imageData, 0, 0)
  }, [studyMode, valueGroups, squintLevel, applyGrayscale, applyValueGrouping, applyPosterize])

  const handleCanvasClick = (e) => {
    if (!isEyedropperActive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width))
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height))
    
    // Store position for indicator (relative to the container, accounting for canvas position and padding)
    const containerRect = canvas.parentElement.getBoundingClientRect()
    const displayX = e.clientX - containerRect.left
    const displayY = e.clientY - containerRect.top
    setEyedropPosition({ x: displayX, y: displayY })
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const imageData = ctx.getImageData(x, y, 1, 1)
    const [r, g, b] = imageData.data
    
    const colorInfo = analyzeColor(r, g, b)
    onColorPick(colorInfo)
    
    setIsEyedropperActive(false)
  }

  const toggleEyedropper = () => {
    setIsEyedropperActive(!isEyedropperActive)
  }

  const handleFullscreen = () => {
    if (onFullscreen) {
      onFullscreen({
        image: image,
        filterType,
        studyMode,
        valueGroups,
        squintLevel
      })
    }
  }

  if (!image) {
    return (
      <div className="canvas-container">
        <div style={{ textAlign: 'center', color: '#64748b', padding: '48px 0' }}>
          <Palette style={{ width: '64px', height: '64px', margin: '0 auto 16px auto', color: '#cbd5e1' }} />
          <p style={{ fontSize: '18px', margin: 0 }}>Upload an image to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '4px', 
      border: '1px solid #d1d5db',
      padding: '16px'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px', 
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            padding: '4px', 
            backgroundColor: '#f3f4f6',
            borderRadius: '3px' 
          }}>
            <Palette style={{ width: '16px', height: '16px', color: '#4b5563' }} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Image Editor
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          {/* Filter Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button
            onClick={applySimpleFilter}
            disabled={isProcessing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              padding: '6px 10px',
              backgroundColor: filterType === 'simplified' ? '#374151' : '#f3f4f6',
              color: filterType === 'simplified' ? 'white' : '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '3px',
              cursor: 'pointer',
              opacity: isProcessing ? '0.5' : '1'
            }}
          >
            <Circle style={{ width: '12px', height: '12px' }} />
            {isProcessing && filterType === 'simplified' ? 'Processing...' : 'Simplified'}
          </button>
          <button
            onClick={applyOilFilter}
            disabled={isProcessing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              padding: '6px 10px',
              backgroundColor: filterType === 'oil' ? '#374151' : '#f3f4f6',
              color: filterType === 'oil' ? 'white' : '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '3px',
              cursor: 'pointer',
              opacity: isProcessing ? '0.5' : '1'
            }}
          >
            <Sparkles style={{ width: '12px', height: '12px' }} />
            {isProcessing && filterType === 'oil' ? 'Processing...' : 'Oil Paint'}
          </button>
          <button
            onClick={toggleEyedropper}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              padding: '6px 10px',
              backgroundColor: isEyedropperActive ? '#374151' : '#f3f4f6',
              color: isEyedropperActive ? 'white' : '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            <Pipette style={{ width: '12px', height: '12px' }} />
            Eyedropper
          </button>
          <button
            onClick={resetImage}
            disabled={!isFiltered}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              padding: '6px 10px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '3px',
              cursor: 'pointer',
              opacity: !isFiltered ? '0.5' : '1'
            }}
          >
            <RotateCcw style={{ width: '12px', height: '12px' }} />
            Reset
          </button>
          <button
            onClick={handleFullscreen}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              padding: '6px 10px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
            title="View fullscreen"
          >
            <Maximize style={{ width: '12px', height: '12px' }} />
            Full Screen
          </button>
          </div>
          
          {/* Study Mode Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Study Mode Dropdown */}
            <select 
              value={studyMode}
              onChange={(e) => setStudyMode(e.target.value)}
              style={{
                padding: '4px 8px',
                border: '1px solid #d1d5db',
                borderRadius: '3px',
                fontSize: '12px',
                background: 'white',
                minWidth: '110px',
                color: '#374151'
              }}
            >
              <option value="original">Original</option>
              <option value="grayscale">Grayscale</option>
              <option value="grouped">Value Groups</option>
              <option value="squint">Squint View</option>
              <option value="posterize">Posterize</option>
            </select>
            
            {/* Value Groups Control */}
            {(studyMode === 'grouped' || studyMode === 'posterize') && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                  {studyMode === 'grouped' ? 'Groups' : 'Levels'}: {valueGroups}
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={valueGroups}
                  onChange={(e) => setValueGroups(Number(e.target.value))}
                  style={{
                    width: '60px',
                    height: '4px',
                    borderRadius: '2px',
                    background: '#e5e7eb',
                    outline: 'none',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer'
                  }}
                  className="custom-slider"
                />
              </div>
            )}
            
            {/* Squint Level Control */}
            {studyMode === 'squint' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <label style={{ fontSize: '11px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                  Blur: {squintLevel}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={squintLevel}
                  onChange={(e) => setSquintLevel(Number(e.target.value))}
                  style={{
                    width: '60px',
                    height: '4px',
                    borderRadius: '2px',
                    background: '#e5e7eb',
                    outline: 'none',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer'
                  }}
                  className="custom-slider"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div style={{ 
        position: 'relative', 
        background: '#f9fafb', 
        borderRadius: '3px', 
        padding: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '2px',
            border: '1px solid #d1d5db',
            display: 'block',
            margin: '0 auto',
            cursor: isEyedropperActive ? 'crosshair' : 'default',
            opacity: isProcessing ? '0.7' : '1'
          }}
        />
        <canvas
          ref={originalCanvasRef}
          style={{ display: 'none' }}
        />
        {isEyedropperActive && (
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: '#374151',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '3px',
            fontSize: '11px',
            fontWeight: '400',
            border: '1px solid #4b5563'
          }}>
            Click image to sample color
          </div>
        )}
        {eyedropPosition && (
          <div style={{
            position: 'absolute',
            left: `${eyedropPosition.x}px`,
            top: `${eyedropPosition.y}px`,
            width: '20px',
            height: '20px',
            border: '2px solid #3b82f6',
            borderRadius: '50%',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            animation: 'eyedropPulse 2s ease-in-out infinite',
            zIndex: 10
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '4px',
              height: '4px',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }}></div>
          </div>
        )}
        {isProcessing && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '3px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '3px',
              padding: '8px 12px',
              border: '1px solid #d1d5db'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  border: '2px solid #6b7280',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <span style={{ fontSize: '12px', fontWeight: '400', color: '#374151' }}>
                  Processing...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Filter Status */}
      {(filterType !== 'none' || studyMode !== 'original') && (
        <div style={{
          marginTop: '12px',
          padding: '8px 10px',
          background: '#f3f4f6',
          borderRadius: '3px',
          border: '1px solid #d1d5db'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#4b5563' }}>
            <div style={{ width: '4px', height: '4px', background: '#6b7280', borderRadius: '50%' }}></div>
            <span style={{ fontWeight: '400' }}>
              {filterType !== 'none' 
                ? `${filterType === 'oil' ? 'Oil Paint' : 'Simplified'} filter active`
                : `${studyMode === 'grayscale' ? 'Grayscale' : 
                      studyMode === 'grouped' ? 'Value Groups' :
                      studyMode === 'squint' ? 'Squint View' :
                      studyMode === 'posterize' ? 'Posterize' : 'Original'} study mode`
              }
            </span>
          </div>
        </div>
      )}
    </div>
  )
}