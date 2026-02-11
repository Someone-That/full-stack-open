import { useDispatch } from 'react-redux'
import { setNotification, removeNotification } from '../reducers/notificationReducer'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = event => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))

    dispatch(setNotification(`You created '${content}'`))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }


  return (
  <form onSubmit={addAnecdote}>
    <h2>create new</h2>
    <div>
        <input name='anecdote' />
    </div>
    <button type='submit'>create</button>
  </form>
  )
}

export default AnecdoteForm
