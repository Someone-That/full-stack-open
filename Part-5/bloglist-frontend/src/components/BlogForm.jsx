import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newURL, setNewURL] = useState('')

  const onAddNew = (event) => {
    event.preventDefault()
    addBlog({
      title: newTitle,
      author: newAuthor,
      url: newURL
    })
    setNewTitle('')
    setNewAuthor('')
    setNewURL('')
  }

  return (
    <form onSubmit={onAddNew}>
      <div>
        <label>
      title:{' '}
          <input
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            placeholder='write blog title here'
          />
        </label></div>
      <div><label>
      author:{' '}
        <input
          value={newAuthor}
          onChange={event => setNewAuthor(event.target.value)}
          placeholder='write blog author here'
        />
      </label></div>
      <div><label>
      url:{' '}
        <input
          value={newURL}
          onChange={event => setNewURL(event.target.value)}
          placeholder='write blog url here'
        />
      </label></div>
      <div>
        <button type="submit">add blog</button>
      </div>
    </form>
  )}

export default BlogForm
