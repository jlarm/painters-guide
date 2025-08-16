import { useState } from 'react'
import { ImageUpload } from '@/components/ImageUpload'
import { ImageCanvas } from '@/components/ImageCanvas'
import { ColorAnalysis } from '@/components/ColorAnalysis'
import { ColorWheel } from '@/components/ColorWheel'
import { SavedColors } from '@/components/SavedColors'
import { Palette, Brush, Pipette, Image } from 'lucide-react'

function App() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imageElement, setImageElement] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [savedColors, setSavedColors] = useState([])

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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <header className="app-header">
        <div className="container">
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
        </div>
      </header>

      <main style={{ padding: '32px 0' }}>
        <div className="container">
          {!uploadedImage ? (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {/* Hero Section */}
              <div className="hero-section">
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ 
                    display: 'inline-flex',
                    padding: '16px', 
                    background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)', 
                    borderRadius: '16px',
                    marginBottom: '24px'
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
                  Upload any image to apply professional oil painting effects and get precise color analysis 
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
                />
              </div>

              {/* Analysis Components Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', 
                gap: 'clamp(16px, 4vw, 24px)',
                alignItems: 'start'
              }}>
                {/* Color Analysis */}
                <ColorAnalysis colorInfo={selectedColor} />
                
                {/* Color Wheel Analysis */}
                <ColorWheel 
                  colorInfo={selectedColor} 
                  onSave={handleSaveColor}
                />
                
                {/* Saved Colors */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <SavedColors 
                    savedColors={savedColors}
                    onRemoveColor={handleRemoveColor}
                    onSelectColor={handleSelectSavedColor}
                  />
                  
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

                  {/* Tips */}
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
                      <p style={{ margin: '0 0 8px 0' }}>• Use the color wheel to see temperature relationships</p>
                      <p style={{ margin: '0 0 8px 0' }}>• Save colors to build a complete palette</p>
                      <p style={{ margin: '0 0 8px 0' }}>• Adjust max chroma to focus on muted colors</p>
                      <p style={{ margin: 0 }}>• Click saved colors to reselect them</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App