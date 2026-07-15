import { useRef, useState } from 'react'
import { formatFileSize } from '../utils/format'

function UploadScreen({ onUploadSuccess }) {
  const fileInputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState(null)
  const [result, setResult] = useState(null)

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] ?? null
    setFile(selectedFile)
    setStatus(null)
    setResult(null)
  }

  const handleUpload = async (event) => {
    event.preventDefault()

    if (!file) {
      setStatus({ type: 'error', message: 'Please choose a file first.' })
      return
    }

    setUploading(true)
    setStatus({ type: 'loading', message: 'Uploading to S3...' })
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setStatus({ type: 'success', message: 'File uploaded successfully.' })
      setResult(data)
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      onUploadSuccess?.(data)
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Something went wrong during upload.',
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div className="badge">Upload</div>
      <h1>Upload to Amazon S3</h1>
      <p className="subtitle">
        Pick a file and send it to your bucket through the Express API.
      </p>

      <form className="upload-form" onSubmit={handleUpload}>
        <label className="dropzone">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <span className="dropzone-title">Choose a file</span>
          <span className="dropzone-hint">Max size: 10 MB</span>
        </label>

        {file && (
          <div className="file-preview">
            <span className="file-name">{file.name}</span>
            <span className="file-size">{formatFileSize(file.size)}</span>
          </div>
        )}

        <button type="submit" disabled={!file || uploading}>
          {uploading ? 'Uploading...' : 'Upload to S3'}
        </button>
      </form>

      {status && (
        <p className={`status status-${status.type}`}>{status.message}</p>
      )}

      {result && (
        <div className="result">
          <h2>Upload result</h2>
          <dl>
            <div>
              <dt>File name</dt>
              <dd>{result.fileName}</dd>
            </div>
            <div>
              <dt>S3 key</dt>
              <dd>
                <code>{result.key}</code>
              </dd>
            </div>
            <div>
              <dt>View file</dt>
              <dd>
                <a href={result.viewUrl} target="_blank" rel="noreferrer">
                  Open uploaded file
                </a>
              </dd>
            </div>
          </dl>
        </div>
      )}
    </>
  )
}

export default UploadScreen
