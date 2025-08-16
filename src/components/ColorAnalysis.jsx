import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Pipette, Thermometer, Droplets, Sun, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ColorAnalysis({ colorInfo }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  if (!colorInfo) {
    return (
      <div className="color-analysis">
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{ 
            padding: '8px', 
            background: 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)', 
            borderRadius: '8px' 
          }}>
            <Pipette style={{ width: '20px', height: '20px', color: '#8b5cf6' }} />
          </div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
            Color Analysis
          </span>
        </div>
        
        <div style={{ textAlign: 'center', color: '#64748b', padding: '32px 0' }}>
          <div style={{ 
            padding: '16px', 
            background: '#f1f5f9', 
            borderRadius: '16px', 
            width: 'fit-content', 
            margin: '0 auto 16px auto' 
          }}>
            <Pipette style={{ width: '48px', height: '48px', color: '#94a3b8' }} />
          </div>
          <p style={{ fontSize: '18px', fontWeight: '500', margin: '0 0 8px 0' }}>Select a Color</p>
          <p style={{ fontSize: '14px', margin: 0 }}>Use the eyedropper tool to analyze any color in your image</p>
        </div>
      </div>
    )
  }

  const { rgb, hsl, hex, chroma, value, temperature, tint } = colorInfo

  return (
    <div className="color-analysis">
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ 
          padding: '8px', 
          background: 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)', 
          borderRadius: '8px' 
        }}>
          <Pipette style={{ width: '20px', height: '20px', color: '#8b5cf6' }} />
        </div>
        <span style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
          Color Analysis
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Color Swatch */}
        <div style={{ 
          background: '#f8fafc', 
          borderRadius: '12px', 
          padding: '16px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '12px',
                border: '2px solid white',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                backgroundColor: hex
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ fontWeight: '700', fontSize: '20px', color: '#1e293b' }}>
                  {hex.toUpperCase()}
                </div>
                <button
                  onClick={() => copyToClipboard(hex)}
                  style={{
                    background: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Copy style={{ width: '12px', height: '12px' }} />
                </button>
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>
                <div>RGB({rgb.r}, {rgb.g}, {rgb.b})</div>
                <div>HSL({hsl.h}°, {hsl.s}%, {hsl.l}%)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Color Properties */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Chroma */}
          <div style={{
            padding: '16px',
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            borderRadius: '12px',
            border: '1px solid #bfdbfe'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Droplets style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
              <span style={{ fontWeight: '600', color: '#1e293b' }}>Chroma (Saturation)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#1e40af' }}>{chroma}%</div>
              <span style={{
                background: chroma > 70 ? '#3b82f6' : chroma > 30 ? '#f1f5f9' : 'white',
                color: chroma > 70 ? 'white' : '#374151',
                padding: '4px 8px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '500',
                border: '1px solid #e2e8f0'
              }}>
                {chroma > 70 ? 'Vivid' : chroma > 30 ? 'Moderate' : 'Muted'}
              </span>
            </div>
            <div style={{ width: '100%', background: '#bfdbfe', borderRadius: '6px', height: '12px' }}>
              <div
                style={{
                  background: '#3b82f6',
                  height: '12px',
                  borderRadius: '6px',
                  width: `${chroma}%`,
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>

          {/* Value */}
          <div style={{
            padding: '16px',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            borderRadius: '12px',
            border: '1px solid #f59e0b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sun style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
              <span style={{ fontWeight: '600', color: '#1e293b' }}>Value (Lightness)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#92400e' }}>{value}%</div>
              <span style={{
                background: value > 70 ? '#f59e0b' : value > 30 ? '#fef3c7' : 'white',
                color: value > 70 ? 'white' : '#374151',
                padding: '4px 8px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '500',
                border: '1px solid #e2e8f0'
              }}>
                {value > 70 ? 'Light' : value > 30 ? 'Medium' : 'Dark'}
              </span>
            </div>
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              background: 'linear-gradient(to right, #000000, #6b7280, #ffffff)', 
              borderRadius: '6px', 
              height: '12px' 
            }}>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  width: '4px',
                  height: '12px',
                  background: '#f59e0b',
                  border: '2px solid white',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  left: `calc(${value}% - 2px)`,
                  transition: 'left 0.3s ease'
                }}
              />
            </div>
          </div>

          {/* Temperature & Tint */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #fef2f2 0%, #eff6ff 100%)',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Thermometer style={{ width: '16px', height: '16px', color: '#64748b' }} />
                <span style={{ fontWeight: '500', fontSize: '14px', color: '#1e293b' }}>Temperature</span>
              </div>
              <span style={{
                background: temperature === 'Warm' ? '#ef4444' : temperature === 'Cool' ? '#3b82f6' : '#f1f5f9',
                color: temperature === 'Warm' || temperature === 'Cool' ? 'white' : '#374151',
                padding: '4px 8px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {temperature}
              </span>
            </div>
            
            <div style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #f3e8ff 0%, #dcfce7 100%)',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(to right, #a855f7, #22c55e)' 
                }}></div>
                <span style={{ fontWeight: '500', fontSize: '14px', color: '#1e293b' }}>Tint</span>
              </div>
              <span style={{
                background: tint === 'Warm' ? '#a855f7' : tint === 'Cool' ? '#22c55e' : '#f1f5f9',
                color: tint === 'Warm' || tint === 'Cool' ? 'white' : '#374151',
                padding: '4px 8px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {tint}
              </span>
            </div>
          </div>
        </div>

        {/* Mixing Notes */}
        <div style={{
          padding: '16px',
          background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
          borderRadius: '12px',
          border: '1px solid #22c55e'
        }}>
          <h4 style={{ 
            fontWeight: '600', 
            color: '#1e293b', 
            marginBottom: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px' 
          }}>
            <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></div>
            Mixing Recommendations
          </h4>
          <div style={{ fontSize: '14px', color: '#374151', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {chroma < 30 && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', marginTop: '8px', flexShrink: 0 }}></div>
                <p style={{ margin: 0 }}>Add gray or complement to achieve this muted tone</p>
              </div>
            )}
            {value < 30 && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', marginTop: '8px', flexShrink: 0 }}></div>
                <p style={{ margin: 0 }}>Dark color - use sparingly or add white to lighten</p>
              </div>
            )}
            {value > 70 && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', marginTop: '8px', flexShrink: 0 }}></div>
                <p style={{ margin: 0 }}>Light color - may need dark accents for contrast</p>
              </div>
            )}
            {temperature === 'Warm' && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', background: '#f87171', borderRadius: '50%', marginTop: '8px', flexShrink: 0 }}></div>
                <p style={{ margin: 0 }}>Warm color - pair with cool blues/greens for balance</p>
              </div>
            )}
            {temperature === 'Cool' && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', background: '#60a5fa', borderRadius: '50%', marginTop: '8px', flexShrink: 0 }}></div>
                <p style={{ margin: 0 }}>Cool color - pair with warm reds/oranges for contrast</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}