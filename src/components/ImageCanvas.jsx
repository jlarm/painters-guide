import { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Palette, Pipette, RotateCcw, Sparkles, Circle } from 'lucide-react'
import { applyOilPaintingFilter, applySimplifiedFilter, analyzeColor } from '@/utils/imageFilters'

export function ImageCanvas({ image, onColorPick }) {
  const canvasRef = useRef(null)
  const originalCanvasRef = useRef(null)
  const [isFiltered, setIsFiltered] = useState(false)
  const [isEyedropperActive, setIsEyedropperActive] = useState(false)
  const [filterType, setFilterType] = useState('none')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (image) {
      drawImageToCanvas(image)
    }
  }, [image])

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
  }

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
              opacity: isProcessing ? '0.5' : '1'
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
              opacity: isProcessing ? '0.5' : '1'
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
              fontSize: '14px'
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
      {filterType !== 'none' && (
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
              {filterType === 'oil' ? 'Oil Paint' : 'Simplified'} filter applied
            </span>
          </div>
        </div>
      )}
    </div>
  )
}