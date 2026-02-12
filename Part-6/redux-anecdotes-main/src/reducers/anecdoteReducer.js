import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    voteOnce(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find(n => n.id === id)
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1
      }
      const sortedState = state.map(anecdote => (anecdote.id !== id ? anecdote : changedAnecdote))
      sortedState.sort((a, b) => b.votes - a.votes)
      return sortedState
    },
    createAnecdote(state, action) {
      return [...state, action.payload]
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { voteOnce, createAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer
