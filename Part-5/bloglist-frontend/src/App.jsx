import { useState, useEffect } from 'react'
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
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newURL, setNewURL] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
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

  const clearForm = () => {
    setNewTitle('')
    setNewAuthor('')
    setNewURL('')
  }

  const onAddNew = async (event) => {
    event.preventDefault()
    
    try {
      const createdBlog = await blogService.create({
        title: newTitle,
        author: newAuthor,
        url: newURL
      })
      setBlogs(blogs.concat(createdBlog))
      notifyWith(`added new blog: ${newTitle} by ${newAuthor}`)
      clearForm()
    } catch (error) {
      notifyWith(error.response.data.error, true)
    }
  }

  const Blogs = () => (
    <div><h1>blogs</h1>
    <Notification notification={notification} />
    
    {user.name} logged in <button onClick={() => {
      window.localStorage.clear()
      setUser(null)
    }}>logout</button>
    <br /><br />
    <Togglable buttonLabel="add new blog">
    <h2>Add a new blog</h2>
      <BlogForm
        newTitle={newTitle}
        newAuthor={newAuthor}
        newURL={newURL}
        onAddNew={onAddNew}
        setNewTitle={setNewTitle}
        setNewAuthor={setNewAuthor}
        setNewURL={setNewURL}
      />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
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
