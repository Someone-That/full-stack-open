import { useState, useEffect } from 'react'
import countryService from './services/countries'

const Filter = ({newFilter, handleFilterChange}) => {
  return <div>filter <input value={newFilter} onChange={handleFilterChange} /></div>
}

const Country = ({name, showCountry}) => {
  return <div>{name} <button onClick={showCountry}>Show</button></div>
}

const Language = ({ language }) => {
  return <li>{language}</li>
}

const FocusedCountry = ({ country }) => {
  const name = country.name.common
  const capital = country.capital[0]
  const flag = country.flags.png
  const area = country.area
  const languages = Object.values(country.languages)
  const api_key = import.meta.env.VITE_SOME_KEY
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countryService
      .getAll(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
      .then((w) => {
        // w.icon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`
        setWeather(w)
      }
        
  )}, [])

  return (
    <div>
    <h1>{name}</h1>
    Capital: {capital} <br />
    Area: {area}
    <br />
    <h2>Languages</h2>
    <ul>
      {languages.map(language => <Language key={language} language={language} /> )}
    </ul>
    <img src={flag} alt={country.flags.alt} /><br />
    {weather && (
    <>
    <h2>weather in {capital}</h2>
    Temperature: {weather.main.temp} Celsius <br />
    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt={weather.weather[0].description} />
    <br />
    Wind: {weather.wind.speed} m/s
    </>)}
    </div>
  )
}

const Countries = ({ countriesToShow, showCountry }) => {
  if (countriesToShow.length === 0) {
    return
  }
  if (countriesToShow.length > 10) {
    return <div>too many matches, be more specific</div>
  }

  if (countriesToShow.length === 1) {
    return <FocusedCountry country={countriesToShow[0]} />
  }

  return (countriesToShow.map(country => 
    <Country key={country.name.common} name={country.name.common} showCountry={() => showCountry(country.name.common)} />
  ))
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    countryService.getAll("https://studies.cs.helsinki.fi/restcountries/api/all").then((initialCountries) => {
      setCountries(initialCountries)
    })
  }, [])

  const showCountry = (name) => {
    setNewFilter(name)
  }
  
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const countriesToShow = newFilter.length === 0 ? [] : countries.filter(country => country.name.common.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      find countries: <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <Countries countriesToShow={countriesToShow} showCountry={showCountry} /><br />
    </div>
  )
}

export default App
