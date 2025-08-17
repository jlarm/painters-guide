import { useState, useEffect, useCallback } from 'react'
import { Brush, Palette, Sun, Moon, Droplets, Lightbulb } from 'lucide-react'

export function PaintRecommendations({ imageElement, selectedColor, valueAnalysis }) {
  const [imageAnalysis, setImageAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Calculate simple temperature bias from RGB values
  const calculateTemperatureBias = (r, g, b) => {
    const red = r / 255
    const green = g / 255
    const blue = b / 255
    
    // Simple warm/cool calculation
    const warmBias = (red + (green * 0.5)) - blue
    const coolBias = blue + (green * 0.3) - red
    
    return warmBias - coolBias
  }

  // Analyze the actual image for temperature characteristics
  const analyzeImageTemperature = useCallback(async () => {
    if (!imageElement) return

    setIsAnalyzing(true)
    
    try {
      // Create a temporary canvas to sample the image
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Use a smaller sample size for performance
      const sampleWidth = Math.min(200, imageElement.width)
      const sampleHeight = Math.min(200, imageElement.height)
      
      canvas.width = sampleWidth
      canvas.height = sampleHeight
      
      // Draw scaled image
      ctx.drawImage(imageElement, 0, 0, sampleWidth, sampleHeight)
      
      // Sample pixels across the image
      const imageData = ctx.getImageData(0, 0, sampleWidth, sampleHeight)
      const data = imageData.data
      
      let totalWarmBias = 0
      let totalCoolBias = 0
      let warmPixels = 0
      let coolPixels = 0
      let neutralPixels = 0
      let darkPixels = 0
      let lightPixels = 0
      
      // Sample every 4th pixel for performance
      for (let i = 0; i < data.length; i += 16) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        
        const tempBias = calculateTemperatureBias(r, g, b)
        const brightness = (r + g + b) / 3
        
        if (tempBias > 0.1) {
          warmPixels++
          totalWarmBias += tempBias
        } else if (tempBias < -0.1) {
          coolPixels++
          totalCoolBias += Math.abs(tempBias)
        } else {
          neutralPixels++
        }
        
        if (brightness < 85) darkPixels++
        else if (brightness > 170) lightPixels++
      }
      
      const totalPixels = warmPixels + coolPixels + neutralPixels
      const warmPercentage = (warmPixels / totalPixels) * 100
      const coolPercentage = (coolPixels / totalPixels) * 100
      const averageWarmBias = warmPixels > 0 ? totalWarmBias / warmPixels : 0
      const averageCoolBias = coolPixels > 0 ? totalCoolBias / coolPixels : 0
      
      const analysis = {
        warmPercentage,
        coolPercentage,
        neutralPercentage: 100 - warmPercentage - coolPercentage,
        averageWarmBias,
        averageCoolBias,
        isDarkDominant: darkPixels > totalPixels * 0.4,
        isLightDominant: lightPixels > totalPixels * 0.4,
        overallBias: warmPercentage > coolPercentage + 10 ? 'warm' : 
                     coolPercentage > warmPercentage + 10 ? 'cool' : 'neutral'
      }
      
      setImageAnalysis(analysis)
    } catch (error) {
      console.error('Error analyzing image temperature:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [imageElement])

  useEffect(() => {
    if (imageElement) {
      analyzeImageTemperature()
    }
  }, [imageElement, analyzeImageTemperature])

  // Get temperature characteristics based on actual image analysis
  const getImageTemperatureCharacteristics = () => {
    if (!imageAnalysis) {
      return {
        overall: 'analyzing',
        lighting: 'analyzing image...',
        shadowsRecommendation: 'Analyzing image for temperature recommendations...',
        highlightsRecommendation: 'Analyzing image for highlight recommendations...'
      }
    }

    const { overallBias, warmPercentage, coolPercentage, isDarkDominant, isLightDominant, averageWarmBias, averageCoolBias } = imageAnalysis

    if (overallBias === 'warm') {
      return {
        overall: 'warm',
        lighting: `warm lighting (${Math.round(warmPercentage)}% warm areas) - likely sunlight or tungsten`,
        shadowsRecommendation: averageWarmBias > 0.5 ? 
          'Strong warm light creates cool shadows: ultramarine blue + burnt umber + touch of dioxazine purple' :
          'Moderate warm light: ultramarine blue + burnt umber for cool shadows',
        highlightsRecommendation: isDarkDominant ?
          'Warm highlights in dark scene: cadmium yellow + raw sienna + titanium white' :
          'Warm highlights: add yellow ochre or raw sienna to titanium white'
      }
    } else if (overallBias === 'cool') {
      return {
        overall: 'cool',
        lighting: `cool lighting (${Math.round(coolPercentage)}% cool areas) - likely overcast sky or cool artificial light`,
        shadowsRecommendation: averageCoolBias > 0.5 ?
          'Strong cool light creates warm shadows: burnt sienna + raw umber + touch of cadmium red' :
          'Moderate cool light: raw umber + burnt sienna for warm shadows',
        highlightsRecommendation: isLightDominant ?
          'Cool highlights in bright scene: cerulean blue + zinc white' :
          'Cool highlights: add ultramarine blue or cerulean blue to titanium white'
      }
    } else {
      return {
        overall: 'neutral',
        lighting: `balanced lighting (${Math.round(warmPercentage)}% warm, ${Math.round(coolPercentage)}% cool) - natural balanced light`,
        shadowsRecommendation: isDarkDominant ?
          'Neutral shadows in dark scene: ivory black + raw umber + titanium white' :
          'Balanced shadows: burnt umber + ultramarine blue for neutral grays',
        highlightsRecommendation: isLightDominant ?
          'Subtle warm highlights: unbleached titanium + touch of yellow ochre' :
          'Neutral highlights: titanium white with subtle warm bias (Naples yellow)'
      }
    }
  }

  const getPaintMixingRecommendations = () => {
    if (!selectedColor) return null

    const tempBias = calculateTemperatureBias(selectedColor.r, selectedColor.g, selectedColor.b)
    const recommendations = []

    // Base color mixing based on selected color temperature
    if (tempBias > 0.3) {
      recommendations.push({
        category: 'Warm Base Colors',
        icon: Sun,
        suggestions: [
          'Cadmium Red Light + Cadmium Yellow Light',
          'Burnt Sienna + Raw Sienna',
          'Yellow Ochre + Venetian Red',
          'Quinacridone Gold + Alizarin Crimson'
        ]
      })
    } else if (tempBias < -0.3) {
      recommendations.push({
        category: 'Cool Base Colors',
        icon: Moon,
        suggestions: [
          'Ultramarine Blue + Cerulean Blue',
          'Phthalo Blue + Viridian Green',
          'Payne\'s Gray + Prussian Blue',
          'Dioxazine Purple + Cobalt Blue'
        ]
      })
    } else {
      recommendations.push({
        category: 'Neutral Base Colors',
        icon: Palette,
        suggestions: [
          'Burnt Umber + Titanium White',
          'Raw Umber + Yellow Ochre',
          'Ivory Black + Naples Yellow',
          'Van Dyke Brown + Zinc White'
        ]
      })
    }

    return recommendations
  }

  const getValueMixingTips = () => {
    if (!valueAnalysis) return []

    const tips = []

    if (valueAnalysis.contrast > 70) {
      tips.push({
        title: 'High Contrast Scene',
        tip: 'Use pure black (Ivory Black) and pure white (Titanium White) sparingly. Reserve them for the absolute darkest shadows and brightest highlights.',
        colors: ['Ivory Black', 'Titanium White', 'Burnt Umber', 'Zinc White']
      })
    }

    if (valueAnalysis.average < 85) {
      tips.push({
        title: 'Dark Dominant Scene',
        tip: 'Build up darks gradually using transparent layers. Start with Burnt Umber and add Ultramarine Blue for cool shadows.',
        colors: ['Burnt Umber', 'Raw Umber', 'Ultramarine Blue', 'Van Dyke Brown']
      })
    }

    if (valueAnalysis.average > 170) {
      tips.push({
        title: 'Light Dominant Scene',
        tip: 'Avoid using white directly from the tube. Tint it with subtle colors to create more natural highlights.',
        colors: ['Naples Yellow', 'Cerulean Blue', 'Raw Sienna', 'Unbleached Titanium']
      })
    }

    return tips
  }

  const getColorTemperatureGuidance = () => {
    const characteristics = getImageTemperatureCharacteristics()
    const guidance = []

    // Shadow recommendations
    guidance.push({
      type: 'Shadows',
      icon: Moon,
      description: characteristics.shadowsRecommendation,
      mixingTip: characteristics.overall === 'warm' 
        ? 'For warm light sources, shadows appear cooler by contrast'
        : characteristics.overall === 'cool'
        ? 'For cool light sources, shadows can be warmer or neutral'
        : 'Neutral lighting allows for flexible shadow temperature'
    })

    // Highlight recommendations
    guidance.push({
      type: 'Highlights',
      icon: Sun,
      description: characteristics.highlightsRecommendation,
      mixingTip: characteristics.overall === 'warm'
        ? 'Warm highlights suggest direct sunlight - add yellow ochre to white'
        : characteristics.overall === 'cool'
        ? 'Cool highlights suggest indirect light - add ultramarine to white'
        : 'Neutral highlights work well with subtle warm bias'
    })

    // Mid-tone recommendations
    guidance.push({
      type: 'Mid-tones',
      icon: Palette,
      description: 'Transition areas between light and shadow',
      mixingTip: 'Mid-tones should bridge the temperature gap between warm lights and cool shadows, or vice versa'
    })

    return guidance
  }

  if (!imageElement) {
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
          <Brush style={{ width: '48px', height: '48px', color: '#64748b' }} />
        </div>
        <h3 style={{ fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
          Paint Recommendations
        </h3>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          Upload an image to get professional painting guidance
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
          <Brush style={{ width: '20px', height: '20px', color: '#64748b' }} />
        </div>
        <span style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
          Paint Recommendations
        </span>
      </div>

      {(() => {
        const characteristics = getImageTemperatureCharacteristics()
        return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Color Temperature Guidance */}
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #f59e0b'
          }}>
            <h4 style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600', 
              color: '#1e293b', 
              marginBottom: '12px' 
            }}>
              🌡️ Temperature Guidance
            </h4>
            
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.8)', 
              borderRadius: '8px', 
              padding: '12px',
              fontSize: '13px',
              lineHeight: '1.5'
            }}>
              {isAnalyzing ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    border: '2px solid #f59e0b',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>Analyzing image temperature...</span>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Overall Temperature:</strong> {characteristics.overall} lighting
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Analysis:</strong> {characteristics.lighting}
                  </div>
                  {imageAnalysis && (
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(3, 1fr)', 
                      gap: '8px', 
                      marginTop: '8px',
                      fontSize: '11px'
                    }}>
                      <div style={{ textAlign: 'center', padding: '4px', background: 'rgba(220, 38, 38, 0.1)', borderRadius: '4px' }}>
                        <div style={{ fontWeight: '700', color: '#dc2626' }}>{Math.round(imageAnalysis.warmPercentage)}%</div>
                        <div style={{ color: '#64748b' }}>Warm</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '4px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '4px' }}>
                        <div style={{ fontWeight: '700', color: '#2563eb' }}>{Math.round(imageAnalysis.coolPercentage)}%</div>
                        <div style={{ color: '#64748b' }}>Cool</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '4px', background: 'rgba(107, 114, 128, 0.1)', borderRadius: '4px' }}>
                        <div style={{ fontWeight: '700', color: '#6b7280' }}>{Math.round(imageAnalysis.neutralPercentage)}%</div>
                        <div style={{ color: '#64748b' }}>Neutral</div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              {getColorTemperatureGuidance().map((guide, index) => {
                const Icon = guide.icon
                return (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: '6px',
                    padding: '10px',
                    fontSize: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Icon style={{ width: '14px', height: '14px', color: '#f59e0b' }} />
                      <strong>{guide.type}:</strong>
                    </div>
                    <div style={{ marginBottom: '4px', color: '#374151' }}>{guide.description}</div>
                    <div style={{ color: '#64748b', fontStyle: 'italic' }}>💡 {guide.mixingTip}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Selected Color Mixing */}
          {selectedColor && (
            <div style={{
              background: '#f8fafc',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>
                🎨 Mixing for Selected Color
              </h4>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: selectedColor.hex,
                  borderRadius: '6px',
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}></div>
                <div>
                  <div style={{ fontWeight: '500', color: '#1e293b' }}>{selectedColor.hex}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {(() => {
                      const tempBias = calculateTemperatureBias(selectedColor.r, selectedColor.g, selectedColor.b)
                      return tempBias > 0.1 ? 'Warm' : tempBias < -0.1 ? 'Cool' : 'Neutral'
                    })()} bias
                  </div>
                </div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '13px'
              }}>
                <div style={{ fontWeight: '500', marginBottom: '6px', color: '#1e293b' }}>
                  Recommended Paint Mixtures:
                </div>
                <div style={{ color: '#374151', lineHeight: '1.4' }}>
                  {selectedColor.mixingNotes || 'Select a color to see specific mixing recommendations'}
                </div>
              </div>
            </div>
          )}

          {/* Value Mixing Tips */}
          {valueAnalysis && getValueMixingTips().length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #22c55e'
            }}>
              <h4 style={{ fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>
                💡 Value Mixing Tips
              </h4>
              
              {getValueMixingTips().map((tip, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: index < getValueMixingTips().length - 1 ? '8px' : '0',
                  fontSize: '13px'
                }}>
                  <div style={{ fontWeight: '500', marginBottom: '6px', color: '#1e293b' }}>
                    {tip.title}
                  </div>
                  <div style={{ marginBottom: '8px', color: '#374151', lineHeight: '1.4' }}>
                    {tip.tip}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '4px',
                    fontSize: '11px'
                  }}>
                    <strong style={{ color: '#16a34a', marginRight: '4px' }}>Colors:</strong>
                    {tip.colors.map((color, colorIndex) => (
                      <span key={colorIndex} style={{
                        background: '#16a34a',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px'
                      }}>
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* General Painting Tips */}
          <div style={{
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #3b82f6'
          }}>
            <h4 style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600', 
              color: '#1e293b', 
              marginBottom: '12px' 
            }}>
              <Lightbulb style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
              General Oil Painting Tips
            </h4>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '13px',
              lineHeight: '1.5'
            }}>
              <div style={{ marginBottom: '8px' }}>
                • <strong>Fat over lean:</strong> Add more oil medium to each successive layer
              </div>
              <div style={{ marginBottom: '8px' }}>
                • <strong>Temperature shifts:</strong> Shadows are often cooler than lights in natural lighting
              </div>
              <div style={{ marginBottom: '8px' }}>
                • <strong>Color mixing:</strong> Use a palette knife for cleaner mixes and less paint waste
              </div>
              <div style={{ marginBottom: '8px' }}>
                • <strong>Underpainting:</strong> Start with a warm or cool toned ground to unify your painting
              </div>
              <div>
                • <strong>Color notes:</strong> Make color swatches on your canvas edge to match key colors
              </div>
            </div>
          </div>
        </div>
        )
      })()}
    </div>
  )
}