const Notification = ({ message, isSuccess }) => {
  if (message === null) {
    return null
  }
  var notifStyle = {
    color: 'green',
  }

  if (!isSuccess) {
    notifStyle = {
        color: 'red',
    }
  }
  return (
    <div style={notifStyle} className="notification">
      {message}
    </div>
  )
}

export default Notification
