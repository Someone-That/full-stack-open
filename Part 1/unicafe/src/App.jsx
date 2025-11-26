import { useState } from 'react'

const Button = ({onClick, text}) => (
  <button onClick={onClick}>{text}</button>
)

const StatisticLine = ({text, value}) => (
  <tbody><tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr></tbody>
)

const Statistics = ({good, bad, neutral, total}) => {
  if (total === 0) {
    return <p>No feedback yet</p>
  }

  return (
    <div>
      <h1>Statistics</h1>
      <table>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="mid" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value={total} />
      <StatisticLine text="average" value={(good-bad)/(total)} />
      <StatisticLine text="positive" value={(good*100)/(total)+"%"} />
      </table>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const total = good + bad + neutral

  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="mid" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      
      <Statistics good={good} bad={bad} neutral={neutral} total={total} />
    </div>
  )
}

export default App
