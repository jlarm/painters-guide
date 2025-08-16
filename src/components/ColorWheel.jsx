import { useState, useRef, useEffect } from 'react'
import { Save } from 'lucide-react'

export function ColorWheel({ colorInfo, onSave }) {
  const canvasRef = useRef(null)
  const [maxChroma, setMaxChroma] = useState(100)
  const [showHarmony, setShowHarmony] = useState('none')
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 15
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw color wheel
    for (let angle = 0; angle < 360; angle += 0.5) {
      for (let distance = 0; distance <= radius; distance += 1) {
        const hue = angle
        const saturation = Math.min((distance / radius) * maxChroma, 100)
        const lightness = 50 // Fixed lightness for the wheel
        
        const x = centerX + Math.cos(angle * Math.PI / 180) * distance
        const y = centerY + Math.sin(angle * Math.PI / 180) * distance
        
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
        ctx.fillRect(x, y, 1, 1)
      }
    }
    
    // Draw temperature dots around the wheel
    const tempPositions = [
      { angle: 0, temp: 100, label: '' },     // Red
      { angle: 30, temp: 80, label: '' },     // Orange
      { angle: 60, temp: 40, label: '' },     // Yellow
      { angle: 90, temp: 0, label: '' },      // Green
      { angle: 120, temp: -40, label: '' },   // Cyan
      { angle: 150, temp: -60, label: '' },   // Light Blue
      { angle: 180, temp: -100, label: '' },  // Blue
      { angle: 210, temp: -80, label: '' },   // Purple-Blue
      { angle: 240, temp: -20, label: '' },   // Purple
      { angle: 270, temp: 20, label: '' },    // Magenta
      { angle: 300, temp: 60, label: '' },    // Pink-Red
      { angle: 330, temp: 90, label: '' }     // Red-Orange
    ]
    
    tempPositions.forEach(({ angle, temp }) => {
      const dotRadius = radius + 15
      const x = centerX + Math.cos(angle * Math.PI / 180) * dotRadius
      const y = centerY + Math.sin(angle * Math.PI / 180) * dotRadius
      
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fillStyle = temp > 0 ? '#ef4444' : temp < 0 ? '#3b82f6' : '#6b7280'
      ctx.fill()
    })
    
    // Draw harmony indicators if selected
    if (colorInfo && showHarmony !== 'none') {
      const { hsl } = colorInfo
      const baseHue = hsl.h
      
      let harmonyHues = []
      
      switch (showHarmony) {
        case 'complementary':
          harmonyHues = [baseHue, baseHue + 180]
          break
        case 'analogous':
          harmonyHues = [baseHue - 30, baseHue, baseHue + 30]
          break
        case 'triadic':
          harmonyHues = [baseHue, baseHue + 120, baseHue + 240]
          break
        case 'tetradic':
          harmonyHues = [baseHue, baseHue + 90, baseHue + 180, baseHue + 270]
          break
        case 'monochromatic':
          // For monochromatic, we'll show the same hue at different saturations
          harmonyHues = [baseHue]
          break
      }
      
      // Draw harmony lines and points
      harmonyHues.forEach((hue, index) => {
        const normalizedHue = ((hue % 360) + 360) % 360
        const angle = normalizedHue * Math.PI / 180
        
        if (showHarmony === 'monochromatic') {
          // For monochromatic, draw at different saturation levels
          const saturations = [30, hsl.s, 80]
          saturations.forEach((sat, satIndex) => {
            const distance = (sat / 100) * radius
            const x = centerX + Math.cos(angle) * distance
            const y = centerY + Math.sin(angle) * distance
            
            // Draw harmony point
            ctx.beginPath()
            ctx.arc(x, y, 6, 0, 2 * Math.PI)
            ctx.fillStyle = satIndex === 1 ? '#ffffff' : '#fbbf24'
            ctx.fill()
            ctx.strokeStyle = satIndex === 1 ? '#1e293b' : '#f59e0b'
            ctx.lineWidth = 2
            ctx.stroke()
          })
        } else {
          // For other harmonies, use the same saturation as the base color
          const distance = (hsl.s / 100) * radius
          const x = centerX + Math.cos(angle) * distance
          const y = centerY + Math.sin(angle) * distance
          
          // Draw line from center to harmony point
          if (index > 0) {
            ctx.beginPath()
            ctx.moveTo(centerX, centerY)
            ctx.lineTo(x, y)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
            ctx.lineWidth = 1
            ctx.stroke()
          }
          
          // Draw harmony point
          ctx.beginPath()
          ctx.arc(x, y, 6, 0, 2 * Math.PI)
          ctx.fillStyle = index === 0 ? '#ffffff' : '#fbbf24'
          ctx.fill()
          ctx.strokeStyle = index === 0 ? '#1e293b' : '#f59e0b'
          ctx.lineWidth = 2
          ctx.stroke()
        }
      })
    } else if (colorInfo) {
      // Draw only the current color position
      const { hsl } = colorInfo
      const angle = hsl.h * Math.PI / 180
      const distance = (hsl.s / 100) * radius
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance
      
      // Draw white circle outline
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, 2 * Math.PI)
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 3
      ctx.stroke()
      
      // Draw inner circle
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, 2 * Math.PI)
      ctx.strokeStyle = '#1e293b'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }, [colorInfo, maxChroma, showHarmony])
  
  if (!colorInfo) {
    return (
      <div className="color-wheel-container">
        <div style={{ textAlign: 'center', color: '#64748b', padding: '32px 0' }}>
          <p style={{ fontSize: '16px', margin: 0 }}>Select a color to see wheel analysis</p>
        </div>
      </div>
    )
  }
  
  const { rgb, hex, value, temperature, tint } = colorInfo
  
  // Calculate temperature and tint values
  const tempValue = temperature === 'Warm' ? 30 : temperature === 'Cool' ? -30 : 0
  const tintValue = tint === 'Warm' ? 2 : tint === 'Cool' ? -2 : 0
  
  return (
    <div className="color-wheel-container" style={{ 
      background: 'white', 
      borderRadius: '12px', 
      padding: '20px', 
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>
          Color Wheel Analysis
        </h3>
        
        {/* Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {/* Max Chroma Selector */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '12px', 
              fontWeight: '500', 
              color: '#64748b',
              marginBottom: '4px'
            }}>
              Max Chroma
            </label>
            <select 
              value={maxChroma} 
              onChange={(e) => setMaxChroma(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '12px',
                background: 'white'
              }}
            >
              <option value={50}>50</option>
              <option value={75}>75</option>
              <option value={100}>100</option>
            </select>
          </div>
          
          {/* Harmony Selector */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '12px', 
              fontWeight: '500', 
              color: '#64748b',
              marginBottom: '4px'
            }}>
              Show Harmony
            </label>
            <select 
              value={showHarmony} 
              onChange={(e) => setShowHarmony(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '12px',
                background: 'white'
              }}
            >
              <option value="none">None</option>
              <option value="complementary">Complementary</option>
              <option value="analogous">Analogous</option>
              <option value="triadic">Triadic</option>
              <option value="tetradic">Tetradic</option>
              <option value="monochromatic">Monochromatic</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Temperature and Tint Labels */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>Temp (T)</span>
          <div style={{
            width: '40px',
            height: '20px',
            background: 'linear-gradient(to right, #3b82f6, #f59e0b, #ef4444)',
            borderRadius: '4px'
          }}></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            background: 'linear-gradient(to right, #a855f7, #22c55e)',
            borderRadius: '4px'
          }}></div>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>Tint (N)</span>
        </div>
      </div>
      
      {/* Color Wheel */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <canvas 
          ref={canvasRef}
          width={280}
          height={280}
          style={{ 
            borderRadius: '50%',
            maxWidth: '100%',
            height: 'auto'
          }}
        />
        
        {/* Temperature indicator */}
        <div style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#1e293b',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {tempValue}
        </div>
        
        {/* Tint indicator */}
        <div style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#1e293b',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {tintValue}
        </div>
      </div>
      
      {/* Value Slider */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>Value</span>
          <div style={{
            background: '#1e293b',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {value}
          </div>
        </div>
        <div style={{ 
          position: 'relative',
          height: '20px',
          background: 'linear-gradient(to right, #000000, #6b7280, #ffffff)',
          borderRadius: '10px',
          border: '1px solid #d1d5db'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: `${value}%`,
            transform: 'translate(-50%, -50%)',
            width: '12px',
            height: '12px',
            background: 'white',
            border: '2px solid #1e293b',
            borderRadius: '50%',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}></div>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#64748b',
          marginTop: '4px'
        }}>
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>
      
      {/* Harmony Information */}
      {showHarmony !== 'none' && colorInfo && (
        <div style={{ 
          background: '#fef3c7',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          border: '1px solid #f59e0b'
        }}>
          <div style={{ 
            fontSize: '12px', 
            color: '#92400e',
            fontWeight: '500',
            marginBottom: '4px'
          }}>
            🎨 {showHarmony.charAt(0).toUpperCase() + showHarmony.slice(1)} Harmony
          </div>
          <div style={{ fontSize: '11px', color: '#78350f' }}>
            {showHarmony === 'complementary' && 'White dot: selected color • Orange dots: opposite color for high contrast'}
            {showHarmony === 'analogous' && 'White dot: selected color • Orange dots: adjacent colors for gentle harmony'}
            {showHarmony === 'triadic' && 'White dot: selected color • Orange dots: evenly spaced colors for vibrant balance'}
            {showHarmony === 'tetradic' && 'White dot: selected color • Orange dots: four colors forming a rectangle for rich contrast'}
            {showHarmony === 'monochromatic' && 'White dot: selected color • Orange dots: same hue at different saturations'}
          </div>
        </div>
      )}

      {/* Color Info Display */}
      <div style={{ 
        background: '#f8fafc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px'
      }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '12px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: hex,
            borderRadius: '8px',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}></div>
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '700', 
              color: '#1e293b',
              marginBottom: '4px'
            }}>
              {rgb.r}, {rgb.g}, {rgb.b}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              T: {tempValue} N: {tintValue}
            </div>
          </div>
        </div>
      </div>
      
      {/* Save Button */}
      {onSave && (
        <button 
          onClick={() => onSave(colorInfo)}
          className="btn-primary"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Save style={{ width: '16px', height: '16px' }} />
          Save
        </button>
      )}
    </div>
  )
}