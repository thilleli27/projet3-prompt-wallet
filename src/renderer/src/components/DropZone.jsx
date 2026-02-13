/**
 * DropZone Component
 * Enables drag-and-drop functionality for text files
 * Wraps the entire application to catch dropped files
 * 
 * Supported file types: .txt, .md, text/plain
 * When a file is dropped, it navigates to /new page with pre-filled content
 * 
 * Features:
 * - Visual feedback when dragging files over the zone
 * - Automatic file type validation
 * - Pre-fills the new prompt form with file content and name
 * - Works globally across the entire app
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DropZone({ children }) {
  // Track if user is dragging over the drop zone
  const [isDragging, setIsDragging] = useState(false)
  const navigate = useNavigate()

  /**
   * Handle drag over event
   * Prevents default browser behavior and shows visual feedback
   */
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  /**
   * Handle drag leave event
   * Hide visual feedback when user leaves the drop zone
   */
  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  /**
   * Handle file drop event
   * Validates file type and navigates to new prompt page with content
   * Only accepts text files (.txt, .md, and text/plain MIME type)
   */
  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)

    // Filter only text files
    const textFiles = files.filter(file =>
      file.type === 'text/plain' ||
      file.name.endsWith('.txt') ||
      file.name.endsWith('.md')
    )

    if (textFiles.length === 0) {
      alert('Please drop a text file (.txt or .md)')
      return
    }

    // Read the first text file
    const file = textFiles[0]
    const text = await file.text()

    // Navigate to new prompt page with pre-filled content
    navigate('/new', {
      state: {
        // Extract filename without extension as title
        title: file.name.replace(/\.(txt|md)$/, ''),
        // File content becomes the prompt content
        content: text
      }
    })
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
    >
      {/* Visual feedback overlay when dragging files */}
      {isDragging && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '3px dashed #3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#3b82f6'
          }}
        >
          📄 Drop text file to create a prompt
        </div>
      )}
      {/* Render child components (entire app content) */}
      {children}
    </div>
  )
}
