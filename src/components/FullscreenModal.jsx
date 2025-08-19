import { useRef, useEffect, useState } from 'react'
import { X, Maximize2, Minimize2 } from 'lucide-react'
import { applyOilPaintingFilter, applySimplifiedFilter } from '@/utils/imageFilters'

export function FullscreenModal({ 
  isOpen, 
  onClose, 
  image, 
  filterType = 'none',
  studyMode = 'original',
  valueGroups = 5,
  squintLevel = 0
}) {
  const canvasRef = useRef(null)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    if (!isOpen || !image) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    
    // Set canvas to full viewport size
    canvas.width = window.innerWidth - 100
    canvas.height = window.innerHeight - 100
    
    // Calculate scaling to fit image in canvas while maintaining aspect ratio
    const scale = Math.min(
      (canvas.width - 40) / image.width,
      (canvas.height - 40) / image.height
    )
    
    const scaledWidth = image.width * scale
    const scaledHeight = image.height * scale
    const x = (canvas.width - scaledWidth) / 2
    const y = (canvas.height - scaledHeight) / 2
    
    // Clear canvas (transparent background since parent div handles the grey background)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw image
    ctx.drawImage(image, x, y, scaledWidth, scaledHeight)
    
    // Apply current filter settings
    if (filterType === 'oil') {
      const imageData = ctx.getImageData(x, y, scaledWidth, scaledHeight)
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = scaledWidth
      tempCanvas.height = scaledHeight
      const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true })
      tempCtx.putImageData(imageData, 0, 0)
      applyOilPaintingFilter(tempCanvas, 3, 20)
      ctx.drawImage(tempCanvas, x, y)
    } else if (filterType === 'simplified') {
      const imageData = ctx.getImageData(x, y, scaledWidth, scaledHeight)
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = scaledWidth
      tempCanvas.height = scaledHeight
      const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true })
      tempCtx.putImageData(imageData, 0, 0)
      applySimplifiedFilter(tempCanvas, 2)
      ctx.drawImage(tempCanvas, x, y)
    }
    
    // Apply study mode effects
    if (studyMode !== 'original') {
      applyStudyModeToFullscreenCanvas(ctx, x, y, scaledWidth, scaledHeight)
    }
    
  }, [isOpen, image, filterType, studyMode, valueGroups, squintLevel])

  const applyStudyModeToFullscreenCanvas = (ctx, x, y, width, height) => {
    const imageData = ctx.getImageData(x, y, width, height)
    const data = imageData.data
    
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
      case 'squint':
        // For squint mode, apply blur to the entire canvas
        if (squintLevel > 0) {
          ctx.filter = `blur(${squintLevel * 2}px)`
          ctx.drawImage(canvasRef.current, 0, 0)
          ctx.filter = 'none'
          return
        }
        break
    }
    
    if (studyMode !== 'squint') {
      ctx.putImageData(imageData, x, y)
    }
  }

  const applyGrayscale = (data) => {
    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
      data[i] = gray
      data[i + 1] = gray
      data[i + 2] = gray
    }
  }
  
  const applyValueGrouping = (data, groups) => {
    const step = 255 / (groups - 1)
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i]
      const groupedValue = Math.round(gray / step) * step
      data[i] = groupedValue
      data[i + 1] = groupedValue
      data[i + 2] = groupedValue
    }
  }
  
  const applyPosterize = (data, levels) => {
    const step = 255 / (levels - 1)
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.round(data[i] / step) * step
      data[i + 1] = Math.round(data[i + 1] / step) * step
      data[i + 2] = Math.round(data[i + 2] / step) * step
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#6b7280',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      {/* Control Panel */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          display: 'flex',
          gap: '8px',
          zIndex: 10000
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '12px',
            color: 'white',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          title={isMinimized ? 'Maximize' : 'Minimize'}
        >
          {isMinimized ? (
            <Maximize2 style={{ width: '18px', height: '18px' }} />
          ) : (
            <Minimize2 style={{ width: '18px', height: '18px' }} />
          )}
        </button>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '12px',
            color: 'white',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          title="Close (Esc)"
        >
          <X style={{ width: '18px', height: '18px' }} />
        </button>
      </div>

      {/* Status Info */}
      {(filterType !== 'none' || studyMode !== 'original') && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '12px 16px',
            color: 'white',
            backdropFilter: 'blur(8px)',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: 10000
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {filterType !== 'none' 
            ? `${filterType === 'oil' ? 'Oil Paint' : 'Simplified'} filter applied`
            : `${studyMode === 'grayscale' ? 'Grayscale' : 
                studyMode === 'grouped' ? `Value Groups (${valueGroups})` :
                studyMode === 'squint' ? `Squint View (${squintLevel}px)` :
                studyMode === 'posterize' ? `Posterize (${valueGroups} levels)` : 'Original'} study mode`
          }
        </div>
      )}

      {/* Canvas */}
      <div
        style={{
          position: 'relative',
          width: isMinimized ? '60%' : '100%',
          height: isMinimized ? '60%' : '100%',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <canvas
          ref={canvasRef}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            borderRadius: '8px'
          }}
        />
      </div>

      {/* Instructions */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '14px',
          textAlign: 'center',
          zIndex: 10000
        }}
        onClick={(e) => e.stopPropagation()}
      >
        Press ESC or click outside to close
      </div>
    </div>
  )
}