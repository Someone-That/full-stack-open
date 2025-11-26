import { useState } from 'react'

const Button = ({onClick, text}) => (
  <button onClick={onClick}>{text}</button>
)

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const addVote = (votes, selected) => {
  const copy = [...votes]
  copy[selected] += 1
  return copy
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const anecdotes_length = anecdotes.length
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes_length).fill(0))

  return (
    <div>
      <h1>Anecdote</h1>
      {anecdotes[selected]} <br />
      has {votes[selected]} votes <br />
      <Button onClick={() => setVotes(addVote(votes, selected))} text="vote" />
      <Button onClick={() => setSelected(getRandomInt(0, anecdotes_length-1))} text="random anecdote" />
      <h1>Anecdote with most votes</h1>
      {anecdotes[votes.indexOf(Math.max(...votes))]} <br />
    </div>
  )
}

export default App
