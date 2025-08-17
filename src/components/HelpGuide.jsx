import { useState } from 'react'
import { X, ChevronRight, ChevronDown, Upload, Palette, Eye, Grid3X3, Target, TrendingUp, Pipette, Sparkles, Circle, RotateCcw } from 'lucide-react'

export function HelpGuide({ isOpen, onClose }) {
  const [expandedSection, setExpandedSection] = useState('getting-started')

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  if (!isOpen) return null

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Upload,
      content: (
        <div className="help-section-content">
          <h4>How to Add a Photo</h4>
          <ol>
            <li>Click on the upload area or drag and drop an image file</li>
            <li>Supported formats: JPG, PNG, GIF, WebP</li>
            <li>Your image will automatically load into the editor</li>
            <li>The image is resized to fit while maintaining aspect ratio</li>
          </ol>
          
          <div className="help-tip">
            <strong>💡 Pro Tip:</strong> Use high-resolution reference photos for the best analysis results.
          </div>
        </div>
      )
    },
    {
      id: 'study-modes',
      title: 'Study Modes',
      icon: Eye,
      content: (
        <div className="help-section-content">
          <h4>Visual Study Tools</h4>
          <div className="feature-list">
            <div className="feature-item">
              <strong>Original:</strong> View your unmodified reference image
            </div>
            <div className="feature-item">
              <strong>Grayscale:</strong> Convert to black and white to study values without color distraction
            </div>
            <div className="feature-item">
              <strong>Value Groups:</strong> Simplify the image into 3-10 distinct value ranges
              <div className="sub-feature">• Adjust the Groups slider to control simplification level</div>
            </div>
            <div className="feature-item">
              <strong>Squint View:</strong> Apply blur to see major shapes and value patterns
              <div className="sub-feature">• Adjust the Blur slider to control the squint effect</div>
            </div>
            <div className="feature-item">
              <strong>Posterize:</strong> Reduce color complexity while maintaining color information
              <div className="sub-feature">• Use Levels slider to control color reduction</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'painting-filters',
      title: 'Painting Filters',
      icon: Sparkles,
      content: (
        <div className="help-section-content">
          <h4>Artistic Reference Filters</h4>
          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-header">
                <Circle size={16} className="feature-icon" />
                <strong>Simplified Filter</strong>
              </div>
              <p>Applies a fast blur effect to simplify details and focus on major shapes and values.</p>
            </div>
            <div className="feature-item">
              <div className="feature-header">
                <Sparkles size={16} className="feature-icon" />
                <strong>Oil Paint Filter</strong>
              </div>
              <p>Advanced artistic filter that creates a painterly effect by sampling pixel intensity to simplify the image while maintaining important color and value relationships.</p>
            </div>
          </div>
          
          <div className="help-tip">
            <strong>💡 When to Use:</strong> Apply filters to reduce visual complexity and focus on the essential elements you want to capture in your painting.
          </div>
        </div>
      )
    },
    {
      id: 'color-sampling',
      title: 'Color Analysis',
      icon: Pipette,
      content: (
        <div className="help-section-content">
          <h4>Eyedropper Tool</h4>
          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-header">
                <Pipette size={16} className="feature-icon" />
                <strong>How to Sample Colors</strong>
              </div>
              <ol>
                <li>Click the Eyedropper button to activate</li>
                <li>Your cursor changes to a crosshair</li>
                <li>Click anywhere on the image to sample that pixel's color</li>
                <li>A blue circle marks where you clicked</li>
                <li>Color analysis appears in the tabs below</li>
              </ol>
            </div>
          </div>
          
          <h4>Color Information Provided</h4>
          <div className="feature-list">
            <div className="feature-item"><strong>Chroma:</strong> Color saturation intensity</div>
            <div className="feature-item"><strong>Value:</strong> Lightness/darkness on a scale</div>
            <div className="feature-item"><strong>Temperature:</strong> Warm (red/yellow) vs Cool (blue/green)</div>
            <div className="feature-item"><strong>Tint:</strong> Color bias and mixing notes</div>
            <div className="feature-item"><strong>HSL Values:</strong> Hue, Saturation, Lightness technical data</div>
            <div className="feature-item"><strong>Mixing Notes:</strong> Suggestions for color mixing</div>
          </div>
        </div>
      )
    },
    {
      id: 'analysis-tabs',
      title: 'Analysis Tabs',
      icon: Palette,
      content: (
        <div className="help-section-content">
          <h4>Detailed Analysis Panels</h4>
          <div className="feature-list">
            <div className="feature-item">
              <strong>Color Analysis:</strong> Detailed breakdown of sampled colors with mixing recommendations
            </div>
            <div className="feature-item">
              <strong>Color Harmony:</strong> Generate complementary, triadic, and other color schemes based on selected colors
            </div>
            <div className="feature-item">
              <strong>Value Studies:</strong> Small-scale value analysis with downloadable studies
            </div>
            <div className="feature-item">
              <strong>Saved Colors:</strong> Build a palette of colors you've sampled from the image
            </div>
          </div>
          
          <h4>Workflow Tips</h4>
          <div className="feature-list">
            <div className="feature-item">• Sample multiple colors to build a complete palette</div>
            <div className="feature-item">• Use value studies to understand light patterns</div>
            <div className="feature-item">• Generate harmonies for balanced color schemes</div>
            <div className="feature-item">• Save important colors for reference while painting</div>
          </div>
        </div>
      )
    },
    {
      id: 'workflow',
      title: 'Recommended Workflow',
      icon: RotateCcw,
      content: (
        <div className="help-section-content">
          <h4>Step-by-Step Painting Analysis</h4>
          <ol className="workflow-steps">
            <li>
              <strong>Upload Your Reference:</strong>
              <p>Start by uploading a high-quality reference photo</p>
            </li>
            <li>
              <strong>Value Study:</strong>
              <p>Switch to Grayscale or Value Groups mode to understand the value structure without color distraction.</p>
            </li>
            <li>
              <strong>Color Sampling:</strong>
              <p>Use the eyedropper to sample key colors. Build your palette by saving important colors.</p>
            </li>
            <li>
              <strong>Simplify for Painting:</strong>
              <p>Apply Simplified or Oil Paint filters to reduce detail and focus on essential elements.</p>
            </li>
            <li>
              <strong>Generate Color Schemes:</strong>
              <p>Use the Color Harmony tab to explore complementary and analogous color relationships.</p>
            </li>
            <li>
              <strong>Final Reference:</strong>
              <p>Keep the app open while painting to reference your analysis and color samples.</p>
            </li>
          </ol>
        </div>
      )
    }
  ]

  return (
    <div className="help-overlay">
      <div className="help-modal">
        <div className="help-header">
          <h2>Painter's Perspective - User Guide</h2>
          <button onClick={onClose} className="help-close-btn">
            <X size={24} />
          </button>
        </div>
        
        <div className="help-content">
          <div className="help-intro">
            <p>Welcome to Painter's Perspective - your comprehensive tool for analyzing reference photos for oil painting. This guide will help you understand each feature and how to use them effectively.</p>
          </div>
          
          <div className="help-sections">
            {sections.map(section => {
              const Icon = section.icon
              const isExpanded = expandedSection === section.id
              
              return (
                <div key={section.id} className="help-section">
                  <button
                    className="help-section-header"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="help-section-title">
                      <Icon size={20} className="help-section-icon" />
                      <span>{section.title}</span>
                    </div>
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </button>
                  
                  {isExpanded && (
                    <div className="help-section-body">
                      {section.content}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        
        <div className="help-footer">
          <p>Need more help? The interface is designed to be intuitive - experiment with different tools to discover what works best for your painting process!</p>
        </div>
      </div>
    </div>
  )
}