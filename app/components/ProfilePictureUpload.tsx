// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import { useState, useRef } from 'react'

interface ProfilePictureUploadProps {
  currentImageUrl?: string | null
  onImageUploaded: (url: string) => void
  onImageRemoved: () => void
}

export default function ProfilePictureUpload({
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
}: ProfilePictureUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG, or WebP image.')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setError('Image must be smaller than 5MB.')
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Create form data
      const formData = new FormData()
      formData.append('file', file)

      // Upload to API
      const response = await fetch('/api/upload/profile-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }

      const data = await response.json()
      const imageUrl = data.url

      // Set preview
      setPreview(imageUrl)
      onImageUploaded(imageUrl)
    } catch (err: any) {
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleRemove = () => {
    setPreview(null)
    onImageRemoved()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="label" style={{
        display: 'block',
        fontSize: '14px',
        fontWeight: 500,
        marginBottom: '12px',
        color: '#374151',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}>
        Profile Picture
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: '2px dashed #D1D5DB',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
          backgroundColor: preview ? 'transparent' : '#F9FAFB',
          cursor: uploading ? 'wait' : 'pointer',
          transition: 'border-color 200ms ease-in-out, background-color 200ms ease-in-out',
          position: 'relative',
        }}
        onClick={() => !uploading && !preview && fileInputRef.current?.click()}
        onMouseEnter={(e) => {
          if (!uploading && !preview) {
            e.currentTarget.style.borderColor = '#9CA3AF'
          }
        }}
        onMouseLeave={(e) => {
          if (!uploading && !preview) {
            e.currentTarget.style.borderColor = '#D1D5DB'
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={uploading}
        />

        {uploading ? (
          <div>
            <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
              Uploading...
            </p>
          </div>
        ) : preview ? (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={preview}
              alt="Profile preview"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #E5E7EB',
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleRemove()
              }}
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                color: 'white',
                border: '2px solid white',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: '-apple-system, sans-serif',
              }}
              title="Remove image"
            >
              ×
            </button>
            <p style={{
              color: '#6B7280',
              fontSize: '12px',
              marginTop: '12px',
              margin: 0,
            }}>
              Click to change
            </p>
          </div>
        ) : (
          <div>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 12px',
              backgroundColor: '#E5E7EB',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <p style={{
              color: '#374151',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '4px',
              margin: 0,
            }}>
              Click to upload or drag and drop
            </p>
            <p style={{
              color: '#6B7280',
              fontSize: '12px',
              margin: 0,
            }}>
              JPG, PNG or WebP (max 5MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <p style={{
          color: '#DC2626',
          fontSize: '12px',
          marginTop: '8px',
          margin: 0,
        }}>
          {error}
        </p>
      )}
    </div>
  )
}
