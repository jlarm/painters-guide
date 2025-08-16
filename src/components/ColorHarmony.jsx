import { useState, useMemo, useCallback } from 'react'
import { Palette, Copy } from 'lucide-react'

export function ColorHarmony({ colorInfo, onSaveHarmony }) {
  const [harmonyType, setHarmonyType] = useState('complementary')
  const [copiedIndex, setCopiedIndex] = useState(null)
  
  const hslToRgb = useCallback((h, s, l) => {
    h /= 360
    s /= 100
    l /= 100
    
    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs((h * 6) % 2 - 1))
    const m = l - c / 2
    
    let r, g, b
    
    if (0 <= h && h < 1/6) {
      r = c; g = x; b = 0
    } else if (1/6 <= h && h < 2/6) {
      r = x; g = c; b = 0
    } else if (2/6 <= h && h < 3/6) {
      r = 0; g = c; b = x
    } else if (3/6 <= h && h < 4/6) {
      r = 0; g = x; b = c
    } else if (4/6 <= h && h < 5/6) {
      r = x; g = 0; b = c
    } else {
      r = c; g = 0; b = x
    }
    
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    }
  }, [])
  
  const hslToHex = useCallback((h, s, l) => {
    const rgb = hslToRgb(h, s, l)
    return `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`
  }, [hslToRgb])
  
  const generateHarmony = useMemo(() => {
    if (!colorInfo) return null
    
    const { hsl } = colorInfo
    const baseHue = hsl.h
    
    const createColor = (hue, saturation = hsl.s, lightness = hsl.l) => {
      const normalizedHue = ((hue % 360) + 360) % 360
      return {
        hsl: { h: normalizedHue, s: saturation, l: lightness },
        hex: hslToHex(normalizedHue, saturation, lightness),
        rgb: hslToRgb(normalizedHue, saturation, lightness)
      }
    }
    
    const harmonies = {
      complementary: [
        createColor(baseHue),
        createColor(baseHue + 180)
      ],
      triadic: [
        createColor(baseHue),
        createColor(baseHue + 120),
        createColor(baseHue + 240)
      ],
      analogous: [
        createColor(baseHue - 30),
        createColor(baseHue),
        createColor(baseHue + 30)
      ],
      'split-complementary': [
        createColor(baseHue),
        createColor(baseHue + 150),
        createColor(baseHue + 210)
      ],
      tetradic: [
        createColor(baseHue),
        createColor(baseHue + 90),
        createColor(baseHue + 180),
        createColor(baseHue + 270)
      ],
      monochromatic: [
        createColor(baseHue, hsl.s, Math.max(hsl.l - 30, 10)),
        createColor(baseHue, hsl.s, hsl.l),
        createColor(baseHue, hsl.s, Math.min(hsl.l + 30, 90))
      ]
    }
    
    return harmonies[harmonyType] || harmonies.complementary
  }, [colorInfo, harmonyType, hslToHex, hslToRgb])
  
  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1000)
  }
  
  const harmonyTypes = [
    { key: 'complementary', label: 'Complementary', description: 'Opposite colors on the wheel' },
    { key: 'triadic', label: 'Triadic', description: 'Three evenly spaced colors' },
    { key: 'analogous', label: 'Analogous', description: 'Adjacent colors on the wheel' },
    { key: 'split-complementary', label: 'Split Complementary', description: 'Base + two adjacent to complement' },
    { key: 'tetradic', label: 'Tetradic', description: 'Four evenly spaced colors' },
    { key: 'monochromatic', label: 'Monochromatic', description: 'Same hue, different values' }
  ]
  
  if (!colorInfo) {
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
          background: '#f3e8ff', 
          borderRadius: '16px', 
          width: 'fit-content', 
          margin: '0 auto 16px auto' 
        }}>
          <Palette style={{ width: '48px', height: '48px', color: '#8b5cf6' }} />
        </div>
        <h3 style={{ fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
          Color Harmony Generator
        </h3>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          Select a color to generate harmony schemes
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
          background: '#f3e8ff', 
          borderRadius: '8px' 
        }}>
          <Palette style={{ width: '20px', height: '20px', color: '#8b5cf6' }} />
        </div>
        <span style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
          Color Harmony
        </span>
      </div>
      
      {/* Harmony Type Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#374151',
          marginBottom: '8px'
        }}>
          Harmony Type
        </label>
        <select 
          value={harmonyType}
          onChange={(e) => setHarmonyType(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            background: 'white'
          }}
        >
          {harmonyTypes.map(type => (
            <option key={type.key} value={type.key}>
              {type.label} - {type.description}
            </option>
          ))}
        </select>
      </div>
      
      {/* Color Harmony Display */}
      {generateHarmony && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${generateHarmony.length}, 1fr)`, 
            gap: '8px',
            marginBottom: '12px'
          }}>
            {generateHarmony.map((color, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '100%',
                    height: '60px',
                    borderRadius: '8px',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    backgroundColor: color.hex,
                    marginBottom: '8px',
                    cursor: 'pointer'
                  }}
                  onClick={() => copyToClipboard(color.hex, index)}
                  title={`Click to copy ${color.hex}`}
                />
                <div style={{ fontSize: '12px', fontWeight: '500', color: '#1e293b' }}>
                  {color.hex.toUpperCase()}
                </div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>
                  {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                </div>
              </div>
            ))}
          </div>
          
          {/* Copy Status */}
          {copiedIndex !== null && (
            <div style={{ 
              textAlign: 'center', 
              fontSize: '12px', 
              color: '#22c55e',
              marginBottom: '12px'
            }}>
              Color {copiedIndex + 1} copied to clipboard!
            </div>
          )}
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => {
                const allColors = generateHarmony.map(c => c.hex).join(', ')
                copyToClipboard(allColors, 'all')
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
              <Copy style={{ width: '14px', height: '14px' }} />
              Copy All
            </button>
            {onSaveHarmony && (
              <button 
                onClick={() => onSaveHarmony(generateHarmony, harmonyType)}
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
                <Palette style={{ width: '14px', height: '14px' }} />
                Save Harmony
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Harmony Info */}
      <div style={{ 
        background: '#f8fafc',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '12px',
        color: '#64748b'
      }}>
        <strong style={{ color: '#374151' }}>
          {harmonyTypes.find(t => t.key === harmonyType)?.label}:
        </strong>
        {' '}
        {harmonyTypes.find(t => t.key === harmonyType)?.description}
      </div>
    </div>
  )
}