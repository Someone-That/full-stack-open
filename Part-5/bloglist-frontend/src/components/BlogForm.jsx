const BlogForm = ({
  newTitle,
  newAuthor,
  onAddNew,
  setNewTitle,
  setNewAuthor,
  newURL,
  setNewURL
}) => (
  <form onSubmit={onAddNew}>
    <div>
    <label>
      title:{' '}
      <input
        value={newTitle}
        onChange={event => setNewTitle(event.target.value)}
      />
    </label></div>
    <div><label>
      author:{' '}
      <input
        value={newAuthor}
        onChange={event => setNewAuthor(event.target.value)}
      />
    </label></div>
    <div><label>
      url:{' '}
      <input
        value={newURL}
        onChange={event => setNewURL(event.target.value)}
      />
    </label></div>
    <div>
      <button type="submit">add blog</button>
    </div>
  </form>
)

export default BlogForm
