import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DropZone({ children }) {
  const [isDragging, setIsDragging] = useState(false)
  const navigate = useNavigate()

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)

    // Filtrer uniquement les fichiers texte
    const textFiles = files.filter(file =>
      file.type === 'text/plain' ||
      file.name.endsWith('.txt') ||
      file.name.endsWith('.md')
    )

    if (textFiles.length === 0) {
      alert('Veuillez glisser un fichier texte (.txt ou .md)')
      return
    }

    // Lire le premier fichier texte
    const file = textFiles[0]
    const text = await file.text()

    // Naviguer vers la page de création avec le contenu
    navigate('/new', {
      state: {
        title: file.name.replace(/\.(txt|md)$/, ''),
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
          📄 Déposez le fichier texte pour créer un prompt
        </div>
      )}
      {children}
    </div>
  )
}
