import { useState } from 'react'
import { ImageUpload } from '@/components/ImageUpload'
import { ImageCanvas } from '@/components/ImageCanvas'
import { AnalysisTabs } from '@/components/AnalysisTabs'
import { HelpGuide } from '@/components/HelpGuide'
import { FullscreenModal } from '@/components/FullscreenModal'
import { Palette, Brush, Pipette, Image, HelpCircle } from 'lucide-react'

function App() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imageElement, setImageElement] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [savedColors, setSavedColors] = useState([])
  const [savedHarmonies, setSavedHarmonies] = useState([])
  const [valueAnalysis, setValueAnalysis] = useState(null)
  const [showHelp, setShowHelp] = useState(false)
  const [fullscreenData, setFullscreenData] = useState(null)

  const handleImageLoad = (img, dataUrl) => {
    setImageElement(img)
    setUploadedImage(dataUrl)
    setSelectedColor(null)
  }

  const handleColorPick = (colorInfo) => {
    setSelectedColor(colorInfo)
  }

  const handleSaveColor = (colorInfo) => {
    // Check if color already exists
    const exists = savedColors.some(saved => saved.hex === colorInfo.hex)
    if (!exists) {
      setSavedColors(prev => [...prev, colorInfo])
    }
  }

  const handleRemoveColor = (index) => {
    setSavedColors(prev => prev.filter((_, i) => i !== index))
  }

  const handleSelectSavedColor = (colorInfo) => {
    setSelectedColor(colorInfo)
  }

  const handleSaveHarmony = (harmonyColors, harmonyType) => {
    const harmony = {
      type: harmonyType,
      colors: harmonyColors,
      id: Date.now(),
      baseColor: selectedColor?.hex
    }
    setSavedHarmonies(prev => [...prev, harmony])
  }

  const handleValueAnalysis = (analysis) => {
    setValueAnalysis(analysis)
  }

  const handleFullscreen = (data) => {
    setFullscreenData(data)
  }

  const closeFullscreen = () => {
    setFullscreenData(null)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: '#ffffff', 
        borderBottom: '1px solid #d1d5db',
        padding: '12px 0'
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                padding: '6px', 
                backgroundColor: '#4b5563',
                borderRadius: '3px' 
              }}>
                <Palette style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Painter's Guide
                </h1>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                  Reference Photo Analysis
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowHelp(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '3px',
                color: '#374151',
                cursor: 'pointer'
              }}
            >
              <HelpCircle style={{ width: '14px', height: '14px' }} />
              Help
            </button>
          </div>
        </div>
      </header>

      <main style={{ padding: '20px 0' }}>
        <div className="container">
          {!uploadedImage ? (
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              {/* Hero Section */}
              <div style={{
                background: 'white',
                borderRadius: '4px',
                padding: '32px 24px',
                marginBottom: '24px',
                border: '1px solid #d1d5db',
              }}>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: '600', 
                  color: '#111827', 
                  marginBottom: '12px',
                  lineHeight: '1.3',
                  textAlign: 'center'
                }}>
                  Reference Photo Analysis
                </h2>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6b7280', 
                  maxWidth: '500px', 
                  margin: '0 auto 32px',
                  lineHeight: '1.5',
                  textAlign: 'center',
                }}>
                  Upload a reference photo to apply artistic filters and analyze colors with precise measurements for accurate painting.
                </p>
                
                {/* Feature Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ textAlign: 'center', padding: '16px 12px' }}>
                    <div style={{ 
                      padding: '8px', 
                      backgroundColor: '#f9fafb', 
                      borderRadius: '3px', 
                      width: 'fit-content', 
                      margin: '0 auto 12px auto',
                      border: '1px solid #e5e7eb'
                    }}>
                      <Image style={{ width: '18px', height: '18px', color: '#6b7280' }} />
                    </div>
                    <h3 style={{ fontWeight: '500', color: '#111827', marginBottom: '6px', fontSize: '13px' }}>
                      Artistic Filters
                    </h3>
                    <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>
                      Oil paint and simplified effects
                    </p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '16px 12px' }}>
                    <div style={{ 
                      padding: '8px', 
                      backgroundColor: '#f9fafb', 
                      borderRadius: '3px', 
                      width: 'fit-content', 
                      margin: '0 auto 12px auto',
                      border: '1px solid #e5e7eb'
                    }}>
                      <Pipette style={{ width: '18px', height: '18px', color: '#6b7280' }} />
                    </div>
                    <h3 style={{ fontWeight: '500', color: '#111827', marginBottom: '6px', fontSize: '13px' }}>
                      Color Picker
                    </h3>
                    <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>
                      Click pixels for color analysis
                    </p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '16px 12px' }}>
                    <div style={{ 
                      padding: '8px', 
                      backgroundColor: '#f9fafb', 
                      borderRadius: '3px', 
                      width: 'fit-content', 
                      margin: '0 auto 12px auto',
                      border: '1px solid #e5e7eb'
                    }}>
                      <Palette style={{ width: '18px', height: '18px', color: '#6b7280' }} />
                    </div>
                    <h3 style={{ fontWeight: '500', color: '#111827', marginBottom: '6px', fontSize: '13px' }}>
                      Value Studies
                    </h3>
                    <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>
                      Grayscale and value grouping
                    </p>
                  </div>
                </div>
              </div>

              <ImageUpload onImageLoad={handleImageLoad} image={uploadedImage} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Full Width Image Editor */}
              <div style={{ width: '100%' }}>
                <ImageCanvas 
                  image={imageElement} 
                  onColorPick={handleColorPick}
                  onFullscreen={handleFullscreen}
                />
              </div>

              {/* Analysis Components - Tabbed Interface */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 1fr', 
                gap: '20px',
                alignItems: 'start'
              }}
              className="analysis-layout"
              >
                {/* Main Analysis Tabs */}
                <AnalysisTabs 
                  selectedColor={selectedColor}
                  imageElement={imageElement}
                  savedColors={savedColors}
                  savedHarmonies={savedHarmonies}
                  valueAnalysis={valueAnalysis}
                  onSaveColor={handleSaveColor}
                  onSaveHarmony={handleSaveHarmony}
                  onRemoveColor={handleRemoveColor}
                  onSelectSavedColor={handleSelectSavedColor}
                  onValueAnalysis={handleValueAnalysis}
                />
                
                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Quick Actions */}
                  <div style={{ 
                    background: 'white', 
                    borderRadius: '4px', 
                    padding: '16px', 
                    border: '1px solid #d1d5db'
                  }}>
                    <h3 style={{ fontWeight: '500', color: '#111827', marginBottom: '12px', fontSize: '13px' }}>
                      Upload New Image
                    </h3>
                    <ImageUpload onImageLoad={handleImageLoad} image={uploadedImage} compact={true} />
                  </div>

                  {/* Tips */}
                  <div style={{ 
                    background: '#f9fafb', 
                    borderRadius: '4px', 
                    padding: '16px', 
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{ fontWeight: '500', color: '#111827', marginBottom: '10px', fontSize: '13px' }}>
                      Tips
                    </h3>
                    <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>
                      <p style={{ margin: '0 0 6px 0' }}>• Use value studies for light patterns</p>
                      <p style={{ margin: '0 0 6px 0' }}>• Generate harmonies for color schemes</p>
                      <p style={{ margin: '0 0 6px 0' }}>• Squint view shows major shapes</p>
                      <p style={{ margin: 0 }}>• High contrast draws focus</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <HelpGuide isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <FullscreenModal
        isOpen={!!fullscreenData}
        onClose={closeFullscreen}
        image={fullscreenData?.image}
        filterType={fullscreenData?.filterType}
        studyMode={fullscreenData?.studyMode}
        valueGroups={fullscreenData?.valueGroups}
        squintLevel={fullscreenData?.squintLevel}
      />
    </div>
  )
}

export default App