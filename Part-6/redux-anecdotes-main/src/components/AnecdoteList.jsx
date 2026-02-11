import { voteOnce } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'
import { useSelector, useDispatch } from 'react-redux'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const filteredAnecdotes = useSelector(({ filter, anecdotes }) => {
  return filter.length === 0 ? anecdotes : anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
})

  const vote = id => {
    dispatch(voteOnce(id))
    
    dispatch(setNotification(`You voted '${filteredAnecdotes.find(n => n.id === id).content}'`))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }

  return (
    <div>
      {filteredAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
