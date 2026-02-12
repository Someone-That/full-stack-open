import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

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
      const sortedState = action.payload.sort((a, b) => b.votes - a.votes)
      return sortedState
    }
  }
})

const { createAnecdote, setAnecdotes, voteOnce } = anecdoteSlice.actions

export const initialiseAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (anecdote) => {
  return async (dispatch) => {
    const votedAnecdote = await anecdoteService.addVote(anecdote)
    dispatch(voteOnce(votedAnecdote.id))
  }
}

export default anecdoteSlice.reducer
