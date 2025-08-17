import { useRef, useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Palette, Pipette, RotateCcw, Sparkles, Circle, Eye } from 'lucide-react'
import { applyOilPaintingFilter, applySimplifiedFilter, analyzeColor } from '@/utils/imageFilters'

export function ImageCanvas({ image, onColorPick }) {
  const canvasRef = useRef(null)
  const originalCanvasRef = useRef(null)
  const [isFiltered, setIsFiltered] = useState(false)
  const [isEyedropperActive, setIsEyedropperActive] = useState(false)
  const [filterType, setFilterType] = useState('none')
  const [isProcessing, setIsProcessing] = useState(false)
  const [studyMode, setStudyMode] = useState('original')
  const [valueGroups, setValueGroups] = useState(5)
  const [squintLevel, setSquintLevel] = useState(0)

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

    const ctx = canvas.getContext('2d')
    const originalCtx = originalCanvas.getContext('2d')
    
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
  }

  const applyOilFilter = async () => {
    const canvas = canvasRef.current
    const originalCanvas = originalCanvasRef.current
    if (!canvas || !originalCanvas) return

    setIsProcessing(true)
    
    // Small delay to show processing state
    await new Promise(resolve => setTimeout(resolve, 100))

    // Copy original image back first
    const ctx = canvas.getContext('2d')
    const originalCtx = originalCanvas.getContext('2d')
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
    const ctx = canvas.getContext('2d')
    const originalCtx = originalCanvas.getContext('2d')
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

    const ctx = canvas.getContext('2d')
    const originalCtx = originalCanvas.getContext('2d')
    const originalImageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height)
    ctx.putImageData(originalImageData, 0, 0)
    
    setIsFiltered(false)
    setFilterType('none')
    setStudyMode('original')
    setValueGroups(5)
    setSquintLevel(0)
  }

  const resetToOriginal = () => {
    const canvas = canvasRef.current
    const originalCanvas = originalCanvasRef.current
    if (!canvas || !originalCanvas) return

    const ctx = canvas.getContext('2d')
    const originalCtx = originalCanvas.getContext('2d')
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

    const ctx = canvas.getContext('2d')
    const originalCtx = originalCanvas.getContext('2d')
    
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
    
    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(x, y, 1, 1)
    const [r, g, b] = imageData.data
    
    const colorInfo = analyzeColor(r, g, b)
    onColorPick(colorInfo)
    
    setIsEyedropperActive(false)
  }

  const toggleEyedropper = () => {
    setIsEyedropperActive(!isEyedropperActive)
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
    <div className="canvas-container">
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px', 
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            padding: '8px', 
            background: 'linear-gradient(135deg, #dbeafe 0%, #f3e8ff 100%)', 
            borderRadius: '8px' 
          }}>
            <Palette style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
          </div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
            Image Editor
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          {/* Filter Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
            onClick={applySimpleFilter}
            className={`${filterType === 'simplified' ? 'btn-active' : 'btn-secondary'}`}
            disabled={isProcessing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              opacity: isProcessing ? '0.5' : '1',
              ...(filterType === 'simplified' && {
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
                borderRadius: '0.5rem',
                border: 'none',
                color: 'white'
              })
            }}
          >
            <Circle style={{ width: '16px', height: '16px' }} />
            {isProcessing && filterType === 'simplified' ? 'Processing...' : 'Simplified'}
          </button>
          <button
            onClick={applyOilFilter}
            className={`${filterType === 'oil' ? 'btn-active' : 'btn-secondary'}`}
            disabled={isProcessing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              opacity: isProcessing ? '0.5' : '1',
              ...(filterType === 'oil' && {
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                boxShadow: '0 2px 4px rgba(139, 92, 246, 0.3)',
                borderRadius: '0.5rem',
                border: 'none',
                color: 'white'
              })
            }}
          >
            <Sparkles style={{ width: '16px', height: '16px' }} />
            {isProcessing && filterType === 'oil' ? 'Processing...' : 'Oil Paint'}
          </button>
          <button
            onClick={toggleEyedropper}
            className={`${isEyedropperActive ? 'btn-active' : 'btn-secondary'}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              ...(isEyedropperActive && {
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)',
                borderRadius: '0.5rem',
                border: 'none',
                color: 'white'
              })
            }}
          >
            <Pipette style={{ width: '16px', height: '16px' }} />
            Eyedropper
          </button>
          <button
            onClick={resetImage}
            className="btn-secondary"
            disabled={!isFiltered}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              opacity: !isFiltered ? '0.5' : '1'
            }}
          >
            <RotateCcw style={{ width: '16px', height: '16px' }} />
            Reset
          </button>
          </div>
          
          {/* Study Mode Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Study Mode Dropdown */}
            <select 
              value={studyMode}
              onChange={(e) => setStudyMode(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                background: 'white',
                minWidth: '140px'
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: '#374151', whiteSpace: 'nowrap' }}>
                  {studyMode === 'grouped' ? 'Groups' : 'Levels'}: {valueGroups}
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={valueGroups}
                  onChange={(e) => setValueGroups(Number(e.target.value))}
                  style={{
                    width: '80px',
                    height: '6px',
                    borderRadius: '3px',
                    background: '#e2e8f0',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: '#374151', whiteSpace: 'nowrap' }}>
                  Blur: {squintLevel}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={squintLevel}
                  onChange={(e) => setSquintLevel(Number(e.target.value))}
                  style={{
                    width: '80px',
                    height: '6px',
                    borderRadius: '3px',
                    background: '#e2e8f0',
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
        background: '#f8fafc', 
        borderRadius: '12px', 
        padding: '16px' 
      }}>
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
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
            top: '24px',
            left: '24px',
            background: '#16a34a',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            🎯 Click on the image to sample color
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
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '12px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '8px',
              padding: '12px 16px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #3b82f6',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Applying filter...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Filter Status */}
      {(filterType !== 'none' || studyMode !== 'original') && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: '#eff6ff',
          borderRadius: '8px',
          border: '1px solid #bfdbfe'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#1e40af' }}>
            <div style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%' }}></div>
            <span style={{ fontWeight: '500' }}>
              {filterType !== 'none' 
                ? `${filterType === 'oil' ? 'Oil Paint' : 'Simplified'} filter applied`
                : `${studyMode === 'grayscale' ? 'Grayscale' : 
                      studyMode === 'grouped' ? 'Value Groups' :
                      studyMode === 'squint' ? 'Squint View' :
                      studyMode === 'posterize' ? 'Posterize' : 'Original'} study mode active`
              }
            </span>
          </div>
        </div>
      )}
    </div>
  )
}