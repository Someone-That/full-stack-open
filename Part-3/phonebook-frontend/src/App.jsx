import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const Person = ({name, number, deletePerson}) => {
    return <div>{name} {number} <button onClick={deletePerson}>delete</button><br /></div>
  }

const Filter = ({newFilter, handleFilterChange}) => {
    return <div>filter <input value={newFilter} onChange={handleFilterChange} /></div>
  }

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <h1>add person</h1>
      <div>
        name: <input value={props.newName} onChange={props.handleNameChange} />
      </div>
      <div>number: <input value={props.newNumber} onChange={props.handleNumberChange} /></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [notifType, setNotifType] = useState(true)
  
  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (!confirm(`are you sure you want to delete ${person.name}`)) {
      return
    }
    personService.del(id).then((deletedPerson) => {
      // console.log(deletedPerson)
      deletedPerson
      setPersons(persons.filter(p => p.id !== id))
      setNotifType(true)
      setNotification(
          `${person.name} was successfully deleted`
        )
        setTimeout(() => {
          setNotification(null)
        }, 3000)
    })
    .catch(error => {
      setNotifType(false)
      setNotification(error.response.data.error)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      personService.getAll().then((initialPersons) => {
        setPersons(initialPersons)
      })
    })
  }

  const updateNumber = (newName, newNumber) => {
    const person = persons.find(p => p.name === newName)
    const updatedPerson = { ...person, number: newNumber}
    personService.update(person.id, updatedPerson).then((returnedPerson) => {
      // console.log(returnedPerson)
      setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
      setNotifType(true)
      setNotification(
          `${newName}'s number was successfully updated to ${newNumber}`
        )
        setTimeout(() => {
          setNotification(null)
        }, 3000)
    })
    .catch(error => {
      setNotifType(false)
      setNotification(error.response.data.error)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      personService.getAll().then((initialPersons) => {
        setPersons(initialPersons)
      })
    })
    setNewName('')
    setNewNumber('')
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      if (!confirm(`${newName} is already added to phonebook, do you want to replace their number with new one?`)) {
        return
      }
      updateNumber(newName, newNumber)
      return
    }
    const new_person = {
      number: newNumber,
      name: newName
    }

    personService.create(new_person).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
      setNotifType(true)
      setNotification(
          `${newName} was successfully added`
        )
        setTimeout(() => {
          setNotification(null)
        }, 3000)
    })
    .catch(error => {
      setNotifType(false)
      setNotification(error.response.data.error)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
    })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const peopleToShow = newFilter.length === 0 ? persons : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} isSuccess={notifType} />
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      {peopleToShow.map(person => 
          <Person key={person.name} name={person.name} number={person.number} deletePerson={() => deletePerson(person.id)} /> 
        )}
    </div>
  )
}

export default App
