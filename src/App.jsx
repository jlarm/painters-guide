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
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <header className="app-header">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                padding: '8px', 
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', 
                borderRadius: '8px' 
              }}>
                <Palette style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
                  Painter's Perspective
                </h1>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                  Professional Color Analysis Tool
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowHelp(true)}
              className="btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '14px'
              }}
            >
              <HelpCircle style={{ width: '18px', height: '18px' }} />
              Help Guide
            </button>
          </div>
        </div>
      </header>

      <main style={{ padding: '32px 0' }}>
        <div className="container">
          {!uploadedImage ? (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {/* Hero Section */}
              <div className="hero-section" style={{
                background: 'white',
                borderRadius: '24px',
                padding: '48px 32px',
                marginBottom: '48px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ 
                    display: 'inline-flex',
                    padding: '16px', 
                    background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)', 
                    borderRadius: '16px',
                    marginBottom: '24px',
                  }}>
                    <Brush style={{ width: '48px', height: '48px', color: '#3b82f6' }} />
                  </div>
                </div>
                <h2 style={{ 
                  fontSize: '48px', 
                  fontWeight: '700', 
                  color: '#1e293b', 
                  marginBottom: '16px',
                  lineHeight: '1.1'
                }}>
                  Transform Your Reference Photos
                </h2>
                <p style={{ 
                  fontSize: '20px', 
                  color: '#64748b', 
                  maxWidth: '600px', 
                  margin: '0 auto 48px auto',
                  lineHeight: '1.6'
                }}>
                  Transform your reference photos with professional oil painting effects and get precise color analysis 
                  with chroma, value, temperature, and tint measurements for accurate color mixing.
                </p>
                
                {/* Feature Cards */}
                <div className="grid grid-cols-3" style={{ marginBottom: '48px' }}>
                  <div className="feature-card">
                    <div style={{ 
                      padding: '12px', 
                      background: '#dbeafe', 
                      borderRadius: '8px', 
                      width: 'fit-content', 
                      margin: '0 auto 16px auto' 
                    }}>
                      <Image style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
                    </div>
                    <h3 style={{ fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                      Oil Paint Filters
                    </h3>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                      Advanced artistic filters that simplify images for painting reference
                    </p>
                  </div>
                  <div className="feature-card">
                    <div style={{ 
                      padding: '12px', 
                      background: '#f3e8ff', 
                      borderRadius: '8px', 
                      width: 'fit-content', 
                      margin: '0 auto 16px auto' 
                    }}>
                      <Pipette style={{ width: '24px', height: '24px', color: '#8b5cf6' }} />
                    </div>
                    <h3 style={{ fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                      Color Sampling
                    </h3>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                      Click any pixel to analyze color properties with professional accuracy
                    </p>
                  </div>
                  <div className="feature-card">
                    <div style={{ 
                      padding: '12px', 
                      background: '#dcfce7', 
                      borderRadius: '8px', 
                      width: 'fit-content', 
                      margin: '0 auto 16px auto' 
                    }}>
                      <Palette style={{ width: '24px', height: '24px', color: '#16a34a' }} />
                    </div>
                    <h3 style={{ fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                      Color Analysis
                    </h3>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                      Get detailed chroma, value, temperature and mixing recommendations
                    </p>
                  </div>
                </div>
              </div>

              <ImageUpload onImageLoad={handleImageLoad} image={uploadedImage} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
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
                gap: '24px',
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Quick Actions */}
                  <div style={{ 
                    background: 'white', 
                    borderRadius: '12px', 
                    padding: '24px', 
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                  }}>
                    <h3 style={{ fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
                      Quick Actions
                    </h3>
                    <ImageUpload onImageLoad={handleImageLoad} image={uploadedImage} compact={true} />
                  </div>

                  {/* Pro Tips */}
                  <div style={{ 
                    background: 'linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%)', 
                    borderRadius: '12px', 
                    padding: '24px', 
                    border: '1px solid #bfdbfe'
                  }}>
                    <h3 style={{ fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>
                      💡 Pro Tips
                    </h3>
                    <div style={{ fontSize: '14px', color: '#374151' }}>
                      <p style={{ margin: '0 0 8px 0' }}>• Use value studies to understand light patterns</p>
                      <p style={{ margin: '0 0 8px 0' }}>• Generate harmonies for balanced color schemes</p>
                      <p style={{ margin: '0 0 8px 0' }}>• Squint view reveals major value shapes</p>
                      <p style={{ margin: 0 }}>• High contrast draws attention to focal points</p>
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