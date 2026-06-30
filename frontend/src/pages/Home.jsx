import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios.js'

function excerpt(content, length = 180) {
  if (content.length <= length) return content
  return content.slice(0, length).trimEnd() + '…'
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/api/posts')
      .then((res) => setPosts(res.data))
      .catch(() => setError('Could not load entries. Is the API running?'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-state">Loading entries…</div>

  return (
    <div>
      <div className="page-head">
        <h1>Latest entries</h1>
      </div>

      {error && <div className="form-error">{error}</div>}

      {!error && posts.length === 0 && (
        <div className="empty-state">No entries yet. Be the first to write one.</div>
      )}

      <ul className="ledger-list">
        {posts.map((post, i) => (
          <li className="entry" key={post.id}>
            <div className="entry-index">{String(posts.length - i).padStart(2, '0')}</div>
            <div>
              <h2 className="entry-title">
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
              </h2>
              <div className="entry-meta">
                {post.author_username} · {formatDate(post.created_at)}
              </div>
              <p className="entry-excerpt">{excerpt(post.content)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
