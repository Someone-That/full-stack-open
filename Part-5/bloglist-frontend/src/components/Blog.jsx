import { useState } from 'react'

const Blog = ({ blog, user, addLike, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  // const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{ visible ? 'hide' : 'view' }</button>
      </div>
      <div style={showWhenVisible}>
        {blog.url} <br />
        likes: {blog.likes} <button onClick={() => addLike(blog)}>like</button> <br />
        {user.name} <br />
        { user.id === blog.user.id ? <button onClick={() => deleteBlog(blog)}>delete</button> : ''}
      </div>
    </div>
  )}

export default Blog
