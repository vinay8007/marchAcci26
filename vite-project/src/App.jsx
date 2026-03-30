import { useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [status, setStatus] = useState(null)
  const [uploadedUrl, setUploadedUrl] = useState(null)
  // Vite exposes env vars on import.meta.env. Provide a fallback to localhost:3000.
  const API_BASE = import.meta.env.VITE_APP_API_URL || 'https://task-manager-backend-dhzz.onrender.com'

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    setFile(f)
    if (f) {
      const url = URL.createObjectURL(f)
      setPreview(url)
    } else {
      setPreview(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('uploading')

    if (!title || !description || !file) {
      setStatus('Please provide title, description and an image.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      // backend expects field name 'file' for single upload
      formData.append('file', file)

  const resp = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (resp && resp.data) {
        const task = resp.data.task
        // backend returns attachment like "uploads/filename.png"
        const attachmentPath = task && task.attachment ? task.attachment : null
  const finalUrl = attachmentPath ? encodeURI(`${API_BASE}/${attachmentPath}`) : null

        setStatus('Upload successful')
        setTitle('')
        setDescription('')
        setFile(null)
        setPreview(null)
        setUploadedUrl(finalUrl)
      } else {
        setStatus('Unexpected response from server')
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message
      setStatus(`Upload failed: ${msg}`)
    }
  }

  return (
    <div className="app-container">
      <h1>New Task — Upload Image</h1>
      <form onSubmit={handleSubmit} className="upload-form">
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            required
          />
        </label>

        <label>
          Image
          <input type="file" accept="image/*" onChange={handleFileChange} required />
        </label>

        {preview && (
          <div className="preview">
            <img src={preview} alt="preview" />
          </div>
        )}

        <button type="submit">Upload</button>
      </form>

      {status && <div className="status">{status}</div>}

      {uploadedUrl && (
        <div className="uploaded-result">
          <h3>Uploaded Image</h3>
          <a href={uploadedUrl} target="_blank" rel="noreferrer">{uploadedUrl}</a>
          <div className="preview" style={{ marginTop: 8 }}>
            <img src={uploadedUrl} alt="uploaded" />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
