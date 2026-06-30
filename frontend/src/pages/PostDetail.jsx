import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function PostDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    api
      .get(`/api/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch(() => setError('That entry could not be found.'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    if (!window.confirm('Delete this entry? This cannot be undone.')) return
    setDeleting(true)
    try {
      await api.delete(`/api/posts/${id}`)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not delete this entry.')
      setDeleting(false)
    }
  }

  if (loading) return <div className="loading-state">Loading entry…</div>
  if (error) return <div className="form-error">{error}</div>
  if (!post) return null

  const isAuthor = user && user.id === post.author_id

  return (
    <div className="post-detail">
      <Link to="/" className="back-link">← Back to entries</Link>

      <h1 className="entry-title">{post.title}</h1>
      <div className="entry-meta">
        {post.author_username} · {formatDate(post.created_at)}
        {post.updated_at !== post.created_at && ' · edited'}
      </div>

      <div className="post-body">{post.content}</div>

      {isAuthor && (
        <div className="btn-row">
          <button className="btn-outline btn" onClick={() => navigate(`/posts/${id}/edit`)}>
            Edit
          </button>
          <button className="btn-danger btn" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  )
}
