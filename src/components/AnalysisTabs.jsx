import { useState } from 'react'
import { ColorAnalysis } from '@/components/ColorAnalysis'
import { ColorWheel } from '@/components/ColorWheel'
import { ColorHarmony } from '@/components/ColorHarmony'
import { ValueStudies } from '@/components/ValueStudies'
import { SavedColors } from '@/components/SavedColors'
import { PaintRecommendations } from '@/components/PaintRecommendations'
import { Pipette, Palette, Eye, Layers, BookOpen, Brush } from 'lucide-react'

export function AnalysisTabs({ 
  selectedColor, 
  imageElement, 
  savedColors,
  savedHarmonies,
  valueAnalysis,
  onSaveColor,
  onSaveHarmony,
  onRemoveColor,
  onSelectSavedColor,
  onValueAnalysis
}) {
  const [activeTab, setActiveTab] = useState('color-analysis')
  
  const tabs = [
    {
      id: 'color-analysis',
      label: 'Color Analysis',
      icon: Pipette,
      component: <ColorAnalysis colorInfo={selectedColor} />
    },
    {
      id: 'color-wheel',
      label: 'Color Wheel',
      icon: Palette,
      component: (
        <ColorWheel 
          colorInfo={selectedColor} 
          onSave={onSaveColor}
        />
      )
    },
    {
      id: 'harmony',
      label: 'Harmony',
      icon: Layers,
      component: (
        <ColorHarmony 
          colorInfo={selectedColor}
          onSaveHarmony={onSaveHarmony}
        />
      )
    },
    {
      id: 'value-studies',
      label: 'Value Studies',
      icon: Eye,
      component: (
        <ValueStudies 
          image={imageElement}
          onValueAnalysis={onValueAnalysis}
        />
      )
    },
    {
      id: 'paint-recommendations',
      label: 'Paint Guide',
      icon: Brush,
      component: (
        <PaintRecommendations 
          imageElement={imageElement}
          selectedColor={selectedColor}
          valueAnalysis={valueAnalysis}
        />
      )
    },
    {
      id: 'saved',
      label: 'Saved',
      icon: BookOpen,
      component: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SavedColors 
            savedColors={savedColors}
            onRemoveColor={onRemoveColor}
            onSelectColor={onSelectSavedColor}
          />
          
          {/* Analysis Results Summary */}
          {(valueAnalysis || savedHarmonies.length > 0) && (
            <div style={{ 
              background: '#f9fafb', 
              borderRadius: '3px', 
              padding: '12px', 
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontWeight: '500', color: '#111827', marginBottom: '12px', fontSize: '13px' }}>
                Analysis Summary
              </h3>
              
              {/* Value Analysis Results */}
              {valueAnalysis && (
                <div style={{ 
                  background: 'white',
                  borderRadius: '3px',
                  padding: '8px',
                  marginBottom: '12px',
                  fontSize: '11px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontWeight: '500', marginBottom: '6px', color: '#111827' }}>
                    Value Analysis:
                  </div>
                  <div style={{ color: '#6b7280' }}>
                    <div>Range: {valueAnalysis.darkest} → {valueAnalysis.lightest} (Contrast: {valueAnalysis.contrast}%)</div>
                    <div>Average: {valueAnalysis.average} • Median: {valueAnalysis.median}</div>
                  </div>
                </div>
              )}
              
              {/* Saved Harmonies */}
              {savedHarmonies.length > 0 && (
                <div style={{ 
                  background: 'white',
                  borderRadius: '3px',
                  padding: '8px',
                  fontSize: '11px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontWeight: '500', marginBottom: '6px', color: '#111827' }}>
                    Color Harmonies ({savedHarmonies.length}):
                  </div>
                  <div style={{ color: '#6b7280' }}>
                    {savedHarmonies.map((harmony, index) => (
                      <div key={harmony.id} style={{ marginBottom: '3px' }}>
                        {index + 1}. {harmony.type} ({harmony.colors.length} colors)
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )
    }
  ]
  
  const activeTabData = tabs.find(tab => tab.id === activeTab)
  
  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '4px', 
      border: '1px solid #d1d5db',
      overflow: 'hidden'
    }}>
      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid #e5e7eb',
        background: '#f9fafb'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '10px 8px',
                border: 'none',
                background: isActive ? 'white' : 'transparent',
                borderBottom: isActive ? '2px solid #374151' : '2px solid transparent',
                color: isActive ? '#111827' : '#6b7280',
                fontWeight: isActive ? '500' : '400',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'all 0.15s ease',
                position: 'relative',
                minHeight: '36px'
              }}
            >
              <Icon style={{ width: '12px', height: '12px' }} />
              <span className="tab-label">
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
      
      {/* Tab Content */}
      <div style={{ padding: '16px' }}>
        {activeTabData?.component}
      </div>
    </div>
  )
}