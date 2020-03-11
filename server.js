require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const MOVIEAPI = ('./movies-data-small.json')
console.log(process.env.API_TOKEN)
const app = express()
app.use(morgan('dev'))

// adding the validate middleware 1 time +
// validating every request before it gets to the next handler middlewares.
// takes 3 parameters
//  3 param is callback function:
    // what we can call if we want to move to the next station in the factory line
app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    console.log('validate bearer token middleware')
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request'})
    }
    next()
})

/* const validFilters = ['genre','country', 'avg_vote']
function handleGetFilter(req, res) {
    res.json(validFilters)
}
app.get('/filter', handleGetFilter);*/

app.get('/movies', function handleGetMovies(req, res) {
  let response = MOVIEAPI.movies;
  if (req.query.genre) {
    reponse = response.filter(movies =>
      movies.genre.includes(req.query.genre)
    )
  }
  if (req.query.country) {
    response = response.filter(pokemon =>
      pokemon.country.includes(req.query.country)
    )
  }
  res.json(response)
})

const PORT = 8000
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
