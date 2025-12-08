import axios from 'axios'

const getAll = Url => {
  const request = axios.get(Url)
  return request.then(response => response.data)
}

export default { getAll }
