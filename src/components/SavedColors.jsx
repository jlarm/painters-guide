import { useState } from 'react'
import { Trash2, Copy } from 'lucide-react'

export function SavedColors({ savedColors, onRemoveColor, onSelectColor }) {
  const [copiedIndex, setCopiedIndex] = useState(null)
  
  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1000)
  }
  
  if (!savedColors || savedColors.length === 0) {
    return (
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        padding: '24px', 
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h3 style={{ fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>
          Saved Colors
        </h3>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          No saved colors yet. Use the save button in the color wheel to build your palette.
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
      <h3 style={{ fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
        Saved Colors ({savedColors.length})
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {savedColors.map((color, index) => (
          <div 
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}
          >
            {/* Color Swatch */}
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '6px',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                backgroundColor: color.hex,
                cursor: 'pointer'
              }}
              onClick={() => onSelectColor && onSelectColor(color)}
              title="Click to select this color"
            />
            
            {/* Color Info */}
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#1e293b',
                marginBottom: '2px'
              }}>
                {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                T: {color.temperature === 'Warm' ? '30' : color.temperature === 'Cool' ? '-30' : '0'} 
                {' '}N: {color.tint === 'Warm' ? '2' : color.tint === 'Cool' ? '-2' : '0'}
              </div>
            </div>
            
            {/* Actions */}
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => copyToClipboard(`${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`, index)}
                style={{
                  background: copiedIndex === index ? '#22c55e' : 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  padding: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: copiedIndex === index ? 'white' : '#64748b'
                }}
                title="Copy RGB values"
              >
                <Copy style={{ width: '12px', height: '12px' }} />
              </button>
              <button
                onClick={() => onRemoveColor && onRemoveColor(index)}
                style={{
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  padding: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#ef4444'
                }}
                title="Remove color"
              >
                <Trash2 style={{ width: '12px', height: '12px' }} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {savedColors.length > 0 && (
        <div style={{ 
          marginTop: '16px', 
          paddingTop: '16px', 
          borderTop: '1px solid #e2e8f0' 
        }}>
          <button 
            onClick={() => {
              const rgbValues = savedColors.map(color => 
                `${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`
              ).join('\n')
              copyToClipboard(rgbValues, 'all')
            }}
            className="btn-secondary"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Copy style={{ width: '16px', height: '16px' }} />
            Copy All RGB Values
          </button>
        </div>
      )}
    </div>
  )
}