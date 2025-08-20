import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon, Replace } from 'lucide-react'

export function ImageUpload({ onImageLoad, image, compact = false }) {
  const [dragActive, setDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef(null)

  const handleInputChange = (e) => {
    console.log('Standard file input change triggered', e.target.files)
    e.preventDefault()
    
    // Prevent duplicate processing
    if (isProcessing) return
    
    if (e.target.files && e.target.files[0]) {
      console.log('Processing file:', e.target.files[0].name)
      setIsProcessing(true)
      handleFile(e.target.files[0])
      
      // Clear the input value for consistent behavior across browsers
      setTimeout(() => {
        if (e.target) {
          e.target.value = ''
        }
        setIsProcessing(false)
      }, 100)
    } else {
      console.log('No file selected or files array empty')
    }
  }

  const handleFile = useCallback((file) => {
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
  }, [onImageLoad])

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

  const openFileDialog = useCallback(() => {
    if (isProcessing) return

    // Check if we're on iOS Safari
    const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    console.log('Opening file dialog, iOS Safari detected:', isIOSSafari)
    console.log('User agent:', navigator.userAgent)

    if (isIOSSafari) {
      // For iOS Safari, create a new input element and add it to DOM
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/jpeg,image/jpg,image/png'
      input.style.position = 'absolute'
      input.style.left = '-9999px'
      input.style.opacity = '0'
      input.style.pointerEvents = 'none'

      const handleIOSChange = (e) => {
        console.log('iOS Safari file change triggered', e.target.files)
        if (e.target.files && e.target.files[0]) {
          setIsProcessing(true)
          handleFile(e.target.files[0])
          setTimeout(() => setIsProcessing(false), 100)
        }
        // Clean up
        document.body.removeChild(input)
      }

      // Add event listener before adding to DOM
      input.addEventListener('change', handleIOSChange)
      input.addEventListener('input', handleIOSChange)
      
      // Add to DOM and trigger click
      document.body.appendChild(input)
      input.click()
    } else {
      // Standard desktop/Android behavior
      if (fileInputRef.current) {
        fileInputRef.current.click()
      }
    }
  }, [isProcessing, handleFile])

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
          style={{ 
            width: '100%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 12px',
            fontSize: '12px',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: '1px solid #d1d5db',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          <Replace style={{ width: '12px', height: '12px' }} />
          Choose Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleInputChange}
          style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
        />
      </div>
    )
  }

  return (
    <div style={{ 
      background: 'white', 
      border: '1px solid #d1d5db', 
      borderRadius: '4px', 
      padding: '24px'
    }}>
      {image ? (
        <div style={{ position: 'relative' }}>
          <img 
            src={image} 
            alt="Uploaded" 
            style={{ 
              width: '100%', 
              height: 'auto', 
              maxHeight: '300px', 
              objectFit: 'contain', 
              borderRadius: '3px',
              border: '1px solid #e5e7eb'
            }}
          />
          <button
            onClick={clearImage}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            <X style={{ width: '12px', height: '12px' }} />
          </button>
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '32px 16px',
            border: dragActive ? '2px dashed #6b7280' : '2px dashed #d1d5db',
            borderRadius: '4px',
            backgroundColor: dragActive ? '#f9fafb' : '#ffffff',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div style={{ 
            display: 'inline-flex',
            padding: '8px', 
            backgroundColor: '#f3f4f6',
            borderRadius: '3px',
            marginBottom: '16px'
          }}>
            <ImageIcon style={{ width: '24px', height: '24px', color: '#6b7280' }} />
          </div>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '500', 
            color: '#111827', 
            marginBottom: '8px' 
          }}>
            Upload Reference Image
          </h3>
          <p style={{ 
            color: '#6b7280', 
            marginBottom: '20px',
            fontSize: '13px',
            maxWidth: '350px',
            margin: '0 auto 20px auto',
            lineHeight: '1.4'
          }}>
            Drop an image file here or click to browse. Supports JPG, PNG formats.
          </p>
          <button 
            onClick={openFileDialog}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              padding: '8px 16px',
              backgroundColor: '#374151',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            <Upload style={{ width: '14px', height: '14px' }} />
            Choose File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleInputChange}
            style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
          />
          <div style={{ 
            marginTop: '16px', 
            fontSize: '11px', 
            color: '#9ca3af' 
          }}>
            Max 10MB • Best results with high resolution images
          </div>
        </div>
      )}
    </div>
  )
}