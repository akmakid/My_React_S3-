import { useEffect, useState } from 'react'
import { formatDate, formatFileSize } from '../utils/format'

function FilePreview({ file }) {
  if (file.isImage) {
    return (
      <img
        src={file.viewUrl}
        alt={file.fileName}
        className="file-thumb image-thumb"
      />
    )
  }

  if (file.isPdf) {
    return (
      <iframe
        src={file.viewUrl}
        title={file.fileName}
        className="file-thumb pdf-thumb"
      />
    )
  }

  return (
    <div className="file-thumb file-icon">
      <span>{file.fileName.split('.').pop()?.toUpperCase() || 'FILE'}</span>
    </div>
  )
}

function FilesScreen({ refreshKey }) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const loadFiles = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/files')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load files')
      }

      setFiles(data.files)
      setSelectedFile((current) => {
        if (!current) return data.files[0] ?? null
        return data.files.find((file) => file.key === current.key) ?? data.files[0] ?? null
      })
    } catch (err) {
      setError(err.message || 'Failed to load files')
      setFiles([])
      setSelectedFile(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFiles()
  }, [refreshKey])

  return (
    <>
      <div className="files-header">
        <div>
          <div className="badge">Gallery</div>
          <h1>Uploaded Files</h1>
          <p className="subtitle">Browse and preview files stored in your S3 bucket.</p>
        </div>
        <button type="button" className="secondary-button" onClick={loadFiles} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading && <p className="status status-loading">Loading files...</p>}

      {error && <p className="status status-error">{error}</p>}

      {!loading && !error && files.length === 0 && (
        <p className="empty-state">No files uploaded yet. Upload a file to see it here.</p>
      )}

      {!loading && !error && files.length > 0 && (
        <div className="files-layout">
          <div className="files-list">
            {files.map((file) => (
              <button
                key={file.key}
                type="button"
                className={`file-item ${selectedFile?.key === file.key ? 'active' : ''}`}
                onClick={() => setSelectedFile(file)}
              >
                <div className="file-item-top">
                  <span className="file-name">{file.fileName}</span>
                  <span className="file-size">{formatFileSize(file.size)}</span>
                </div>
                <span className="file-date">{formatDate(file.lastModified)}</span>
              </button>
            ))}
          </div>

          {selectedFile && (
            <div className="file-viewer">
              <div className="viewer-header">
                <div>
                  <h2>{selectedFile.fileName}</h2>
                  <p>
                    {formatFileSize(selectedFile.size)} · {formatDate(selectedFile.lastModified)}
                  </p>
                </div>
                <a
                  href={selectedFile.viewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="secondary-button link-button"
                >
                  Open in new tab
                </a>
              </div>

              <div className="viewer-content">
                <FilePreview file={selectedFile} />
              </div>

              <dl className="viewer-meta">
                <div>
                  <dt>S3 key</dt>
                  <dd>
                    <code>{selectedFile.key}</code>
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default FilesScreen
