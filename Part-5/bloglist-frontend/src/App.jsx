import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null })

  const resetBlogs = async () => {
    const temp = await blogService.getAll()
    temp.sort((a, b) => b.likes - a.likes)
    setBlogs(temp)
  }

  useEffect(() => {
    resetBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      notifyWith('wrong credentials', true)
    }
  }

  const notifyWith = (message, isError = false) => {
    setNotification({ message, isError })
    setTimeout(() => {
      setNotification({ message: null })
    }, 5000)
  }

  const addBlog = async (blog) => {
    try {
      const createdBlog = await blogService.create(blog)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(createdBlog))
      notifyWith(`added new blog: ${blog.title} by ${blog.author}`)
    } catch (error) {
      notifyWith(error.response.data.error, true)
    }
  }

  const addLike = async (blog) => {
    try {
      blog.likes += 1
      await blogService.update(blog.id, blog)
      // resetBlogs()
      notifyWith(`successfully liked blog: ${blog.title} by ${blog.author}`)
    } catch (error) {
      notifyWith(error.response.data.error, true)
    }
  }

  const deleteBlog = async (blog) => {
    try {
      const ok = window.confirm(`Delete ${blog.title} by ${blog.author}?`)
      if (ok) {
        await blogService.del(blog.id)
        resetBlogs()
        notifyWith(`Deleted ${blog.title}`)
      }
    } catch (error) {
      notifyWith(error.response.data.error, true)
    }
  }

  const blogFormRef = useRef()

  const Blogs = () => (
    <div><h1>blogs</h1>
      <Notification notification={notification} />

      {user.name} logged in <button onClick={() => {
        window.localStorage.clear()
        setUser(null)
      }}>logout</button>
      <br /><br />
      <Togglable buttonLabel="add new blog" ref={blogFormRef}>
        <h2>Add a new blog</h2>
        <BlogForm
          addBlog={addBlog}
        />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} addLike={addLike} deleteBlog={deleteBlog} />
      )}
    </div>
  )


  return (
    <div>

      {!user && <LoginForm
        handleSubmit={handleLogin}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        username={username}
        password={password}
        notification={notification} />}
      {user && (
        <div>

          {Blogs()}
        </div>
      )}

    </div>
  )
}

export default App
