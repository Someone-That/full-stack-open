import { useDispatch } from 'react-redux'
import { newNotification } from '../reducers/notificationReducer'
import { appendAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(appendAnecdote(content))
    
    dispatch(newNotification(`You created '${content}'`, 5))
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
