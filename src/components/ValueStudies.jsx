import { useState, useRef, useEffect, useCallback } from 'react'
import { Eye, Layers, Download, RotateCcw } from 'lucide-react'

export function ValueStudies({ image, onValueAnalysis }) {
  const canvasRef = useRef(null)
  const originalCanvasRef = useRef(null)
  const [studyMode, setStudyMode] = useState('original')
  const [valueGroups, setValueGroups] = useState(5)
  const [squintLevel, setSquintLevel] = useState(0)
  
  // Define helper functions first
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
  
  // Now define applyStudyMode that uses the helper functions
  const applyStudyMode = useCallback((sourceCanvas, targetCanvas, mode, groups, blur) => {
    const sourceCtx = sourceCanvas.getContext('2d')
    const targetCtx = targetCanvas.getContext('2d')
    
    const imageData = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height)
    const data = imageData.data
    
    // Apply blur first if squint mode
    if (blur > 0) {
      targetCtx.filter = `blur(${blur}px)`
      targetCtx.drawImage(sourceCanvas, 0, 0)
      targetCtx.filter = 'none'
      const blurredData = targetCtx.getImageData(0, 0, targetCanvas.width, targetCanvas.height)
      imageData.data.set(blurredData.data)
    }
    
    switch (mode) {
      case 'grayscale':
        applyGrayscale(data)
        break
      case 'grouped':
        applyGrayscale(data)
        applyValueGrouping(data, groups)
        break
      case 'squint':
        // Blur is already applied above
        break
      case 'posterize':
        applyPosterize(data, groups)
        break
      default:
        // Original - no changes needed
        break
    }
    
    if (mode !== 'squint' || blur === 0) {
      targetCtx.putImageData(imageData, 0, 0)
    }
  }, [applyGrayscale, applyValueGrouping, applyPosterize])
  
  useEffect(() => {
    if (!image) return
    
    const canvas = canvasRef.current
    const originalCanvas = originalCanvasRef.current
    if (!canvas || !originalCanvas) return
    
    const originalCtx = originalCanvas.getContext('2d')
    
    // Set canvas dimensions to match container
    const maxWidth = 300
    const maxHeight = 200
    const aspectRatio = image.width / image.height
    
    let canvasWidth, canvasHeight
    if (aspectRatio > maxWidth / maxHeight) {
      canvasWidth = maxWidth
      canvasHeight = maxWidth / aspectRatio
    } else {
      canvasHeight = maxHeight
      canvasWidth = maxHeight * aspectRatio
    }
    
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    originalCanvas.width = canvasWidth
    originalCanvas.height = canvasHeight
    
    // Draw original image
    originalCtx.drawImage(image, 0, 0, canvasWidth, canvasHeight)
    
    // Apply current study mode
    applyStudyMode(originalCanvas, canvas, studyMode, valueGroups, squintLevel)
  }, [image, studyMode, valueGroups, squintLevel, applyStudyMode])
  
  const downloadCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const link = document.createElement('a')
    link.download = `value-study-${studyMode}.png`
    link.href = canvas.toDataURL()
    link.click()
  }
  
  const analyzeValues = () => {
    const canvas = canvasRef.current
    if (!canvas || !onValueAnalysis) return
    
    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    
    const values = []
    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
      values.push(gray)
    }
    
    // Calculate value statistics
    const sortedValues = [...values].sort((a, b) => a - b)
    const darkest = sortedValues[0]
    const lightest = sortedValues[sortedValues.length - 1]
    const median = sortedValues[Math.floor(sortedValues.length / 2)]
    const average = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length)
    
    // Calculate value distribution
    const valueRange = lightest - darkest
    const contrast = valueRange / 255 * 100
    
    onValueAnalysis({
      darkest,
      lightest,
      median,
      average,
      contrast: Math.round(contrast),
      range: valueRange
    })
  }
  
  const studyModes = [
    { key: 'original', label: 'Original', description: 'Full color reference' },
    { key: 'grayscale', label: 'Grayscale', description: 'Black and white conversion' },
    { key: 'grouped', label: 'Value Groups', description: 'Simplified value ranges' },
    { key: 'squint', label: 'Squint View', description: 'Blurred to see major shapes' },
    { key: 'posterize', label: 'Posterize', description: 'Reduced color complexity' }
  ]
  
  if (!image) {
    return (
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        padding: '24px', 
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ 
          padding: '16px', 
          background: '#f1f5f9', 
          borderRadius: '16px', 
          width: 'fit-content', 
          margin: '0 auto 16px auto' 
        }}>
          <Eye style={{ width: '48px', height: '48px', color: '#64748b' }} />
        </div>
        <h3 style={{ fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
          Value Studies
        </h3>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          Upload an image to analyze values and create studies
        </p>
      </div>
    )
  }
  
  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '12px', 
      padding: '20px', 
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{ 
          padding: '8px', 
          background: '#f1f5f9', 
          borderRadius: '8px' 
        }}>
          <Eye style={{ width: '20px', height: '20px', color: '#64748b' }} />
        </div>
        <span style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
          Value Studies
        </span>
      </div>
      
      {/* Study Mode Selector */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#374151',
          marginBottom: '8px'
        }}>
          Study Mode
        </label>
        <select 
          value={studyMode}
          onChange={(e) => setStudyMode(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            background: 'white'
          }}
        >
          {studyModes.map(mode => (
            <option key={mode.key} value={mode.key}>
              {mode.label} - {mode.description}
            </option>
          ))}
        </select>
      </div>
      
      {/* Controls */}
      {(studyMode === 'grouped' || studyMode === 'posterize') && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151',
            marginBottom: '8px'
          }}>
            {studyMode === 'grouped' ? 'Value Groups' : 'Color Levels'}: {valueGroups}
          </label>
          <input
            type="range"
            min="3"
            max="10"
            value={valueGroups}
            onChange={(e) => setValueGroups(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      )}
      
      {studyMode === 'squint' && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151',
            marginBottom: '8px'
          }}>
            Squint Level: {squintLevel}px
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={squintLevel}
            onChange={(e) => setSquintLevel(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      )}
      
      {/* Canvas Display */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '16px',
        background: '#f8fafc',
        borderRadius: '8px',
        padding: '16px'
      }}>
        <canvas 
          ref={canvasRef}
          style={{ 
            borderRadius: '8px',
            maxWidth: '100%',
            border: '1px solid #e2e8f0'
          }}
        />
        <canvas 
          ref={originalCanvasRef}
          style={{ display: 'none' }}
        />
      </div>
      
      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button 
          onClick={downloadCanvas}
          className="btn-secondary"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '14px'
          }}
        >
          <Download style={{ width: '14px', height: '14px' }} />
          Download
        </button>
        <button 
          onClick={analyzeValues}
          className="btn-primary"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '14px'
          }}
        >
          <Layers style={{ width: '14px', height: '14px' }} />
          Analyze
        </button>
        <button 
          onClick={() => {
            setStudyMode('original')
            setValueGroups(5)
            setSquintLevel(0)
          }}
          className="btn-secondary"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '14px'
          }}
        >
          <RotateCcw style={{ width: '14px', height: '14px' }} />
          Reset
        </button>
      </div>
      
      {/* Study Info */}
      <div style={{ 
        background: '#f8fafc',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '12px',
        color: '#64748b'
      }}>
        <strong style={{ color: '#374151' }}>
          {studyModes.find(m => m.key === studyMode)?.label}:
        </strong>
        {' '}
        {studyModes.find(m => m.key === studyMode)?.description}
      </div>
    </div>
  )
}