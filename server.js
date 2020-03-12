require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIEAPI = ('./movies-data-small.json')
const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())
// adding the validate middleware 1 time +
// validating every request before it gets to the next handler middlewares.
// takes 3 parameters
//  3 param is callback function:
    // what we can call if we want to move to the next station in the factory line
app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');
    console.log('validate bearer token middleware')
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request'})
    }
    next()
})

app.get('/movies', function handleGetMovies(req, res) {
  let response = MOVIEAPI;
  if (req.query.genre) {
    reponse = response.filter(movies =>
      movies.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    )
  }
  if (req.query.country) {
    response = response.filter(movies =>
      movies.country.toLowerCase().includes(req.query.country.toLowerCase())
    )
  }
  if (req.query.avg_vote) {
    response = response.filter(movies =>
      Number(movies.avg_vote) >= Number(req.query.avg_vote)
    )
  }
  res.json(response)
})

const PORT = 9000
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
