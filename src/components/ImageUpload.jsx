import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon, Replace } from 'lucide-react'

export function ImageUpload({ onImageLoad, image, compact = false }) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          onImageLoad(img, e.target.result)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const clearImage = () => {
    onImageLoad(null, null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (compact) {
    return (
      <div>
        <button 
          onClick={openFileDialog}
          className="btn-secondary"
          style={{ 
            width: '100%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Replace style={{ width: '16px', height: '16px' }} />
          Upload New Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </div>
    )
  }

  return (
    <div style={{ 
      background: 'white', 
      border: '1px solid #e2e8f0', 
      borderRadius: '12px', 
      padding: '32px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      {image ? (
        <div style={{ position: 'relative' }}>
          <img 
            src={image} 
            alt="Uploaded" 
            style={{ 
              width: '100%', 
              height: 'auto', 
              maxHeight: '384px', 
              objectFit: 'contain', 
              borderRadius: '12px' 
            }}
          />
          <button
            onClick={clearImage}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer'
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      ) : (
        <div
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div style={{ 
            display: 'inline-flex',
            padding: '16px', 
            background: 'linear-gradient(135deg, #dbeafe 0%, #f3e8ff 100%)', 
            borderRadius: '16px',
            marginBottom: '24px'
          }}>
            <ImageIcon style={{ width: '48px', height: '48px', color: '#3b82f6' }} />
          </div>
          <h3 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#1e293b', 
            marginBottom: '12px' 
          }}>
            Upload Your Reference Image
          </h3>
          <p style={{ 
            color: '#64748b', 
            marginBottom: '32px', 
            maxWidth: '400px', 
            margin: '0 auto 32px auto',
            lineHeight: '1.5'
          }}>
            Drag and drop an image here, or click the button below to select from your files. 
            Supports JPG, PNG, and other common formats.
          </p>
          <button 
            onClick={openFileDialog}
            className="btn-primary"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Upload style={{ width: '20px', height: '20px' }} />
            Choose Image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          <div style={{ 
            marginTop: '24px', 
            fontSize: '14px', 
            color: '#94a3b8' 
          }}>
            Maximum file size: 10MB • Recommended: High resolution for best results
          </div>
        </div>
      )}
    </div>
  )
}