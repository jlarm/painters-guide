import { useState } from 'react'
import { ColorAnalysis } from '@/components/ColorAnalysis'
import { ColorWheel } from '@/components/ColorWheel'
import { ColorHarmony } from '@/components/ColorHarmony'
import { ValueStudies } from '@/components/ValueStudies'
import { SavedColors } from '@/components/SavedColors'
import { Pipette, Palette, Eye, Layers, BookOpen } from 'lucide-react'

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
      id: 'saved',
      label: 'Saved',
      icon: BookOpen,
      component: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <SavedColors 
            savedColors={savedColors}
            onRemoveColor={onRemoveColor}
            onSelectColor={onSelectSavedColor}
          />
          
          {/* Analysis Results Summary */}
          {(valueAnalysis || savedHarmonies.length > 0) && (
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '20px', 
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
                Analysis Summary
              </h3>
              
              {/* Value Analysis Results */}
              {valueAnalysis && (
                <div style={{ 
                  background: '#f8fafc',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px',
                  fontSize: '12px'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '8px', color: '#1e293b' }}>
                    Value Analysis:
                  </div>
                  <div style={{ color: '#374151' }}>
                    <div>Range: {valueAnalysis.darkest} → {valueAnalysis.lightest} (Contrast: {valueAnalysis.contrast}%)</div>
                    <div>Average: {valueAnalysis.average} • Median: {valueAnalysis.median}</div>
                  </div>
                </div>
              )}
              
              {/* Saved Harmonies */}
              {savedHarmonies.length > 0 && (
                <div style={{ 
                  background: '#f8fafc',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '12px'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '8px', color: '#1e293b' }}>
                    Color Harmonies ({savedHarmonies.length}):
                  </div>
                  <div style={{ color: '#374151' }}>
                    {savedHarmonies.map((harmony, index) => (
                      <div key={harmony.id} style={{ marginBottom: '4px' }}>
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
      borderRadius: '12px', 
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    }}>
      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid #e2e8f0',
        background: '#f8fafc'
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
                padding: '12px 8px',
                border: 'none',
                background: isActive ? 'white' : 'transparent',
                borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                color: isActive ? '#1e293b' : '#64748b',
                fontWeight: isActive ? '600' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                position: 'relative',
                minHeight: '48px'
              }}
            >
              <Icon style={{ width: '16px', height: '16px' }} />
              <span className="tab-label">
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
      
      {/* Tab Content */}
      <div style={{ padding: '20px' }}>
        {activeTabData?.component}
      </div>
    </div>
  )
}