import Notification from './Notification'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
  notification
}) => {
  return (
    <div>
      <h2>Login</h2>
      <Notification notification={notification} />
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            username
            <input
              value={username}
              onChange={handleUsernameChange}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
