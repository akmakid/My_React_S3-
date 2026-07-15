import { useState } from 'react'
import FilesScreen from './components/FilesScreen'
import UploadScreen from './components/UploadScreen'
import './App.css'

function App() {
  const [screen, setScreen] = useState('upload')
  const [filesRefreshKey, setFilesRefreshKey] = useState(0)

  const handleUploadSuccess = () => {
    setFilesRefreshKey((key) => key + 1)
    setScreen('files')
  }

  return (
    <div className="app">
      <header className="top-nav">
        <div className="brand">S3 Storage</div>
        <nav className="nav-tabs">
          <button
            type="button"
            className={screen === 'upload' ? 'active' : ''}
            onClick={() => setScreen('upload')}
          >
            Upload
          </button>
          <button
            type="button"
            className={screen === 'files' ? 'active' : ''}
            onClick={() => setScreen('files')}
          >
            My Files
          </button>
        </nav>
      </header>

      <main className={`card ${screen === 'files' ? 'card-wide' : ''}`}>
        {screen === 'upload' ? (
          <UploadScreen onUploadSuccess={handleUploadSuccess} />
        ) : (
          <FilesScreen refreshKey={filesRefreshKey} />
        )}
      </main>
    </div>
  )
}

export default App
