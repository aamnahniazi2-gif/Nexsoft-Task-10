import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios.js'

export default function PostForm({ mode }) {
  const isEdit = mode === 'edit'
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    api
      .get(`/api/posts/${id}`)
      .then((res) => {
        setTitle(res.data.title)
        setContent(res.data.content)
      })
      .catch(() => setError('Could not load this entry for editing.'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (isEdit) {
        const res = await api.put(`/api/posts/${id}`, { title, content })
        navigate(`/posts/${res.data.id}`)
      } else {
        const res = await api.post('/api/posts', { title, content })
        navigate(`/posts/${res.data.id}`)
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not save this entry.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="loading-state">Loading…</div>

  return (
    <div className="form-card" style={{ maxWidth: 620 }}>
      <h1>{isEdit ? 'Edit entry' : 'New entry'}</h1>
      <p className="form-subtitle">{isEdit ? 'Revise your post' : 'Write something worth keeping'}</p>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="btn-row">
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Publish'}
          </button>
          <button
            type="button"
            className="btn-outline btn"
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
