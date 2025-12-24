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
    <div style={blogStyle} className='blog'>
      <div id='title-author'>
        {blog.title} {blog.author} <button onClick={toggleVisibility} id='visbilityToggler'>{ visible ? 'hide' : 'view' }</button>
      </div>
      <div style={showWhenVisible} id='url-likes'>
        {blog.url} <br />
        <div id='likes'>likes: {blog.likes}</div> <button onClick={() => addLike(blog)}>like</button> <br />
        {user.name} <br />
        { user.id === (blog.user.id ? blog.user.id : blog.user) ? <button onClick={() => deleteBlog(blog)}>delete</button> : ''}
      </div>
    </div>
  )}

export default Blog
